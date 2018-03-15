from flask import Flask, make_response
import numpy as np
import json
import uuid
import os
from pymongo import MongoClient
from bson import ObjectId
import pika
import threading
import time


def on_rabbit_request(*args, **kwargs):
    channel = kwargs["channel"]
    callback = kwargs["callback"]
    queue = kwargs["queue"]

    channel.basic_consume(callback, queue=queue, no_ack=True)

    t1 = threading.Thread(target=channel.start_consuming)
    t1.start()
    t1.join(0)

credentials = pika.PlainCredentials('guest', 'guest')
parameters = pika.ConnectionParameters(
    host='rabbitmq', port=5672, virtual_host='/', credentials=credentials)
channel_established = False
channel = None
while not channel_established:
    try:
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()
        channel.queue_declare(queue='hello')
        channel_established = True
    except:
        time.sleep(1)


counter = 1


def callback(ch, method, properties, body):
    global counter
    with open("log.dat", "a") as f:
        f.write(str(counter) + ": " + body + "\n")
        counter = counter + 1

# channel.basic_consume(callback,
#                      queue='hello',
# no_ack=True)
#
# print ' [*] Waiting for messages. To exit press CTRL+C'
# channel.start_consuming()
on_rabbit_request(callback=callback, queue='hello', channel=channel)

app = Flask(__name__)


def mockup_data(id):
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
    x = np.linspace(0.0, 10.0, num=10001)
    if id == 0:
        y = np.sin(x)
    elif id == 1:
        y = 10 * np.cos(2 * x)
    else:
        y = np.exp(-3 * x * x)
    data.append([list(x), list(y)])

    return data


@app.route("/plot_rest", methods=['GET'])
def plot_rest():
    data = mockup_data(0)
    return make_response(json.dumps(data))


@app.route("/plot_db", methods=['GET'])
def plot_db():
    data = mockup_data(1)
    data_id = str(uuid.uuid4())
    db_file = os.path.join(r'/database', data_id)
    with open(db_file, 'w') as outfile:
        json.dump(data, outfile)

    db_resp = {}
    db_resp['data_file'] = db_file
    return make_response(json.dumps(db_resp))


@app.route("/plot_mongo", methods=['GET'])
def plot_mongo():
    data = mockup_data(2)
    dict_data = {}
    for d in range(len(data)):
        dict_data[str(d)] = data[d]

    db_client = MongoClient("mongodb://database:27017/")

    db = db_client.test_data
    posts = db.posts
    post_id = posts.insert_one(dict_data).inserted_id

    return make_response(json.dumps(str(post_id)))


if __name__ == "__main__":
    app.run(port=5011, debug=True, host='0.0.0.0')
