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
      var loadDefaultBtn = new qx.ui.form.Button("Load default graph");
      doc.add(loadDefaultBtn, {left: 50, top: 150});
      loadDefaultBtn.addListener("execute", function() {
        this._workflowView.LoadDefault();
      }, this);
      
      var startPipelineBtn = new qx.ui.form.Button("Start");
      doc.add(startPipelineBtn, {left: 250, top: 150});
      startPipelineBtn.addListener("execute", function() {
        this._workflowView.StartPipeline();
      }, this);
      
      var stopPipelineBtn = new qx.ui.form.Button("Stop");
      doc.add(stopPipelineBtn, {left: 300, top: 150});
      stopPipelineBtn.addListener("execute", function() {
        this._workflowView.StopPipeline();
      }, this);

      this._workflowView = new qxapp.components.workflowView(500, 500);
      doc.add(this._workflowView, {left: 50, top: 200});
    },
  }
});
