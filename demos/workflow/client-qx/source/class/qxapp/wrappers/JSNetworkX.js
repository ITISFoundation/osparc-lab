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
          this._mainGraph.addWeightedEdgesFrom([[2,3,10]]);
          this._mainGraph.addStar([3,4,5,6], {weight: 5}); 
          this._mainGraph.addStar([2,1,0,-1], {weight: 3});
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
          this._mainGraph.addNodesFrom([1,2,3,4], {group:0});
          this._mainGraph.addNodesFrom([5,6,7], {group:1});
          this._mainGraph.addNodesFrom([8,9,10,11], {group:2});
           
          this._mainGraph.addPath([1,2,5,6,7,8,11]);
          this._mainGraph.addEdgesFrom([[1,3],[1,4],[3,4],[2,3],[2,4],[8,9],[8,10],[9,10],[11,10],[11,9]]);
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
          // nodes[i][1].color = 'green'; //doesn't work/update
          var oldNode = nodes[i][0];
          this._mainGraph.addNodesFrom([oldNode], {color: 'green'});
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
        for (let i = 0; i < nodes.length; i++) {
          var oldNode = nodes[i][0];
          if (data[i] == 1)          {
            this._mainGraph.addNodesFrom([oldNode], {color: 'red'});
          } else{
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
  