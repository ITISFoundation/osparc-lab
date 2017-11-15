# Pipelines: Use microservices to create pipelines


Overview
========

Pipelines is an experimental project for testing different means of creating pipelines and communication/passing of data among them.

Testing includes:

* inter-service communication: JSON, thrift
* data passing via data service, synchronous, via database
* communication through manager
* docker container creation via manager from repository
* distributed containers vs. dynamic all-in-one container


Building Services
=================
To build the pipeline services:

<code>
$ make build
</code>

Starting and Stopping Services
==============================

To launch the pipeline services:

<code>
$ make launch
</code>


To stop the pipeline services:

<code>
$ make shutdown
</code>


APIs and Documentation
======================

## Viewer service(port 5010)

This service is used to display data in plots.

Try `http://192.168.0.10:5010/plot_rest`
Try `http://192.168.0.10:5010/plot_db`

## Calculator service (port 5011)

This service is used to create mockup data
