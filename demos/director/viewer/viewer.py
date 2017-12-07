from flask import Flask, render_template
from werkzeug.exceptions import NotFound, ServiceUnavailable
import json
import requests
import os
from pymongo import MongoClient
from bson import ObjectId
import plotly

app = Flask(__name__)

def create_graphs(raw_data):
    graphs = [
#        dict(
#            data=[
#                dict(
#                    x=raw_data[0][0],
#                    y=raw_data[0][1],
#                    type='scatter'
#                ),
#            ],
#            layout=dict(
#                title='scatter plot'
#            )
#        ),
#
#        dict(
#            data=[
#                dict(
#                    x=raw_data[1][0],
#                    y=raw_data[1][1],
#                    type='bar'
#                ),
#            ],
#            layout=dict(
#                title='histogram'
#            )
#        ),

        dict(
            data=[
                dict(
                    x=raw_data[0][0],
                    y=raw_data[0][1]),
            ],
            layout=dict(
                title='data plot'
            )
        )
    ]

    return graphs

@app.route("/plot_rest", methods=['GET'])
def plot_rest():
    try:
        jdata = requests.get("http://producer:5011/plot_rest")
    except requests.exceptions.ConnectionError:
        raise ServiceUnavailable("The producer service is unavailable.")

    data = jdata.json()

    graphs = create_graphs(data)


    # Add "ids" to each of the graphs to pass up to the client
    # for templating
    ids = ['graph-{}'.format(i) for i, _ in enumerate(graphs)]

    # Convert the figures to JSON
    # PlotlyJSONEncoder appropriately converts pandas, datetime, etc
    # objects to their JSON equivalents
    graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)

    return render_template('layouts/index.html',
                           ids=ids,
                           graphJSON=graphJSON)

@app.route("/plot_db", methods=['GET'])
def plot_db():
    try:
        jdata = requests.get("http://producer:5011/plot_db")
    except requests.exceptions.ConnectionError:
        raise ServiceUnavailable("The producer service is unavailable.")

    db_data = jdata.json()

    data_file = db_data['data_file']
    data = []
    with open(data_file) as json_data:
        data = json.load(json_data)
        os.remove(data_file)

    graphs = create_graphs(data)


    # Add "ids" to each of the graphs to pass up to the client
    # for templating
    ids = ['graph-{}'.format(i) for i, _ in enumerate(graphs)]

    # Convert the figures to JSON
    # PlotlyJSONEncoder appropriately converts pandas, datetime, etc
    # objects to their JSON equivalents
    graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)

    return render_template('layouts/index.html',
                           ids=ids,
                           graphJSON=graphJSON)

@app.route("/plot_mongo", methods=['GET'])
def plot_mongo():
    try:
        jdata = requests.get("http://producer:5011/plot_mongo")
    except requests.exceptions.ConnectionError:
        raise ServiceUnavailable("The producer service is unavailable.")

    post_id = ObjectId(jdata.json())
    db_client = MongoClient("mongodb://database:27017/")

    db = db_client.test_data
    posts = db.posts
    plot_data = posts.find_one({"_id" : post_id})

    data = []
    for k in plot_data.keys():
        data.append(plot_data[k])

    graphs = create_graphs(data)


    # Add "ids" to each of the graphs to pass up to the client
    # for templating
    ids = ['graph-{}'.format(i) for i, _ in enumerate(graphs)]

    # Convert the figures to JSON
    # PlotlyJSONEncoder appropriately converts pandas, datetime, etc
    # objects to their JSON equivalents
    graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)

    return render_template('layouts/index.html',
                           ids=ids,
                           graphJSON=graphJSON)


if __name__ == "__main__":
    app.run(port=5010, debug=True, host='0.0.0.0')
