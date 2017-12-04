qx.Class.define("app2.ui.AvailableServicesView",
{
  extend: qx.ui.container.Composite,

  construct : function(height, color, backgrdColor)
  {
    this.base(arguments);

    this.setBarHeight(height);
    this.setColor(color);
    this.setBackgrdColor(backgrdColor);

    var box = new qx.ui.layout.HBox();
    box.set({
      spacing: 10,
      alignX: "center",
      alignY: "middle"
    });

    this.set({
      layout: box,
      height: this.getBarHeight(),
      backgroundColor: this.getBackgrdColor()
    });

    this._recreateButtons();
  },

  properties: {
    BarHeight: { check:"Number" },
    Color: { check:"String" },
    BackgrdColor: { check:"String" }
  },

  events : {
    "newServiceRequested": "qx.event.type.Data"
  },
  
  members: {
    _AvailableServices: {},
    SetAvailableServices: function(availableServices) {
      this._AvailableServices = availableServices;
      this._recreateButtons();
    },

    _checkInputConnections: function(checkThisService) {
      return true;
    },

    _onServiceRequested: function(service_id) {
      this.fireDataEvent("newServiceRequested", service_id);
    },

    _recreateButtons: function() {
      this.removeAll();

      var label = new qx.ui.basic.Label("Available Services: ").set({
        font: new qx.bom.Font(20, ["Verdana", "sans-serif"]),
        textColor: this.getColor()
      });
      this.add(label);

      if (this._AvailableServices) {
        var filteredServices = [];
        for (var i = 0; i < this._AvailableServices.length; i++) {
          if (this._checkInputConnections(this._AvailableServices[i])) {
              filteredServices.push(this._AvailableServices[i]);
          }
        }

        for (var i = 0; i < filteredServices.length; i++) {
          var btn = new qx.ui.form.Button(filteredServices[i].text);
          btn.set({
            minWidth: 60,
            maxHeight: 0.8*this.getBarHeight()
          });
          btn.addListener("execute", this._onServiceRequested.bind(this, filteredServices[i].id));
          this.add(btn);
        }
      }
    }
  }
});
