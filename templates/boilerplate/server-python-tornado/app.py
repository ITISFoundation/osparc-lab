import os
import sys
import uuid
import logging
import json

import tornado.web
import tornado.websocket
import tornado.httpserver
import tornado.ioloop
import tornado.log
import tornado.options
from tornado.options import define, options

define("port", default=8080, type=int)

_CFILE = os.path.abspath( sys.argv[0] if __name__ == "__main__" else __file__ )
_CDIR = os.path.dirname( _CFILE)

# LOG
logging.basicConfig(level=logging.DEBUG)
# TODO: logging still does not work properly
ACCESS_LOG = logging.getLogger("tornado.access")
APP_LOG = logging.getLogger("tornado.application")
GEN_LOG = logging.getLogger("tornado.general")

_CLIENT_DIR = os.path.normpath( os.path.join(_CDIR, "../client-qx/source-output") )

# LIB ---

# FORMS ------


# REQUEST HANDLERS-------
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write( open(os.path.join(_CLIENT_DIR,'index.html')).read() )

class EchoWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print("WebSocket opened")

    def on_message(self, message):
        self.write_message(u"You said: " + message)

    def on_close(self):
        print("WebSocket closed")


# APPLICATION ---
class Application(tornado.web.Application):
    """
        - Careful client-qx hardcodes websockets via port 8080
    """
    def __init__(self):
        handlers = [
            (r'/', MainHandler),
            (r"/(.*)", tornado.web.StaticFileHandler, {"path":_CLIENT_DIR}),
            (r'/socket.io/', EchoWebSocket)
        ]

        settings = dict(
            #template_path = os.path.join(_CDIR, 'template'),
            #static_path = os.path.join(_CDIR, 'static'),
            #static_handler_args=dict(default_filename="app/index.html"),
            debug=True,
            )

        super(Application, self).__init__(handlers, **settings)


def main():
    tornado.options.parse_command_line()
    tornado.log.enable_pretty_logging()

    app = Application()

    server = tornado.httpserver.HTTPServer(app)
    server.listen(options.port)

    print "Serving at port {} ...".format(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__=="__main__":
    main()
