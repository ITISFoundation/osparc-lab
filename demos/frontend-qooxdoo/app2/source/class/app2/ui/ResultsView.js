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
      textColor: color
      //textColor: color,
      //backgroundColor: backgrdColor
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
    /*
    this._resultsViewerUI = new qx.ui.embed.Iframe().set({
      width: 400,
      height: 300,
      minWidth: 200,
      minHeight: 150,
      decorator : null
    });
    */

    this._resultsViewerUI = new qx.ui.container.Composite();

    this._resultsViewerUI.getContentElement().setAttribute('class', 'grid-stack');
    this._resultsViewerUI.getContentElement().setAttribute('id', 'results-viewer');

    // Add the label
    splitpane.add(this._resultsViewerUI, 2);





    var widgetItem1 = new qx.ui.container.Composite();
    widgetItem1.getContentElement().addClass('grid-stack-item');
    widgetItem1.getContentElement().setAttribute('data-gs-x', '0');
    widgetItem1.getContentElement().setAttribute('data-gs-y', '0');
    widgetItem1.getContentElement().setAttribute('data-gs-width', '4');
    widgetItem1.getContentElement().setAttribute('data-gs-height', '4');

    var widgetItemContent1 = new qx.ui.container.Composite();
    widgetItemContent1.getContentElement().setAttribute('class', 'grid-stack-item-content');

    var frame1 = new qx.ui.embed.Iframe().set({
      //width: 400,
      //height: 300,
      //minWidth: 200,
      //minHeight: 150,
      source: "http://qooxdoo.org",
      decorator : null
    });

    widgetItemContent1.add(frame1);
    widgetItem1.add(widgetItemContent1);
    this._resultsViewerUI.add(widgetItem1);


    var widgetItem2 = new qx.ui.container.Composite();
    widgetItem2.getContentElement().addClass('grid-stack-item');
    widgetItem2.getContentElement().setAttribute('data-gs-x', '0');
    widgetItem2.getContentElement().setAttribute('data-gs-y', '4');
    widgetItem2.getContentElement().setAttribute('data-gs-width', '4');
    widgetItem2.getContentElement().setAttribute('data-gs-height', '4');

    var widgetItemContent2 = new qx.ui.container.Composite();
    widgetItemContent2.getContentElement().setAttribute('class', 'grid-stack-item-content');

    var frame2 = new qx.ui.embed.Iframe().set({
      //width: 400,
      //height: 300,
      //minWidth: 200,
      //minHeight: 150,
      source: "https://www.itis.ethz.ch",
      decorator : null
    });

    widgetItemContent2.add(frame2);
    widgetItem2.add(widgetItemContent2);
    this._resultsViewerUI.add(widgetItem2);




    // in debug mode load the uncompressed unobfuscated scripts
    // three.js files are in resource/three/three(.min).js
    var min = '.min';
    if (qx.core.Environment.get("qx.debug")) {
      min = '';
    }

    // initialize the script loading
    var jquery_path = "resource/jquery/jquery-3.2.1" + min + ".js";
    var jquery_ui_path = "resource/jquery/jquery-ui-1.12.1" + min + ".js";
    var lodash_path = "resource/jquery/lodash" + min + ".js";
    var gridstack_path = "resource/jquery-gridstack/gridstack.min.js";
    var gridstack_css_path = "resource/jquery-gridstack/gridstack.min.css";
    var dynLoader = new qx.util.DynamicScriptLoader([
      jquery_path,
      jquery_ui_path,
      lodash_path,
      gridstack_path
    ]);

    this._addCss(gridstack_css_path);

    dynLoader.addListenerOnce('ready', function(e) {
      console.log(gridstack_path + " loaded");
      this.setLibReady(true);

      var self = this;
      $(function () {
        var options = {
            cellHeight: 80,
            verticalMargin: 10
        };
        $('.grid-stack').gridstack(options);

        /*
        var widgetItem1 = new qx.ui.core.Widget();
        //widgetItem1.getContentElement().addClass('grid-stack-item');
        widgetItem1.getContentElement().setAttribute('class', 'grid-stack-item');
        widgetItem1.getContentElement().setAttribute('data-gs-x', '0');
        widgetItem1.getContentElement().setAttribute('data-gs-y', '0');
        widgetItem1.getContentElement().setAttribute('data-gs-width', '4');
        widgetItem1.getContentElement().setAttribute('data-gs-height', '4');

        var widgetItemContent1 = new qx.ui.core.Widget();
        widgetItemContent1.getContentElement().setAttribute('class', 'grid-stack-item-content');
        widgetItem1.addChildrenToQueue(widgetItemContent1);

        //self._resultsViewerUI.getContentElement().appendChild(widgetItem1.getContentElement());
        $('.grid-stack').appendChild(widgetItem1.getContentElement());


        var widgetItem2 = new qx.ui.core.Widget();
        //widgetItem2.getContentElement().addClass('grid-stack-item');
        widgetItem2.getContentElement().setAttribute('class', 'grid-stack-item');
        widgetItem2.getContentElement().setAttribute('data-gs-x', '0');
        widgetItem2.getContentElement().setAttribute('data-gs-y', '0');
        widgetItem2.getContentElement().setAttribute('data-gs-width', '4');
        widgetItem2.getContentElement().setAttribute('data-gs-height', '4');

        var widgetItemContent2 = new qx.ui.core.Widget();
        widgetItemContent2.getContentElement().setAttribute('class', 'grid-stack-item-content');
        widgetItem2.addChildrenToQueue(widgetItemContent2);

        $('.grid-stack').appendChild(widgetItem2);
        */
      });
    }, this);

    dynLoader.addListener('failed', function(e) {
      var data = e.getData();
      console.log("failed to load " + data.script);
    }, this);

    dynLoader.start();

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

      /*
      this._resultsFolderUI.addListener("changeSelection", function(e)
      {
        var selectedNodes = e.getData();
        var newUrl = selectedNodes[0].url;
        this._resultsViewerUI.setSource(newUrl);
      }, this);
      */
    },

    /**
      * Simple css loader without event support
      */
    _addCss: function(url) {
      var head = document.getElementsByTagName("head")[0];
      var el = document.createElement("link");
      el.type = "text/css";
      el.rel = "stylesheet";
      el.href = qx.util.ResourceManager.getInstance().toUri(url);
      setTimeout(function() {
        head.appendChild(el);
      }, 0);
    }
  }
});
