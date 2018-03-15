// #run script:
// node server.js

const express = require('express');
const path = require('path');

const app = express();
var server = require('http').createServer(app);


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


var io = require('socket.io')(server);
io.on('connection', function(client) {
  console.log('Client connected...');

  client.on('operation1', function(in_number) {
    doOperation1(client, in_number);
  });

  client.on('operation2', function(in_number) {
    doOperation2(client, in_number);
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


console.log("server started on " + HOSTNAME + ":" + PORT );
