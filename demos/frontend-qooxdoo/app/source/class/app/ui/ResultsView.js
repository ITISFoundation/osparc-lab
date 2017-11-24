qx.Class.define("app.ui.ResultsView",
{
  extend: qx.ui.window.Window,

  construct : function(left, top, width, height, color, backgrdColor)
  {
    this.base(arguments, "Settings");
    this.set({
      contentPadding: 0,
      width: width,
      height: height,
      showClose: false,
      showMinimize: false
    });
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
    this._resultsFolder = new qx.ui.treevirtual.TreeVirtual("Results Folder");
    this._resultsFolder.setColumnWidth(0, 400);
    this._resultsFolder.setAlwaysShowOpenCloseSymbol(true);

    // Add the tree
    splitpane.add(this._resultsFolder, 1);

    // Right
    this._resultsViewer = new qx.ui.form.TextArea("Results Viewer");
    this._resultsViewer.setDecorator(null);
    this._resultsViewer.setWrap(true);

    // Add the label
    splitpane.add(this._resultsViewer, 2);

    this._addTreeDataModel();

    this.moveTo(left, top);
  },

  members: {
    _resultsFolder: null,
    _resultsViewer: null,
    _addTreeDataModel: function() {
      // tree data model
      var dataModel = this._resultsFolder.getDataModel();

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

      this._resultsFolder.addListener("changeSelection", function(e)
      {
        var text = "Selected labels:";
        var selectedNodes = e.getData();
        for (var i = 0; i < selectedNodes.length; i++)
        {
          text += "\n  " + selectedNodes[i].label;
        }
        this._resultsViewer.setValue(text);
      },this);
    }
  }
});
