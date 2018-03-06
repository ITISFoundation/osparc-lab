const express = require('express');
const app = express();
var server = require('http').createServer(app);
var https = require('https');

const port = 7001;

// serve static assets normally
app.use(express.static(__dirname + '/source-output'));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('/', function (request, response) {
  const path = require('path');
  response.sendFile(path.resolve(__dirname, 'source-output', 'app', 'index.html'));
});

server.listen(port);

var io = require('socket.io')(server);
io.on('connection', function(client) {
  console.log('Client connected...');
});

console.log("server started on " + port + '/app');
