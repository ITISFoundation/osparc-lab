/**
 * This class is a direct link with socketio.
 * @asset(socketio/socket.io.js)
 * @ignore(io)
 */

/* eslint valid-jsdoc: "error" */
/* eslint-env es6 */

qx.Class.define('qxapp.wrappers.webSocket', {
  extend: qx.core.Object,

  // Socket.io events
  events: {
    /** socket.io connect event */
    'connect': 'qx.event.type.Event',
    /** socket.io connecting event */
    'connecting': 'qx.event.type.Data',
    /** socket.io connect_failed event */
    'connect_failed': 'qx.event.type.Event',
    /** socket.io message event */
    'message': 'qx.event.type.Data',
    /** socket.io close event */
    'close': 'qx.event.type.Data',
    /** socket.io disconnect event */
    'disconnect': 'qx.event.type.Event',
    /** socket.io reconnect event */
    'reconnect': 'qx.event.type.Data',
    /** socket.io reconnecting event */
    'reconnecting': 'qx.event.type.Data',
    /** socket.io reconnect_failed event */
    'reconnect_failed': 'qx.event.type.Event',
    /** socket.io error event */
    'error': 'qx.event.type.Data',
  },

  properties: {
    libReady: {
      nullable: false,
      init: false,
      check: 'Boolean',
    },

    url: {
      nullable: false,
      init: 'http://'.concat(window.location.hostname),
      check: 'String',
    },
    /** The port used to connect */
    port: {
      nullable: false,
      init: Number(window.location.port),
      check: 'Number',
    },
    /** The namespace (socket.io namespace), can be empty */
    namespace: {
      nullable: true,
      init: '',
      check: 'String',
    },
    /** The socket (socket.io), can be null */
    socket: {
      nullable: true,
      init: null,
      check: 'Object',
    },
    /** Parameter for socket.io indicating if we should reconnect or not */
    reconnect: {
      nullable: true,
      init: true,
      check: 'Boolean',
    },
    connectTimeout: {
      nullable: true,
      init: 10000,
      check: 'Number',
    },
    /** Reconnection delay for socket.io. */
    reconnectionDelay: {
      nullable: false,
      init: 500,
      check: 'Number',
    },
    /** Max reconnection attemps */
    maxReconnectionAttemps: {
      nullable: false,
      init: 1000,
      check: 'Number',
    },
  },

  /** Constructor
   * @param {string} [namespace] The namespace to connect on
   * @returns {void}
   */
  construct: function(namespace) {
    this.base();
    // if (namespace !== null) {
    if (namespace) {
      this.setNamespace(namespace);
    }
    this.__name = [];
  },

  members: {
    // The name store an array of events
    __name: null,

    /**
     * Trying to using socket.io to connect and plug every event from socket.io to qooxdoo one
     * @returns {void}
     */
    connect: function() {
      // initialize the script loading
      let socketIOPath = '../resource/socketio/socket.io.js';
      let dynLoader = new qx.util.DynamicScriptLoader([
        socketIOPath,
      ]);

      let scope = this;
      dynLoader.addListenerOnce('ready', function(e) {
        console.log(socketIOPath + ' loaded');
        scope.setLibReady(true);


        if (scope.getSocket() != null) {
          scope.getSocket().removeAllListeners();
          scope.getSocket().disconnect();
        }

        let dir = scope.getUrl() + ':' + scope.getPort();
        console.log('socket in', dir);
        let mySocket = io.connect(dir, {
          'port': scope.getPort(),
          'reconnect': scope.getReconnect(),
          'connect timeout': scope.getConnectTimeout(),
          'reconnection delay': scope.getReconnectionDelay(),
          'max reconnection attempts': scope.getMaxReconnectionAttemps(),
          'force new connection': true,
        });
        scope.setSocket(mySocket);

        scope.on('connect', function() {
          scope.fireEvent('connect');
        }, scope);
        scope.on('connecting', function(e) {
          scope.fireDataEvent('connecting', e);
        }, scope);
        scope.on('connect_failed', function() {
          scope.fireEvent('connect_failed');
        }, scope);
        scope.on('message', function(e) {
          scope.fireDataEvent('message', e);
        }, scope);
        scope.on('close', function(e) {
          scope.fireDataEvent('close', e);
        }, scope);
        scope.on('disconnect', function() {
          scope.fireEvent('disconnect');
        }, scope);
        scope.on('reconnect', function(e) {
          scope.fireDataEvent('reconnect', e);
        }, scope);
        scope.on('reconnecting', function(e) {
          scope.fireDataEvent('reconnecting', e);
        }, scope);
        scope.on('reconnect_failed', function() {
          scope.fireEvent('reconnect_failed');
        }, scope);
        scope.on('error', function(e) {
          scope.fireDataEvent('error', e);
        }, scope);
      }, scope);

      dynLoader.start();
    },

    /**
     * Emit an event using socket.io
     *
     * @param {string} name The event name to send to Node.JS
     * @param {object} jsonObject The JSON object to send to socket.io as parameters
     * @returns {void}
     */
    emit: function(name, jsonObject) {
      console.log('emit', name);
      this.getSocket().emit(name, jsonObject);
    },

    /**
     * Connect and event from socket.io like qooxdoo event
     *
     * @param {string} name The event name to watch
     * @param {function} fn The function wich will catch event response
     * @param {mixed} that A link to this
     * @returns {void}
     */
    on: function(name, fn, that) {
      this.__name.push(name);
      if (typeof(that) !== 'undefined' && that !== null) {
        this.getSocket().on(name, qx.lang.Function.bind(fn, that));
      } else {
        this.getSocket().on(name, fn);
      }
    },

    slotExists: function(name) {
      for (let i = 0; i < this.__name.length; ++i) {
        if (this.__name[i] === name) {
          return true;
        }
      }
      return false;
    },
  },

  /**
   * Destructor
   * @returns {void}
   */
  destruct: function() {
    if (this.getSocket() != null) {
      // Deleting listeners
      if (this.__name !== null && this.__name.length >= 1) {
        for (let i = 0; i < this.__name.length; ++i) {
          this.getSocket().removeAllListeners(this.__name[i]);
        }
      }
      this.__name = null;

      this.removeAllBindings();

      // Disconnecting socket.io
      try {
        this.getSocket().socket.disconnect();
      } catch (e) {}

      try {
        this.getSocket().disconnect();
      } catch (e) {}

      this.getSocket().removeAllListeners('connect');
      this.getSocket().removeAllListeners('connecting');
      this.getSocket().removeAllListeners('connect_failed');
      this.getSocket().removeAllListeners('message');
      this.getSocket().removeAllListeners('close');
      this.getSocket().removeAllListeners('disconnect');
      this.getSocket().removeAllListeners('reconnect');
      this.getSocket().removeAllListeners('reconnecting');
      this.getSocket().removeAllListeners('reconnect_failed');
      this.getSocket().removeAllListeners('error');
    }
  },
});
