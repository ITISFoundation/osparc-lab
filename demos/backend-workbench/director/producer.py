import os
import registry_proxy
import json
import docker

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
        registry_url = os.environ.get(REGISTRY_URL) + '/v2'
        username = os.environ.get(REGISTRY_USER)
        password = os.environ.get(REGISTRY_PW)
        dockerClient.login(registry=registry_url, username=REGISTRY_USER, password=REGISTRY_PW)
    except docker.errors.APIError as e:
        raise Exception('Error while loging to registry: ' + e)

    
    listOfContainerIDs = []
    for dockerImagePath in listOfImages:
        availableTagsList = sorted(listOfImages[dockerImagePath]['tags'])
        if len(availableTagsList) == 0:
            raise Exception('No available image in ' + dockerImagePath)

        tag = availableTagsList[len(availableTagsList)-1]
        if not service_tag == 'latest' and availableTagsList.count(service_tag) == 1:
            tag = service_tag
        
        try:
            dockerImageFullPath = REGISTRY_URL + dockerImagePath + ':' + tag
            # pull the docker image            

            #dockerImage = dockerClient.images.pull(REGISTRY_URL + dockerImagePath, tag=tag)
            # run the docker image
            container = dockerClient.containers.run(dockerImageFullPath, detach=True, auto_remove=True, labels={"uuid":service_uuid})            
            # get the docker IP and port
            listOfContainerIDs.append({"service name":service_name, "service uuid":service_uuid, "container id":container.id})        

        except docker.errors.ImageNotFound as e:
            # first cleanup
            stop_service(service_uuid)
            raise Exception('Error service not found: ' + e)
        except docker.errors.APIError as e:
            # first cleanup
            stop_service(service_uuid)            
            raise Exception('Error while accessing docker server: ' + e)
    
    return json.dumps({'container_ids': listOfContainerIDs})

def stop_service(service_uuid):
    # get the docker client
    dockerClient = docker.from_env()
    try:
        # login
        registry_url = os.environ.get(REGISTRY_URL) + '/v2'
        username = os.environ.get(REGISTRY_USER)
        password = os.environ.get(REGISTRY_PW)
        dockerClient.login(registry=registry_url, username=username, password=password)
    except docker.errors.APIError as e:
        raise Exception('Error while logging to registry: ' + e)
    
    try:
        # get list of running containers and stop them
        listOfRunningContainersWithUUID = dockerClient.containers.list(filters={'label':'uuid=' + service_uuid})
        [container.stop() for container in listOfRunningContainersWithUUID]
    except docker.errors.APIError as e:
        raise Exception('Error while stopping container' + e)
    