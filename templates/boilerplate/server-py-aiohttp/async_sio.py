"""
    Defines **async** handlers for socket.io server


    SEE https://pypi.python.org/pypi/python-socketio
    SEE http://python-socketio.readthedocs.io/en/latest/

"""
# pylint: disable=C0111
# pylint: disable=C0103
import logging

import socketio
import services

sio = socketio.AsyncServer(async_mode='aiohttp')


@sio.on('connect')
def connect(sid, environ):
    # environ = WSGI evnironment dictionary
    print("connect ", sid, environ)
    return True


@sio.on('operation1')
async def op1_handler(sid, data):
    result = data**2
    await sio.emit('operation1', data=dict(value=result), room=sid)


@sio.on('operation2')
async def op2_handler(sid, data):
    result = data**0.5
    await sio.emit('operation2', data=dict(value=result), room=sid)


@sio.on('checkS4LAppVersion')
async def s4l_check_app_version(sid, data):
    try:
        version = services.APP('GetApiVersion')
        logging.debug("S4L App version %s", version)
        await sio.emit('checkS4LAppVersion',
                    data=dict(major=version.major, minor=version.minor), room=sid)
    except Exception:
        pass
    


@sio.on('checkS4LModVersion')
async def s4l_check_modeler_version(sid, data):
    try:
        version = services.MODEL('GetApiVersion')
        logging.debug("S4L Mode version %s", version)
        await sio.emit('checkS4LModVersion', data=dict(major=version.major, minor=version.minor), room=sid)
    except Exception:
        pass

@sio.on('createS4LSolidCylinder')
async def create_S4L_solid_cylinder(sid, data):
    from services import modeler
    try:
        services.APP('NewDocument')
        uuid = services.MODEL('CreateSolidCylinder', modeler.Modeler.Vertex(0,0,0), modeler.Modeler.Vertex(25,35,34), 25.5, u'')
        logging.debug('S4L created cylinder with uuid %s', uuid)
        await sio.emit('createS4LSolidCylinder', data=uuid, room=sid)
    except Exception:
        pass


@sio.on('disconnect')
def disconnect(sid):
    print('disconnect ', sid)
