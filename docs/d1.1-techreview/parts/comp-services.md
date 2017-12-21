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





Computational services
  - Containers Technology
  - Orchestration framework


  TODO: Preselection. Justify C+S+P, howdie

#### Review

  TODO: user-stories + map w/ demos

  TODO: different models analyzed for 3rd party services. a) i/o files, b) SDK layer?  c) SDK w/ UI override?


#### Summary


#### Recommendations
