# Pipelines Project Make File
# author: Manuel Guidon

build:
	docker build -t pipeline-calculator -f ./calculator/Dockerfile ./calculator
	docker build -t pipeline-viewer -f ./viewer/Dockerfile ./viewer

launch: shutdown build
	docker network create --subnet 192.168.0.0/16 pipeline_network
	docker run --net pipeline_network --ip 192.168.0.10 -d -v $(PWD):/work -p 5010:5010 --name my_viewer pipeline-viewer
	docker run --net pipeline_network --ip 192.168.0.11 -d -v $(PWD):/work -p 5011:5011 --name my_calculator pipeline-calculator

test-calc: shutdown build
	docker network create --subnet 192.168.0.0/16 pipeline_network
	docker run --net pipeline_network --ip 192.168.0.11 -it -v $(PWD):/work -p 5011:5011 --name my_calculator pipeline-calculator

shutdown:
	docker stop my_viewer || true
	docker rm my_viewer || true
	docker stop my_calculator || true
	docker rm my_calculator || true
	docker network rm pipeline_network || true
