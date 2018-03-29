// #run script:
// node server.js

const express = require('express');
const path = require('path');

const app = express();
var server = require('http').createServer(app);
var http = require('http');

// TODO: socker io on the same port?
// TODO: how to guarantee same version of sockerio between client/server?
// See https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html


const HOSTNAME = process.env.SIMCORE_WEB_HOSTNAME || "127.0.0.1"
const PORT = process.env.SIMCORE_WEB_PORT || 8080;
const APP_PATH = process.env.SIMCORE_WEB_OUTDIR || path.resolve(__dirname, 'source-output')


// serve static assets normally
const static_path = APP_PATH
console.log("Serving static : " + static_path);
app.use(express.static(static_path));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('/', function (request, response) {
  console.log("Routing / to " + path.resolve(APP_PATH, 'index.html'))
  response.sendFile(path.resolve(APP_PATH, 'index.html'));
});

server.listen(PORT, HOSTNAME);

var logger_handle;
var progress_handle;
var logger_on = false;
var progress_on = false;

var io = require('socket.io')(server);
io.on('connection', function (client) {
  console.log('Client connected...');

  client.on('funcparser', function (in_number) {
    doFuncparser(client, in_number);
  });

  client.on('pipeline', function (pipeline) {

    doPipeline(client, pipeline);
    // if (!logger_on) {
    //   logger_handle = setInterval(periodicLog, 1500, client);
    //   logger_on = true;
    //   progress_handle = setInterval(periodicProgress, 1500, client);
    //   progress_on = true;
    // } 
  });

  client.on('stop_pipeline', function (pipeline) {
    doStopPipeline(client, pipeline);
   // if (logger_on) {
   //   clearInterval(logger_handle);
   //   logger_on = false;
   //   clearInterval(progress_handle);
   //   progress_on = false;
   // }
  });

  client.on('logger', function () {
    if (!logger_on) {
      logger_handle = setInterval(periodicLog, 1500, client);
      logger_on = true;
    }
    //  else {
    //  
    //   clearInterval(logger_handle);
    //   logger_on = false;
    // }
  });

  client.on('progress', function () {
    if (!progress_on) {
      progress_handle = setInterval(periodicProgress, 1500, client);
      progress_on = true;
    } 
    // else {
    //   clearInterval(progress_handle);
    //   progress_on = false;
    // }
  });
});

function doLog(client) {
  http.get('http://director:8010/check_pipeline_log', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      var json_data = JSON.parse(data)
      console.log(data)
      client.emit('logger', json_data);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
};

function doProgress(client) {
  http.get('http://director:8010/check_pipeline_progress', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      var json_data = JSON.parse(data)
      console.log(data)
      if(data){
        client.emit('progress', json_data);
      }
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
};

function periodicLog(client) {
  doLog(client);
}

function periodicProgress(client) {
  doProgress(client);
}


function doPipeline(client, pipeline) {
  var url;
  switch(pipeline) {
    case 0:
      url = 'http://director:8010/pipeline_id/0';
      break;
    case 1:
      url = 'http://director:8010/pipeline_id/1';
      break;
    default:
      url = 'http://director:8010/pipeline_id/2';
  }
  console.log(url);
  http.get(url, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      //  console.log(JSON.parse(data).explanation);
      var json_data = JSON.parse(data)
      var task_id = json_data['task_id']
      client.emit('pipeline', task_id);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
};

function doStopPipeline(client, pipeline) {
  var url;
  switch(pipeline) {
    case 0:
      url = 'http://director:8010/stop_pipeline';
      break;
    case 1:
      url = 'http://director:8010/stop_pipeline';
      break;
    default:
      url = 'http://director:8010/stop_pipeline';
  }
  console.log(url);
  http.get(url, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(data);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
};

function doFuncparser(client, in_number) {
  var url = 'http://director:8010/calc_id/0.0/10.0/' + in_number.toString() + '/%22sin(x)%22';
  console.log(url);
  http.get(url, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      //  console.log(JSON.parse(data).explanation);
      var json_data = JSON.parse(data)
      var task_id = json_data['task_id']
      client.emit('funcparser', task_id);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
};



console.log("server started on " + HOSTNAME + ":" + PORT);