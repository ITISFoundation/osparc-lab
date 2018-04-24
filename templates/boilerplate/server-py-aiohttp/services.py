""" API to computational services

"""
import os
import sys
import logging

import thrift
import thrift.protocol
import thrift.transport
from thrift import Thrift


import config

from config import CONFIG
from utils import import_thrift_api_module


# pylint: disable=services-rpc-api
# TODO: include under rpc package?
import_thrift_api_module('application')

import application.Application
import modeler.Modeler


class xRpcModelerInterface:
    applicationClient = None
    modelerClient = None

    def create_transport(self, ip, port):
        """creates a Thrift transport
        
        Arguments:
            ip {string} -- the host ip
            port {number} -- the host port
        
        Returns:
            thrift.transport -- the transport object
        """

        from thrift.transport import TSocket, TTransport
        # create socket with host and port
        socket = TSocket.TSocket(ip, port)
        # Buffering is critical. Raw sockets are very slow
        transport = TTransport.TBufferedTransport(socket)
        return transport
    
    def create_binary_protocol(self, transport):
        """creates a Thrift binary protocol
        
        Arguments:
            transport {thrift.transport} -- a transport object
        
        Returns:
            thrift.protocol -- the protocol object
        """

        from thrift.protocol import TBinaryProtocol
        # Wrap in a protocol
        protocol = TBinaryProtocol.TBinaryProtocol(transport)
        return protocol

    def create_client_open_connection(self, transport, protocol, service):
        """creates the client and open the connection to the server
        
        Arguments:
            transport {thrift.transport} -- the transport object
            protocol {thrift.protocol} -- the protocol object
            service {thrift.client} -- the interface client
        """
        # Create the client
        client = service.Client(protocol)
        # Connect
        transport.open()
        return client

    def connect_std_buffer_interface(self, ip, port, service):
        """connects to the server using a simple interface with host and port
        
        Arguments:
            ip {string} -- the host
            port {number} -- the port
            service {thrift.client} -- the service client object
        """
        transport = self.create_transport(ip, port)
        protocol = self.create_binary_protocol(transport)
        return self.create_client_open_connection(transport, protocol, service)

    def connect_multiplexed_interface(self, ip, port, service_name, service):
        """connects to the server using a multiplexed interface (with several services on the same port)
        
        Arguments:
            ip {string} -- the host
            port {number} -- the port
            service_name {string} -- the service client name
            service {thrift.client} -- the service client object
        """
        from thrift.protocol import TMultiplexedProtocol    
        
        transport = self.create_transport(ip, port)
        protocol = self.create_binary_protocol(transport)
        # update the protocol to a multiplexed protocol (several services are agregated on the same port)
        multiplexedProtocol = TMultiplexedProtocol.TMultiplexedProtocol(protocol, service_name)
        return self.create_client_open_connection(transport, multiplexedProtocol, service)

    def create_clients_std(self, ip, *ports):
        """creates the client objects using standard connection (1 client per port)
        
        Arguments:
            ip {string} -- host
            ports {numbers} -- ports (1 per service)
        """
        port0, port1 = ports if len(ports) == 2 else (ports[0], ports[0]+1)

        self.applicationClient = self.connect_std_buffer_interface(
            ip, port0, application.Application)

        self.modelerClient = self.connect_std_buffer_interface(
            ip, port1, modeler.Modeler)


    def create_clients_multiplexed(self, ip, port):
        """creates the client objects using multiplexed connection (several clients per port)
        
        Arguments:
            ip {string} -- host
            port {number} -- port
        """
        self.applicationClient = self.connect_multiplexed_interface(
            ip, port, 'Application', application.Application)
        self.modelerClient = self.connect_multiplexed_interface(
            ip, port, 'Modeler', modeler.Modeler)

    def create_clients(self, config):
        """creates the client objects
        
        Arguments:
            config {config} -- configuration object
        """
        if config.THRIFT_USE_MULTIPLEXED_SERVER == True:
            self.create_clients_multiplexed(config.CS_S4L_HOSTNAME, config.CS_S4L_PORT_APP)
        else:
            self.create_clients_std(config.CS_S4L_HOSTNAME, config.CS_S4L_PORT_APP, config.CS_S4L_PORT_MOD)

    def __init__(self, config):
        self.create_clients(config)


class XRpcConnectionManager:
    xRpcClient = None
    
    @staticmethod
    def connect(): 
        """tries to connect to the Thrift RPC interface of the XRpcWorker
        """
        _CONFIG = CONFIG[os.environ.get('SIMCORE_WEB_CONFIG', 'default')]
        try:
            XRpcConnectionManager.xRpcClient = xRpcModelerInterface(_CONFIG)
        except Thrift.TException as e:
            logging.exception('Thrift exception: %s', e)
            XRpcConnectionManager.xRpcClient = None
            raise

    @staticmethod
    def call_rpc_function(rpcService, fctName, *args):
        """wraps the call to an RPC method such that disconnection can be detected
        
        Arguments:
            rpcService {string} -- name of the service
            fctName {string} -- name of the function
            *args -- any number of arguments as defined in the Thrift interface
        """
        if XRpcConnectionManager.xRpcClient is None:
            # try to connect
            XRpcConnectionManager.connect()
        try:
            service_to_call = getattr(XRpcConnectionManager.xRpcClient, rpcService)
            method_to_call = getattr(service_to_call, fctName)
            results = method_to_call(*args)
            return results
        except Exception as e:
            logging.exception('Thrift exception: %s', e)
            XRpcConnectionManager.xRpcClient = None
            raise

def MODEL(fctName, *args):
    return XRpcConnectionManager.call_rpc_function('modelerClient', fctName, *args)

def APP(fctName, *args):
    return XRpcConnectionManager.call_rpc_function('applicationClient', fctName, *args)