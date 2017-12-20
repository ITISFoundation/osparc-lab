#include "SessionWidget.h"

#include <Wt/WGridLayout.h>
#include <Wt/WVBoxLayout.h>
#include <Wt/WHBoxLayout.h>
#include <Wt/WTreeView.h>
#include <Wt/WText.h>
#include <Wt/WImage.h>
#include <Wt/WPushButton.h>
#include <Wt/WGLWidget.h>

#include "SceneWidget.h"
#include "NavigationBar.h"

#include "../threeview/ThreeWidget.h"

namespace sparc
{
	using namespace Wt;
	SessionWidget::SessionWidget(Wt::Auth::Login& login)
		: login_(login)
	{		
		auto topLayout = cpp14::make_unique<WGridLayout>();

		{
			auto navBar = topLayout->addWidget(cpp14::make_unique<NavigationBar>(), 0, 0, 1, 2);
			

			auto logout_button = std::make_unique<WPushButton>("Logout");
			logout_button->clicked().connect(this, [this]()
			{
				login_.logout();
			});
			navBar->addWidget(std::move(logout_button), AlignmentFlag::Right);

			//auto user = std::make_unique<WText>(login.user().identity("loginname"));
			//user->setTextAlignment(AlignmentFlag::Center);
			//user->setPadding(20);
			//navBar->addWidget(std::move(user), AlignmentFlag::Right | AlignmentFlag::Center);
		}

		{
			auto layout = std::make_unique<WHBoxLayout>();
			{
				auto treeView = layout->addWidget(cpp14::make_unique<WTreeView>(), 1);
			}

			{
				//auto sceneView = layout->addWidget(cpp14::make_unique<SceneWidget>(), 4);
				auto sceneView = layout->addWidget(cpp14::make_unique<ThreeWidget>(), 4);

				sceneView->addOrbitControl();
				sceneView->addTeapot();
			}

			layout->setResizable(0);

			topLayout->addLayout(std::move(layout), 1,0, 1, 2);
			topLayout->setRowStretch(1, 1);
		}

		{
			topLayout->addWidget(std::make_unique<WText>("oSparc - 0.1"), 2,0);
		}

		setLayout(std::move(topLayout));
	}
}
