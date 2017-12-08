# Build example compuational service
# author: Manuel Guidon

build:
	python solver/build-scripts/build.py --imagename=sidecar-solver --version=1.1 --registry=masu.speag.com --namespace=comp.services 
	docker build -t masu.speag.com/comp.backend/simcore.director:1.0 -f ./director/Dockerfile-prod ./director
	docker build -t masu.speag.com/comp.backend/simcore.sidecar:1.0 -f ./sidecar/Dockerfile-prod ./sidecar

publish:
	python solver/build-scripts/build.py --imagename=sidecar-solver --version=1.1 --registry=masu.speag.com --namespace=comp.services --publish
	docker push masu.speag.com/comp.backend/simcore.director:1.0
	docker push masu.speag.com/comp.backend/simcore.sidecar:1.0

demo:
	echo "this should launch the demo (detached if possible)"

stop:
	echo "this should stop the demo"
