FROM continuumio/miniconda
MAINTAINER Manuel Guidon <guidon@itis.ethz.ch>

RUN conda install flask plotly
RUN conda install -c mhworth pika


EXPOSE 8010

WORKDIR /work
CMD ["python", "director.py"]
