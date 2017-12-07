import os
from celery import Celery

env=os.environ
CELERY_BROKER_URL=env.get('CELERY_BROKER_URL','amqp://z43:z43@rabbit:5672')
CELERY_RESULT_BACKEND=env.get('CELERY_RESULT_BACKEND','rpc://')

celery= Celery('tasks',
                broker=CELERY_BROKER_URL,
                backend=CELERY_RESULT_BACKEND)
