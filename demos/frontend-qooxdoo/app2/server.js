// #run script:
// node server.js

const path = require('path');
const express = require('express');
const app = express();

const port = 7001;

// serve static assets normally
app.use(express.static(__dirname + '/source-output'));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'source-output', 'app2', 'index.html'));
});

app.listen(port);
console.log("server started on port " + port);
