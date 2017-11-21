from flask import Flask, make_response
from werkzeug.exceptions import NotFound, ServiceUnavailable
import json
import requests
import os

app = Flask(__name__)

def nice_json(arg):
    response = make_response(json.dumps(arg, sort_keys = True, indent=4))
    response.headers['Content-type'] = "application/json"
    return response

with open("/registry/registry.json", "r") as f:
    registered_services = json.load(f)


@app.route("/services", methods=['GET'])
def services():
    return nice_json(registered_services)

@app.route("/service/<id>", methods=['GET'])
def service(id):
    return nice_json(registered_services[id])

@app.route("/plot_rabbit", methods=['GET'])
def plot_rabbit():
    return nice_json({"status" : "under construstion"})


if __name__ == "__main__":
    app.run(port=8010, debug=True, host='0.0.0.0')
