'use strict';

var https = require('https');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('../config/paths');
const config = require('../config/webpack.config.dev');
const createDevServerConfig = require('../config/webpackDevServer.config');

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 6001;
const HOST = process.env.HOST || '0.0.0.0';


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

function checkItaliaMenu(service, client) {
  var path = require('path');
  var scriptPath = path.join(__dirname, 'ItaliaMenu.py');
  console.log(scriptPath);
  var day = service.settings[0].value;
  console.log('Day: ', day);
  var options = {
    mode: 'text',
    args: ['Risotto', day]
  };
  var PythonShell = require('python-shell');
  PythonShell.run(scriptPath, options, function (err, result) {
    if (err) {
      // throw err
      console.log(err)
    }
    console.log(result);
    client.emit('whatInItalia', {
      type:'result',
      value: result
    });
  })
};

function calculateRandomValue(service, client) {
  var sleepFor = 3000; //ms
  console.log('Calculating')
  setTimeout(function() {
    var min = Number(service.settings[0].value);
    var max = Number(service.settings[1].value);
    var newRand = Math.floor(Math.random() * (max - min + 1) + min);
    console.log(newRand);
    client.emit('radiusChangedByServer', {
      type:'randomizer',
      value: newRand
    });
  }, sleepFor);
  console.log('Random Radius...');
}

function dirTree(filename) {
  const path = require('path');
  var stats = fs.lstatSync(filename);
  var info = {
    path: filename,
    name: path.basename(filename)
  };

  if (stats.isDirectory()) {
    info.type = "folder";
    info.children = fs.readdirSync(filename).map(function(child) {
      return dirTree(filename + '/' + child);
    });
  } else {
    info.type = "file";
  }

  return info;
};

function computeOutputData(service, uniqueName, client) {
  console.log('computeOutputData', service);
  if (service.name === 'requestWhatInItalia') {
    checkItaliaMenu(service, client);
  } else if (service.name === 'randomizer') {
    calculateRandomValue(service, client);
  } else if (service.name === 'single-cell') {
    if (uniqueName === 'SingleCell_S1' || uniqueName === 'SingleCell_S2') {
      var url = 'https://raw.githubusercontent.com/odeimaiz/oSPARC_Test/master/demos/frontend-data/' + uniqueName + '.json';
      https.get(url, function(res) {
        var json = '';

        res.on('data', function(chunk) {
          json += chunk;
        });

        res.on('end', function() {
          if (res.statusCode === 200) {
            // var localDir = '//filesrv.speag.com/outbox/' + uniqueName;
            // var outputDataStructure = dirTree(localDir);
            var outputDataStructure = JSON.parse(json);
            client.emit('outputDataStructure', {
              type: 'outputDataStructure',
              value: outputDataStructure,
              jobId: uniqueName
            });
          }
        });
      });
    }
  } else {
    console.log('Request should be sent to the director');
  }
}

function readUrlContent(url, client) {
  console.log('url', url);

  const request = require('request');
  request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('readUrlContentRes', body);
      client.emit('readUrlContentRes', body);
    } else {
      console.log('error readUrlContentRes', error);
    }
  });
}

function readCsvContent(url, client) {
  console.log('url', url);

  const request = require('request');
  const csv = require('csvtojson');
  var jsonArray = [];
  csv()
    .fromStream(request.get(url))
    .on('json',(jsonObj)=>{
      jsonArray.push(jsonObj);
    })
    .on('done',(error)=>{
      console.log('readCsvContentRes', jsonArray);
      client.emit('readCsvContentRes', jsonArray);
    });
}

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
choosePort(HOST, DEFAULT_PORT)
  .then(port => {
    if (port == null) {
      // We have not found a port.
      return;
    }
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson).name;
    const urls = prepareUrls(protocol, HOST, port);
    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler(webpack, config, appName, urls, useYarn);
    // Load proxy config
    const proxySetting = require(paths.appPackageJson).proxy;
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
    // Serve webpack assets generated by the compiler over a web sever.
    const serverConfig = createDevServerConfig(
      proxyConfig,
      urls.lanUrlForConfig
    );
    const devServer = new WebpackDevServer(compiler, serverConfig);
    // Launch WebpackDevServer.
    devServer.listen(port, HOST, err => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }
      console.log(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);

      const io = require('socket.io')();

      io.on('connection', (client) => {

        console.log('client connected');

        client.on('requestAvailableServices', function() {
          getServices(client);
        });

        client.on('computeOutputData', (service, uniqueName) => {
          computeOutputData(service, uniqueName, client);
        });

        client.on('readUrlContent', function(url) {
          readUrlContent(url, client);
        });

        client.on('readCsvContent', function(url) {
          readCsvContent(url, client);
        });

        // --------------------------------------- //

        client.on('amIConnected', (hisID) => {
          console.log('Client with id ', hisID, ' connected');
          client.emit('userConnected', hisID);
        });

        client.on('pingServer', (message) => {
          console.log('pingServer ', message)
          client.emit('customEmit', {
            type:'customEmit',
            text: message + ' back'
          })
        });
      });

      const port = 6002;
      io.listen(port);
      console.log('socket listening on port ', port);

    });

    ['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close();
        process.exit();
      });
    });
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
