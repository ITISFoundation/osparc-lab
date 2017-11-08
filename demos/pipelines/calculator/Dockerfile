FROM continuumio/miniconda
MAINTAINER Manuel Guidon <guidon@itis.ethz.ch>

RUN conda install flask numpy

EXPOSE 5011

WORKDIR /work
CMD ["python", "calculator/calculator.py"]
