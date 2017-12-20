# Makefile with shortcuts for most common operations with vue-app
CURRDIR = $(shell pwd)
IMAGENAME = itisfoundation/sandbox:frontend-vue
# TODO: image should have the name of containing directory


# Use container as nodejs installation mapped to the application
node:
	docker run -it --rm -v ${CURRDIR}/app:/home/node/app -w /home/node/app -p 5001:5001 node:6.11.5 bash


# Builds a production image of this application
build:
	docker build -t ${IMAGENAME} ./app

run:
	docker run -idt --rm -p 5001:5001 --name vue-demo ${IMAGENAME}



demo: build run
	open http:/localhost:5001
	
stop:
	docker stop vue-demo
	docker rm vue-demo
