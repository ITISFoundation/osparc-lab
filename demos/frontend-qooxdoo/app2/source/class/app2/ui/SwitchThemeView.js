qx.Class.define("app2.ui.SwitchThemeView",
{
  extend: qx.ui.container.Composite,

  construct : function(height, color, backgrdColor)
  {
    this.base(arguments);

    this._selectBox = new qx.ui.form.SelectBox();
    var option0 = new qx.ui.form.ListItem("Indigo", null, 0);
    var option1 = new qx.ui.form.ListItem("Classic", null, 1);
    var option2 = new qx.ui.form.ListItem("Modern", null, 2);
    var option3 = new qx.ui.form.ListItem("Simple", null, 3);
    this._selectBox.add(option0);
    this._selectBox.add(option1);
    this._selectBox.add(option2);
    this._selectBox.add(option3);
    this._selectBox.set({
      minWidth: 60,
      maxHeight: 0.8*height
    });

    var box = new qx.ui.layout.HBox();
    box.set({
      spacing: 10,
      alignX: "left",
      alignY: "middle"
    });

    this.set({
      layout: box,
      height: height,
      backgroundColor: backgrdColor
    });

    this.add(this._selectBox);

    this._selectBox.addListener("changeSelection", this._onSelectBoxChanged.bind(this));
  },

  events : {
    "themeSwitched": "qx.event.type.Data"
  },

  members : {
    _selectBox: null,

    _onSelectBoxChanged: function() {
      this.fireDataEvent("themeSwitched", this._selectBox.getModelSelection().getItem(0));
    }
  }
});
