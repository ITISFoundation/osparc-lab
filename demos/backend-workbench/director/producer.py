import os
import registry_proxy
import json
import docker

def isInLocalMode():
    local_mode = bool(os.environ.get('LOCAL_MODE', True) == 'True')
    return local_mode

def start_service(service_name, service_tag, service_uuid):
    # get the repos implied by the service name
    listOfInteractiveServicesRepositories = registry_proxy.retrieve_list_of_repos_with_interactive_services()
    # find the ones containing the service name
    listOfReposForService = []
    [listOfReposForService.append(i) for i in listOfInteractiveServicesRepositories if registry_proxy.get_service_name(i) == service_name]
    # get the available tags for each service
    listOfImages = {}
    for repo in listOfReposForService:
        listOfImages[repo] = registry_proxy.retrieve_list_of_images_in_repo(repo)
    # get the docker client
    dockerClient = docker.from_env()
    try:
        # login
        registry_url = os.environ.get('REGISTRY_URL')
        username = os.environ.get('REGISTRY_USER')
        password = os.environ.get('REGISTRY_PW')
        dockerClient.login(registry=registry_url + '/v2', username=username, password=password)        
    except docker.errors.APIError as e:
        raise Exception('Error while loging to registry: ' + str(e))

    
    listOfContainerIDs = []
    for dockerImagePath in listOfImages:
        availableTagsList = sorted(listOfImages[dockerImagePath]['tags'])
        if len(availableTagsList) == 0:
            raise Exception('No available image in ' + dockerImagePath)

        tag = availableTagsList[len(availableTagsList)-1]
        if not service_tag == 'latest' and availableTagsList.count(service_tag) == 1:
            tag = service_tag
        
        try:
            dockerImageFullPath = registry_url +'/' + dockerImagePath + ':' + tag
            # run the docker image
            if isInLocalMode():
                container = dockerClient.containers.run(dockerImageFullPath, detach=True, auto_remove=True, labels={"uuid":service_uuid})            
                listOfContainerIDs.append({"service name":service_name, "service uuid":service_uuid, "container id":container.id})        
            else:
                service = dockerClient.services.create(dockerImageFullPath, labels={"uuid":service_uuid})
                listOfContainerIDs.append({"service name":service_name, "service uuid":service_uuid, "container id":service.id})
            

        except docker.errors.ImageNotFound as e:
            # first cleanup
            stop_service(service_uuid)
            raise Exception('Error service not found: ' + str(e))
        except docker.errors.APIError as e:
            # first cleanup
            stop_service(service_uuid)            
            raise Exception('Error while accessing docker server: ' + str(e))
    
    return json.dumps({'container_ids': listOfContainerIDs})

def stop_service(service_uuid):
    # get the docker client
    dockerClient = docker.from_env()
    try:
        # login
        registry_url = os.environ.get('REGISTRY_URL') + '/v2'
        username = os.environ.get('REGISTRY_USER')
        password = os.environ.get('REGISTRY_PW')
        dockerClient.login(registry=registry_url, username=username, password=password)
    except docker.errors.APIError as e:
        raise Exception('Error while logging to registry: ' + str(e))
    
    try:
        # get list of running containers and stop them
        if isInLocalMode():
            listOfRunningContainersWithUUID = dockerClient.containers.list(filters={'label':'uuid=' + service_uuid})
            [container.stop() for container in listOfRunningContainersWithUUID]
        else:
            listOfRunningServicesWithUUID = dockerClient.services.list(filters={'label':'uuid=' + service_uuid})
            [service.remove() for service in listOfRunningServicesWithUUID]

    except docker.errors.APIError as e:
        raise Exception('Error while stopping container' + str(e))
    