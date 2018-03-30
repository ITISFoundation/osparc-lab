"""
    Uses socketio and aiohtttp framework
"""
import os
import sys

from aiohttp import web

from sio_handlers import sio
from config import config

_CONFIG = config['default']
client_dir = _CONFIG.SIMCORE_CLIENT_OUTDIR

app = web.Application()
sio.attach(app)

# http requests handlers
async def index(request):
    """Serve the client-side application."""
    index_path = os.path.join(client_dir, 'index.html')
    with open(index_path) as f:
        return web.Response(text=f.read(), content_type='text/html')


# TODO: check whether this can be done at once
app.router.add_static('/qxapp', os.path.join(client_dir, 'qxapp'))
app.router.add_static('/transpiled', os.path.join(client_dir, 'transpiled'))
app.router.add_static('/resource', os.path.join(client_dir, 'resource'))
app.router.add_get('/', index)

if __name__ == '__main__':
    web.run_app(app, 
            host=_CONFIG.SIMCORE_WEB_HOSTNAME, 
            port=_CONFIG.SIMCORE_WEB_PORT)
