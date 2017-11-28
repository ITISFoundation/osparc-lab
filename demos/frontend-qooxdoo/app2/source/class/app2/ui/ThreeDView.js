/**
 * @asset(resource/three/*)
 * @ignore(THREE)
 */
 qx.Class.define("app2.ui.ThreeDView",
{
  extend: qx.ui.window.Window,

  construct : function(left, top, width, height, color, backgrdColor)
  {
    this.setLibReady(false);

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
    // three.js files are in resource/three/three(.min).js
    var min = '.min';
    if (qx.core.Environment.get("qx.debug")) {
      min = '';
    }

    // initialize the script loading
    var three_path = "resource/three/three" + min + ".js";
    var orbit_path = "resource/three/OrbitControls.js";
    var dynLoader = new qx.util.DynamicScriptLoader([
      three_path,
      orbit_path
    ]);

    dynLoader.addListenerOnce('ready', function(e) {
      console.log(three_path + " loaded");

      this._scene = new THREE.Scene();
      this._scene.background = new THREE.Color(backgrdColor);

      this._camera = new THREE.PerspectiveCamera();
      this._camera.position.z = 20;
      this._scene.add(this._camera);

      var pointLight = new THREE.PointLight(0xFFFFFF);
      pointLight.position.x = -10;
      pointLight.position.y = 10;
      pointLight.position.z = 40;
      this._scene.add(pointLight);

      this._renderer = new THREE.WebGLRenderer();
      this._renderer.setSize(this.getWidth(), this.getHeight());

      var widget = new qx.ui.core.Widget();
      widget.addListenerOnce('appear', function() {
        widget.getContentElement().getDomElement().appendChild(this._renderer.domElement);

        this._controls = new THREE.OrbitControls(this._camera, this._renderer.domElement);
        this._controls.addEventListener('change', this._updateControls.bind(this));
        this._controls.update();

        this._render();
        this._addSphere(2);
      }, this);

      widget.addListener('resize', function() {
        this._camera.aspect = this.getWidth() /this.getHeight();
        this._camera.updateProjectionMatrix();
        this._controls.handleResize();
        this._renderer.setSize(this.getWidth(), this.getHeight());
      }, this);

      this.add(widget);

      this.moveTo(left, top);

      this.setLibReady(true);
    }, this);

    dynLoader.addListener('failed', function(e) {
      var data = e.getData();
      console.log("failed to load " + data.script);
    }, this);

    dynLoader.start();
  },

  properties: {
    LibReady: { check : "Boolean" }
  },

  members: {
    _threeDViewer: null,
    _scene: null,
    _camera: null,
    _renderer: null,
    _controls: null,

    _render : function()
    {
      this._renderer.render(this._scene, this._camera);
    },

    _updateControls : function() {
      this._render();
    },

    _addSphere : function(radius)
    {
      var geometry = new THREE.SphereGeometry(2, 32, 16);
      var material = new THREE.MeshPhongMaterial({
        wireframe: true,
        wireframeLinewidth: 3,
        color: 0xFF0000
      });
      var mesh = new THREE.Mesh(geometry, material);
      this._scene.add(mesh);
      this._render();
    }
  }
});
