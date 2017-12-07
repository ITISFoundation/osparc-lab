FROM continuumio/miniconda
MAINTAINER Manuel Guidon <guidon@itis.ethz.ch>

RUN conda install flask numpy pymongo
RUN conda install -c mhworth pika

EXPOSE 5011

WORKDIR /work
CMD ["python", "producer.py"]
