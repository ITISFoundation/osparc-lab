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
      var spinner = new qx.ui.form.Spinner(0,200,10000);
      container.add(new qx.ui.basic.Label("Number of points"));
      container.add(spinner);

      // Add spinner to document at fixed coordinates
      doc.add(container, {left: 20, top: 10});

      // Create operation buttons
      var btnFuncParser = new qx.ui.form.Button("Run parser");
      var btnToggleLog = new qx.ui.form.Button("Toggle log");
      var btnToggleProgress = new qx.ui.form.Button("Toggle progress");

      // Add buttons and labels to document at fixed coordinates
      doc.add(btnFuncParser, {left: 350, top: 10});
      doc.add(btnToggleLog, {left: 500, top: 10});
      doc.add(btnToggleProgress, {left: 600, top: 10});

       // Add an event listeners
       btnFuncParser.addListener("execute", function() {
        if (!this._socket.slotExists("funcparser")) {
          this._socket.on("funcparser", function(val) {
            console.log(val);
            alert("task_id: " + val);
          });
        }
        var n = spinner.getValue();
        this._socket.emit("funcparser", n);
      }, this);

       // Add an event listeners
       btnToggleLog.addListener("execute", function() {
        if (!this._socket.slotExists("logger")) {
          this._socket.on("logger", function(data) {
            var newLogText = JSON.stringify(data);
            textarea.setValue(data + textarea.getValue());
          });
        }
        this._socket.emit("logger");
      }, this);

       // Add an event listeners
       btnToggleProgress.addListener("execute", function() {
        if (!this._socket.slotExists("progress")) {
          this._socket.on("progress", function(data) {
            updateFromProgress(data);
            var newLogText = JSON.stringify(data);
            textarea.setValue(data + textarea.getValue());
          });
        }
        this._socket.emit("progress");
      }, this);

      // WORKBENCH
      var toolbar = new qx.ui.toolbar.ToolBar();
      toolbar.setSpacing(5);

      var part1 = new qx.ui.toolbar.Part();
      {
        var simpleBtn = new qx.ui.toolbar.Button("simple");
        simpleBtn.setHeight(40);
        simpleBtn.setWidth(100);
        simpleBtn.addListener("execute", function() {
          this._workflowView.LoadDefault(0);
        }, this);
        part1.add(simpleBtn);
       
        var advancedBtn = new qx.ui.toolbar.Button("advanced");
        advancedBtn.setHeight(40);
        advancedBtn.setWidth(100);
        advancedBtn.addListener("execute", function() {
          this._workflowView.LoadDefault(1);
        }, this);
        part1.add(advancedBtn);
       
        var moapBtn = new qx.ui.toolbar.Button("moap");
        moapBtn.setHeight(40);
        moapBtn.setWidth(100);
        moapBtn.addListener("execute", function() {
          this._workflowView.LoadDefault(2);
        }, this);
        part1.add(moapBtn);

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

      doc.add(toolbar, {left: 20, top: 80});

      // add jsNetworkX View
      this._workflowView = new qxapp.components.workflowView(500, 500);
      doc.add(this._workflowView, {left: 50, top: 120});

      // add textarea
      var logLabel = new qx.ui.basic.Label("Logger:");
      var textarea = new qx.ui.form.TextArea(" ");
     
      textarea.setWidth(750);
      textarea.setHeight(565);
      textarea.setReadOnly(true);

      doc.add(logLabel, {left: 20, top: 600});
      doc.add(textarea, {left: 20, top: 630});

      this._workflowView._jsNetworkXWrapper.addListener("NodeClicked", function(e) {
        var nodeClicked = e.getData();
        var newLogText = textarea.getValue() + "\n" + "Node " + nodeClicked.node + " clicked";

        textarea.setValue(newLogText);
        textarea.scrollToY(1e99);
      }, this);

      this._workflowView._jsNetworkXWrapper.addListener("DoubleClicked", function() {
        var newLogText = textarea.getValue() + "\n" + "Double Click";
        textarea.setValue(newLogText);
      }, this);

      var workflowview = this._workflowView;
      function updateFromProgress(data){
        textarea.setValue(textarea.getValue() + "ON MORE");
        workflowview.UpdatePipeline(data)
      };

    },
  }
});
