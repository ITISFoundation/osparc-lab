# Dockerized node-js

## Setup
``` bash
cd docker-node

# Build docker
docker build -t itis/node-web-app .

# Running detached. redirect port to 49160
docker run -p 49160:8080 -d itis/node-web-app

dockers ps
docker logs <container id >

# Execute inside
docker exec -it 98 /bin/bash
```



## References
 - [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
 - [Docker and Node.js Best Practices](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
