// #run script:
// node server.js

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
  response.sendFile(path.resolve(__dirname, 'source-output', 'app2', 'index.html'));
});

server.listen(port);

var io = require('socket.io')(server);
io.on('connection', function(client) {
  console.log('Client connected...');

  client.on('requestAvailableServices', function() {
    console.log('requestAvailableServices');
    getServices(client);
  });

});


function getServices(client) {
  console.log('requestAvailableServices');
  var url = 'https://raw.githubusercontent.com/odeimaiz/oSPARC_Test/master/demos/frontend-data/ServiceRegistry.json';
  https.get(url, function(res) {
    var json = '';

    res.on('data', function(chunk) {
      json += chunk;
    });

    res.on('end', function() {
      if (res.statusCode === 200) {
        try {
          var availableServicesJson = JSON.parse(json);
          var availableServices = [];
          console.log('Found', Object.keys(availableServicesJson).length, ':');
          for (var key in availableServicesJson) {
            if (!availableServicesJson.hasOwnProperty(key)) {
              continue;
            }
            console.log(availableServicesJson[key].text);
            availableServices.push(availableServicesJson[key]);
          };
          client.emit('availableServices', {
            type: 'availableServices',
            value: availableServices
          })
        } catch (e) {
          console.log('Error parsing JSON!');
        }
      } else {
        console.log('Status:', res.statusCode);
      }
    });
  }).on('error', function(e) {
    console.log("Got an error: ", e);
  });
};

console.log("server started on port " + port);
