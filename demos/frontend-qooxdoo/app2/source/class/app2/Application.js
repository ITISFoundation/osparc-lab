/* ************************************************************************

   Copyright:

   License: MIT

   Authors: maiz@itis.ethz.com

************************************************************************ */

/**
 * This is the main application class of your custom application "app2"
 *
 * @asset(app2/*)
 */
qx.Class.define("app2.Application",
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
    _availableServicesView: null,
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

      var body = document.body;
      var html = document.documentElement;
      var docHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
      var docWidth = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );
      var servicesHeight = 60;
      var padding = 10;
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
      var availableServicesObj = this._getAvailableServices();
      var availableServicesArr = [];
      for (var key in availableServicesObj) {
        if (!availableServicesObj.hasOwnProperty(key)) {
          continue;
        }
        availableServicesArr.push(availableServicesObj[key]);
      };
      var availableServicesArrQx = new qx.data.Array(availableServicesArr);
      this._model.setAvailableServices(availableServicesArrQx);
      var baseColor = this._model.getBaseColor();

      this._availableServicesView = new app2.ui.AvailableServicesView(
        servicesHeight,
        this._getStyle1(baseColor).color, this._getStyle1(baseColor).backgroundColor
      );
      this._availableServicesView.SetAvailableServices(this._model.getAvailableServices().toArray());

      this._settingsView = new app2.ui.SettingsView(
        padding, servicesHeight + padding, quarterWidth, halfHeight,
        this._getStyle2(baseColor).color, this._getStyle2(baseColor).backgroundColor
      );
      this._threeDView = new app2.ui.ThreeDView(
        2*padding + quarterWidth, servicesHeight + padding, quarterWidth, halfHeight,
        this._getStyle2(baseColor).color, this._getStyle2(baseColor).backgroundColor
      );
      this._resultsView = new app2.ui.ResultsView(
        3*padding + 2*quarterWidth, servicesHeight + padding, halfWidth, docHeight,
        this._getStyle2(baseColor).color, this._getStyle2(baseColor).backgroundColor
      );
      this._workbenchView = new app2.ui.WorkbenchView(
        padding, servicesHeight + padding + halfHeight + padding, halfWidth - padding, halfHeight - padding,
        this._getStyle3(baseColor).color, this._getStyle3(baseColor).backgroundColor
      );

      this._availableServicesView.addListener("newServiceRequested", function(e) {
        this._newServiceRequested(e.getData());
      }, this);

      doc.add(this._availableServicesView, {left: 0, top: 0, width: "100%"});
      this._settingsView.open();
      this._threeDView.open();
      this._resultsView.open();
      this._workbenchView.open();

      this._settingsView.setModel(this._model);

      setTimeout( function(self) {
        this._threeDView.setSphereRadius(2);
      }.bind(this), 3000);
    },

    _getAvailableServices : function() {
      /*
      var payload = {};
      var url = 'https://outbox.zurichmedtech.com/maiz/ServiceRegistry.json';
      var req = new qx.io.remote.Request(url);
      //req.setRequestHeader('Content-Type','application/json');
      //req.setCrossDomain(true);
      req.addListener("completed", function(e) {
        console.log('completed');
        var res = e.getContent();
        console.log('getResponse', res);
      }, this);
      req.send();
      */
      // store/ServiceRegistry.json
      var myList = {
      	"00000-00000" : {
      		"id": "00000-00000",
      		"name": "single-cell",
      		"text": "SingleCell",
      		"tooltip": "Single Cell TT",
      		"input": "none",
      		"output": "folder",
      		"settings": [
              {
      			"name": "NaValue",
                  "text": "Na blocker drug concentration",
                  "type": "number",
                  "value": 10
              },
              {
                  "name": "KrValue",
                  "text": "Kr blocker drug concentration",
                  "type": "number",
                  "value": 10
              },
              {
      			"name": "BCLValue",
                  "text": "Basic cycle length (BCL)",
                  "type": "number",
                  "value": 10
              },
              {
                  "name": "beatsValue",
                  "text": "Number of beats",
                  "type": "number",
                  "value": 10
              },
              {
                  "name": "LigandValue",
                  "text": "Ligand concentration",
                  "type": "number",
                  "value": 10
              },
              {
                  "name": "cAMKIIValue",
                  "options": [
      				"A",
                      "B",
                      "C",
                      "D"
                  ],
                  "text": "Adjust cAMKII activity level",
                  "type": "select",
                  "value": 0
              }
              ]
      	},
      	"00000-00001" : {
      		"id": "00000-00001",
      		"name": "requestWhatInItalia",
      		"text": "Italia",
      		"tooltip": "You know what it does",
      		"input": "none",
      		"output": "bool",
      		"settings": [
      		{
      			"name": "day",
      			"text": "Day",
      			"type": "number",
      			"value": 0
      		}
      		]
      	},
      	"00000-00002" : {
      		"id": "00000-00002",
      		"name": "randomizer",
      		"text": "Random",
      		"tooltip": "Creates a random number in the given range",
      		"input": "none",
      		"output": "number",
      		"settings": [
      		{
      			"name": "lowerLimit",
      			"text": "Lower Limit",
      			"type": "number",
      			"value": 1
      		},
      		{
      			"name": "upperLimit",
      			"text": "Upper Limit",
      			"type": "number",
      			"value": 10
      		}
      		]
      	},
      	"00000-00003" : {
      		"id": "00000-00003",
      		"name": "adder",
      		"text": "Adder",
      		"tooltip": "Adds the value in the settings to the input",
      		"input": "number",
      		"output": "number",
      		"settings": [
      		{
      			"name": "add",
      			"text": "Add",
      			"type": "number",
      			"value": 5
      		}
      		]
      	},
      	"00000-00004" : {
      		"id": "00000-00004",
      		"name": "multiplier",
      		"text": "Multiplier",
      		"tooltip": "Multiplies the input by the value in the settings",
      		"input": "number",
      		"output": "number",
      		"settings": [
      		{
      			"name": "multiply",
      			"text": "Multiply by",
      			"type": "number",
      			"value": 2
      		}
      		]
      	},
      	"00000-00005" : {
      		"id": "00000-00005",
      		"name": "divider",
      		"text": "Divider",
      		"tooltip": "Divides the input by the value in the settings",
      		"input": "number",
      		"output": "number",
      		"settings": [
      		{
      			"name": "divide",
      			"text": "Divide by",
      			"type": "number",
      			"value": 2
      		}
      		]
      	}
      };
      return myList;
    },

    _getInitialStore : function() {
      // store/InitialStore.json
      var myStore = {
        "availableServices": [],
        "sphereRadius": 1,
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
          //this._workbenchView.addNewNode(copiedService);
          var newNode = {
            uniqueName: copiedService.text + '_S' + Number(this._model.getWorkbench().getNodes().length+1),
            service: copiedService,
          };
          if ('input' in copiedService && copiedService.input !== 'none') {
            newNode['input'] = {
              nameId: 'in'
            };
          }

          if ('output' in copiedService && copiedService.output !== 'none') {
            newNode['output'] = {
              nameId: 'out'
            };
          }
          this._model.getWorkbench().getNodes().push(newNode);

          if (this._model.getSelected().length > 0 && this._model.getSelected().getItem(0)) {
            let newConn = {
              nameId: 'Conn_' + (this._model.getWorkbench().getConnections().length + 1),
              input: {
                node: this._model.getSelected().getItem(0).uniqueName,
                port: 'out'
              },
              output: {
                node: newNode.uniqueName,
                port: 'in'
              }
            };
            this._model.getWorkbench().getConnections().push(newConn);
          }

          this._model.getSelected().removeAll();
          this._model.getSelected().push(newNode);

          // Settings View
          this._settingsView.updateSettings(copiedService);

          console.log(this._model);

          break;
        }
      }
      //this._model.getWorkbench().setSelected(e.getData());
      //workbenchWindow.AddService(e.getData());
      //console.log(this._model);
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
