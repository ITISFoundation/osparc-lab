#include "ThreeWidget.h"

#include <Wt/WApplication.h>
#include <Wt/DomElement.h>

#include <boost/algorithm/string.hpp>

namespace sparc
{
	using namespace Wt;

	namespace algo = boost::algorithm;

	ThreeWidget::ThreeWidget()
		// JS slot which executed in the client-side, called from server side.
		: resizeSlot_("function(o, e, w, h) {" + this->jsRef() + ".resizeRenderer(o, e, w, h); }", 2, this)
		, scene_(this, this->jsRef() + ".scene")
	{
		setInline(false);
		setLayoutSizeAware(true);

		WApplication *app = WApplication::instance();

		std::string res = WApplication::relativeResourcesUrl() + "three/";

		app->require(res + "three.js");
		app->require(res + "js/controls/OrbitControls.js");
		app->require(res + "js/Detector.js");
		app->require(res + "js/libs/dat.gui.min.js");
		app->require(res + "js/geometries/TeapotBufferGeometry.js");
	}

	void ThreeWidget::addOrbitControl()
	{
		js_ <<
			"var self = " << jsRef() << ";\n";

		js_ << R"(
// CONTROLS
self.cameraControls = new THREE.OrbitControls( self.scene._camera, self.renderer.domElement );
self.cameraControls.addEventListener( 'change', self.renderScene );
)";
	}

	void ThreeWidget::addTeapot()
	{
		scene_.addObject3D(std::make_unique<Three::Teapot>());
	}

	Wt::DomElementType ThreeWidget::domElementType() const
	{
		return Wt::DomElementType::DIV;
	}

	void ThreeWidget::resize(const WLength &width, const WLength &height)
	{
		WInteractWidget::resize(width, height);
		layoutSizeChanged(static_cast<int>(width.value()), static_cast<int>(height.value()));
	}

	Wt::DomElement * ThreeWidget::createDomElement(WApplication *app)
	{
		DomElement *result = nullptr;

		result = DomElement::createNew(domElementType());

		setId(result, app);

		updateDom(*result, true);

		return result;
	}

	void ThreeWidget::render(Wt::WFlags<Wt::RenderFlag> flags)
	{
		std::ostringstream js;

		if (flags.test(RenderFlag::Full))
		{

			js << "console.log('ThreeWidget::render(): Full Update');\n";

			// Boiler plate code to initialize scene
			js <<
				"var self = " << jsRef() << ";\n";

			js << R"(
self.widgetData = {};

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );

self.appendChild( renderer.domElement );

self.renderer = renderer;

self.resizeRenderer = (function(o, e, w, h) 
{
	if ('scene' in o)
	{
		o.scene._camera.aspect = w / h;
		o.scene._camera.updateProjectionMatrix();

		o.renderer.setSize( w, h );
		o.renderer.render( o.scene, o.scene._camera );
	}
});

self.animate = (function animate() 
{
	requestAnimationFrame( animate );
	renderer.render( self.scene, self.scene._camera );
});

self.renderScene = function render()
{
	if ('scene' in self)
		renderer.render( self.scene, self.scene._camera );
}

)";

			js << scene_.fullRender();
		}
		else
		{
			// Simple update

		}

		js << js_.str();
		js_.str("");

		WApplication::instance()->doJavaScript(js.str());

		WInteractWidget::render(flags);
	}

	void ThreeWidget::layoutSizeChanged(int width, int height)
	{
		resizeSlot_.exec(jsRef(), "null", std::to_string(width), std::to_string(height));
	}

	std::string ThreeWidget::createJsRef()
	{
		auto ref = jsRef() + ".widgetData." + "obj" + std::to_string(jsRefs_.size());
		jsRefs_.insert(ref);
		return ref;
	}

	//////////////////////////////////////////////////////////////////////////

	std::string Three::Object3D::jsRef() const
	{
		if(jsRef_.empty() && owner_)
			jsRef_ = owner_->createJsRef();
		if(!jsRef_.empty())
			return jsRef_;

		return "%" + std::to_string((std::uint64_t)this) + "%";
	}

	std::string Three::Object3D::fullRender()
	{
		fullRenderOverride();

		for(auto& c : children_)
		{
			js_ << c->fullRender() << "\n";
		}

		// Apply incremental
		js_ << incrementalRender();

		auto s = resolveJsRef(js_.str());
		js_.str("");

		return s;
	}

	std::string Three::Object3D::incrementalRender()
	{
		for (auto& c : children_)
		{
			incrementalJs_ << c->resolveJsRef(c->incrementalRender()) << "\n";
		}

		auto s = resolveJsRef(incrementalJs_.str());
		for (auto& c : children_)
			s = c->resolveJsRef(std::move(s));

		incrementalJs_.str("");
		return s;
	}

	void Three::Object3D::fullRenderOverride()
	{
		js_ << jsRef() << " = new THREE.Object3D();\n";
	}

	void Three::Object3D::syncToClient()
	{
		if(owner_ && owner_->isRendered())
		{
			owner_->doJavaScript(incrementalRender());
			incrementalJs_.str("");
		}
	}

	std::string Three::Object3D::resolveJsRef(const std::string jsCode) const
	{
		return algo::replace_all_copy(jsCode, "%" + std::to_string((std::uint64_t)this) + "%", jsRef());
	}

	Three::Object3D* Three::Object3D::createObject3D()
	{
		return addObject3D(std::make_unique<Three::Object3D>(owner_));
	}

	Three::Object3D* Three::Object3D::addObject3D(std::unique_ptr<Object3D> obj)
	{
		if (obj)
		{
			incrementalJs_ << jsRef() << ".add(" << obj->jsRef() << ");\n";
			children_.push_back(std::move(obj));
			children_.back()->owner_ = owner_;

			syncToClient();

			return children_.back().get();
		}
		return nullptr;
	}

	Three::Object3D::Object3D(ThreeWidget* owner, std::string jsRef) 
		: owner_(owner)
		, jsRef_(jsRef)
	{

	}

	void Three::Scene::fullRenderOverride()
	{
		js_ << jsRef() << "= new THREE.Scene(); var scene = " << jsRef() << ";";
		js_ << R"( ;

scene.background = new THREE.Color( 0xAAAAAA );

camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 80000 );
camera.position.set( -600, 550, 1300 );
scene.add( camera );

// LIGHTS
ambientLight = new THREE.AmbientLight( 0x333333 );	// 0.2
light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );

scene.add( ambientLight );
scene.add( light );

scene._camera = camera;

)";


	}

	Three::Scene::Scene(ThreeWidget* owner, const std::string& ref)
		: Object3D(owner, ref)
	{		
	}

	void Three::Mesh::fullRenderOverride()
	{
		js_ << jsRef() << " = new THREE.Mesh();\n";
	}

	void Three::Teapot::fullRenderOverride()
	{
		js_ << R"(

var tess = -1;	// force initialization
var bBottom ;
var bLid;
var bBody;
var bFitLid;
var bNonBlinn;
var shading;
var wireMaterial, flatMaterial, gouraudMaterial, phongMaterial, texturedMaterial, reflectiveMaterial;

var teapotSize = 400;

var materialColor = new THREE.Color();
materialColor.setRGB( 1.0, 1.0, 1.0 );

phongMaterial = new THREE.MeshPhongMaterial( { color: materialColor, side: THREE.DoubleSide } );

var teapotGeometry = new THREE.TeapotBufferGeometry( teapotSize,
	128,
	true,
	true,
	true,
	true,
	true );

)" << jsRef() << R"( = new THREE.Mesh(
	teapotGeometry,
	phongMaterial
	);
)";
	}

}
