from flask import Flask, make_response
import numpy as np
import json
import uuid
import os
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)

def mockup_data():
    data = []
#    plot1 = []
#    plot1.append([0,1,2,3])
#    plot1.append([0, 10, 20, 30])
#    data.append(plot1)
#
#    plot2 = []
#    plot2.append([0, 1, 2])
#    plot2.append([0, 100, 25])
#    data.append(plot2)
    x = np.linspace(0.0, 10.0, num = 10001)
    y = np.sin(x)
    data.append([list(x),list(y)])

    return data

@app.route("/plot_rest", methods=['GET'])
def plot_rest():
    data = mockup_data()
    return make_response(json.dumps(data))

@app.route("/plot_db", methods=['GET'])
def plot_db():
    data = mockup_data()
    data_id = str(uuid.uuid4())
    db_file = os.path.join(r'/database',data_id)
    with open(db_file, 'w') as outfile:
        json.dump(data, outfile)
        
    db_resp = {}
    db_resp['data_file'] = db_file
    return make_response(json.dumps(db_resp))

@app.route("/plot_mongo", methods=['GET'])
def plot_mongo():
    data = mockup_data()
    dict_data ={}
    for d in range(len(data)):
        dict_data[str(d)] = data[d]

    db_client = MongoClient("mongodb://database:27017/")

    db = db_client.test_data
    posts = db.posts
    post_id = posts.insert_one(dict_data).inserted_id

    return make_response(json.dumps(str(post_id)))


if __name__ == "__main__":
    app.run(port=5011, debug=True, host='0.0.0.0')
