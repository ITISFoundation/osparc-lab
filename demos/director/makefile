# Director makefile
# author: Manuel Guidon

build:
	docker build -t director -f ./director/Dockerfile ./director

launch: shutdown build
	docker run -d -v $(PWD):/work -p 8010:8010 --name my_director director

shutdown:
	docker my_director || true
	docker rm my_director || true
