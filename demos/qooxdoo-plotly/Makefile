# Makefile with shortcuts for most common operations with qooxdoo-app
CURRDIR = $(shell pwd)
IMAGENAME = itisfoundation/sandbox:qooxdoo-plotly
# TODO: image should have the name of containing directory


# Use container as nodejs installation mapped to the application
node:
	docker run -it --rm -v ${CURRDIR}/app:/home/node/app -w /home/node/app -p 7001:7001 --dns 172.16.8.15 node:8.9.2 bash


# Builds a production image of this application
build:
	docker build -t ${IMAGENAME} ./app

run:
	docker run -idt --rm -p 7001:7001 --dns 172.16.8.15 --name qooxdoo-plotly ${IMAGENAME} node server.js



demo: build run
	open http:/localhost:7001/app

stop:
	docker stop qooxdoo-plotly
	docker rm qooxdoo-plotly