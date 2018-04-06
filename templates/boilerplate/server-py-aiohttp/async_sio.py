"""
    Defines **async** handlers for socket.io server
    
"""
# pylint: disable=C0111
# pylint: disable=C0103

import socketio
import service

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
    # TODO: lazy connect?
    result = service.app.GetApiVersion()
    await sio.emit('checkS4LAppVersion', data=result, room=sid)


@sio.on('checkS4LModVersion')
async def s4l_check_app_version(sid, data):
    # TODO: lazy connect?
    result = service.model.GetApiVersion()
    await sio.emit('checkS4LModVersion', data=result, room=sid)


@sio.on('disconnect')
def disconnect(sid):
    print('disconnect ', sid)
