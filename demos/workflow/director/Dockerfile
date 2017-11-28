FROM continuumio/miniconda
MAINTAINER Manuel Guidon <guidon@itis.ethz.ch>

RUN conda install flask plotly pymongo
RUN conda install -c mhworth pika
RUN pip install docker


EXPOSE 8010

WORKDIR /work
CMD ["python", "director.py"]
