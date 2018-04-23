# DAG

Experimental code for a distributed dag scheduler based on celery. This is a prototype for a general pipeline executor. Mostly taken from 

[blog](https://medium.com/@pavloosadchyi/parallel-running-dag-of-tasks-in-pythons-celery-4ea73c88c915)

## Usage

```
docker-compose up
```
From another terminal
```
docker-compose run dev bash
python -m dag.run
```
