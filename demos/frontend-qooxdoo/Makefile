# Makefile with shortcuts for most common operations with qooxdoo-app
CURRDIR = $(shell pwd)
IMAGENAME = itisfoundation/sandbox:frontend-qooxdoo
# TODO: image should have the name of containing directory


# Use container as nodejs installation mapped to the application
node:
	docker run -it --rm -v ${CURRDIR}/app2:/home/node/app2 -w /home/node/app2 -p 7001:7001 --dns 172.16.8.15 node:8.9.2 bash


# Builds a production image of this application
build:
	docker build -t ${IMAGENAME} ./app2

run:
	docker run -idt --rm -p 7001:7001 --dns 172.16.8.15 --name qooxdoo-demo ${IMAGENAME}



demo: build run
	open http:/localhost:7001/app2

stop:
	docker stop qooxdoo-demo
	docker rm qooxdoo-demo
