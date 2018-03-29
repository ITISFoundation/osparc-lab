import hashlib
import json
import random
import sys

import celery.states as states
import docker
import gridfs
import numpy as np
import plotly
import redis
import requests
from bson import ObjectId
from celery import signature
from celery.result import AsyncResult
from flask import Flask, make_response, render_template, request, url_for
from pymongo import MongoClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from werkzeug.exceptions import NotFound, ServiceUnavailable

from conf import DATABASE_URI, QUEUE_NAME
from models import Base, CeleryTask, Task, Workflow
from worker import celery

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
 
r = redis.StrictRedis(host="redis", port=6379, charset="utf-8", decode_responses=True)

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
        client.login(registry="masu.speag.com/v2", username="z43", password="z43")
        img = client.images.pull(container_name, tag=container_tag)
        container_hash = str(img.id).split(':')[1]
        return container_hash

def start_computation(data):
    try:
       requests.post("http://sidecar:8000/run", json = data)

    except requests.exceptions.ConnectionError:
        raise ServiceUnavailable("The computational service is unavailable.")

@app.route('/check/<string:id>')
def check_task(id):
    task_id = id
    res = celery.AsyncResult(task_id)
    if res.state==states.PENDING:
        return res.state
    elif str(res.state) == "RUNNING":
        data ={}
        log_key = task_id + ":log"
        prog_key = task_id + ":progress"
        data['Log'] = str(r.lrange(log_key, 0, -1))
        data['Progress'] = str(r.lrange(prog_key, 0, -1))
        return json.dumps(data)
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

# get all task infos
@app.route('/check')
def check_all_tasks():
    all_in_one = ""
    for task_id in task_info:
        #res = celery.AsyncResult(task_id)
        log_key = task_id + ":log"
        cur_len = r.llen(log_key)
        log = []        
        for i in range(cur_len):
            l = r.lpop(log_key)
            if not l is None:
                log.append(l)
            #log = r.lrange(log_key, 0, cur_len-1)
        if len(log):
            task_info[task_id] = "\n".join(log[::-1])+"\n"
            all_in_one = all_in_one + task_info[task_id]
    return json.dumps(all_in_one)

@app.route('/check_pipeline_log')
def check_pipeline_log():
    engine = create_engine(DATABASE_URI)
    Session = sessionmaker(bind=engine)

    session = Session()
    tasks = session.query(Task).all()
    session.close()
    all_in_one = ""
    for task in tasks:
        task_id = task.celery_task_uid
        if task_id:
            #all_in_one = all_in_one + task_id + "\n"
            log_key = task_id + ":log"
            cur_len = r.llen(log_key)
            log = []        
            for i in range(cur_len):
                l = r.lpop(log_key)
                if not l is None:
                    log.append(l)
            if len(log):
                task_info[task_id] = "\n".join(log[::-1])+"\n"
                all_in_one = all_in_one + task_info[task_id]
    return json.dumps(all_in_one)

@app.route('/check_pipeline_progress')
def check_pipeline_progress():
    engine = create_engine(DATABASE_URI)
    Session = sessionmaker(bind=engine)

    session = Session()
    tasks = session.query(Task).all()
    session.close()
    pipeline_progress = [-1 for i in range(len(tasks))]
    for task in tasks:
        task_id = task.celery_task_uid
        pipeline_part = task.id
        if task_id:
            prog_key = task_id + ":progress"
            progress = r.get(prog_key)
            pipeline_progress[pipeline_part-1] = progress
            
    return json.dumps(pipeline_progress)

@app.route('/stop_pipeline')
def stop_pipeline():
    engine = create_engine(DATABASE_URI)
    Session = sessionmaker(bind=engine)

    session = Session()
    tasks = session.query(Task).all()
    session.close()
    pipeline_progress = [-1 for i in range(len(tasks))]
    for task in tasks:
        task_id = task.celery_task_uid
        if task_id:
            res = celery.AsyncResult(task_id)
            res.revoke(terminate=True)

    Base.metadata.drop_all(engine, checkfirst=True)
    CeleryTask.__table__.drop(engine, checkfirst=True)  
    CeleryTask.__table__.create(engine, checkfirst=True)
    Base.metadata.create_all(engine)     
    session.commit()
    session.close()
    return "Deleted"

@app.route('/clear_log')
def clear_log():
    task_info = {}
    return "log deleted"

def run_func_parser(x_min, x_max, N, f):
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
    	"name": "masu.speag.com/simcore/comp.services/functionparser",
        "tag": "2.0"
    }
    }""" % (N, x_min, x_max, f) 

    data = json.loads(data_str)
    hashstr = ""
    [input_hash, input_exists] = parse_input_data(data)
   
    container_hash = parse_container_data(data)
    
    combined = hashlib.sha256()
    combined.update(input_hash.encode('utf-8'))
    combined.update(container_hash.encode('utf-8'))
    output_hash = combined.hexdigest()
   
    output_ready = output_exists(output_hash)
    print(output_ready)
    task = celery.send_task('mytasks.run', args=[data], kwargs={})
    task_info[task.id] = ["Task submitted"]
    return task

def run_pipeline(pipeline_id):
    engine = create_engine(DATABASE_URI)
    Session = sessionmaker(bind=engine)

    session = Session()
    Base.metadata.drop_all(engine, checkfirst=True)
    CeleryTask.__table__.drop(engine, checkfirst=True)
    CeleryTask.__table__.create(engine, checkfirst=True)
    Base.metadata.create_all(engine)

    if pipeline_id == 0:
    
        for i in range(8):
            session.add(Task(sleep=random.randint(2, 7))) # sleep for 1-7 secs

            session.add(
                Workflow(
                dag_adjacency_list = dict([
                    (1, [3]),
                    (2, [4]),
                    (3, [5]),
                    (4, [5]),
                    (5, [6, 7]),
                    (6, [8]),
                    (7, [8])
                ])
                )
            )
    elif pipeline_id == 1:
        for i in range(15):
            session.add(Task(sleep=random.randint(2, 7))) # sleep for 1-7 secs

            session.add(
                Workflow(
                dag_adjacency_list = dict([
                    (1, [2]),
                    (2, [3]),
                    (3, [10]),
                    (4, [5]),
                    (5, [6]),
                    (6, [10]),
                    (7, [8]),
                    (8, [9]),
                    (9, [12]),
                    (10, [11]),
                    (11, [14]),
                    (12, [13]),
                    (13, [14]),
                    (14, [15])
                ])
                )
            )
    elif pipeline_id == 2:
        for i in range(42):
            session.add(Task(sleep=random.randint(2, 7))) # sleep for 1-7 secs

            session.add(
                Workflow(
                dag_adjacency_list = dict([
                    (1, [2]),
                    (2, [3]),
                    (3, [25]),
                    (4, [5]),
                    (5, [6]),
                    (6, [25]),
                    (7, [8]),
                    (8, [9]),
                    (9, [25]),
                    (10, [11]),
                    (11, [12]),
                    (12, [26]),
                    (13, [14]),
                    (14, [15]),
                    (15, [26]),
                    (16, [17]),
                    (17, [18]),
                    (18, [27]),
                    (19, [20]),
                    (20, [21]),
                    (21, [27]),
                    (22, [23]),
                    (23, [24]),
                    (24, [27]),
                    (25, [28]),
                    (26, [29,30]),
                    (27, [31,32,33]),
                    (28, [35]),
                    (29, [35]),
                    (30, [34]),
                    (31, [34]),
                    (32, [37]),
                    (33, [38]),
                    (34, [40]),
                    (35, [36]),
                    (36, [40]),
                    (38, [39]),
                    (39, [40]),
                    (40, [41,42])
                ])
                )
            )

    session.commit()

    workflow = session.query(Workflow).all()[-1]

    print ("WORKFLOW", workflow.id)
    session.flush()
    session.close()
    task = celery.send_task('mytasks.pipeline', args=(workflow.id,), kwargs={})
    task_info[task.id] = ["Task submitted"]
    return task


@app.route('/calc/<float:x_min>/<float:x_max>/<int:N>/<string:f>')
def calc(x_min, x_max, N, f):
    task = run_func_parser(x_min, x_max, N, f)

    return "<a href='{url}'>check status of {id} </a>".format(id=task.id,
        url=url_for('check_task',id=task.id,_external=True))

@app.route('/calc_id/<float:x_min>/<float:x_max>/<int:N>/<string:f>')
def calc_id(x_min, x_max, N, f):
    task = run_func_parser(x_min, x_max, N, f)
    data = {}
    data["task_id"] = task.id
    json_data = json.dumps(data)     
    return json_data

@app.route('/pipeline_id/<int:pipeline_id>')
def pipeline_id(pipeline_id):
    task = run_pipeline(pipeline_id)
    data = {}
    data["task_id"] = task.id
    json_data = json.dumps(data)     
    return json_data


if __name__ == "__main__":
    app.run(port=8010, debug=True, host='0.0.0.0', threaded=True)
