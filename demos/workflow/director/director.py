from flask import Flask, make_response, request, url_for
import json
import hashlib
from pymongo import MongoClient
from bson import ObjectId

import docker

app = Flask(__name__)

task_info = {}

def nice_json(arg):
    response = make_response(json.dumps(arg, sort_keys = True, indent=4))
    response.headers['Content-type'] = "application/json"
    return response

def output_exists(output_hash):
    db_client = MongoClient("mongodb://database:27017/")
    output_database = db_client.output_database
    output_collections = output_database.output_collections
    exists = output_collections.find_one({"_hash" : str(output_hash)})
    return not exists is None
   
def parse_input_data(data):
    if data.has_key("input"):
        inp = data["input"]
        data_hash = hashlib.sha256(json.dumps(inp, sort_keys=True)).hexdigest()
        db_client = MongoClient("mongodb://database:27017/")
        input_database = db_client.input_database
        input_collections = input_database.input_collections
        exists = input_collections.find_one({"_hash" : str(data_hash)})
        if exists == None:
           data["_hash"] = [str(data_hash)]
           input_collections.insert_one(data)
    
        return [data_hash, not exists is None]

def parse_container_data(data):
    if data.has_key("container"):
        container = data["container"]
        container_name = container["name"]
        container_tag = container['tag']
        client = docker.from_env(version='auto')
        client.login(registry="masu.speag.com/v2", username="z43", password="z43")
        img = client.images.pull(container_name, tag=container_tag)
        container_hash = str(img.id).split(':')[1]
        return container_hash


@app.route("/services", methods=['GET'])
def services():
    return nice_json(registered_services)

@app.route("/service/<id>", methods=['GET'])
def service(id):
    return nice_json(registered_services[id])

@app.route("/task/<id>", methods=['Get'])
def task(id):
   return "42" 

@app.route("/run_pipeline", methods=['POST'])
def run_pipeline():
    data = request.get_json()
    hashstr = ""
    [input_hash, input_exists] = parse_input_data(data)
   
    container_hash = parse_container_data(data)

    combined = hashlib.sha256()
    combined.update(input_hash)
    combined.update(container_hash)
    output_hash = combined.hexdigest()

    output_ready = output_exists(output_hash)
    if not output_ready:
       print "needs some work" 

    return nice_json({"input_hash" : str(input_hash), "input_exists" : str(input_exists),
        "output_hash" : str(output_hash), "output_exists" : str(output_ready)})


if __name__ == "__main__":
    app.run(port=8010, debug=True, host='0.0.0.0')