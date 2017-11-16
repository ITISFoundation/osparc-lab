FROM continuumio/miniconda
MAINTAINER Manuel Guidon <guidon@itis.ethz.ch>

RUN conda install flask

EXPOSE 5000

WORKDIR /work
CMD ["python", "app.py"]
