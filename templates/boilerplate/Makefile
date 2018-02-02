# Makefile with shortcuts for most common operations with qooxdoo-app
CURRDIR = $(shell pwd)
IMAGENAME = itisfoundation/sandbox:boilerplate
# TODO: image should have the name of containing directory


# Use container as nodejs installation mapped to the application
node:
	docker run -it --rm -v ${CURRDIR}/qxapp:/home/node/qxapp -w /home/node/qxapp -p 8080:8080 --dns 172.16.8.15 node:8.9.2 bash


# Builds a production image of this application
build:
	docker build -t ${IMAGENAME} ./qxapp

run:
	docker run -idt --rm -p 8080:8080 --dns 172.16.8.15 --name qooxdoo-demo ${IMAGENAME} qx serve



demo: build run
	open http://localhost:8080/source-output/qxapp/index.html
	
stop:
	docker stop qooxdoo-demo
	docker rm qooxdoo-demo