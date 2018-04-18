import os
import json
import docker
import logging
from requests import Session, RequestException
from flask import Flask, request


app = Flask(__name__)
s = Session()

def setup_registry_connection():
    # get authentication state or set default value
    REGISTRY_AUTH = os.environ.get('REGISTRY_AUTH',False)

    # get base_url or set default value
    FRONTEND_URL = os.getenv('FRONTEND_URL','/')
    if not FRONTEND_URL.endswith('/'):
        FRONTEND_URL = FRONTEND_URL + "/"

    if REGISTRY_AUTH == "True" or REGISTRY_AUTH == "true":
        s.auth = (os.environ['REGISTRY_USER'], os.environ['REGISTRY_PW'])

    print("Registry URL: " + os.environ['REGISTRY_URL'])
    print("Frontend URL: " + FRONTEND_URL)

def registry_request(path, method="GET"):
    api_url = os.environ['REGISTRY_URL'] + '/v2/' + path

    try:
        #r = s.get(api_url, verify=False) #getattr(s, method.lower())(api_url)
        r = getattr(s, method.lower())(api_url)
        if r.status_code == 401:
            raise Exception('Return Code was 401, Authentication required / not successful!')
        else:
            return r
    except RequestException as e:
        raise Exception("Problem during docker registry connection")

def retrieve_list_of_repositories():    
    r = registry_request('_catalog')
    j = r.json()
    return j

def retrieve_list_of_images_in_repo(repository_name):
    r = registry_request(repository_name + '/tags/list')
    j = r.json()
    return j

@app.route('/')
def hello_world():
    return 'Hello I\'m alive!'

@app.route('/list_interactive_services', methods=['GET'])
def list_interactive_services():
    list_of_repos = retrieve_list_of_repositories()['repositories']
    interactive_services_prefix = 'simcore/services'
    list_of_interactive_repos = [repo for repo in list_of_repos if str(repo).startswith(interactive_services_prefix)]

    list_of_interactive_services = [retrieve_list_of_images_in_repo(repo) for repo in list_of_interactive_repos]

    return json.dumps(list_of_interactive_services)

@app.route('/start_service', methods=['POST'])
def start_service():
    # check syntax
    if not request.json or not 'service_name' in request.json or not 'tag' in request.json:
        abort(400)

    service_name = request.json['service_name']
    service_tag = request.json['tag']
    # get the docker client
    dockerClient = docker.from_env()
    try:
        # pull the docker image
        response = dockerClient.login(registry="masu.speag.com/v2", username='z43', password='z43')
        dockerImage = dockerClient.images.pull(service_name, tag=service_tag)
        # run the docker image
        container = dockerClient.containers.run(dockerImage, detach=True, auto_remove=True)
        # get the docker IP and port
        return json.dumps({'service_id': container.id})

    except docker.errors.ImageNotFound as e:
        return 'Error service not found: ' + e
    except docker.errors.APIError as e:
        return 'Error while accessing docker server: ' + e

@app.route('/stop_service', methods=['POST'])
def stop_service():
    # check syntax
    if not request.json or not 'service_id' in request.json:
        abort(400)
    service_id = request.json['service_id']
    # get the docker client
    dockerClient = docker.from_env()
    try:
        # pull the docker image
        response = dockerClient.login(registry="masu.speag.com/v2", username='z43', password='z43')
        # get the docker image
        container = dockerClient.containers.get(service_id)
        # stop the container
        container.stop()
        return 'Service stopped'

    except docker.errors.NotFound as e:
        # the docker is already down, return
        return 'Service already stopped'
    except docker.errors.APIError as e:
        return 'Error while accessing docker server: ' + e

if __name__ == "__main__":
    setup_registry_connection()    

    app.run(host='0.0.0.0', debug=False, port=8001, threaded=True)