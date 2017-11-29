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

  members: {
    _AvailableServices: [],
    SetAvailableServices: function(availableServices) {
      this._AvailableServices = availableServices;
      this._recreateButtons();
    },

    _recreateButtons: function() {
      this.removeAll();

      var label = new qx.ui.basic.Label("Available Services: ").set({
        font: new qx.bom.Font(20, ["Verdana", "sans-serif"]),
        textColor: this.getColor()
      });
      this.add(label);

      for (var i = 0; i < this._AvailableServices.length; i++) {
        var btn = new qx.ui.form.Button(this._AvailableServices[i]);
        btn.set({
          minWidth: 60,
          height: 30
          //this.getButtonHeight()
        });
        this.add(btn);
      }
    }
  }
});
