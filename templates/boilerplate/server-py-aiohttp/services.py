""" API to computational services

"""
import os
import sys

import config

def import_with_retry(module_name, *extended_paths):
    import importlib
    module = None
    try:
        module = importlib.import_module(module_name)
    except ImportError:
        snapshot = list(sys.path)
        try:
            sys.path = extended_paths + sys.path
            module = importlib.import_module(module_name)
        except ImportError as ee:
            sys.path = snapshot
            # TODO: should I remove from sys.path even if it does not fail?

    return module


def get_thrift_api_folders(startdir):
    """ Helper that returns all folders as 'startdir/**/gen-py' 
    
        This is the folder layout produced by the thrift generator
    """
    folders = []
    for root, dirs, files in os.walk(startdir):
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        if "gen-py" in dirs:
            dirs[:] = []  # stop looking under this node
            folders.append(os.path.join(root, "gen-py"))
    return folders



def import_thrift_api_module(module_name):
    include = []
    if config.CommonConfig.THRIFT_GEN_OUTDIR:
        include = get_thrift_api_folders(config.CommonConfig.THRIFT_GEN_OUTDIR)
    return import_with_retry(module_name, *include)

# TODO Move all above to utils


import thrift
import thrift.transport
import thrift.protocol

# computational services RPC API
modeler=import_thrift_api_module('modeler')
application=import_thrift_api_module('application')


def connect_to_std_buffer_interface(ip, port, client_service):
    from thrift.transport import TSocket, TTransport
    from thrift.protocol import TBinaryProtocol

    # make socket for processFactory interface
    transport=TSocket.TSocket(ip, port)
    # Buffering is critical. Raw sockets are very slow
    transport=TTransport.TBufferedTransport(transport)

    # Wrap in a protocol
    protocol=TBinaryProtocol.TBinaryProtocol(transport)

    # Create a client
    client=client_service.Client(protocol)

    # Connect
    transport.open()

    return client



def create_clients(ip, port):
    """
        Creates transport, defines protocol and opens connection
    """
    application_client=connect_to_std_buffer_interface(
        ip, port, application.Application)

    modeler_client=connect_to_std_buffer_interface(
        ip, port+1, modeler.Modeler)

    return application_client, modeler_client


# TODO: move this away!---------------------------
from config import CONFIG

_CONFIG=CONFIG[os.environ.get('SIMCORE_WEB_CONFIG', 'default')]
application, model=create_clients(
    _CONFIG.CS_S4L_HOSTNAME, _CONFIG.CS_S4L_PORT_APP, _CONFIG.CS_S4L_PORT_MOD)
