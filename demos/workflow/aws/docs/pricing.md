# simcore hosted on AWS

## Pricing models

AWS offers multiple model two of which apply to our use case:

- On-Demand Pricing: pay by the minute, no long-term commitments, no upfront payments, good for short-term, spiky workloads
- Reserved Instances: steady state usage, commit to a 1 or 3 year term, payment upfront, up to 75 % disocunt compared to on-demand

[AWS pricing models](https://aws.amazon.com/ec2/pricing/)

## What do you have to pay for

- hardware costs, depending on type
- elastic IP management costs (`simcore.io`, `registry.simcore.io`, ...)
- data storage cost (persistant S3 storage not on nodes)
- data traffic cost (Internet <--> AWS and AWS region i <--> AWS region j)
- zip code

## Hardware types

### General Purpose
- T2: Intel Xeon, 1-8 vCPUs, 0.5-32 GB RAM [websites]
- M5: Intexl Xeon 8175, 2-96 vCPUs, 8-384 GB RAM [small-mid sze databases, data processing, cluster computing
- M4: Intel Xeon E5-2686, 2-64 vCPUs, 8-256 GB RAM [as above]- 

### Compute Optimized

- C5: Xeon Platinun 3.0 GHz, 2-72 vCPUs, 4-144 GB RAM, up to 25 Gbps network bandwidth, [high performacne web servers, scientific modeling, machine learning, highly scalable mutliplayer gaming]
- C4: Intel Xeon E5-2666, [as above]

### Memory Optimized

- X1: Intel Xeon E7-8880, 64 or 128 vCPUs, 976 or 1952 GB RAM [in memeory databases, big data processing, HPC]
- X1e: Intel Xeon E7-8880, 4-128 vCPUs, 122-3904 GB RAM [as above]
- R4: Intel Xeon E5-2686, 2-16 vPCUS, 15.25-122 GB RAM [high performance databases]

### Aceelerated Computing

- P5: NVIDIA Tesla v100, Intel Xeon E5-2686, 1-8 GPUs, 8-64 vCPUs, 61-488 GB RAM üHPC]
- P2: NVIDIA K80, Intel Xeon E5-2686, 1-16 GPUs, 4-64 vCPUs, 61-732 GB RAM [HPSC]
- G3: NVIDIA M60, Intel Xeon E5-2686, 1-4 vCPUs, 16-64 vCPUs, 122-488 GB RAM, [HPC]
- F1: Field programmable gate arrays (FPGAs)

### Storage optimized

- H1: Intel Xeon E5-2686, 8-64 vCPUs, 32-256 GB RAM, 2-16 TB HDD [distributed HDF5 and friends]
- I3: Intel Xeon E5-2686, 2-64 vCPUs, 15.25-488 GB RAM, 5-16 TB SSD, [NoSQL dbs, MongoDB, Redis]
- D2: Intel Xeon E5-2676, 4-36 vCPUS, 30.5-244 GB RAM, 6-248 TB HDD, [Parallel Processiing data warehousing]

[AWS EC2 instance types](https://aws.amazon.com/ec2/instance-types/)

## Example setup

We promised to support at least 20 (50) simulataneous users connected by the end of year 1 (year 2).

### Instances

- Tornado web server (static)
- Director (static)
- Comp.-Backend dbs (static)
- Sidecars (dynamic)
- Docker registry (static)
- s4l modeler (dynamic)

### Storage

- S3 for registry: 0.023 $/GB up to first 50 TB

### Network

- `node0.simcore.io`
- `registry.simcore.io`

First elastic IP for free, then 0.005 per hour

### Data Traffic

- Data Transfer IN to AWS EC2 from Internet: 0 $ per GB
- Data Transfer OUT from AWS EC2 to Internet: 
  - up to 10 TB/month: 0.09$ per GB
  - next 40 TB/month: 0.085$ per GB
  - next 100 TB/month: 0.070$ per GB
- Data Transfer OUT from AWS EC2 to Another AWS region: 0.020 $ per GB
- Data Transfer AWS ES2 to S3 in same region: 0 $ per GB

## Example decent hardware

- A: $ per hour/unit on-demand
- B: $ per hour/unit 1 year upfront
- C: $ per hour/unit 3 years upfront
- D: $ per month on-demand
- E: $ per month 1 year upfront
- F: $ per month 3 years upfront


| service        | ec2 type                |   units  |  A     |   B   | C     |   D       | E       | F       |
|:---------------|:------------------------|---------:|-------:|------:|:-----:|----------:|--------:|--------:|
| tornado        | t2.xlarge [4, 16]       | 2        | 0.2144 | 0.143 | 0.097 | 308.736   | 205.92  | 139.68  | 
| director       | t2.medium [2,4]         | 2        | 0.0536 | 0.036 | 0.024 | 77.184    | 51.84   | 34.56   | 
| database       | i3.xlarge [4, 1 TB SSD] | 2        | 0.372  | 0.237 | 0.157 | 535.68    | 341.28  | 226.08  | 
| sidecars others| c5.4xlarge [16, 32]     | 4        | 0.776  | 0.498 | 0.4   | 2234.88   | 1434.24 | 1152    | 
| sidecars s4l   | x1.16xlarge [64, 976]   | 1        | 9.337  | 5.37  | 2.612 | 6722.64   | 3866.4  | 1880.64 | 
| registry       | t2.small [1,1]          | 2        | 0.0268 | 0.018 | 0.014 | 38.592    | 25.92   | 20.16   | 
| S4l-modeler    | t2.2xlarge [8,32]       | 1        | 0.4288 | 0.285 | 0.194 | 308.736   | 205.2   | 139.68  | 
| S3             | standard [GB]           | 100      | 0.023  |       |       | 2.3       | 2.3     | 2.3     | 
| 2nd elastic IP | standard                | 1        | 0.005  |       |       | 3.6       | 3.6     | 3.6     | 
| data traffic   | AWS EC2→Internet [GB]   | 10000    | 0.09   |       |       | 900       | 900     | 900     | 
| **total cost/month**     |                         |          |        |       |       | **11132.348** | **7036.7**  | **4498.7** | 

## Example cheap hardware

| service        | ec2 type                |   units  |  A     |   B   | C     |   D       | E       | F       |
|:---------------|:------------------------|---------:|-------:|------:|:-----:|----------:|--------:|--------:|
| tornado        | t2.xlarge [4, 16]       | 2        | 0.2144 | 0.143 | 0.097 | 308.736   | 205.92  | 139.68  | 
| director       | t2.medium [2,4]         | 2        | 0.0536 | 0.036 | 0.024 | 77.184    | 51.84   | 34.56   | 
| database       | t2.large [2, 8]         | 2        | 0.1072 | 0.071 | 0.049 | 154.368   | 102.24  | 70.56   | 
| sidecars others| t2.2xlarge [8, 32]      | 8        | 0.4288 | 0.285 | 0.194 | 2469.888  | 1641.6  | 1117.44 | 
| sidecars s4l   | r4.16xlarge [64, 488]   | 1        | 5.122  | 3.012 | 1.926 | 3687.84   | 2168.64 | 1386.72 | 
| registry       | t2.small [1,1]          | 2        | 0.0268 | 0.018 | 0.012 | 38.592    | 25.92   | 17.28   | 
| S4l-modeler    | t2.2xlarge [8,32]       | 1        | 0.4288 | 0.285 | 0.194 | 308.736   | 205.2   | 139.68  | 
| S3             | standard [GB]           | 100      | 0.023  |       |       | 2.3       | 2.3     | 2.3     | 
| 2nd elastic IP | standard                | 1        | 0.005  |       |       | 3.6       | 3.6     | 3.6     | 
| data traffic   | AWS EC2→Internet [GB]   | 10000    | 0.09   |       |       | 900       | 900     | 900     | 
| **total cost/month**     |                         |          |        |       |       | **7951.244**  | **5307.26** | **3811.82** | 


## Example in-house

| service        | ec2 type                |   units  |  A     |   B   | C     |   D       | E       | F       |
|:---------------|:------------------------|---------:|-------:|------:|:-----:|----------:|--------:|--------:|
| type a         | c5.x18large [72, 278]   | 3        | 3.492  | 2.240 | 1.502 | 7542.72   | 4838.4  | 3244.32 | 
| type b         | x1.32xlarge [128, 1952] | 1        | 18.674 | 10.74 | 5.225 | 13455.28  | 7732.8  | 3762    | 
| S3             | standard [GB]           | 100      | 0.023  |       |       | 2.3       | 2.3     | 2.3     | 
| 2nd elastic IP | standard                | 1        | 0.005  |       |       | 3.6       | 3.6     | 3.6     | 
| data traffic   | AWS EC2→Internet [GB]   | 10000    | 0.09   |       |       | 900       | 900     | 900     | 
| **total cost/month** |                         |          |        |       |       | **21893.9**  | **13477.1** | **7912.22** | 