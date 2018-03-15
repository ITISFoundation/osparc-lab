/**
 * This class is a direct link with JSNetworkX.
 * @asset(qxapp/*)
 * @asset(jsnetworkx/*)
 * @ignore(jsnx)
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

      AddStuff : function()
      {
        const loadExample = 1;
        if (loadExample === 0)
        {
          // #0: Undirected weighted graph
          this._mainGraph.addWeightedEdgesFrom([[2,3,10]]);
          this._mainGraph.addStar([3,4,5,6], {weight: 5}); 
          this._mainGraph.addStar([2,1,0,-1], {weight: 3});
        }
        else if (loadExample === 1)
        {
          this._mainGraph.addNodesFrom([1,2,3,4,5], {color: 'blue'});
          this._mainGraph.addNodesFrom([9], {color: '#008A00'});
          this._mainGraph.addCycle([1,2,3,4,5]);
          this._mainGraph.addEdgesFrom([[1,9], [9,1]]);
        }
        else if (loadExample === 2)
        {
          // #2: NetworkX example graph
          this._mainGraph.addNodesFrom([1,2,3,4], {group:0});
          this._mainGraph.addNodesFrom([5,6,7], {group:1});
          this._mainGraph.addNodesFrom([8,9,10,11], {group:2});
           
          this._mainGraph.addPath([1,2,5,6,7,8,11]);
          this._mainGraph.addEdgesFrom([[1,3],[1,4],[3,4],[2,3],[2,4],[8,9],[8,10],[9,10],[11,10],[11,9]]);
        }
      },

      StartPipeline : function()
      {
        const getAllInfo = true;
        var nodes = this._mainGraph.nodes(getAllInfo);
        console.log(nodes);
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
    },
  
    /**
     * Destructor
     */
    destruct: function() {
        
    }
  });
  