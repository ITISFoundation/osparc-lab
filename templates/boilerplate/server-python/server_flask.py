import os
import sys

import eventlet
import eventlet.wsgi
import socketio
from flask import Flask, render_template, Blueprint

from config import config
from sio_handlers import sio

_CONFIG = config['default']
client_dir = _CONFIG.SIMCORE_CLIENT_OUTDIR


def make_app(main_blueprint):
    app = Flask(__name__,
                template_folder=client_dir)
    print(client_dir)

    app.config.from_object(_CONFIG)

    # Added as separate blueprints : see flask-static
    transpiled_blueprint = Blueprint('qx_transpiled', __name__,
                                   static_url_path='/transpiled',
                                   static_folder=os.path.join(client_dir, 'transpiled'))

    resource_blueprint = Blueprint('qx_resource', __name__,
                                   static_url_path='/resource',
                                   static_folder=os.path.join(client_dir, 'resource'))

    app.register_blueprint(main_blueprint)
    app.register_blueprint(transpiled_blueprint)
    app.register_blueprint(resource_blueprint)

    return app


main = Blueprint('main', __name__,
                 static_url_path='/qxapp',
                 static_folder=os.path.join(client_dir, "qxapp"),)


@main.route('/')
def index():
    """Serve the client-side application."""
    return render_template('index.html')


if __name__ == "__main__":

    app = make_app(main)
    wsgi_app = socketio.Middleware(sio, app)

    # deploy as an eventlet WSGI server
    host, port = _CONFIG.SIMCORE_WEB_HOSTNAME, _CONFIG.SIMCORE_WEB_PORT
    eventlet.wsgi.server(eventlet.listen(('', 8000)), wsgi_app)
