qx.Class.define("app.ui.WorkbenchView",
{
  extend: qx.ui.window.Window,
  
  construct : function(left, top, width, height, color, backgrdColor)
  {
    this.base(arguments, "Settings");
    this.setContentPadding(0);
    this.setWidth(width);
    this.setHeight(height);

    this.setShowClose(false);
    this.setShowMinimize(false);
    this.setLayout(new qx.ui.layout.Grow());

    var scroller = new qx.ui.container.Scroll();
    this.add(scroller);

    var container = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
      allowShrinkY: false,
      textColor: color,
      backgroundColor: backgrdColor
    });
    scroller.add(container);

    this.moveTo(left, top);
  }
});
