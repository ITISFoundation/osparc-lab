#pragma once

#include <Wt/WContainerWidget.h>
#include <Wt/Auth/Login.h>


namespace sparc
{
	/// 
	class SessionWidget : public Wt::WContainerWidget
	{
	public:

		explicit SessionWidget(Wt::Auth::Login& login);

	protected:
		Wt::Auth::Login& login_;
	};
}
