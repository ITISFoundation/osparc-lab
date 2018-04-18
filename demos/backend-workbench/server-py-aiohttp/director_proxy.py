import os
import sys
import logging
from requests import Session, RequestException

s = Session()

def director_request(path, method="GET"):
    api_url = os.environ['DIRECTOR_HOST'] + ':' + os.environ['DIRECTOR_PORT'] + '/' + path
    try:        
        #r = s.get(api_url, verify=False) #getattr(s, method.lower())(api_url)
        r = getattr(s, method.lower())(api_url)
        if r.status_code == 401:
            raise Exception('Return Code was 401, Authentication required / not successful!')
        elif r.status_code == 404:
            raise Exception('Return code 404, Unknown URL used!')
        else:
            logging.warning('return ok: %s', r.json())
            return r
    except RequestException as e:
        raise Exception("Problem during connection to director")

def retrieve_interactive_services():
    request = director_request('list_interactive_services')
    return request.json()
