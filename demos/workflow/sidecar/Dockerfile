FROM continuumio/miniconda3
MAINTAINER Manuel Guidon <guidon@itis.ethz.ch>

RUN conda install flask plotly pymongo
RUN conda install -c conda-forge celery

RUN pip install docker
RUN pip install redis

EXPOSE 8000

WORKDIR /work
ENTRYPOINT celery -A sidecar worker -c 1 --loglevel=info
