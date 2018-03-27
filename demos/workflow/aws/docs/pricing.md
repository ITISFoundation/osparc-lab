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