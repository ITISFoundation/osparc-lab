/**
 * @asset(resource/jquery/*)
 * @asset(resource/jquery-flowchart/*)
 * @ignore(jQuery.*)
 * @ignore(jQueryFlowchart.*)
 */
 qx.Class.define("app2.ui.WorkbenchView",
{
  extend: qx.ui.window.Window,

  construct : function(left, top, width, height, color, backgrdColor)
  {
    this.setLibReady(false);

    this.base(arguments, "Workbench");
    this.set({
      contentPadding: 0,
      width: width,
      height: height,
      showClose: false,
      showMinimize: false
    });
    this.setLayout(new qx.ui.layout.Grow());

    var scroller = new qx.ui.container.Scroll();
    this.add(scroller);

    this._workbenchViewer = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
      allowShrinkY: false,
      textColor: color,
      backgroundColor: backgrdColor
    });
    scroller.add(this._workbenchViewer);


    // in debug mode load the uncompressed unobfuscated scripts
    // three.js files are in resource/three/three(.min).js
    var min = '.min';
    if (qx.core.Environment.get("qx.debug")) {
      min = '';
    }

    // initialize the script loading
    var jquery_path = "resource/jquery/jquery-3.2.1" + min + ".js";
    var jquery_ui_path = "resource/jquery/jquery-ui-1.12.1" + min + ".js";
    var jquery_ui_css_path = "resource/jquery/jquery-ui-1.12.1" + min + ".css";
    var flowchart_path = "resource/jquery-flowchart/jquery.flowchart" + min + ".js";
    var flowchart_css_path = "resource/jquery-flowchart/jquery.flowchart" + min + ".css";
    var dynLoader = new qx.util.DynamicScriptLoader([
      jquery_path,
      jquery_ui_path,
      flowchart_path
    ]);

    this._addCss(jquery_ui_css_path);
    this._addCss(flowchart_css_path);

    dynLoader.addListenerOnce('ready', function(e) {
      console.log(jquery_path + " loaded");
      this.setLibReady(true);

      var widget = new qx.ui.core.Widget();
      this.add(widget);

      widget.addListenerOnce('appear', function() {
        var self = this;
        $(document).ready( init );
        function init() {
          // Apply the plugin on a standard, empty div...
          var $operatorTitle = $('#operator_title');
          var $flowchart = $('#example');
          $flowchart.flowchart({
            data: this._workbenchData,
            multipleLinksOnOutput: true,
            multipleLinksOnInput: true,
            onOperatorSelect: function(operatorId) {
              $operatorTitle.val($flowchart.flowchart('getOperatorTitle', operatorId));
              self._nodeSelected(operatorId);
              return true;
            },
            onOperatorUnselect: function() {
              self._nodeUnselected();
              return true;
            },
          });
        };
      }, this);

      this._fillEmptyWorkbench();

      widget.getContentElement().setAttribute('id', 'example');
      widget.getContentElement().setAttribute('height', height+'px');
      widget.getContentElement().setAttribute('width', width+'px');

      this.moveTo(left, top);
    }, this);

    dynLoader.addListener('failed', function(e) {
      var data = e.getData();
      console.log("failed to load " + data.script);
    }, this);

    dynLoader.start();
  },

  properties: {
    LibReady: { check : "Boolean" }
  },

  events : {
    "serviceSelected": "qx.event.type.Data",
    "serviceUnselected": "qx.event.type.Data"
  },

  members: {
    _workbenchViewer: null,
    _workbenchData: null,
    _model: null,

    setModel : function(model) {
      this._model = model;
    },

    _fillEmptyWorkbench : function() {
      this._workbenchData = {
        operators: {},
        links: {}
      }
    },

    addService: function(copiedService) {
      var nNodes = Object.keys(this._workbenchData.operators).length;

      var operatorId = copiedService.text + '_S' + Number(nNodes+1);
      var nodeInputs = {};
      if (copiedService.input !== "none") {
        nodeInputs.input_1 = {
          label: 'Input 1'
        }
      }
      var nodeOutputs = {};
      if (copiedService.output !== "none") {
        nodeOutputs.output_1 = {
          label: 'Output 1'
        }
      }
      var operatorData = {
        top: 20,
        left: 20 + nNodes*175,
        service: copiedService,
        properties: {
          title: operatorId,
          inputs: nodeInputs,
          outputs: nodeOutputs
        }
      };
      this._workbenchData.operators[operatorId] = operatorData;
      $('#example').flowchart('createOperator', operatorId, operatorData);
      this._model.getWorkbench().getNodes().push(operatorData);

      if (this._model.getSelected().length > 0) {
        var selectedId = this._model.getSelected().getItem(0).id;
        var selectedOperatorKey = null;
        for (var key in this._workbenchData.operators) {
          if (this._workbenchData.operators.hasOwnProperty(key)) {
            if (this._workbenchData.operators[key].service.id === selectedId) {
              if (this._workbenchData.operators[key].service.output === copiedService.input) {
                selectedOperatorKey = key;
              }
              break;
            }
          }
        }

        if (selectedOperatorKey) {
          var nLinks = Object.keys(this._workbenchData.links).length;

          var linkId = 'link_' + Number(nLinks+1);
          var linkData = {
            fromOperator: selectedOperatorKey,
            fromConnector: 'output_1',
            toOperator: operatorId,
            toConnector: 'input_1',
          }
          this._workbenchData.links[linkId] = linkData;
          $('#example').flowchart('createLink', linkId, linkData);
          this._model.getWorkbench().getConnections().push(operatorData);
        }
      }
    },

    _nodeSelected: function(operatorId) {
      if (operatorId in this._workbenchData.operators) {
        this.fireDataEvent("serviceSelected", this._workbenchData.operators[operatorId].service.id);
      }
    },

    _nodeUnselected: function() {
      this.fireDataEvent("serviceUnselected");
    },

    /**
      * Simple css loader without event support
      */
    _addCss: function(url) {
      var head = document.getElementsByTagName("head")[0];
      var el = document.createElement("link");
      el.type = "text/css";
      el.rel = "stylesheet";
      el.href = qx.util.ResourceManager.getInstance().toUri(url);
      setTimeout(function() {
        head.appendChild(el);
      }, 0);
    }
  }
});
