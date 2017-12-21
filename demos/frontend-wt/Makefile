CURRDIR=$(shell pwd)
IMAGE=$(shell basename ${CURRDIR})

info:
	echo  ${CURRDIR}
	echo  ${IMAGE}

build:
	docker build -t ${IMAGE} .

rebuild:
	docker build --no-cache -t ${IMAGE} .
	docker image ls

run:
	docker run --rm --name wtdemo -it -p 8080:80 ${IMAGE}

bash:
	docker run -it -p 8080:80 ${IMAGE} bash

wt-dev:
	docker run -it -v ${CURRDIR}:/home/src -w /home/src wt-dev

demo:
	docker run --rm --name wtdemo -td -p 8080:80 ${IMAGE}
	docker ps
	#open  http:/localhost:8080
	#sensible-browser  http:/localhost:8080

stop:
	docker stop wtdemo
	docker rm wtdemo
