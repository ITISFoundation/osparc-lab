FROM continuumio/miniconda3
LABEL maintainer="Sylvain Anderegg"

RUN conda update conda
RUN conda install flask
RUN pip install docker

WORKDIR /home/app

ENV FLASK_APP=director.py
ENV FLASK_DEBUG=1

EXPOSE 8001
VOLUME /home/app

ENTRYPOINT python director.py