FROM continuumio/miniconda
MAINTAINER Manuel Guidon <guidon@itis.ethz.ch>

RUN conda install flask plotly


EXPOSE 5010

WORKDIR /work
CMD ["python", "viewer/viewer.py"]
