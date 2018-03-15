from flask import Flask, make_response, request, url_for, render_template
import json
import hashlib
from pymongo import MongoClient
import gridfs
from bson import ObjectId
from werkzeug.exceptions import NotFound, ServiceUnavailable
import requests
from worker import celery
from celery.result import AsyncResult
import celery.states as states
from celery import signature
import numpy as np
import docker
import sys
import plotly

app = Flask(__name__)


task_info = {}

def create_graph(x,y):
    graph = [
        dict(
            data=[
                dict(
                    x=x,
                    y=y,
                    type='scatter'
                  ),
              ],
              layout=dict(
                  title='scatter plot'
              )
          )
          ]
    return graph
 

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
    if "input" in data:
        inp = data["input"]
        data_hash = hashlib.sha256(json.dumps(inp, sort_keys=True).encode('utf-8')).hexdigest()
        db_client = MongoClient("mongodb://database:27017/")
        input_database = db_client.input_database
        input_collections = input_database.input_collections
        exists = input_collections.find_one({"_hash" : str(data_hash)})
        if exists == None:
            cp_data = data.copy()
            cp_data["_hash"] = [str(data_hash)]
            input_collections.insert_one(cp_data)
    
        return [data_hash, not exists is None]

def parse_container_data(data):
    if "container" in data:
        container = data["container"]
        container_name = container["name"]
        container_tag = container['tag']
        client = docker.from_env(version='auto')
<<<<<<< HEAD
#        client.login(registry="masu.speag.com/v2", username="z43", password="z43")
=======
        client.login(registry="masu.speag.com/v2", username="z43", password="z43")
>>>>>>> master
        img = client.images.pull(container_name, tag=container_tag)
        container_hash = str(img.id).split(':')[1]
        return container_hash

def start_computation(data):
    try:
<<<<<<< HEAD
=======
       # req = requests.post("http://sidecar:8000/setup", json = data)
       # req2 = requests.get("http://sidecar:8000/preprocess")
       # req3 = requests.get("http://sidecar:8000/process")
       # req4 = requests.get("http://sidecar:8000/postprocess")
#       print data
#       sys.stdout.flush()
>>>>>>> master
       req = requests.post("http://sidecar:8000/run", json = data)

    except requests.exceptions.ConnectionError:
        raise ServiceUnavailable("The computational service is unavailable.")

@app.route('/add/<int:param1>/<int:param2>')
def add(param1,param2):
    task = celery.send_task('mytasks.add', args=[param1, param2], kwargs={})
    return "<a href='{url}'>check status of {id} </a>".format(id=task.id,
                url=url_for('check_task',id=task.id,_external=True))

@app.route('/check/<string:id>')
def check_task(id):
    res = celery.AsyncResult(id)
    if res.state==states.PENDING:
        return res.state
    else:
        db_client = MongoClient("mongodb://database:27017/")
        output_database = db_client.output_database
        output_collections = output_database.output_collections
        exists = output_collections.find_one({"_hash" : str(res.result)})
        if exists is not None:
            file_db = db_client.file_db
            fs = gridfs.GridFS(file_db)
            for file_id in exists["ids"]:
                data = fs.get(file_id).read()
                data_array = np.fromstring(data, sep="\t")
                x = data_array[0::2]
                y = data_array[1::2]
                graph = create_graph(x, y)
                ids = ['graph-{}'.format(i) for i, _ in enumerate(graph)]
                # objects to their JSON equivalents
                graphJSON = json.dumps(graph, cls=plotly.utils.PlotlyJSONEncoder)
                
                return render_template('layouts/index.html',
                                       ids=ids,
                                       graphJSON=graphJSON)

        return str(res.result)


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
    combined.update(input_hash.encode('utf-8'))
    combined.update(container_hash.encode('utf-8'))
    output_hash = combined.hexdigest()
   
    output_ready = output_exists(output_hash)
    task = celery.send_task('mytasks.run', args=[data], kwargs={})
         
    return "<a href='{url}'>check status of {id} </a>".format(id=task.id,
                  url=url_for('check_task',id=task.id,_external=True))


# @app.route("/calc", methods=['GET'])
@app.route('/calc/<float:x_min>/<float:x_max>/<int:N>/<string:f>')
def calc(x_min, x_max, N, f):
    #ata = request.get_json()
   
    data_str = """{
    "input": 
    [
           {
           	"name": "N", 
               	"value": %s
           }, 
           {
           	"name": "xmin", 
               	"value": %f
           }, 
           {
           	"name": "xmax", 
               	"value": %f
           },
           {
               	"name": "func", 
               	"value": %s
           }
    ],
    "container":
    {
    	"name": "mguidon/simcore.comp.backend.functionparser",
        "tag": "2.0"
    }
    }""" % (N, x_min, x_max, f) 

    data = json.loads(data_str)
    print(type(data))
    sys.stdout.flush()
    hashstr = ""
    [input_hash, input_exists] = parse_input_data(data)
   
    container_hash = parse_container_data(data)
    
    combined = hashlib.sha256()
    combined.update(input_hash.encode('utf-8'))
    combined.update(container_hash.encode('utf-8'))
    output_hash = combined.hexdigest()
   
    output_ready = output_exists(output_hash)
    task = celery.send_task('mytasks.run', args=[data], kwargs={})
         
    return "<a href='{url}'>check status of {id} </a>".format(id=task.id,
                  url=url_for('check_task',id=task.id,_external=True))


if __name__ == "__main__":
<<<<<<< HEAD
    app.run(port=8010, debug=True, host='0.0.0.0', threaded=True)
=======
    app.run(port=8010, debug=True, host='0.0.0.0')
>>>>>>> master
