import os
import sys
import logging
import json
from requests import Session, RequestException

s = Session()

def director_request(path, method="GET", data=dict()):
    api_url = os.environ.get('DIRECTOR_HOST', 'http://172.16.9.89') + ':' + os.environ.get('DIRECTOR_PORT', '8001') + '/' + path
    try:        
        #r = s.get(api_url, verify=False) #getattr(s, method.lower())(api_url)
        if len(data) == 0:
            r = getattr(s, method.lower())(api_url)
        else:
            r = getattr(s, method.lower())(api_url, json=data)
            #r = s.post(api_url, json={'service_name':'modeler', 'service_uuid':'0000'})
        if r.status_code == 400:
            raise Exception('Return Code was 400, Bad request, malformed syntax!')
        if r.status_code == 401:
            raise Exception('Return Code was 401, Authentication required / not successful!')
        elif r.status_code == 404:
            raise Exception('Return code 404, Unknown URL used!')
        elif r.status_code == 500:
            raise Exception('Return code 500, Internal Server Error!')
        else:
            logging.warning('return ok: %s', r.json())
            return r
    except RequestException as e:
        raise Exception("Problem during connection to director")

def retrieve_interactive_services():
    try:
        request = director_request('list_interactive_services')
        return request.json()
    except Exception as e:
        return 'failed: ' + str(e)

def start_service(service_name, service_uuid):
    try:
        request = director_request('start_service', method='POST', data={'service_name':service_name, 'service_uuid':str(service_uuid)})
        return request.json()
    except Exception as e:
        return 'failed: ' + str(e)

def stop_service(service_uuid):
    try:
        request = director_request('stop_service', method='POST', data={'service_uuid':str(service_uuid)})
        return request.json()
    except Exception as e:
        return 'failed: ' + str(e)
    