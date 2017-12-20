CURRDIR=$(shell pwd)
IMAGE=$(shell basename ${CURRDIR})

info:
	echo  ${CURRDIR}
	echo  ${IMAGE}

build:
	docker build -t ${IMAGE} .
	docker image ls

run:
	docker run -it -p 8080:80 ${IMAGE}

bash:
	docker run -it -p 8080:80 ${IMAGE} bash

wt-dev:
	docker run -it -v ${CURRDIR}:/home/src -w /home/src wt-dev
