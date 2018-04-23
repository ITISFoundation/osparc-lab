import time
from celery import Celery
from .models import Task, Workflow
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .conf import DATABASE_URI, QUEUE_NAME
from celery.result import AsyncResult
from celery.signals import task_postrun, task_prerun, after_setup_logger, task_failure
from celery.states import SUCCESS

app = Celery('dag-celery', backend='db+' + DATABASE_URI, broker='amqp://z43:z43@rabbit:5672')

engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)

def find_entry_point(G):
    result = []
    for node in G.nodes:
        if len(list(G.predecessors(node))) == 0:
            result.append(node)
    return result

@task_prerun.connect
def prerun(*args, **kwargs):
    global session
    session = Session()


@task_postrun.connect
def postrun(*args, **kwargs):
    session.flush()
    session.close()

def _is_node_rdy(task, graph):
    tasks = session.query(Task).filter(Task.id.in_(list(graph.predecessors(task.id)))).all()
    for dep_task in tasks:
        if not dep_task.celery_task_uid or \
           not AsyncResult(dep_task.celery_task_uid).state == SUCCESS:
            return False
    return True


def _process_task_node(celery_task, task, uid, workflow_id, cur_task_id):
    task.celery_task_uid = uid
    session.add(task)
    session.commit()
    print('Runnning Workflow {} and Task {}'.format(workflow_id, cur_task_id))
    # simulate that task runs
    dp = 1.0 / (task.sleep-1)
    for i in range(task.sleep):
        print('{}: Sleep, sec: {}'.format(uid, i))
        process_percent = i * dp 
        celery_task.update_state(state='PROGRESS', meta={'process_percent':process_percent})
        time.sleep(1)

@app.task(bind=True)
def run(self, workflow_id, cur_task_id=None):
    
    workflow = session.query(Workflow).filter_by(id=workflow_id).one()
    graph = workflow.execution_graph

    next_task_ids = []
    if cur_task_id:
        task = session.query(Task).get(cur_task_id)
        if not _is_node_rdy(task, graph):
            return

        _process_task_node(self,task, self.request.id, workflow_id, cur_task_id)

        next_task_ids = list(graph.successors(cur_task_id))
    else:
        next_task_ids = find_entry_point(graph)

    self.update_state(state=SUCCESS)

    for task_id in next_task_ids:
        run.apply_async(
            args=(workflow_id, task_id,),
            queue=QUEUE_NAME
        )