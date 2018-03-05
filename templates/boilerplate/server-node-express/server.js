// #run script:
// node server.js

const express = require('express');
const path = require('path');

const app = express();
var server = require('http').createServer(app);
var https = require('https');


// TODO: socker io on the same port?
// TODO: how to guarantee same version of sockerio between client/server?
// See https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html


const HOSTNAME = process.env.SIMCORE_WEB_HOSTNAME || "127.0.0.1"
const PORT = process.env.SIMCORE_WEB_PORT || 8080;
const APP_PATH = process.env.SIMCORE_WEB_OUTDIR || path.resolve(__dirname, 'source-output')


// serve static assets normally
const static_path = APP_PATH
console.log( "Serving static : " + static_path );
app.use( express.static(static_path) );

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('/', function (request, response) {
  console.log("Routing / to " + path.resolve(APP_PATH, 'index.html'))
  response.sendFile( path.resolve(APP_PATH, 'index.html') );
});

server.listen(PORT, HOSTNAME);


var thrift = require('thrift');

var thrApplication       = require('./thrift/ApplicationJSNode/gen-nodejs/Application.js');
var thrApplicationTypes  = require('./thrift/ApplicationJSNode/gen-nodejs/application_types');
var thrAppLogger         = require('./thrift/ApplicationJSNode/gen-nodejs/Logger');
var thrAppSharedService  = require('./thrift/ApplicationJSNode/gen-nodejs/SharedService');
var thrAppProcessFactory = require('./thrift/ApplicationJSNode/gen-nodejs/ProcessFactory');

const S4L_IP = process.env.CS_S4L_HOSTNAME || '172.16.9.89';
const S4L_APP_PORT = process.env.CS_S4L_PORT || 9095;

var transport = thrift.TBufferedTransport;
var protocol = thrift.TBinaryProtocol;
var connection_s4l = thrift.createConnection(S4L_IP, S4L_APP_PORT, {
  transport: transport,
  protocol : protocol
});
connection_s4l.on('error', function(err) {
  console.log('Thrift connection to S4L failed:');
  console.log(err);
});

var s4lAppClient = thrift.createClient(thrApplication, connection_s4l);


var io = require('socket.io')(server);
io.on('connection', function(client) {
  console.log('Client connected...');

  client.on('operation1', function(in_number) {
    doOperation1(client, in_number);
  });

  client.on('operation2', function(in_number) {
    doOperation2(client, in_number);
  });

  client.on('checkS4LAPIVersion', function() {
    checkS4LAPIVersion(client, s4lAppClient);
  });
});


function doOperation1(client, in_number) {
  console.log('Doing operation 1 with input', in_number);
  var resultOp1 = {
    value: Math.pow(in_number, 2)
  };
  client.emit('operation1', resultOp1);
};

function doOperation2(client, in_number) {
  console.log('Doing operation 2 with input', in_number);
  var resultOp2 = {
    value: Math.pow(in_number, 0.5)
  };
  client.emit('operation2', resultOp2);
};

function checkS4LAPIVersion(client, s4lAppClient) {
  s4lAppClient.GetApiVersion( function(err, response) {
    console.log('S4L API Version', response);
    client.emit('checkS4LAPIVersion', response);
  });
}

console.log("server started on " + HOSTNAME + ":" + PORT );
