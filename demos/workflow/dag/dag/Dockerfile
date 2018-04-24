FROM continuumio/miniconda3

ADD ./dag/requirements.txt /app/requirements.txt
#ADD ./dag/dag /app/dag
WORKDIR /app/
RUN pip install -r requirements.txt
ENTRYPOINT celery worker -A dag.task -Q queue-1


