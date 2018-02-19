// #run script:
// node server.js

const express = require('express');
const app = express();
var server = require('http').createServer(app);
var https = require('https');

const PORT = 8080;
const APP_PATH = 'source-output/qxapp/'

// serve static assets normally
app.use(express.static(__dirname + '/source-output'));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('/', function (request, response) {
  const path = require('path');
  response.sendFile(path.resolve(__dirname, APP_PATH, 'index.html'));
});

server.listen(PORT);


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
  console.log('doing operation 1 with input', in_number);
  var resultOp1 = {
    value: Math.pow(in_number, 2)
  };
  client.emit('operation1', resultOp1);
};

function doOperation2(client, in_number) {
  console.log('doing operation 2 with input', in_number);
  var resultOp2 = {
    value: Math.pow(in_number, 0.5)
  };
  client.emit('operation2', resultOp2);
};


console.log("server started on " + PORT + '/qxapp');
