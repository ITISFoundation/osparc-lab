/*
 * Copyright (C) 2010 Emweb bvba, Kessel-Lo, Belgium.
 *
 * See the LICENSE file for terms of use.
 */
#include <Wt/WApplication.h>
#include <Wt/WContainerWidget.h>
#include <Wt/WServer.h>

#include <Wt/Auth/AuthModel.h>
#include <Wt/Auth/PasswordService.h>
#include <Wt/Auth/RegistrationModel.h>
#include <Wt/WBootstrapTheme.h>

#include <Wt/WFitLayout.h>
#include <Wt/WVBoxLayout.h>
#include <Wt/WHBoxLayout.h>

#include "QRAuthWidget.h"
#include "model/Session.h"
#include "model/QRTokenDatabase.h"
#include "../sessionview/SessionWidget.h"

using namespace Wt;

class AuthApplication : public WApplication
{
public:
	AuthApplication(const WEnvironment& env)
		: WApplication(env),
		session_(appRoot() + "auth.db")
	{
		/*
		 * For better support for a mobile device. Note this requires
		 * progressive bootstrap being enabled (see wt_config.xml).
		 */
		addMetaHeader(MetaHeaderType::Meta,
			"width=device-width", "initial-scale=1", "maximum-scale=1");

		// setCssTheme("polished");
		setTheme(std::make_shared<WBootstrapTheme>());

		root()->setStyleClass("maindiv");

		session_.login().changed().connect(this, &AuthApplication::authEvent);

		// useStyleSheet("css/style.css");
		messageResourceBundle().use(appRoot() + "templates");

		topLayout_ = root()->setLayout(std::make_unique<WVBoxLayout>());

		createWelcomeUI();
	}

	std::unique_ptr<QRAuthWidget> createAuthWidget()
	{
		auto model = cpp14::make_unique<Auth::AuthModel>(Session::auth(), session_.users());
		model->addPasswordAuth(&Session::passwordAuth());
		model->addOAuth(Session::oAuth());

		auto authWidget = cpp14::make_unique<QRAuthWidget>(session_.login());
		authWidget->setModel(std::move(model));
		authWidget->setRegistrationEnabled(true);
		authWidget->configureQRAuth(Session::qrAuth(), session_.qrTokenDatabase());

		authWidget->processEnvironment();

		return authWidget;
	}

	void createLoggedInUI()
	{
		if (authWidget_)
			authWidget_->hide();

		// Build logged in layout
		
		sessionWidget_ = topLayout_->addWidget(cpp14::make_unique<sparc::SessionWidget>(session_.login()), 1);

		refresh();
	}

	void createWelcomeUI()
	{
		if (sessionWidget_)
		{
			sessionWidget_->removeFromParent();
			sessionWidget_ = nullptr;
		}

		if (!authWidget_)
		{
			auto authWidget = createAuthWidget();
			authWidget_ = topLayout_->addWidget(std::move(authWidget));			
		}
		else
		{
			authWidget_->show();
		}
	}

	void authEvent()
	{
		if (session_.login().loggedIn())
		{
			log("notice") << "User " << session_.login().user().id()
				<< " logged in.";

			createLoggedInUI();
		}
		else
		{
			log("notice") << "User logged out.";

			createWelcomeUI();
		}
	}

private:
	Session session_;
	QRAuthWidget* authWidget_ = nullptr;
	WVBoxLayout* topLayout_ = nullptr;
	sparc::SessionWidget* sessionWidget_ = nullptr;
};

std::unique_ptr<WApplication> createApplication(const WEnvironment& env)
{
	return cpp14::make_unique<AuthApplication>(env);
}

int main(int argc, char **argv)
{
	try {
		WServer server(argc, argv, WTHTTP_CONFIGURATION);

		server.addEntryPoint(EntryPointType::Application, &createApplication);

		Session::configureAuth();

		server.run();
	}
	catch (WServer::Exception& e) {
		std::cerr << e.what() << std::endl;
	}
	catch (std::exception &e) {
		std::cerr << "exception: " << e.what() << std::endl;
	}
}
