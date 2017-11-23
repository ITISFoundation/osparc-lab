/* ************************************************************************

   Copyright:

   License: MIT

   Authors: maiz@itis.ethz.com

************************************************************************ */

/**
 * This is the main application class of your custom application "app"
 *
 * @asset(app/*)
 */
qx.Class.define("app.Application",
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

      // We want to use some of the high-level node operation convenience
      // methods rather than manually digging into the TreeVirtual helper
      // classes.  Include the mixin that provides them.
      qx.Class.include(qx.ui.treevirtual.TreeVirtual,
                       qx.ui.treevirtual.MNode);


      var servicesHeight = 60;
      this._createAvailableServicesContainer(servicesHeight);
      this._createSettingsWindow(20, servicesHeight+20, 350, 450);
      this._createResultsViewerWindow(1000, servicesHeight+20, 800, 800);
      this._createWorkbenchWindow(20, servicesHeight+500, 800, 400);
    },

    _createAvailableServicesContainer : function(height)
    {
      var box = new qx.ui.layout.HBox();
      box.setSpacing(5);

      var container = (new qx.ui.container.Composite(box)).set(
        {
          decorator: "main",
          backgroundColor: "yellow",
          height: height
        }
      );

      var available_label = new qx.ui.basic.Label("Available Services").set({
        decorator: "main",
        rich: true,
        backgroundColor: "green",
        maxHeight: height-10,
        alignY: "middle",
        allowGrowX: true,
        allowGrowY: true
      });

      container.add(available_label);

      this.getRoot().add(container,
        {
          left: 0,
          top: 0,
          width: "100%"
        }
      );
    },

    _createSettingsWindow : function(left, top, width, height)
    {
      var win = new qx.ui.window.Window("Settings").set({
        contentPadding: 0,
        width: width,
        height: height
      });
      win.setAllowClose(false);
      win.setAllowMinimize(false);
      win.setLayout(new qx.ui.layout.Grow());

      var scroller = new qx.ui.container.Scroll();
      win.add(scroller);

      var container = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
        allowShrinkY: false
      });
      scroller.add(container);

      win.moveTo(left, top);
      win.open();
    },

    _createResultsViewerWindow : function(left, top, width, height)
    {
      var win = new qx.ui.window.Window("Results").set({
        contentPadding: 0,
        width: width,
        height: height
      });
      win.setAllowClose(false);
      win.setAllowMinimize(false);
      win.setLayout(new qx.ui.layout.Grow());

      var scroller = new qx.ui.container.Scroll();
      win.add(scroller);

      var container = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
        allowShrinkY: false
      });
      scroller.add(container);


      var splitpane = new qx.ui.splitpane.Pane("horizontal");
      // splitpane.setWidth(400);
      // splitpane.setHeight(60);
      splitpane.setDecorator("main");
      // this.getRoot().add(splitpane, {left:20, top:20});
      win.add(splitpane);

      // Left
      var tree = new qx.ui.treevirtual.TreeVirtual("Results Folder");
      tree.setColumnWidth(0, 400);
      tree.setAlwaysShowOpenCloseSymbol(true);

      // Add the tree
      splitpane.add(tree, 1);

      // Right
      var rightWidget = new qx.ui.form.TextArea("Viewer");
      rightWidget.setDecorator(null);
      rightWidget.setWrap(true);

      // Add the label
      splitpane.add(rightWidget, 2);

      {
        // tree data model
        var dataModel = tree.getDataModel();

        var te1 = dataModel.addBranch(null, "Desktop", true);

        var te;
        dataModel.addBranch(te1, "Files", true);

        te = dataModel.addBranch(te1, "Workspace", true);
        dataModel.addLeaf(te, "Windows (C:)");
        dataModel.addLeaf(te, "Documents (D:)");

        dataModel.addBranch(te1, "Network", true);
        dataModel.addBranch(te1, "Trash", true);

        var te2 = dataModel.addBranch(null, "Inbox", true);

        te = dataModel.addBranch(te2, "Spam", false);
        for (var i = 1; i < 20; i++)
        {
          dataModel.addLeaf(te, "Spam Message #" + i);
        }

        dataModel.addBranch(te2, "Sent", false);
        dataModel.addBranch(te2, "Trash", false);
        dataModel.addBranch(te2, "Data", false);
        dataModel.addBranch(te2, "Edit", false);

        dataModel.setData();

        tree.addListener("changeSelection", function(e)
        {
          var text = "Selected labels:";
          var selectedNodes = e.getData();
          for (i = 0; i < selectedNodes.length; i++)
          {
            text += "\n  " + selectedNodes[i].label;
          }
          rightWidget.setValue(text);
        });
      }

      win.moveTo(left, top);
      win.open();
    },

    _createWorkbenchWindow : function(left, top, width, height)
    {
      var win = new qx.ui.window.Window("Workbench").set({
        contentPadding: 0,
        width: width,
        height: height
      });
      win.setShowClose(false);
      win.setShowMinimize(false);
      win.setLayout(new qx.ui.layout.Grow());

      var scroller = new qx.ui.container.Scroll();
      win.add(scroller);

      var container = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
        allowShrinkY: false
      });
      scroller.add(container);

      win.moveTo(left, top);
      win.open();
    }
  }
});
