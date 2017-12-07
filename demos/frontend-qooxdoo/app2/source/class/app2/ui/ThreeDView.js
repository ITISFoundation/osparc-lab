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
    var tranform_path = "resource/three/TransformControls.js";
    var shader_skin_path = "resource/three/ShaderSkin.js";
    var dynLoader = new qx.util.DynamicScriptLoader([
      three_path,
      orbit_path,
      tranform_path,
      shader_skin_path
    ]);

    dynLoader.addListenerOnce('ready', function(e) {
      console.log(three_path + " loaded");
      this.setLibReady(true);

      this._scene = new THREE.Scene();
      this._scene.background = new THREE.Color(backgrdColor);

      this._camera = new THREE.PerspectiveCamera();
      this._camera.position.z = 20;
      this._scene.add(this._camera);

      var pointLight = new THREE.PointLight(0xBBBBBB);
      pointLight.position.x = -10;
      pointLight.position.y = 10;
      pointLight.position.z = 40;
      this._scene.add(pointLight);

      var pointLight2 = new THREE.PointLight(0xFFFFFF);
      pointLight2.position.x = 10;
      pointLight2.position.y = -10;
      pointLight2.position.z = -40;
      this._scene.add(pointLight2);

      this._renderer = new THREE.WebGLRenderer();
      this._renderer.setSize(this.getWidth(), this.getHeight());

      var widget = new qx.ui.core.Widget();
      this.add(widget);

      widget.addListenerOnce('appear', function() {
        widget.getContentElement().getDomElement().appendChild(this._renderer.domElement);

        this._orbitControls = new THREE.OrbitControls(this._camera, this._renderer.domElement);
        this._orbitControls.addEventListener('change', this._updateOrbitControls.bind(this));
        this._orbitControls.update();

        this._transformControls = new THREE.TransformControls(this._camera, this._renderer.domElement);
        this._transformControls.addEventListener('change', this._updateTransformControls.bind(this));
        this._transformControls.setMode( "translate" );
        this._scene.add(this._transformControls);

        this._render();
        //this._addSphere(1);
        this._addBody();
        //this._addHead();
      }, this);

      widget.addListener('resize', function() {
        this._camera.aspect = this.getWidth() /this.getHeight();
        this._camera.updateProjectionMatrix();
        this._orbitControls.handleResize();
        this._orbitControls.update();
        this._renderer.setSize(this.getWidth(), this.getHeight());
      }, this);

      this.moveTo(left, top);
    }, this);

    dynLoader.addListener('failed', function(e) {
      var data = e.getData();
      console.log("failed to load " + data.script);
    }, this);

    dynLoader.start();
  },

  properties: {
    LibReady: { check: "Boolean" },
    SphereRadius: { check: "Number", apply: "_radiusChanged" }
  },

  members: {
    _threeDViewer: null,
    _scene: null,
    _camera: null,
    _renderer: null,
    _orbitControls: null,
    _transformControls: null,
    _sphereMesh: null,

    _render : function()
    {
      this._renderer.render(this._scene, this._camera);
    },

    _updateOrbitControls : function() {
      this._render();
    },

    _updateTransformControls : function() {
      this._transformControls.update();
      this._render();
    },

    _radiusChanged : function(scale)
    {
        //this._addSphere(scale);
    },

    _addSphere : function(radius)
    {
      this._scene.remove(this._sphereMesh);
      var geometry = new THREE.SphereGeometry(radius, 32, 16);
      var material = new THREE.MeshPhongMaterial({
        wireframe: true,
        wireframeLinewidth: 3,
        color: 0xFF0000
      });
      this._sphereMesh = new THREE.Mesh(geometry, material);
      this._scene.add(this._sphereMesh);
      this._transformControls.attach(this._sphereMesh);
      this._render();
    },

    _addBody : function()
    {
      var loader = new THREE.ObjectLoader();

      var self = this;
      loader.load(
        'resource/three/3D_models/body/standard-male-figure.json',
        function (obj) {
          self._scene.add(obj);
          self._transformControls.attach(obj);
          self._render();
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (xhr) {
            console.error('An error happened');
        }
      );
    },

    _addHead : function()
    {
      //var loader = new THREE.JSONLoader();
      var loader = new THREE.ObjectLoader();
      var self = this;
      loader.load(
        'resource/three/3D_models/head/lee-perry-smith-head-scan.json',
        function (geometry) {
  				var textureLoader = new THREE.TextureLoader();
  				var mapHeight = textureLoader.load( "resource/three/3D_models/head/Face_Disp.jpg" );
  				mapHeight.anisotropy = 4;
  				mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
  				mapHeight.format = THREE.RGBFormat;
  				//var mapSpecular = textureLoader.load( "resource/three/3D_models/head/Map-SPEC.jpg" );
  				//mapSpecular.anisotropy = 4;
  				//mapSpecular.wrapS = mapSpecular.wrapT = THREE.RepeatWrapping;
  				//mapSpecular.format = THREE.RGBFormat;
  				var mapColor = textureLoader.load( "resource/three/3D_models/head/Face_Color.jpg" );
  				mapColor.anisotropy = 4;
  				mapColor.wrapS = mapColor.wrapT = THREE.RepeatWrapping;
  				mapColor.format = THREE.RGBFormat;
  				var shader = THREE.ShaderSkin["skinSimple"];
  				var fragmentShader = shader.fragmentShader;
  				var vertexShader = shader.vertexShader;
  				var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
          console.log('uniforms', uniforms);
  				uniforms["enableBump"].value = true;
  				uniforms["enableSpecular"].value = true;
  				//uniforms["tBeckmann"].value = composerBeckmann.renderTarget1.texture;
  				uniforms["tDiffuse"].value = mapColor;
  				uniforms["bumpMap"].value = mapHeight;
  				//uniforms["specularMap"].value = mapSpecular;
  				//uniforms["diffuse"].value.setHex( 0xa0a0a0 );
          uniforms["uDiffuseColor"].value.setHex( 0xa0a0a0 );
  				//uniforms["specular"].value.setHex( 0xa0a0a0 );
          uniforms["uSpecularColor"].value.setHex( 0xa0a0a0 );
  				uniforms["uRoughness"].value = 0.2;
  				uniforms["uSpecularBrightness"].value = 0.5;
  				uniforms["bumpScale"].value = 8;
  				var material = new THREE.ShaderMaterial( { fragmentShader: fragmentShader, vertexShader: vertexShader, uniforms: uniforms, lights: true } );
  				material.extensions.derivatives = true;
  				var mesh = new THREE.Mesh(geometry, material);
  				mesh.position.y = -50;
  				mesh.scale.set(100, 100, 100);
  				mesh.castShadow = true;
  				mesh.receiveShadow = true;
  				self._scene.add(mesh);
          self._transformControls.attach(mesh);
          self._render();
        }
      );
    }
  }
});
