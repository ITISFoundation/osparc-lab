/* ************************************************************************

   Copyright: 2018

   License: MIT license

   Authors:

************************************************************************ */

/**
 * This is the main application class of "qxapp"
 *
 * @asset(qxapp/*)
 */
qx.Class.define("qxapp.Application",
{
  extend : qx.application.Standalone,

  include : [qx.locale.MTranslation],

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called
     * during startup of the application
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

      // openning web socket
      this._socket = new qxapp.wrappers.webSocket('app');
      this._socket.connect();

      var container = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
      var spinner = new qx.ui.form.Spinner();
      container.add(new qx.ui.basic.Label("Input number"));
      container.add(spinner);

      // Add spinner to document at fixed coordinates
      doc.add(container, {left: 50, top: 50});

      // Create operation buttons
      var button1 = new qx.ui.form.Button("WebSocket: Do operation");

      // Add buttons and labels to document at fixed coordinates
      doc.add(button1, {left: 250, top: 50});

      // Add an event listeners
      button1.addListener("execute", function() {
        if (!this._socket.slotExists("operation1")) {
          this._socket.on("operation1", function(val) {
            console.log(val);
            alert("Result to operation 1: " + val.value);
          });
        }
        var input_number = spinner.getValue();
        this._socket.emit("operation1", input_number);
      }, this);


      // WORKBENCH
      var toolbar = new qx.ui.toolbar.ToolBar();
      toolbar.setSpacing(5);

      var part1 = new qx.ui.toolbar.Part();
      {
        var loadDefaultBtn = new qx.ui.toolbar.Button("Load default graph");
        loadDefaultBtn.setHeight(40);
        loadDefaultBtn.addListener("execute", function() {
          this._workflowView.LoadDefault();
        }, this);
        part1.add(loadDefaultBtn);
        toolbar.add(part1);
      }

      toolbar.addSpacer();

      var part2 = new qx.ui.toolbar.Part();
      {
        var startPipelineBtn = new qx.ui.toolbar.RadioButton("Start");
        startPipelineBtn.setHeight(40);
        startPipelineBtn.setWidth(100);
        startPipelineBtn.setCenter(true);
        startPipelineBtn.addListener("execute", function() {
          this._workflowView.StartPipeline();
          var newLogText = textarea.getValue() + "\n" + "Start";
          textarea.setValue(newLogText);
        }, this);
        
        var stopPipelineBtn = new qx.ui.toolbar.RadioButton("Stop");
        stopPipelineBtn.setHeight(40);
        stopPipelineBtn.setWidth(100);
        stopPipelineBtn.setCenter(true);
        stopPipelineBtn.addListener("execute", function(e) {
          this._workflowView.StopPipeline();
          var newLogText = textarea.getValue() + "\n" + "Stop";
          textarea.setValue(newLogText);
        }, this);
        
        part2.add(startPipelineBtn);
        part2.add(stopPipelineBtn);
        var radioGroup = new qx.ui.form.RadioGroup(startPipelineBtn, stopPipelineBtn);
        radioGroup.setAllowEmptySelection(true);
        radioGroup.setSelection([]);
        toolbar.add(part2);
      }

      doc.add(toolbar, {left: 50, top: 150});

      // add jsNetworkX View
      this._workflowView = new qxapp.components.workflowView(500, 500);
      doc.add(this._workflowView, {left: 50, top: 215});

      // add textarea
      var logLabel = new qx.ui.basic.Label("Logger:");
      var textarea = new qx.ui.form.TextArea();
      textarea.setWidth(250);
      textarea.setHeight(565);
      textarea.setReadOnly(true);
      doc.add(logLabel, {left: 550, top: 150});
      doc.add(textarea, {left: 550, top: 180});

      this._workflowView._jsNetworkXWrapper.addListener("NodeClicked", function(e) {
        var nodeClicked = e.getData();
        var newLogText = textarea.getValue() + "\n" + "Node " +nodeClicked.node + " clicked";
        textarea.setValue(newLogText);
      }, this);

      this._workflowView._jsNetworkXWrapper.addListener("DoubleClicked", function() {
        var nodeClicked = e.getData();
        var newLogText = textarea.getValue() + "\n" + "Double Click";
        textarea.setValue(newLogText);
      }, this);
    },
  }
});
