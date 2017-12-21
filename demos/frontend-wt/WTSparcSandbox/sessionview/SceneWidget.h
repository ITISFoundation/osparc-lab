#pragma once

#include <Wt/WGLWidget.h>

namespace sparc
{
	/// 
	class SceneWidget : public Wt::WGLWidget
	{
	public:

		SceneWidget();

	protected:

		virtual void initializeGL() override;
		virtual void resizeGL(int width, int height) override;
		virtual void paintGL() override;
		virtual void updateGL() override;

	private:
		bool useBinaryBuffers_ = true;
	};
}
