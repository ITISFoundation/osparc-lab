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

define("port", default=8000, type=int)

_CFILE = os.path.abspath( sys.argv[0] if __name__ == "__main__" else __file__ )
_CDIR = os.path.dirname( _CFILE)

# LOG
logging.basicConfig(level=logging.DEBUG)
# TODO: logging still does not work properly
ACCESS_LOG = logging.getLogger("tornado.access")
APP_LOG = logging.getLogger("tornado.application")
GEN_LOG = logging.getLogger("tornado.general")


# LIB ---

# FORMS ------


# REQUEST HANDLERS-------
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        #self.render('app/index.html')
        self.write( open(os.path.join(_CDIR, 'source-output/app/index.html')).read() )

class CartHandler(tornado.web.RequestHandler):
    def post(self):
        """ Adds/removes book from cart """
        action = self.get_argument('action', None)
        session = self.get_argument('session', None)
        print 'post.CartHandler :', action, session

        if session is None:
            self.set_status(400, "Could not identify session")
            return

        if action == 'add':
            self.application.shopping_cart.move_item_to_cart(session)
        elif action == 'remove':
            self.application.shopping_cart.delete_item_from_cart(session)
        else:
            self.set_status(400, "Could not idenfity action")
        return

class StatusHandler(tornado.websocket.WebSocketHandler):
    """
        On document creation, the client opens the websocket channel
        then, the application subscribes callbacks that
        broadcast back to all subscribers via web-sockets
    """
    def open(self):
        self.application.shopping_cart.subscribe(self._callback)

    def on_close(self):
        self.application.shopping_cart.unsubscribe(self._callback)

    def on_message(self):
        """
            There are no messages comming from the client via the WebSocket
            instead, there is a HTTP post request to Cart and
            the server responds via the web-socket!!


        """
        pass
    def _callback(self, count):
        self.write_message( json.dumps(dict(inventoryCount=count)) )


# APPLICATION ---
class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            #(r"/(.*)", tornado.web.StaticFileHandler, {"path": "app/"}),
            #(r'/', MainHandler),
            #(r'/cart', CartHandler),
            #(r'/cart/status', StatusHandler)
        ]

        settings = dict(
            template_path = os.path.join(_CDIR, 'template'),
            static_path = os.path.join(_CDIR, 'source-output'),
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
