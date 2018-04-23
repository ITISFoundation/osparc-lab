qx.Class.define("qxapp.components.workflowView",
{
    extend: qx.ui.container.Composite,
  
    construct : function(width, height)
    {
        this.base(arguments);
        this.set({
            width: width,
            height: height
        });
    
        var box = new qx.ui.layout.VBox();
    
        box.set({
            spacing: 10,
            alignX: "center",
            alignY: "middle"
        });
    
        this.set({
            layout: box
        });
    
        this._jsNetworkXWrapper = new qxapp.wrappers.JSNetworkX();
        this._jsNetworkXWrapper.addListener(("JSNetworkXReady"), function(e) {
            var ready = e.getData();
            if (ready) {
                this._workflowView = new qx.ui.core.Widget();
                this.add(this._workflowView, {flex: 1});
                const canvasId = 'JSNetworkXCanvas';
                this._workflowView.getContentElement().setAttribute('id', canvasId);
                this._workflowView.getContentElement().setAttribute('height', height+'px');
                this._workflowView.getContentElement().setAttribute('width', width+'px');
                
                this._workflowView.addListenerOnce('appear', function() {
                    this._jsNetworkXWrapper.CreateEmptyCanvas(canvasId);
                    //this._workflowView.getContentElement().getDomElement().appendChild(this._networksxWrapper.GetDomElement());
                }, this);
            } else {
                console.log("JSNetworkX.js was not loaded");
            }
        }, this);
    },

    events : {
    },

    members: {
        _jsNetworkXWrapper: null,
        _workflowView: null,

        LoadDefault : function(which)
        {
            this._jsNetworkXWrapper.AddStuff(which);
        },

        StartPipeline : function()
        {
            this._jsNetworkXWrapper.StartPipeline();
        },

        StopPipeline : function()
        {
            this._jsNetworkXWrapper.StopPipeline();
        },

        UpdatePipeline : function(data)
        {
            this._jsNetworkXWrapper.UpdatePipeline(data);
        },
    },
});