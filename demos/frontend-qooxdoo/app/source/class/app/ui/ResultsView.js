qx.Class.define("app.ui.ResultsView",
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
    this._resultsViewerUI = new qx.ui.embed.Iframe().set({
      width: 400,
      height: 300,
      minWidth: 200,
      minHeight: 150,
      decorator : null
    });

    // Add the label
    splitpane.add(this._resultsViewerUI, 2);

    this._addTreeDataModel();

    this.moveTo(left, top);
  },

  properties :
  {
    resultsFolder : { check : "String", apply : "_changeResultsFolder" },
    selectedResult : { check : "String", apply : "_changeSelectedResult" },
    LibReady: { check : "Boolean" }
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
      var te1 = dataModel.addBranch(null, "Output", true);
      var te;
      te = dataModel.addBranch(te1, "Pub-Websites", true);
      var node1 = dataModel.addLeaf(te, "qooxdoo");
      var node2 = dataModel.addLeaf(te, "IT'IS");
      te = dataModel.addBranch(te1, "Own-Websites", true);
      var node3 = dataModel.addLeaf(te, "Output1");
      var node4 = dataModel.addLeaf(te, "Output2");
      dataModel.setData();

      var myNode1 = dataModel.getNode(node1-1);
      myNode1.url = "http://qooxdoo.org";
      var myNode2 = dataModel.getNode(node2-1);
      myNode2.url = "https://www.itis.ethz.ch";
      var myNode3 = dataModel.getNode(node3-1);
      myNode3.url = "resource/outputs/Output1.html";
      var myNode4 = dataModel.getNode(node4-1);
      myNode4.url = "resource/outputs/Output2.html";

      this._resultsFolderUI.addListener("changeSelection", function(e)
      {
        var selectedNodes = e.getData();
        var newUrl = selectedNodes[0].url;
        this._resultsViewerUI.setSource(newUrl);
      }, this);
    }
  }
});
