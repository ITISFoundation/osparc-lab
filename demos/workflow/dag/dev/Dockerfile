FROM continuumio/miniconda3

ADD ./dev/requirements.txt /app/requirements.txt
#ADD ./dag/dag /app/dag
WORKDIR /app/
RUN pip install -r requirements.txt
ENTRYPOINT bash


