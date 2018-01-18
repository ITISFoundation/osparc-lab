#include "SceneWidget.h"

#include <Wt/WEnvironment.h>
#include <Wt/WApplication.h>

namespace sparc
{
	using namespace Wt;

	SceneWidget::SceneWidget()
	{
		// check if binary buffers are enabled
		// i.e. if your application url is "webgl" on localhost:8080, use this to enable binary buffers:
		// localhost:8080/webgl?binaryBuffers
		// query given URL arguments...
		Http::ParameterValues pv = wApp->environment().getParameterValues("binaryBuffers");
		useBinaryBuffers_ = false;
		if (!pv.empty())
			useBinaryBuffers_ = true;

	}

	void SceneWidget::initializeGL()
	{
		clearColor(0, 0, 0, 1);

		// Reset Z-buffer, enable Z-buffering
		clearDepth(1);
		enable(DEPTH_TEST);
		depthFunc(LEQUAL);
	}

	void SceneWidget::resizeGL(int width, int height)
	{

	}

	void SceneWidget::paintGL()
	{
		// Clear color an depth buffers
		clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
	}

	void SceneWidget::updateGL()
	{

	}
}
