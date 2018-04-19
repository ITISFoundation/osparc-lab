"""


TODO create create_environment_file(.) to build a template env file with defaults
"""
# pylint: disable=C0111
import os
import sys
import logging

_CDIR = os.path.dirname(sys.argv[0] if __name__ == '__main__' else __file__)


# Location of qx ourdir when compiled using docker-compose -f docker-compose.dev.yml run build-qx
CLIENT_DIR = os.path.normpath(os.path.join(
    _CDIR, "..", "client-qx", "source-output"))


class CommonConfig:

    # Web service
    SIMCORE_WEB_HOSTNAME = os.environ.get('SIMCORE_WEB_HOSTNAME', '0.0.0.0')
    SIMCORE_WEB_PORT = os.environ.get('SIMCORE_WEB_PORT', 8080)
    SIMCORE_CLIENT_OUTDIR = os.environ.get('SIMCORE_WEB_OUTDIR', CLIENT_DIR)

    # S4L computational service (thrift)
    CS_S4L_HOSTNAME = os.environ.get('CS_S4L_HOSTNAME', '172.16.9.89')
    CS_S4L_PORT_APP = os.environ.get('CS_S4L_PORT_APP', 9095)
    CS_S4L_PORT_MOD = os.environ.get('CS_S4L_PORT_MOD', 9096)

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(CommonConfig):
    DEBUG = True
    LOG_LEVEL = logging.DEBUG


class TestingConfig(CommonConfig):
    LOG_LEVEL = logging.DEBUG
    TESTING = True


class ProductionConfig(CommonConfig):
    LOG_LEVEL = logging.INFO


CONFIG = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,

    'default': DevelopmentConfig
}
