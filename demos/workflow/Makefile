# Build example compuational service
# author: Manuel Guidon

build:
	python solver/build-scripts/build.py --imagename=functionparser --version=2.0 --registry=masu.speag.com --namespace=simcore/comp.services 
	#docker build -t masu.speag.com/comp.backend/simcore.director:1.0 -f ./director/Dockerfile-prod ./director
	#docker build -t masu.speag.com/comp.backend/simcore.sidecar:1.0 -f ./sidecar/Dockerfile-prod ./sidecar

build-dockerhub:
	python solver/build-scripts/build.py --imagename=mguidon/simcore.comp.backend.functionparser --version=2.0
	docker build -t mguidon/simcore.comp.backend.director:2.0 -f ./director/Dockerfile-prod ./director
	docker build -t mguidon/simcore.comp.backend.sidecar:2.0 -f ./sidecar/Dockerfile-prod ./sidecar

publish:
	python solver/build-scripts/build.py --imagename=sidecar-solver --version=1.1 --registry=masu.speag.com --namespace=comp.services --publish
	docker push masu.speag.com/comp.backend/simcore.director:1.0
	docker push masu.speag.com/comp.backend/simcore.sidecar:1.0

demo:
	echo "this should launch the demo (detached if possible)"

stop:
	echo "this should stop the demo"
