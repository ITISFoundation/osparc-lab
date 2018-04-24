import os
import json
from requests import Session, RequestException

interactive_services_prefix = 'simcore/services/'
s = Session()

def setup_registry_connection():
    # get authentication state or set default value
    REGISTRY_AUTH = os.environ.get('REGISTRY_AUTH',False)
    if REGISTRY_AUTH == "True" or REGISTRY_AUTH == "true":
        s.auth = (os.environ['REGISTRY_USER'], os.environ['REGISTRY_PW'])

    print("Registry URL: " + os.environ['REGISTRY_URL'])

def registry_request(path, method="GET"):
    api_url = 'https://' + os.environ['REGISTRY_URL'] + '/v2/' + path

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
    j = r.json()['repositories']
    return j

def retrieve_list_of_images_in_repo(repository_name):
    r = registry_request(repository_name + '/tags/list')
    j = r.json()
    return j

def retrieve_labels_of_image(image, tag):
    r = registry_request(image + '/manifests/' + tag)
    j = r.json()
    labels = json.loads(j["history"][0]["v1Compatibility"])["container_config"]["Labels"]
    return labels

def retrieve_list_of_repos_with_interactive_services():    
    listOfAllRepos = retrieve_list_of_repositories()
    # get the services repos
    list_of_interactive_repos = [repo for repo in listOfAllRepos if str(repo).startswith(interactive_services_prefix)]
    return list_of_interactive_repos

def get_service_name(repository_name):
    service_name_suffixes = str(repository_name)[len(interactive_services_prefix):]
    return service_name_suffixes.split('/')[0]
