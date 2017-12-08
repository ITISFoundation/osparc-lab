# Workflow

An experimental project for designing a complete workflow which includes pipeline extraction, job scheduling, result storage and display in the framework of a scalable docker swarm

## Description
The computational backend of simcore consists of a director that exposes all available services to the user via the frontend. It is also responsible to convert pipelines created by the user into inter-dependant jobs that can be scheduled asynchronously.
Scheduling is done using the python celery framework with rabbitMQ as a broker and MongoDB as a backend to store data. The celery workers are implemented as sidedcars that themselves can run on-shot docker containers with the actual compuational services. The full stack can be deployed in a docker swarm.

## APIs and Documentation

### Director Service



