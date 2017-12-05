FROM continuumio/miniconda
MAINTAINER Manuel Guidon <guidon@itis.ethz.ch>

RUN conda install flask plotly
RUN conda install -c mhworth pika

RUN pip install docker

EXPOSE 8000

WORKDIR /work
CMD ["python", "sidecar.py"]
