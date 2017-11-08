# Dockerized node-js

## Setup
``` bash
cd docker-node

# Build docker
$ bin/build

# Running detached. redirect port to 49160
$ bin/run

$ dockers ps
$ docker logs mynodejs-app

# Test server
$ curl http://localhost:49160
Hoi zaeme!

# Execute bash inside the container.
# Can check permissions and different directory structures
$ docker exec -it mynodejs-app /bin/bash
```

## References
 - [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
 - [Docker and Node.js Best Practices](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
