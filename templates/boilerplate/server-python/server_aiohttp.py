"""
    Uses socketio and aiohtttp framework
"""
import os
import sys

from aiohttp import web

from sio_handlers import sio


basedir = os.path.dirname(sys.argv[0] if __name__=="__main__" else __file__)
basedir = os.path.abspath(basedir)

# BUG: this only works when run in host and not in containers
clientdir = os.path.normpath(os.path.join(basedir, "..", "client-qx", "source-output"))


app = web.Application()
sio.attach(app)

# http requests handlers
async def index(request):
    """Serve the client-side application."""
    index_path = os.path.join(clientdir, 'index.html')
    with open(index_path) as f:
        return web.Response(text=f.read(), content_type='text/html')

# TODO: check whether this can be done at once
app.router.add_static('/qxapp', os.path.join(clientdir, 'qxapp'))
app.router.add_static('/transpiled', os.path.join(clientdir, 'transpiled'))
app.router.add_static('/resource', os.path.join(clientdir, 'resource'))
app.router.add_get('/', index)

if __name__ == '__main__':
    web.run_app(app)
