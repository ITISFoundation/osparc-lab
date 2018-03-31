"""
    Defines handlers for socket.io server
"""
# pylint: disable=C0111
# pylint: disable=C0103

import socketio


sio = socketio.Server()


@sio.on('connect')
def connect(sid, environ):
    # environ = WSGI evnironment dictionary
    print("connect ", sid, environ)
    return True


@sio.on('operation1')
def op1_handler(sid, data):
    result = data**2
    sio.emit('operation1', data=dict(value=result), room=sid)


@sio.on('operation2')
def op2_handler(sid, data):
    result = data**0.5
    sio.emit('operation2', data=dict(value=result), room=sid)


@sio.on('disconnect')
def disconnect(sid):
    print('disconnect ', sid)
