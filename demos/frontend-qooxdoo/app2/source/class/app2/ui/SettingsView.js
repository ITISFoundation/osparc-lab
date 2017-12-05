qx.Class.define("app2.ui.SettingsView",
{
  extend: qx.ui.window.Window,

  construct : function(left, top, width, height, color, backgrdColor)
  {
    this.base(arguments, "Settings");
    this.set({
      contentPadding: 0,
      width: width,
      height: height,
      allowClose: false,
      allowMinimize: false
    });
    this.setLayout(new qx.ui.layout.Grow());

    var scroller = new qx.ui.container.Scroll();
    this.add(scroller);

    this._settingsViewer = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
      allowShrinkY: false,
      textColor: color,
      backgroundColor: backgrdColor
    });
    scroller.add(this._settingsViewer);

    this.moveTo(left, top);
  },

  events : {
    "computeService": "qx.event.type.Data"
  },

  members: {
    _settingsViewer: null,
    _model: null,

    setModel : function(model) {
      this._model = model;
    },

    updateSettings : function() {
      this._buildForm();
    },

    _buildForm : function() {
      this._settingsViewer.removeAll();

      if ("service" in this._model.getSelected().getItem(0) &&
          "settings" in this._model.getSelected().getItem(0).service) {
        var myServiceSetts = this._model.getSelected().getItem(0).service.settings;

        if (myServiceSetts.length > 0) {
          var data = this._model.getSelected().getItem(0).service.settings;
          var model = qx.data.marshal.Json.createModel(data);

          var form = new qx.ui.form.Form();

          for (var i = 0; i < myServiceSetts.length; i++) {
            var input;
            switch (myServiceSetts[i].type) {
              case "number":
                input = new qx.ui.form.Spinner();
                input.set({
                  value: myServiceSetts[i].value
                });
                break;
              case "text":
                input = new qx.ui.form.TextField();
                input.set({
                  value: myServiceSetts[i].value
                });
                break;
              case "select":
                input = new qx.ui.form.SelectBox();
                for (var j = 0; j < myServiceSetts[i].options.length; j++) {
                  var optionItem = new qx.ui.form.ListItem(myServiceSetts[i].options[j], null, j);
                  input.add(optionItem);
                }
                break;
              default:
                input = null;
                break;
            }
            if (input) {
              form.add(input, myServiceSetts[i].text, null, myServiceSetts[i].name);
            }
          }

          // form with Compute and reset button
          var computeButton = new qx.ui.form.Button("Compute");
          form.addButton(computeButton);
          var resetButton = new qx.ui.form.Button("Reset");
          form.addButton(resetButton);

          var controller = new qx.data.controller.Form(null, form);
          var model = controller.createModel();

          computeButton.addListener("execute", function() {
            if (form.validate()) {
              for (var i = 0; i < this._model.getSelected().getItem(0).service.settings.length; i++) {
                var settKey = this._model.getSelected().getItem(0).service.settings[i].name;
                this._model.getSelected().getItem(0).service.settings[i].value = model.get(settKey);
              }
            }
          }, this);

          resetButton.addListener("execute", function() {
            form.reset();
          }, this);

          this._settingsViewer.add(new qx.ui.form.renderer.Single(form));
        }
      }
    }
  }
});
