# Makefile with shortcuts for most common operations with react-app
CURRDIR = $(shell pwd)

# Use container as nodejs installation mapped to the application
node:
	docker run -it --rm -v ${CURRDIR}/app:/home/node/app -w /home/node/app node:6.11.5 bash

# build image for development
build-dev:
	docker build -f ./app/Dockerfile-dev -t itis/react-app:dev ./app

build:
	docker build -t --rm itis/react-app ./app

run-dev: build-dev
	docker run -it --rm -p 6001:6001 --name react-app itis/react-app:dev

run:
	docker run -it --rm -p 6001:6001 --name react-app itis/react-app

stop:
	docker stop react-app
