docker-machine scp docker-compose-swarm.yml manager1:
docker-machine ssh manager1 'docker stack deploy -c docker-compose-swarm.yml workflow'
#docker-machine ssh manager1 'docker login -u z43 -p z43 masu.speag.com && docker stack deploy -c docker-compose-swarm.yml workflow --with-registry-auth'
