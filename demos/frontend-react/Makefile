# Makefile with shortcuts for most common operations with react-app
CURRDIR = $(shell pwd)
IMAGENAME = itis/frontend-react
# TODO: image should have the name of containing directory


# Use container as nodejs installation mapped to the application
node:
	docker run -it --rm -v ${CURRDIR}/app:/home/node/app -w /home/node/app -p 6001:6001 node:6.11.5 bash


# Builds a production image of this application
build:
	docker build -t ${IMAGENAME} ./app

run:
	docker run -it --rm -p 6001:6001 --name react-demo ${IMAGENAME}

stop:
	docker stop react-demo
