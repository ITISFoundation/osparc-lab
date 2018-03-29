import os
import sys

import eventlet
import eventlet.wsgi

import socketio
from flask import Flask, render_template, send_from_directory

from sio_handlers import sio



basedir = os.path.dirname(sys.argv[0] if __name__ == "__main__" else __file__)
basedir = os.path.abspath(basedir)

# BUG: this only works when run in host and not in containers
client_dir = os.path.normpath(os.path.join(
    basedir, "..", "client-qx", "source-output"))


app = Flask(__name__, static_folder=client_dir)


@app.route('/qxapp/<path:path>')
def send_static(path):
    return send_from_directory(client_dir, path)


@app.route('/')
def index():
    """Serve the client-side application."""
    return render_template(os.path.join(client_dir, 'index.html'))


if __name__ == "__main__":
    app = socketio.Middleware(sio, app)

    # deploy as an eventlet WSGI server    
    eventlet.wsgi.server(eventlet.listen(('', 8888)), app)
    
