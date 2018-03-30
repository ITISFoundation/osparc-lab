"""


TODO create create_environment_file(.) to build a template env file with defaults
"""
import os
import sys

_CDIR = os.path.dirname( sys.argv[0] if __name__=='__main__' else __file__)


# Location of qx ourdir when compiled using docker-compose -f docker-compose.dev.yml run build-qx
client_dir = os.path.normpath(os.path.join(_CDIR, "..", "client-qx", "source-output"))


class CommonConfig:
    # Web service
    SIMCORE_WEB_HOSTNAME = os.environ.get('SIMCORE_WEB_HOSTNAME', '0.0.0.0')
    SIMCORE_WEB_PORT = os.environ.get('SIMCORE_WEB_PORT', 8080)
    SIMCORE_CLIENT_OUTDIR = os.environ.get('SIMCORE_WEB_OUTDIR', client_dir)

    # S4L computational service (thrift)
    CS_S4L_HOSTNAME = os.environ.get('CS_S4L_HOSTNAME', '172.16.9.89')
    CS_S4L_PORT_APP = os.environ.get('CS_S4L_PORT_APP', 9095)
    CS_S4L_PORT_MOD = os.environ.get('CS_S4L_PORT_MOD', 9096)

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(CommonConfig):
    DEBUG = True


class TestingConfig(CommonConfig):
    TESTING = True


class ProductionConfig(CommonConfig):
    pass


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,

    'default': DevelopmentConfig
}
