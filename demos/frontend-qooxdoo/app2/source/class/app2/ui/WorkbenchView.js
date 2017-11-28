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

      var widget = new qx.ui.core.Widget();
      widget.addListenerOnce('appear', function() {

        $(document).ready(function() {
          var data = {
            operators: {
              operator1: {
                top: 20,
                left: 20,
                properties: {
                  title: 'Operator 1',
                  inputs: {},
                    outputs: {
                    output_1: {
                      label: 'Output 1',
                    }
                  }
                }
              },
              operator2: {
                top: 80,
                left: 300,
                properties: {
                  title: 'Operator 2',
                  inputs: {
                    input_1: {
                      label: 'Input 1',
                    },
                    input_2: {
                      label: 'Input 2',
                    },
                  },
                  outputs: {}
                }
              },
            },
            links: {
              link_1: {
                fromOperator: 'operator1',
                fromConnector: 'output_1',
                toOperator: 'operator2',
                toConnector: 'input_2',
              },
            }
          };

          // Apply the plugin on a standard, empty div...
          $('#example').flowchart({
            data: data
          });
        });
      }, this);

      widget.getContentElement().setAttribute('id', 'example');
      widget.getContentElement().setAttribute('height', height+'px');
      widget.getContentElement().setAttribute('width', width+'px');

      this.add(widget);

      this.moveTo(left, top);

      this.setLibReady(true);
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

  members: {
    _workbenchViewer: null,

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
