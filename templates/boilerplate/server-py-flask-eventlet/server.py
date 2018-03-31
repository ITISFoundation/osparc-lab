"""
    Flask + eventlet
"""
# pylint: disable=C0111
# pylint: disable=C0103

import os
import logging

import eventlet
import eventlet.wsgi
import socketio

from flask import Flask, render_template, Blueprint

from config import CONFIG
from sync_sio import sio

_CONFIG = CONFIG[os.environ.get('SIMCORE_WEB_CONFIG', 'default')]
CLIENT_DIR = _CONFIG.SIMCORE_CLIENT_OUTDIR

logging.basicConfig(level=_CONFIG.LOG_LEVEL)


def make_app(main_blueprint):
    _app = Flask(__name__, template_folder=CLIENT_DIR)
    logging.debug("Client dir: %s", CLIENT_DIR)

    _app.config.from_object(_CONFIG)

    # Added as separate blueprints : see flask-static
    transpiled_blueprint = Blueprint('qx_transpiled', __name__,
                                     static_url_path='/transpiled',
                                     static_folder=os.path.join(CLIENT_DIR, 'transpiled'))

    resource_blueprint = Blueprint('qx_resource', __name__,
                                   static_url_path='/resource',
                                   static_folder=os.path.join(CLIENT_DIR, 'resource'))

    _app.register_blueprint(main_blueprint)
    _app.register_blueprint(transpiled_blueprint)
    _app.register_blueprint(resource_blueprint)

    return _app


main = Blueprint('main', __name__,
                 static_url_path='/qxapp',
                 static_folder=os.path.join(CLIENT_DIR, "qxapp"),)


@main.route('/')
def index():
    """Serve the client-side application."""
    return render_template('index.html')


if __name__ == "__main__":

    app = make_app(main)
    wsgi_app = socketio.Middleware(sio, app)

    # deploy as an eventlet WSGI server
    host, port = _CONFIG.SIMCORE_WEB_HOSTNAME, int(_CONFIG.SIMCORE_WEB_PORT)
    eventlet.wsgi.server(eventlet.listen((host, port)), wsgi_app)
