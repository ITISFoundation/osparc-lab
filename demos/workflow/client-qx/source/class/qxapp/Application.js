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
qx.Class.define("qxapp.Application", {
  extend: qx.application.Standalone,

  include: [qx.locale.MTranslation],

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members: {
    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     */
    main: function () {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug")) {
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

      // WORKBENCH
      var toolbar = new qx.ui.toolbar.ToolBar();
      toolbar.setSpacing(5);

      var current_pipeline = -1

      var part1 = new qx.ui.toolbar.Part(); {
        var simpleBtn = new qx.ui.toolbar.Button("simple");
        simpleBtn.setHeight(40);
        simpleBtn.setWidth(100);
        simpleBtn.addListener("execute", function () {
          current_pipeline = 0;
          this._workflowView.LoadDefault(0);
        }, this);
        part1.add(simpleBtn);

        var advancedBtn = new qx.ui.toolbar.Button("advanced");
        advancedBtn.setHeight(40);
        advancedBtn.setWidth(100);
        advancedBtn.addListener("execute", function () {
          current_pipeline = 1;
          this._workflowView.LoadDefault(1);
        }, this);
        part1.add(advancedBtn);

        var moapBtn = new qx.ui.toolbar.Button("moap");
        moapBtn.setHeight(40);
        moapBtn.setWidth(100);
        moapBtn.addListener("execute", function () {
          current_pipeline = 2;
          this._workflowView.LoadDefault(2);
        }, this);
        part1.add(moapBtn);

        toolbar.add(part1);
      }

      toolbar.addSpacer();

      var part2 = new qx.ui.toolbar.Part();

      var pipelines = [];
      var simple_pipeline = {1: [3], 2: [4], 3: [5], 4: [5], 5: [6, 7], 6: [8], 7: [8]};
      var advanced_pipeline = {1: [3], 2: [4], 3: [5], 4: [5], 5: [6, 7], 6: [8], 7: [8]};

      var pipelines = [simple_pipeline, advanced_pipeline];

      var can_start = true;

      var startPipelineBtn = new qx.ui.toolbar.Button("Start");
      startPipelineBtn.setHeight(40);
      startPipelineBtn.setWidth(100);
      startPipelineBtn.setCenter(true);
      startPipelineBtn.addListener("execute", function () {
        if (can_start){
          this._workflowView.StartPipeline();
        }
      }, this);

      startPipelineBtn.addListener("execute", function () {
        if (!this._socket.slotExists("pipeline")) {
          this._socket.on("pipeline", function (val) {
            console.log(val);
          });
        }
        if (can_start){
          this._socket.emit("pipeline", current_pipeline);
        }
      }, this);

       // Add an event listeners
       startPipelineBtn.addListener("execute", function () {
        if (!this._socket.slotExists("logger")) {
          this._socket.on("logger", function (data) {
            var newLogText = JSON.stringify(data);
            textarea.setValue(data + textarea.getValue());
          });
        }
        this._socket.emit("logger");
      }, this);

       // Add an event listeners
       startPipelineBtn.addListener("execute", function () {
        if (!this._socket.slotExists("progress")) {
          this._socket.on("progress", function (data) {
            updateFromProgress(data);
            
            var len = data.length;
            var done = true;
            for (var i=0; i<len; i++){
              if (data[i] != 1.0){
                done = false;
                break;
              }
            }
            can_start = done;
          });
        }
        can_start = false;
        this._socket.emit("progress");
      }, this);


      var stopPipelineBtn = new qx.ui.toolbar.Button("Stop");
      stopPipelineBtn.setHeight(40);
      stopPipelineBtn.setWidth(100);
      stopPipelineBtn.setCenter(true);
      stopPipelineBtn.addListener("execute", function (e) {
        this._workflowView.StopPipeline();
        can_start = true;
      }, this);

      stopPipelineBtn.addListener("execute", function () {
        if (!this._socket.slotExists("pipeline_stop")) {
          this._socket.on("stop_pipeline", function (val) {
            console.log(val);
          });
        }
        var n = "this is gonna be the pipeline as json";
        this._socket.emit("stop_pipeline", n);
      }, this);

      //  // Add an event listeners
      //  stopPipelineBtn.addListener("execute", function () {
      //   if (!this._socket.slotExists("logger")) {
      //     this._socket.on("logger", function (data) {
      //       var newLogText = JSON.stringify(data);
      //       textarea.setValue(data + textarea.getValue());
      //     });
      //   }
      //   this._socket.emit("logger");
      // }, this);
// 
      //  // Add an event listeners
      //  stopPipelineBtn.addListener("execute", function () {
      //   if (!this._socket.slotExists("progress")) {
      //     this._socket.on("progress", function (data) {
      //       updateFromProgress(data);
      //     });
      //   }
      //   this._socket.emit("progress");
      // }, this);
// 

      part2.add(startPipelineBtn);
      part2.add(stopPipelineBtn);
      toolbar.add(part2);

      doc.add(toolbar, {
        left: 20,
        top: 5
      });

      // add jsNetworkX View
      this._workflowView = new qxapp.components.workflowView(575, 425);
      doc.add(this._workflowView, {
        left: 20,
        top: 70
      });

      // add textarea
      var logLabel = new qx.ui.basic.Label("Logger:");
      var textarea = new qx.ui.form.TextArea(" ");

      textarea.setWidth(575);
      textarea.setHeight(200);
      textarea.setReadOnly(true);

      doc.add(logLabel, {
        left: 20,
        top: 500
      });
      doc.add(textarea, {
        left: 20,
        top: 520
      });

      this._workflowView._jsNetworkXWrapper.addListener("NodeClicked", function (e) {
        var nodeClicked = e.getData();
      }, this);

      this._workflowView._jsNetworkXWrapper.addListener("DoubleClicked", function () {
      }, this);

      var workflowview = this._workflowView;

      function updateFromProgress(data) {
        workflowview.UpdatePipeline(data)
      };

    },
  }
});