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

      // Create operation buttons
      let button1 = new qx.ui.form.Button('Get Available Services');
      // Add buttons and labels to document at fixed coordinates
      doc.add(button1, {left: 50, top: 100});
      // Add an event listeners
      button1.addListener('execute', function() {
        const socketName = 'getInteractiveServices';
        if (!this._socket.slotExists(socketName)) {
          this._socket.on(socketName, function(val) {
            console.log(val);
            alert('Result to Getting Services is: ' + val);
          });
        }
        this._socket.emit(socketName);
      }, this);
    },
  },
});
