qx.Class.define("app.ui.ResultsView",
{
  extend: qx.ui.window.Window,
  construct : function(left, top, width, height, color, backgrdColor)
  {
    this.base(arguments, "Settings");
    this.setContentPadding(0);
    this.setWidth(width);
    this.setHeight(height);

    this.setAllowClose(false);
    this.setAllowMinimize(false);
    this.setLayout(new qx.ui.layout.Grow());

    var scroller = new qx.ui.container.Scroll();
    this.add(scroller);

    var container = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
      allowShrinkY: false,
      textColor: color,
      backgroundColor: backgrdColor
    });
    scroller.add(container);


    var splitpane = new qx.ui.splitpane.Pane("horizontal");
    // splitpane.setWidth(400);
    // splitpane.setHeight(60);
    splitpane.setDecorator("main");
    // this.getRoot().add(splitpane, {left:20, top:20});
    this.add(splitpane);

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
      dataModel.addLeaf(te, "thisdows (C:)");
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

    this.moveTo(left, top);
  }
});
