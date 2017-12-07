# Makefile with shortcuts for most common operations with react-app
CURRDIR = $(shell pwd)
IMAGENAME = itisfoundation/sandbox:frontend-react
# TODO: image should have the name of containing directory


# Use container as nodejs installation mapped to the application
node:
	docker run -it --rm -v ${CURRDIR}/app:/home/node/app -w /home/node/app -p 6002:6002 -p 6001:6001 node:8.9.2 bash


# Builds a production image of this application
build:
	docker build -t ${IMAGENAME} ./app

run:
	docker run -idt --rm -p 6002:6002 -p 6001:6001 --name react-demo ${IMAGENAME}



demo: build run
	open http:/localhost:6001
	
stop:
	docker stop react-demo
	docker rm react-demo
