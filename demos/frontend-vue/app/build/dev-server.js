'use strict'
require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'production')
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
// const port = process.env.PORT || config.dev.port
// const port = 5000;
const port = 5001;
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

function myRandomizer(min, max) {
    var newRand = Math.floor(Math.random() * (max - min + 1) + min)
    return newRand;
}

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port
    var uri = 'http://localhost:' + port
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    //server = app.listen(port)
    server = require('http').createServer(app)
    var io = require('socket.io')(server)

    io.on('connection', function (socket) {
      console.log('Connection established')

      socket.on('disconnect', function () {
        console.log('Connection interrupted')
      })

      socket.on('requestAvailableServices', function () {
        var serviceManager = require('../services/ServiceManager')
        var myServices = new serviceManager()
        var availableServices = myServices.getAvailableServices()

        io.emit('availableServices', {
            type:'availableServices',
            value: availableServices
          })
      });

      socket.on('requestWhatInItalia', (message) => {
        var day = message.settings[0].value
        console.log(day)
        var PythonShell = require('python-shell')
        var path = require('path')
        var scriptPath = path.join(__dirname, 'ItaliaMenu.py')
        console.log(scriptPath)
        var options = {
          mode: 'text',
          args: ['Risotto', day]
        }
        PythonShell.run(scriptPath, options, function (err, result) {
          if (err) {
            // throw err
            console.log(err)
          }
          console.log(result)
          io.emit('whatInItalia', {
              type:'result',
              value: result
            })
        })
      });

      socket.on('pingServer', (message) => {
        console.log(message)
        io.emit('customEmit', {
            type:'customEmit',
            text: message + ' back'
          })
      });

      socket.on('randomRadius', (message) => {
        console.log('Calculating')
        setTimeout(function() {
          console.log('Calculated:')
          var max = 10
          var min = 1
          var newRand = myRandomizer(min, max)
          console.log(newRand)
          io.emit('radiusChangedByServer', {
              type:'randomizer',
              value: newRand
            })
        }, 5000)
        console.log('Random Radius...')

        io.emit('customEmit', {
            type:'customEmit',
            text: message + ' back'
          })
      });
    })
    server.listen(5001)

    _resolve()
  })
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
