"""
    Defines **async** handlers for socket.io server
"""
import os
import sys

import socketio


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


@sio.on('disconnect')
def disconnect(sid):
    print('disconnect ', sid)
