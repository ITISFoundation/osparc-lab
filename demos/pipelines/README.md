# Pipelines: Use microservices to create pipelines


Overview
========

Pipelines is an experimental project for testing different means of creating pipelines and communication/passing of data among them.

Testing includes:

* inter-service communication: REST API, RPC
* data passing via data service
* communication through manager
* docker container creation via manager


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

## Viewer (port 5010)

This service is used to display data in plots.

Try `http://192.168.0.10:5010/plot_rest`

## Calculator Service (port 5011)

This service is used to create mockup data
