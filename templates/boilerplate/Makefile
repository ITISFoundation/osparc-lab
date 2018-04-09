# TODO: Add deploy to by automatically tag then with prefix itisfoundation/ and push them to a docker registry
build:
	docker-compose build

compile:
	echo Compiling qx client ...
	docker-compose -f docker-compose.dev.yml run build-qx
	docker-compose down

run:
	docker-compose up

demo: build
	docker-compose up -d
	xdg-open http://localhost:8080
	xdg-open http://localhost:8081
	xdg-open http://localhost:8082

stop:
	docker-compose down
