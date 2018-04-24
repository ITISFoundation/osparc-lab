#!/bin/sh

sudo apt-get update
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common \
    make
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update
sudo apt-get install -y docker-ce
sudo usermod -aG docker ubuntu
# aws cli
# sudo apt-get install -y unzip
# curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
# unzip awscli-bundle.zip
# sudo /usr/bin/python3 ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws
# 
# 
# 
# # what follows is needed to avoid docker login for ecr
# git clone https://github.com/awslabs/amazon-ecr-credential-helper
# cd amazon-ecr-credential-helper
# make docker
# export PATH=/amazon-ecr-credential-helper/bin/local:$PATH
# mkdir -p /home/ubuntu/.docker
# echo '{
#   "credsStore": "ecr-login"
# }' > /home/ubuntu/.docker/config.json
