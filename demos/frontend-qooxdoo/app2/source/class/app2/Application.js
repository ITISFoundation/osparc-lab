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

      var baseColor = 60;
      var servicesHeight = 60;
      var padding = 10;
      var halfHeight = (974 - servicesHeight - 3*padding) / 2;

      var availableServices = this._createAvailableServicesContainer(
        servicesHeight,
        this._getStyle1(baseColor).color, this._getStyle1(baseColor).backgroundColor
      );
      var settingsWindow = new app2.ui.SettingsView(
        padding, servicesHeight + padding, 350, halfHeight,
        this._getStyle2(baseColor).color, this._getStyle2(baseColor).backgroundColor
      );
      var threeDWindow = new app2.ui.ThreeDView(
        padding + 350 + padding, servicesHeight + padding, halfHeight, halfHeight,
        this._getStyle2(baseColor).color, this._getStyle2(baseColor).backgroundColor
      );
      var resultsWindow = new app2.ui.ResultsView(
        900, servicesHeight + padding, 1000, 800,
        this._getStyle2(baseColor).color, this._getStyle2(baseColor).backgroundColor
      );
      var workbenchWindow = new app2.ui.WorkbenchView(
        padding, servicesHeight + padding + halfHeight + padding, 800, halfHeight,
        this._getStyle3(baseColor).color, this._getStyle3(baseColor).backgroundColor
      );

      doc.add(availableServices, {left: 0, top: 0, width: "100%"});
      settingsWindow.open();
      threeDWindow.open();
      resultsWindow.open();
      workbenchWindow.open();
    },

    _createAvailableServicesContainer : function(height, color, backgrdColor)
    {
      var box = new qx.ui.layout.HBox();
      box.setSpacing(5);

      var container = (new qx.ui.container.Composite(box)).set(
        {
          decorator: "main",
          height: height,
          backgroundColor: backgrdColor
        }
      );

      var available_label = new qx.ui.basic.Label("Available Services").set({
        decorator: "main",
        rich: true,
        textColor: color,
        backgroundColor: "blue",
        maxHeight: height-10,
        alignY: "middle",
        allowGrowX: true,
        allowGrowY: true
      });

      container.add(available_label);

      return container;
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
  }
});
