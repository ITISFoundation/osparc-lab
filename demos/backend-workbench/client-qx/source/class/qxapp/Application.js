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
qx.Class.define('qxapp.Application',
{
  extend: qx.application.Standalone,

  include: [qx.locale.MTranslation],

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members:
  {
    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     */
    main: function() {
      // Call super class
      this.base();

      // Enable logging in debug variant
      if (qx.core.Environment.get('qx.debug')) {
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
      let doc = this.getRoot();

      // openning web socket
      this._socket = new qxapp.wrappers.webSocket('app');
      this._socket.connect();

      let scope = this;
      let horizontalLayout = new qx.ui.layout.HBox().set({
        spacing: 4,
        alignX: 'left',
      });
      let buttonPane = new qx.ui.container.Composite(horizontalLayout);
      doc.add(buttonPane, {left: 50, top: 100});
      // Create operation buttons
      let button1 = new qx.ui.form.Button('Get Available Services');
      // Add buttons and labels to document at fixed coordinates
      buttonPane.add(button1);
      // Add an event listeners
      button1.addListener('execute', function() {
        const socketName = 'getInteractiveServices';
        if (!scope._socket.slotExists(socketName)) {
          scope._socket.on(socketName, function(val) {
            console.log(val);
            onRetrievedInteractiveServices(val);
          });
        }
        scope._socket.emit(socketName);
      }, this);

      let button2 = new qx.ui.form.Button('Start Modeler');
      buttonPane.add(button2);
      button2.addListener('execute', function() {
        const socketName = 'startModeler';
        if (!scope._socket.slotExists(socketName)) {
          scope._socket.on(socketName, function(val) {
            console.log(val);
            onStartModelerDone(val);
          });
        }
        let uuid = textArea.getValue();
        scope._socket.emit(socketName, uuid);
      }, this);

      let button3 = new qx.ui.form.Button('Stop Modeler');
      buttonPane.add(button3);
      button3.addListener('execute', function() {
        const socketName = 'stopModeler';
        if (!scope._socket.slotExists(socketName)) {
          scope._socket.on(socketName, function(val) {
            console.log(val);
            onStopModelerDone(val);
          });
        }
        let uuid = textArea.getValue();
        scope._socket.emit(socketName, uuid);
      }, this);

      let textArea = new qx.ui.form.TextArea().set({
        height: 250,
      });
      doc.add(textArea, {left: 50, top: 200});


      function onRetrievedInteractiveServices(data) {
        for (let index = 0; index < data.length; index++) {
          const service = data[index];
          console.log(service);
        }
        textArea.setValue(qx.lang.Json.stringify(data));
      };

      function onStartModelerDone(data) {
        for (let index = 0; index < data.length; index++) {
          const service = data[index];
          console.log(service);
        }
        textArea.setValue(qx.lang.Json.stringify(data));
      };

      function onStopModelerDone(data) {
        for (let index = 0; index < data.length; index++) {
          const service = data[index];
          console.log(service);
        }
        textArea.setValue(qx.lang.Json.stringify(data));
      };
    },
  },
});
