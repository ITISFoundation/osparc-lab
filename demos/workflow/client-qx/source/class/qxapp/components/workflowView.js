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
    
        this._networkxWrapper = new qxapp.wrappers.JSNetworkX();
        this._networkxWrapper.addListener(("JSNetworkXReady"), function(e) {
            var ready = e.getData();
            if (ready) {
                this._workflowView = new qx.ui.core.Widget();
                this.add(this._workflowView, {flex: 1});
                const canvasId = 'JSNetworkXCanvas';
                this._workflowView.getContentElement().setAttribute('id', canvasId);
                this._workflowView.getContentElement().setAttribute('height', height+'px');
                this._workflowView.getContentElement().setAttribute('width', width+'px');
                
                this._workflowView.addListenerOnce('appear', function() {
                    this._networkxWrapper.CreateEmptyCanvas(canvasId);
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
        _networkxWrapper: null,
        _workflowView: null,

        LoadDefault : function()
        {
            this._networkxWrapper.AddStuff();
        },

        StartPipeline : function()
        {
            this._networkxWrapper.StartPipeline();
        },

        StopPipeline : function()
        {
            this._networkxWrapper.StopPipeline();
        },
    },
});