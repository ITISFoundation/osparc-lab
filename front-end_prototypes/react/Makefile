build-dev:
	docker build -f ./app/Dockerfile-dev -t itis/react-app:dev ./app

build:
	docker build -t itis/react-app:prod ./app

run-dev:
	docker run -it --rm -p 6001:6001 --name react-app itis/react-app:dev

run:
	docker run -it --rm -p 6001:6001 --name react-app itis/react-app

stop:
	docker stop react-app

node:
	docker run -it --rm -v $(pwd)/app:/home/node/app node:6.11.5 bash
