FROM continuumio/miniconda
MAINTAINER Manuel Guidon <guidon@itis.ethz.ch>

RUN conda install flask plotly


EXPOSE 8010

WORKDIR /work
CMD ["python", "director/director.py"]
