// #run script:
// node server.js

const express = require('express');
const path = require('path');

const app = express();
let server = require('http').createServer(app);
let Promise = require('promise');


// TODO: socker io on the same port?
// TODO: how to guarantee same version of sockerio between client/server?
// See https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html


const HOSTNAME = process.env.SIMCORE_WEB_HOSTNAME || '127.0.0.1';
const PORT = process.env.SIMCORE_WEB_PORT || 8080;
const APP_PATH = process.env.SIMCORE_WEB_OUTDIR || path.resolve(__dirname, 'source-output');


// serve static assets normally
const staticPath = APP_PATH;
console.log( 'Serving static : ' + staticPath );
app.use( express.static(staticPath) );

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('/', function(request, response) {
  console.log('Routing / to ' + path.resolve(APP_PATH, 'index.html'));
  response.sendFile( path.resolve(APP_PATH, 'index.html') );
});

server.listen(PORT, HOSTNAME);


let thrift = require('thrift');

// ---------------------
let _BDIR = process.env.CS_RPC_BASEDIR || path.resolve(__dirname, 'services-rpc-api/application/gen-nodejs');

let thrApplication = require(path.resolve(_BDIR, 'Application.js'));
// let thrApplicationTypes = require(path.resolve(_BDIR, 'application_types'));
// let thrAppLogger = require(path.resolve(_BDIR, 'Logger'));
// let thrAppSharedService = require(path.resolve(_BDIR, 'SharedService'));
// let thrAppProcessFactory = require(path.resolve(_BDIR, 'ProcessFactory'));

_BDIR = process.env.CS_RPC_BASEDIR || path.resolve(__dirname, 'services-rpc-api/modeler/gen-nodejs');
let thrModeler = require(path.resolve(_BDIR, 'Modeler'));
// let thrModelerTypes = require(path.resolve(_BDIR, 'modeler_types'));

const S4L_IP = process.env.CS_S4L_HOSTNAME || '172.16.9.89';
const S4L_PORT_APP = process.env.CS_S4L_PORT_APP || 9095;
const S4L_PORT_MOD = process.env.CS_S4L_PORT_MOD || 9096;

const transport = thrift.TBufferedTransport;
const protocol = thrift.TBinaryProtocol;

let s4lAppClient = null;
let s4lModelerClient = null;
checkS4LAppVersion();

let io = require('socket.io')(server);
io.on('connection', function(client) {
  console.log('Client connected...');

  client.on('operation1', function(inNumber) {
    doOperation1(client, inNumber);
  });

  client.on('operation2', function(inNumber) {
    doOperation2(client, inNumber);
  });

  client.on('checkS4LAppVersion', function() {
    checkS4LAppVersion(client);
  });

  client.on('checkS4LModVersion', function() {
    checkS4LModVersion(client);
  });
});


function doOperation1(client, inNumber) {
  console.log('Doing operation 1 with input', inNumber);
  let resultOp1 = {
    value: Math.pow(inNumber, 2),
  };
  client.emit('operation1', resultOp1);
};

function doOperation2(client, inNumber) {
  console.log('Doing operation 2 with input', inNumber);
  let resultOp2 = {
    value: Math.pow(inNumber, 0.5),
  };
  client.emit('operation2', resultOp2);
};

function checkS4LAppVersion(client) {
  connectToS4LServer().
  then(function() {
    s4lAppClient.GetApiVersion( function(err, response) {
      if (err) {
        console.log('Call to Thrift failed with error: ' + err);
      } else {
        console.log('S4L App Version', response);
        if (client) {
          client.emit('checkS4LAppVersion', response);
        }
      }
    });
  }).
  catch(failureCallback);
};

function checkS4LModVersion(client) {
  connectToS4LServer().
  then(function() {
    s4lModelerClient.GetApiVersion( function(err, response) {
      if (err) {
        console.log('Call to Thrift failed with error: ' + err);
      } else {
        console.log('S4L Mod Version', response);
        if (client) {
          client.emit('checkS4LModVersion', response);
        }
      }
    });
  }).
  catch(failureCallback);
};

function connectToS4LServer() {
  return new Promise(function(resolve, reject) {
    createThriftConnection(S4L_IP, S4L_PORT_APP, thrApplication, s4lAppClient, disconnectFromApplicationServer)
    .then(function(client) {
      s4lAppClient = client;
      createThriftConnection(S4L_IP, S4L_PORT_MOD, thrModeler, s4lModelerClient, disconnectFromModelerServer)
        .then(function(client) {
          s4lModelerClient = client;
          resolve();
        });
    })
    .catch(function(err) {
      reject(err);
    });
  });
}

function disconnectFromModelerServer() {
  s4lModelerClient = null;
  console.log('Modeler client disconnected');
}

function disconnectFromApplicationServer() {
  s4lAppClient = null;
  console.log('Application client disconnected');
}

/**
 * creates a Thrift connection with the thing object
 *
 * @param {any} host
 * @param {any} port
 * @param {any} thing
 * @param {any} client
 * @param {any} disconnectionCB
 * @return {any} the client object promise
 */
function createThriftConnection(host, port, thing, client, disconnectionCB) {
  return new Promise(function(resolve, reject) {
    if (client == null) {
      const connection = thrift.createConnection(host, port, {
        transport: transport,
        protocol: protocol,
      });

      connection.on('close', function() {
        console.log('Connection to ' + host + ':' + port + ' closed');
        disconnectionCB();
      });
      connection.on('timeout', function() {
        console.log('Connection to ' + ' timed out...');
      });
      connection.on('reconnecting', function(delay, attempt) {
        console.log('Reconnecting to ' + host + ':' + port + ' delay ' + delay + ', attempt ' + attempt);
      });
      connection.on('connect', function() {
        console.log('connected to ' + host + ':' + port);
        client = thrift.createClient(thing, connection);
        resolve(client);
      });
      connection.on('error', function(err) {
        console.log('connection error to ' + host + ':' + port);
        reject(err);
      });
    } else {
      resolve(client);
    }
  });
}

function failureCallback(error) {
  console.log('Thrift error: ' + error);
}

console.log('server started on ' + HOSTNAME + ':' + PORT );
