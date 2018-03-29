/**
 * This class is a direct link with JSNetworkX.
 * @asset(qxapp/*)
 * @asset(jsnetworkx/*)
 * @ignore(jsnx)
 * @ignore(d3)
 */

qx.Class.define("qxapp.wrappers.JSNetworkX", {

    extend: qx.core.Object,
  
    construct: function() {
      // initialize the script loading
      var d3_path = "../resource/jsnetworkx/d3.v3.min.js";
      var jsnetworkx_path = "../resource/jsnetworkx/jsnetworkx.js";
      var dynLoader = new qx.util.DynamicScriptLoader([
        d3_path,
        jsnetworkx_path
      ]);

      dynLoader.addListenerOnce('ready', function(e) {
        console.log(jsnetworkx_path + " loaded");
        this.setLibReady(true);

        this.fireDataEvent("JSNetworkXReady", true);
      }, this);

      dynLoader.addListener('failed', function(e) {
        var data = e.getData();
        console.log("failed to load " + data.script);
        this.fireDataEvent("JSNetworkXReady", false);
      }, this);

      dynLoader.start();
    },
  
    events: {
      "JSNetworkXReady": "qx.event.type.Data",
      "NodeClicked": "qx.event.type.Data",
      "DoubleClicked": "qx.event.type.Event",
    },
  
    properties: {
      libReady: {
        nullable: false,
        init: false,
        check: "Boolean"
      },
    },
  
    members: {

      _mainGraph: null,

      CreateEmptyCanvas : function(canvasId)
      {
        this._mainGraph = new jsnx.DiGraph();

        const autoUpdate = true;
        jsnx.draw(this._mainGraph, {
          element: '#'+canvasId, 
          withLabels: true, 
          nodeStyle: {
              fill: function(d) { 
                  return d.data.color; 
              }
          }, 
          labelStyle: {fill: 'white'},
          stickyDrag: true
        }, autoUpdate);
      },

      AddStuff : function(loadExample)
      {
        for (var n of this._mainGraph.nodes()){
            this._mainGraph.removeNode(n);
        }

        //const loadExample = 1;
        if (loadExample === 0)
        {
          // #0: Undirected weighted graph
          // Main graph would need to be changed to jsnx.Graph();
          this._mainGraph.addNodesFrom([1,2,3,4,5,6,7,8], {color: 'blue'});
          this._mainGraph.addEdgesFrom([[1,3],[3,5],[2,4],[4,5],[5,6],[5,7],[6,8],[7,8]]);
        }
        else if (loadExample === 1)
        {
          this._mainGraph.addNodesFrom([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], {color: 'blue'});
          this._mainGraph.addEdgesFrom([[1,2],[2,3],[4,5],[5,6],[7,8],[8,9],[3,10],[6,10],
          [9,12],[10,11],[12,13],[11,14],[13,14],[14,15]]);
        }
        else if (loadExample === 2)
        {
          // #2: NetworkX example graph
		  // Main graph would need to be changed to jsnx.Graph();
		  var nodes = [];
		  for (var i=1; i<43; i++){
			  nodes.push(i);
		  }

          this._mainGraph.addNodesFrom(nodes, {group:0});
		  this._mainGraph.addEdgesFrom([[1,2],[2,3],[4,5],[5,6],[7,8],[8,9],
			[10,11],[11,12],[13,14],[14,15],[16,17],[17,18],[19,20],[20,21],[22,23],[23,24],
			[3,25],[6,25],[9,25],[12,26],[15,26],[18,27],[21,27],[24,27],
			 [25,28],[26,29],[26,30],[27,31],[27,32],[27,33],[28,35],[29,35],[30,34],[31,34],[32,37],[33,38],
			[35,36],[34,40],[38,39],[36,40],[39,40],[40,41],[40,42]]);
        }

        //d3.select("svg.jsnx").selectAll("g.node").on('mouseenter', function(d) {
        //  console.log('mouseenter', d);
        //});
    
        //d3.select("svg.jsnx").selectAll("g.node").on('mouseover', function(d) {
        //  console.log('mouseover', d);
        //});
    
        var that = this;
        d3.select("svg.jsnx").selectAll("g.node").on('click', function(d) {
          that.fireDataEvent("NodeClicked", d);
        }, that);

        d3.select('svg.jsnx').on('dblclick.zoom', function(d) {
          that.fireEvent("DoubleClicked");
        }, that);
      },

      StartPipeline : function()
      {
        const getAllInfo = true;
        var nodes = this._mainGraph.nodes(getAllInfo);
        for (let i = 0; i < nodes.length; i++) {
          var oldNode = nodes[i][0];
          this._mainGraph.addNodesFrom([oldNode], {color: 'red'});
        }
      },

      StopPipeline : function()
      {
        const getAllInfo = true;
        var nodes = this._mainGraph.nodes(getAllInfo);
        for (let i = 0; i < nodes.length; i++) {
          var oldNode = nodes[i][0];
          this._mainGraph.addNodesFrom([oldNode], {color: 'red'});
        }
      },

      UpdatePipeline : function(data)
      {
        const getAllInfo = true;
        var nodes = this._mainGraph.nodes(getAllInfo);
        if (data.length != nodes.length){
          return;
        }

        for (let i = 0; i < nodes.length; i++) {
          var oldNode = nodes[i][0];
          if (data[i] == -1)          {
            this._mainGraph.addNodesFrom([oldNode], {color: 'red'});
          } else if(data[i] < 1.0) {
            this._mainGraph.addNodesFrom([oldNode], {color: 'orange'});
          }
          else{
            this._mainGraph.addNodesFrom([oldNode], {color: 'green'});
            
          }
        }
      },

    },
  
    /**
     * Destructor
     */
    destruct: function() {
        
    }
  });
  