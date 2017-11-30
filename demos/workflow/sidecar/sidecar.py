from flask import Flask, make_response, request
import json
import requests
import pika

import docker
import os
import sys 
import time
import shutil
import uuid
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(2)

app = Flask(__name__)

io_dirs = {}
buddy = None
buddy_image =""
buddy_image = 'solver'
job_id = ""

def nice_json(arg):
    response = make_response(json.dumps(arg, sort_keys = True, indent=4))
    response.headers['Content-type'] = "application/json"
    return response

def delete_contents(folder):
    for the_file in os.listdir(folder):
        file_path = os.path.join(folder, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path): shutil.rmtree(file_path)
        except Exception as e:
            print(e)

def create_directories():
    global io_dirs
    global job_id
    job_id = str(uuid.uuid4())
    for d in ['input', 'output', 'log']:
        dir = os.path.join("/", d, job_id)
        io_dirs[d] = dir
        if not os.path.exists(dir):
            os.makedirs(dir)
        else:
            delete_contents(dir)


def parse_input_data(data):
    global io_dirs 
    for d in data:
        if "type" in d and d["type"] == "url":
            r = requests.get(d["url"])
            filename = os.path.join(io_dirs['input'], d["name"])
            with open(filename, 'wb') as f:
                f.write(r.content)
    filename = os.path.join(io_dirs['input'], 'input.json')
    with open(filename, 'w') as f:
        f.write(json.dumps(data))
                
def fetch_container(data):
    global buddy_image
    buddy_name = data['name']
    buddy_tag = data['tag']
    client = docker.from_env(version='auto')
    client.login(registry="masu.speag.com/v2", username="z43", password="z43")
    img = client.images.pull(buddy_name, tag=buddy_tag)
    buddy_image = buddy_name + ":" + buddy_tag


def prepare_input_and_container(data):
    if 'input' in data:
        parse_input_data(data['input'])

    if 'container' in data:
        fetch_container(data['container'])
   
def dump_log():
    global buddy_image

def start_container(name, stage, io_env):
    client = docker.from_env(version='auto')
    buddy = client.containers.run(buddy_image, "run", 
         detach=False, remove=True,
         volumes = {'workflow_input'  : {'bind' : '/input'}, 
                    'workflow_output' : {'bind' : '/output'},
                    'workflow_log'    : {'bind'  : '/log'}},
         environment=io_env)

    buddy.remove()
    # hash output
#    output_hash = hash_job_output()

    

@app.route("/setup", methods=['POST'])
def setup():
    create_directories()
    # add files if any and dump json
    data = request.get_json()
    prepare_input_and_container(data)

    return "done"

@app.route("/preprocess", methods=['GET'])
def preprocess():
    global buddy
    global buddy_image
    client = docker.from_env(version='auto')

    buddy = client.containers.run(buddy_image, "preprocess", detach=False,
     volumes = {'sidecar_input' :{'bind' : '/input'}, 'sidecar_output' : {'bind' : '/output'}})

    return nice_json({"status" : "preprocess hello nik"})

@app.route("/process", methods=['GET'])
def process():
    global buddy_image
    client = docker.from_env(version='auto')
    buddy = client.containers.run(buddy_image,"process", detach=True,
     volumes = {'sidecar_input' :{'bind' : '/input'}, 'sidecar_output' : {'bind' : '/output'}})
    
    dump_log()

    return nice_json({"status" : "asdfasfd"})

@app.route("/postprocess", methods=['GET'])
def postprocess():
    global buddy
    client = docker.from_env(version='auto')
    buddy = client.containers.run(buddy_image,"postprocess", detach=True,
    volumes = {'sidecar_input' :{'bind' : '/input'}, 'sidecar_output' : {'bind' : '/output'}})

    return nice_json({"status" : "postprocessing"})

@app.route("/run", methods=['POST'])
def run():
    global buddy_image
    global job_id
    create_directories()
    # add files if any and dump json
    data = request.get_json()

    prepare_input_and_container(data)
    io_env = []
    io_env.append("INPUT_FOLDER=/input/"+job_id)
    io_env.append("OUTPUT_FOLDER=/output/"+job_id)
    io_env.append("LOG_FOLDER=/log/"+job_id)
   
    executor.submit(start_container, buddy_image, "run", io_env)
    return nice_json({"status" : "Running pipeline"})

if __name__ == "__main__":
  app.run(port=8000, debug=True, host='0.0.0.0')
