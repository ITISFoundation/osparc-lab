qx.Class.define("app2.ui.ResultsView",
{
  extend: qx.ui.window.Window,

  construct : function(left, top, width, height, color, backgrdColor)
  {
    this.base(arguments, "Results");
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
    this._resultsFolderUI = new qx.ui.treevirtual.TreeVirtual("Results Folder");
    this._resultsFolderUI.setColumnWidth(0, 400);
    this._resultsFolderUI.setAlwaysShowOpenCloseSymbol(true);

    // Add the tree
    splitpane.add(this._resultsFolderUI, 1);

    // Right
    this._resultsViewerUI = new qx.ui.form.TextArea("Results Viewer");
    this._resultsViewerUI.setDecorator(null);
    this._resultsViewerUI.setWrap(true);

    // Add the label
    splitpane.add(this._resultsViewerUI, 2);

    this._addTreeDataModel();

    this.moveTo(left, top);
  },

  properties :
  {
    resultsFolder : { check : "String", apply : "_changeResultsFolder" },
    selectedResult : { check : "String", apply : "_changeSelectedResult" }
  },

  members :
  {
    _resultsFolderUI: null,
    _resultsViewerUI: null,
    _changeResultsFolder : function(value) {
      console.log('changeResultsFolder', value);
    },
    _changeSelectedResult : function(value) {
      console.log('changeSelectedResult', value);
    },
    _addTreeDataModel: function() {
      // tree data model
      var dataModel = this._resultsFolderUI.getDataModel();

      var te1 = dataModel.addBranch(null, "Desktop", true);

      var te;
      dataModel.addBranch(te1, "Files", true);

      te = dataModel.addBranch(te1, "Workspace", true);
      dataModel.addLeaf(te, "Windows (C:)");
      dataModel.addLeaf(te, "Documents (D:)");

      dataModel.addBranch(te1, "Network", true);
      dataModel.addBranch(te1, "Trash", true);

      dataModel.setData();

      this._resultsFolderUI.addListener("changeSelection", function(e)
      {
        var text = "Selected labels:";
        var selectedNodes = e.getData();
        for (var i = 0; i < selectedNodes.length; i++)
        {
          text += "\n  " + selectedNodes[i].label;
        }
        this._resultsViewerUI.setValue(text);
      },this);
    }
  }
});
