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
      var button1 = new qx.ui.form.Button("WS: Do operation 1");
      var button2 = new qx.ui.form.Button("WS: Do operation 2");

      // Add buttons and labels to document at fixed coordinates
      doc.add(button1, {left: 50, top: 100});
      doc.add(button2, {left: 250, top: 100});

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

      button2.addListener("execute", function() {
        if (!this._socket.slotExists("operation2")) {
          this._socket.on("operation2", function(val) {
            console.log(val);
            alert("Result to operation 2: " + val.value);
          });
        }
        var input_number = spinner.getValue();
        this._socket.emit("operation2", input_number);
      }, this);


      var button3 = new qx.ui.form.Button("WS + S4L: Check App Version");
      doc.add(button3, {left: 50, top: 150});
      button3.addListener("execute", function() {
        if (!this._socket.slotExists("checkS4LAppVersion")) {
          this._socket.on("checkS4LAppVersion", function(val) {
            console.log(val);
            alert("S4L App Version: " + val.major + '.' + val.minor);
          });
        }
        this._socket.emit("checkS4LAppVersion");
      }, this);

      var button4 = new qx.ui.form.Button("WS + S4L: Check Modeler Version");
      doc.add(button4, {left: 250, top: 150});
      button4.addListener("execute", function() {
        if (!this._socket.slotExists("checkS4LModVersion")) {
          this._socket.on("checkS4LModVersion", function(val) {
            console.log(val);
            alert("S4L Modeler Version: " + val.major + '.' + val.minor);
          });
        }
        this._socket.emit("checkS4LModVersion");
      }, this);
    },
  }
});
