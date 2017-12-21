/* ************************************************************************

   Copyright:

   License: MIT

   Authors: odeimaiz

************************************************************************ */

/**
 * This is the main application class of your custom application "app"
 *
 * @asset(app/*)
 */
qx.Class.define("app.Application",
{
  extend : qx.application.Standalone,

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    _model: null,
    _socket: null,
    _availableServicesView: null,
    _switchThemeView: null,
    _settingsView: null,
    _threeDView: null,
    _resultsView: null,
    _workbenchView: null,

    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     *
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      // Document is the application root
      var doc = this.getRoot();

      // We want to use some of the high-level node operation convenience
      // methods rather than manually digging into the TreeVirtual helper
      // classes.  Include the mixin that provides them.
      qx.Class.include(qx.ui.treevirtual.TreeVirtual,
                       qx.ui.treevirtual.MNode);

      // openning web socket
      this._socket = new app.api.WebSocket('app');
      this._socket.connect();

      var body = document.body;
      var html = document.documentElement;
      var docHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
      var docWidth = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );
      var servicesHeight = 60;
      var padding = 5;
      docHeight = docHeight - servicesHeight;
      var quarterWidth = (docWidth - 6*padding) / 4;
      var halfHeight = (docHeight - 2*padding) / 2;
      var halfWidth = (docWidth - 2*padding) / 2;
      docHeight = docHeight - 2*padding;
      docWidth = docWidth - 2*padding;
      {
        docHeight = parseInt(docHeight);
        docWidth = parseInt(docWidth);
        halfHeight = parseInt(halfHeight);
        halfWidth = parseInt(halfWidth);
        quarterWidth = parseInt(quarterWidth);
      }

      this._model = qx.data.marshal.Json.createModel(this._getInitialStore());
      var baseColor = this._model.getBaseColor();

      this._availableServicesView = new app.ui.AvailableServicesView(
        servicesHeight,
        this._getStyle1(baseColor).color, this._getStyle1(baseColor).backgroundColor
      );
      this._switchThemeView = new app.ui.SwitchThemeView(
        servicesHeight,
        this._getStyle1(baseColor).color, this._getStyle1(baseColor).backgroundColor
      );
      this._settingsView = new app.ui.SettingsView(
        padding, servicesHeight + padding, quarterWidth, halfHeight,
        this._getStyle2(baseColor).color, this._getStyle2(baseColor).backgroundColor
      );
      this._threeDView = new app.ui.ThreeDView(
        2*padding + quarterWidth, servicesHeight + padding, quarterWidth, halfHeight,
        this._getStyle2(baseColor).color, this._getStyle2(baseColor).backgroundColor
      );
      this._resultsView = new app.ui.ResultsView(
        3*padding + 2*quarterWidth, servicesHeight + padding, halfWidth, docHeight,
        this._getStyle2(baseColor).color, this._getStyle2(baseColor).backgroundColor
      );
      this._workbenchView = new app.ui.WorkbenchView(
        padding, servicesHeight + padding + halfHeight + padding, halfWidth - padding, halfHeight - padding,
        this._getStyle3(baseColor).color, this._getStyle3(baseColor).backgroundColor
      );

      this._socket.addListener("connect", function() {
        console.log("Connection stablished");

        this._socket.emit("requestAvailableServices");
        this._socket.on("availableServices", function(val) {
          if (val.type === "availableServices") {
            var availableServicesArrQx = new qx.data.Array(val.value);
            this._model.setAvailableServices(availableServicesArrQx);
            this._availableServicesView.RecreateButtons();
          }
        }, this);
      }, this);

      this._availableServicesView.addListener("newServiceRequested", function(e) {
        this._newServiceRequested(e.getData());
      }, this);
      this._switchThemeView.addListener("themeSwitched", function(e) {
        this.switchTheme(e.getData());
      }, this);
      this._settingsView.addListener("computeService", function(e) {
        this._computeService(e.getData());
      }, this);

      this._workbenchView.addListener("serviceSelected", function(e) {
        this._serviceSelected(e.getData());
      }, this);

      this._workbenchView.addListener("serviceUnselected", function(e) {
        this._serviceUnselected();
      }, this);

      doc.add(this._availableServicesView, {left: 0, top: 0, width: "100%"});
      doc.add(this._switchThemeView, {left: 0, top: 0, width: "10%"});
      this._settingsView.open();
      this._threeDView.open();
      this._resultsView.open();
      this._workbenchView.open();

      this._availableServicesView.setModel(this._model);
      this._settingsView.setModel(this._model);
      this._workbenchView.setModel(this._model);
    },

    _getInitialStore : function() {
      // store/InitialStore.json
      var myStore = {
        "availableServices": [],
        "baseColor": 66,
        "outputPath": "",
        "selected": [],
        "workbench": {
          "nodes": [],
          "connections": []
        }
      };
      return myStore;
    },

    uuidv4 : function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    _newServiceRequested : function(service_id) {
      for (var i = 0; i < this._model.getAvailableServices().length; i++) {
        if (service_id === this._model.getAvailableServices().getItem(i).id) {
          var copiedService = JSON.parse(JSON.stringify(this._model.getAvailableServices().getItem(i)));
          copiedService.id = this.uuidv4();

          // Workbench View
          this._workbenchView.addService(copiedService);

          this._model.getSelected().removeAll();
          this._model.getSelected().push(copiedService);

          // Settings View
          this._settingsView.updateSettings();

          // Available Services View
          this._availableServicesView.RecreateButtons();

          break;
        }
      }
    },

    switchTheme : function(selectedTheme) {
      switch (selectedTheme)
      {
        case 0:
          qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Indigo);
          break;
        case 1:
          qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Classic);
          break;
        case 2:
          qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Modern);
          break;
        case 3:
          qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Simple);
          break;
        default:
          qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Classic);
          break;
      }
    },

    calculateRandomValue : function(service) {
      var sleepFor = 3000; //ms
      setTimeout( function() {
        var min = Number(service.settings[0].value);
        var max = Number(service.settings[1].value);
        var newRand = Math.floor(Math.random() * (max - min + 1) + min);
        this._threeDView.setSphereRadius(newRand);
      }.bind(this), sleepFor);
    },

    addSelectedModel : function(service) {
      var modelType = service.settings[0].value;
      var scale = service.settings[1].value;
      var addTransorm = service.settings[2].value;
      var clearScene = service.settings[3].value;
      if (clearScene) {
        // Clear scene
        this._threeDView.ClearScene();
      }
      switch (modelType)
      {
        case 0:
          this._threeDView.AddSphere(scale, addTransorm);
          break;
        case 1:
          this._threeDView.AddBody(scale, addTransorm);
          break;
        case 2:
          this._threeDView.AddHead(scale, addTransorm);
          break;
        default:
          console.log('Not supported')
          break;
      }
    },

    _computeService : function(service_id) {
      for (var i = 0; i < this._model.getWorkbench().getNodes().length; i++) {
        if (service_id === this._model.getWorkbench().getNodes().getItem(i).service.id) {
          var computeThis = this._model.getWorkbench().getNodes().getItem(i).service;
          if (computeThis.name === 'randomizer')
          {
            this.calculateRandomValue(computeThis);
          }
          else if (computeThis.name === 'single-cell')
          {
            var uniqueName = this._model.getWorkbench().getNodes().getItem(i).properties.title;
          }
          else if (computeThis.name === 'modeler')
          {
            this.addSelectedModel(computeThis);
          }
          return;
        }
      }
    },

    _serviceSelected : function(service_id) {
      for (var i = 0; i < this._model.getWorkbench().getNodes().length; i++) {
        if (service_id === this._model.getWorkbench().getNodes().getItem(i).service.id) {
          this._model.getSelected().removeAll();
          this._model.getSelected().push(this._model.getWorkbench().getNodes().getItem(i).service);

          // Settings View
          this._settingsView.updateSettings();

          // Available Services View
          this._availableServicesView.RecreateButtons();
        }
      }
    },

    _serviceUnselected : function() {
      this._model.getSelected().removeAll();
      this._settingsView.updateSettings();

      // Available Services View
      this._availableServicesView.RecreateButtons();
    },

    _getStyle1 : function(baseClr) {
      var baseColor = baseClr + 0;
      var textColor = 255 - baseColor;
      return {
        backgroundColor: 'rgb(' + baseColor + ',' + baseColor + ',' + baseColor + ')',
        color: 'rgb(' + textColor + ',' + textColor + ',' + textColor + ')'
      };
    },

    _getStyle2 : function(baseClr) {
      var baseColor = baseClr + 10;
      var textColor = 255 - baseColor;
      return {
        backgroundColor: 'rgb(' + baseColor + ',' + baseColor + ',' + baseColor + ')',
        color: 'rgb(' + textColor + ',' + textColor + ',' + textColor + ')'
      };
    },

    _getStyle3 : function(baseClr) {
      var baseColor = baseClr + 20;
      var textColor = 255 - baseColor;
      return {
        backgroundColor: 'rgb(' + baseColor + ',' + baseColor + ',' + baseColor + ')',
        color: 'rgb(' + textColor + ',' + textColor + ',' + textColor + ')'
      };
    }
  },

  events : {
    "addNewServiceRequested": "qx.event.type.Data",
    "serviceSelected": "qx.event.type.Data"
  }
});
