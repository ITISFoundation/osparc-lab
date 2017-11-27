qx.Class.define("app2.ui.ThreeDView",
{
  extend: qx.ui.window.Window,

  construct : function(left, top, width, height, color, backgrdColor)
  {
    this.base(arguments, "3D View");
    this.set({
      contentPadding: 0,
      width: width,
      height: height,
      allowClose: false,
      allowMinimize: false,
      layout: new qx.ui.layout.Grow()
    });

    var scroller = new qx.ui.container.Scroll();
    this.add(scroller);

    this._threeDViewer = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
      allowShrinkY: false,
      textColor: color,
      backgroundColor: backgrdColor
    });
    scroller.add(this._threeDViewer);


    // in debug mode load the uncompressed unobfuscated scripts
    // three.js files are in externals/three(.min).js
    var src = '';
    var min = '.min';
    if (qx.core.Environment.get("qx.debug")) {
      src = '.src';
      min = '';
    }

    // initialize the script loading
    var lib_path = "resource/three/three" + min + ".js";
    var dynLoader = new qx.util.DynamicScriptLoader([
      lib_path
    ]);

    dynLoader.addListenerOnce('ready',function(e) {
      console.log(lib_path + " loaded");

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera();
      var renderer = new THREE.WebGLRenderer();

      var widget = new qx.ui.core.Widget();
      widget.addListenerOnce('appear',function() {
        scene.background = new THREE.Color(backgrdColor);

        camera.position.z = 20

        renderer.setSize(this.getWidth(), this.getHeight());

        widget.getContentElement().getDomElement().appendChild(renderer.domElement);

        var geometry = new THREE.SphereGeometry(2, 32, 16);
        var material = new THREE.MeshPhongMaterial({
          wireframe: true,
          wireframeLinewidth: 3,
          color: 0xFF0000
        });
        var mesh = new THREE.Mesh(geometry, material);

        var pointLight = new THREE.PointLight(0xFFFFFF);
        pointLight.position.x = -10;
        pointLight.position.y = 10;
        pointLight.position.z = 40;

        scene.add(camera);
        scene.add(mesh);
        scene.add(pointLight);

        renderer.render(scene, camera);
      }, this);

      widget.addListener('resize',function(){
        renderer.setSize( this.getWidth(), this.getHeight());
      }, this);

      this.add(widget);

      this.moveTo(left, top);
    }, this);

    dynLoader.addListener('failed',function(e) {
      var data = e.getData();
      console.log("failed to load " + data.script);
    }, this);

    dynLoader.start();
  },

  members: {
    _threeDViewer: null
  }
});
