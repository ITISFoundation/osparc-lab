# AWS Registry

This documents how to setup a private docker registry on AWS using a bucket in S3.

https://www.digitalocean.com/community/tutorials/how-to-set-up-a-private-docker-registry-on-ubuntu-14-04
https://www.cb-net.co.uk/linux/using-lets-encrypt-with-an-nginx-docker-container-plus-bye-bye-startssl/


## Prerequisites

Create a new ec2 ubuntu 16.04 instance with the following settings

- subnet: simcore-dev
- add contents of install-docker.sh to Advanced Details
- security-group: simcore private
- associate elastic ip address with this instance (A record registry.simcore.io in Route 53)
- create S3 bucket simcore-registry
- make sure you have your accesskey and secretkey ready

## Registry setup

- copy the content of this directory into the home directory of the ec2 instance scp -i permfile -r registry ubuntu@registry.simcore.io:
- login and move into that folder
- docker-compose up -d
- sh setup.sh
- docker-compose down
- cd nginx/conf.d
- htpasswd -c registry.password USERNAME and create new pwd when prompted
- export REGISTRY_USER=USERNAME
- export REGISTRY_PW=PW\
- edit storage/s3/accesskey and storage/s3/secretkey to match you AWS account credentials
- remove comments in docker-compose.yml
- reomve comments in conf.d   
- docker-compose up

