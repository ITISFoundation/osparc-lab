"""
    Uses socketio and aiohtttp framework
"""
# pylint: disable=C0103

import os
import logging

from aiohttp import web

from async_sio import sio

from config import CONFIG

_CONFIG = CONFIG[os.environ.get('SIMCORE_WEB_CONFIG', 'default')]
CLIENT_DIR = _CONFIG.SIMCORE_CLIENT_OUTDIR

logging.basicConfig(level=_CONFIG.LOG_LEVEL)

app = web.Application()
sio.attach(app)

# http requests handlers


async def index(request):
    """Serve the client-side application."""
    logging.debug("index.request:\n %s", request)

    index_path = os.path.join(CLIENT_DIR, 'index.html')
    with open(index_path) as f:
        return web.Response(text=f.read(), content_type='text/html')


# TODO: check whether this can be done at once
app.router.add_static('/qxapp', os.path.join(CLIENT_DIR, 'qxapp'))
app.router.add_static('/transpiled', os.path.join(CLIENT_DIR, 'transpiled'))
app.router.add_static('/resource', os.path.join(CLIENT_DIR, 'resource'))
app.router.add_get('/', index)

if __name__ == '__main__':
    web.run_app(app,
                host=_CONFIG.SIMCORE_WEB_HOSTNAME,
                port=_CONFIG.SIMCORE_WEB_PORT)
