FROM continuumio/miniconda3
MAINTAINER Manuel Guidon <guidon@itis.ethz.ch>

RUN conda install flask plotly pymongo numpy
RUN conda install -c conda-forge celery
RUN pip install docker
RUN pip install redis


EXPOSE 8010

WORKDIR /work

CMD ["python", "director.py"]
