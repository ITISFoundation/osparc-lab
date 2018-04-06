""" API to computational services

"""
import os
import sys

import thrift
import thrift.protocol
import thrift.transport

import config

from config import CONFIG
from utils import import_thrift_api_module


# pylint: disable=services-rpc-api
# TODO: include under rpc package?
import_thrift_api_module('application')

import application.Application
import modeler.Modeler


def connect_to_std_buffer_interface(ip, port, client_service):
    from thrift.transport import TSocket, TTransport
    from thrift.protocol import TBinaryProtocol

    # make socket for processFactory interface
    transport = TSocket.TSocket(ip, port)
    # Buffering is critical. Raw sockets are very slow
    transport = TTransport.TBufferedTransport(transport)

    # Wrap in a protocol
    protocol = TBinaryProtocol.TBinaryProtocol(transport)

    # Create a client
    client = client_service.Client(protocol)

    # Connect
    transport.open()

    return client


def create_clients(ip, *ports):
    """
        Creates transport, defines protocol and opens connection
    """
    port0, port1 = ports if len(ports) == 2 else (ports[0], ports[0]+1)

    application_client = connect_to_std_buffer_interface(
        ip, port0, application.Application)

    modeler_client = connect_to_std_buffer_interface(
        ip, port1, modeler.Modeler)

    return application_client, modeler_client


_CONFIG = CONFIG[os.environ.get('SIMCORE_WEB_CONFIG', 'default')]

APP, MODEL = create_clients(
    _CONFIG.CS_S4L_HOSTNAME,
    _CONFIG.CS_S4L_PORT_APP,
    _CONFIG.CS_S4L_PORT_MOD)
