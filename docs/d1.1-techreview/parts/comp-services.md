## Computational services

#### Introduction

The computational backend involves all services needed to handle the actual computational workload. A computational workflow is described as a pipeline that processes a stream of data in a sequential way. Every pipeline consists of multiple algorithms each of which expecting specific input data and providing specific output data.
The pipeline can be built up in the frontend as a directed acyclic graph (dag) where the edges describe input/ouput and the nodes consist of the algorithms, the computational kernels. Such kernels include complete standalone solvers, algorithms to calculate specific quantities or viewer that render data into graphs, plots or tables.


#### Responsabilities

The computational backend

- schedules execution of pipelines in an efficient way while respecting the inherent data dependencies 
- provides the user with a list of all available algorithms
- provides a mechanism to easily inject new algorithms
- allows control/managing of concurrently running pipelines
- can dynamically be up/down-scaled depending on the current load
- has access to a database with all relevant input and output data
 
#### Selection of technology for computational kernel integration

Since ease of adding user defined algorithms into the platform is considered paramount, technology preselection was based on that criterion. 

Modern scientific libraries and solvers span a broad range of programming languages, are typically very specialized and have many dependcies to numerical libraries. Usually they are desgined to work best on few specific platforms. In order to ease the deployment of those codes into the heterogenous simcore platform, it is desirable to provide contributors with the toolsets and platform they know best. This can be achieved by the usage of containers or virtual machines. Due to the large overhead in terms of hardware consumption, usage of virtual machines has been discareded in favor of the containerized approach. Containers, in contrast to virtual machines, do not emulate the hardware but the operating system itself. That makes them much more lightweight and allows for having up to thousands of instances running on one host.

There exist several approaches to containerization, however docker has become the de-facto standard in the industry and many scientific applications already provide users with docker images of their code. Furthermore, with docker swarm, a tool is at hand that natively allows to orchestrate multiple docker containers among a heterogenous network of computers. Additionally, all major cloud providing platforms support the technology. However, if later on in the project, more sophisticated means of orchestration is required, docker recently added full support for kubernetes which is the major player when it comes to managing containers.


The docker framework also allows to easily extend functionality on existing images which will be used to enhance algorithms with an additional layer that makes integration into the simcore ecosystem possible. A specific use case will be discussed below.


#### Core components of computational backend

**Docker image registry**

With respect to the technology decision outlined above, another core component of the docker ecosystem is being used for the computational backend, namely the concept of the docker registry. Every computational service is provided as a docker image in a repository that is part of the simcore platform. If required, those images are being pulled from the registry and a container is created that runs the corresponding service.

In addition to the images themselves, the registry also contains meta information for the services. This allows to store information like 

- required input data (format)
- output data (format)
- specific hardware needs (gpu/multicore)
- version number and hashes for identification


This data is being used to check whether two algorithms in the pipeline can be connected or not.

**Director**

The director acts as bridge between the frontend/backend and the computational backend. It is aware of all available algorithms in the registry and can translate incoming pipelines into workflows and schedules jobs to execute them in the proper order.

All jobs are being kept in a queue and its status can be queried from the client. Also job control such as stop/kill/resume is provided.

**Distributed task Queue**

All jobs in the platfrom are being scheduled in a centralized queue based on message passing. Workers can grab tasks from the list and execute them concurrently. For that purpose a broker service that handles all the message passing from director to worker is also part of the computational backend.

**Workers**

Workers are the services that perform the actual computation. They always appear in pairs of containers. One, the sidecar, is always alive and is connected to the tasks queue. When required it creates a so called one-shot container running the requested computational service. All interaction sidecar-computational service happends on the command line interface. Furthermore, since being pysically on the same host, they share the filesystem which allows the sidecar to make input files or other data avilable to the computational service. 

The advantage of this design is that all complex interaction with the system is being abstracted away from the computational service and enables contributers to add algorithms without the need for detailed knowledge of the platform.


**Service Orchestration**

As mentioned above simcore takes advantage of the native docker orchestration tool swarm. If this turns out to be not flexible enough, kubernetes can also be considered.


#### Use case

For the sake of simplicity, consider a computational service that evaluates a user defined single variable function in a given interval and a second service that renders that result as a scatter plot. For the function parsing service, c and c++ code is available from a contributer. In addition, the contributer provided the command line arguments for its algorithm. For the visualization part, a default service from the simcore platform will be used that expects a tab separated listof values as an input and creates an rendered html page with a scatter plot.

**Dockerfile**

A dockerfile contains all commands needed to create a docker image that can be run in a container. For the function evaluator this file looks as follows:


```bash
  1 FROM alpine
  2 
  3 MAINTAINER  Manuel guidon <guidon@itis.ethz.ch>
  4 
  5 RUN apk add --no-cache g++ bash jq
  6 
  7 WORKDIR /work
  8 
  9 ADD ./code /work
 10 ADD ./simcore.io /simcore.io
 11 RUN chmod +x /simcore.io/*
 12 
 13 ENV PATH="/simcore.io:${PATH}"
 14 
 15 RUN gcc -c -fPIC -lm tinyexpr.c -o libtiny.o
 16 RUN g++ -std=c++11 -o test main.cpp libtiny.o
 17 RUN rm *.cpp *.c *.h
```

The image is based on a very small linux distribution called `alpine` with compilers `gcc`, shell `bash` and jason parser `jq`. In addition to compile the source code into an executable called `test` the `PATH` is being prepended by some scripts from what is called `simcore.io`. This allows to enhance the docker command line interface (cli) by whatever is needed to run the computational service via the sidecar. In this ase, there is a `run` command added to the cli.

```bash
  1 #!/bin/bash
  2 arg1=$(cat $INPUT_FOLDER/input.json | jq '.[] | select(.name =="xmin") .value')
  3 arg2=$(cat $INPUT_FOLDER/input.json | jq '.[] | select(.name =="xmax") .value')
  4 arg3=$(cat $INPUT_FOLDER/input.json | jq '.[] | select(.name =="N") .value')
  5 arg4=$(cat $INPUT_FOLDER/input.json | jq '.[] | select(.name =="func") .value')
  6 temp="${arg4%\"}"
  7 temp="${temp#\"}"
  8 arg5=$OUTPUT_FOLDER/output
  9 
 10 ./test $arg1 $arg2 $arg3 $temp $arg5 > $LOG_FOLDER/log.dat
```
In this case, the sidecar would copy the all input data needed into a file called `input.json` which above script would parse and pass to the test executable.  

After building the docker image is is being depolyed into the docker registry with the following meta data:

```json
{
  "input":[
    {
      "name": "N",
      "value": 10
    },
    {
      "name": "xmin",
      "value": 0.0
    },
    {
      "name": "xmax",
      "value": 1.0
    }
    {
       "name": "func",
       "value" : "sin(x)"
    }
  ],
  "output": tsv
}
```
	



#### Summary


#### Recommendations
