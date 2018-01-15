#pragma once

#include <memory>

#include <Wt/WInteractWidget.h>

namespace sparc
{
	class ThreeWidget;

	namespace Three
	{
		/// Represents a generic scene node in a Three scene.
		class Object3D
		{
		public:
			/// Fully qualified reference access to this instance in Js.
			std::string jsRef() const;

			/// Pending client-side JS code stream.
			std::ostringstream & js() { return js_; }

			/// Flushes full JS code into string, resolves references.
			std::string fullRender();

			std::string incrementalRender();

			/// Creates a new child node.
			Object3D* createObject3D();

			/// Adds a child node.
			Object3D* addObject3D(std::unique_ptr<Object3D> obj);

			explicit Object3D(ThreeWidget* owner = nullptr, std::string jsRef = "");
			virtual ~Object3D() = default;

		protected:
			friend class ThreeWidget;

			void setJsRef(std::string ref) { jsRef_ = std::move(ref); }

			virtual void fullRenderOverride();

			void syncToClient();

			/// Replaces internal references by Js reference.
			std::string resolveJsRef(const std::string jsCode) const;

			ThreeWidget* owner_ = nullptr;
			
			/// Pending client-side JS code.
			std::ostringstream js_;
			std::ostringstream incrementalJs_;

			std::vector<std::unique_ptr<Object3D>> children_;

		private:
			Object3D(const Object3D&) = delete;
			void operator=(const Object3D&) = delete;
			mutable std::string jsRef_;
		};

		/// Root Three scene node.
		class Scene : public Object3D
		{
		public:

		protected:
			virtual void fullRenderOverride() override;

		//private:
		public:
			friend class ThreeWidget;
			Scene(ThreeWidget* owner, const std::string& ref);
		};

		// https://threejs.org/docs/index.html#api/objects/Mesh
		class Mesh : public Object3D
		{
		public:
			Mesh() = default;

			virtual void fullRenderOverride() override;
		};

		/// Simple teapot for testing.
		class Teapot : public Mesh
		{
		public:
			Teapot() = default;

			virtual void fullRenderOverride() override;
		};
	}


	/** Attempts to create a simple wrapper around client-side Three.js library.
	 **/
	class ThreeWidget : public Wt::WInteractWidget
	{
	public:
		ThreeWidget();
		~ThreeWidget() = default;

		/** Client-side initializers and updaters.
		 ** 
		 ** Override to define and update scene.
		**/
		virtual void initializeScene() {}
		virtual void updateScene() {}

		void addOrbitControl();

		void addTeapot();

		/// Creates a new fully qualified Js reference.
		std::string createJsRef();

		/// Pending client-side JS code stream.
		std::ostringstream & js() { return js_; }

		virtual Wt::DomElementType domElementType() const override;
		void resize(const Wt::WLength &width, const Wt::WLength &height) override;

	protected:
		virtual Wt::DomElement *createDomElement(Wt::WApplication *app) override;
		virtual void render(Wt::WFlags<Wt::RenderFlag> flags) override;
		virtual void layoutSizeChanged(int width, int height) override;


		std::set<std::string> jsRefs_;

		Wt::JSlot resizeSlot_;

		/// Default scene root container.
		Three::Scene scene_;

		std::ostringstream js_;
	};
}
