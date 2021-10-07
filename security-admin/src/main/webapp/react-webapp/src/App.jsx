import React, { Suspense, lazy, Component } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import ErrorBoundary from "Views/ErrorBoundary";

import { Loader } from "../src/components/CommonComponents";
import history from "Utils/history";
import { getUserProfile, setUserProfile } from "Utils/appState";

const HeaderComp = lazy(() => import("Views/Header"));
const HomeComp = lazy(() => import("Views/Home"));
const UserProfileComp = lazy(() => import("Views/UserProfile"));
const ZoneListingComp = lazy(() => import("Views/SecurityZone/ZoneListing"));

function AuthRoute({ path, component: Comp, userProfile, ...rest }) {
  if (!getUserProfile()) {
    // return <Redirect to="/signin" />;
    window.location.replace("login.html");
    return;
  }
  return (
    <Route {...rest} exact render={(routeProps) => <Comp {...routeProps} />} />
  );
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
    };
  }

  componentDidMount() {
    this.fetchUserProfile();
  }

  fetchUserProfile = async () => {
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      const profResp = await fetchApi({
        url: "users/profile"
      });
      await fetchCSRFConf();
      setUserProfile(profResp.data);
    } catch (error) {
      setUserProfile(null);
      console.error(
        `Error occurred while fetching profile or CSRF headers! ${error}`
      );
    }
    this.setState({
      loader: false,
    });
  };

  render() {
    const userProfile = getUserProfile();
    const defaultProps = { userProfile };
    return (
      <ErrorBoundary>
        <Router history={history}>
          <Suspense fallback={<Loader />}>
            {/* Add Header / Sidebar component here. */}
            {!this.state.loader && <HeaderComp />}
            <section className="container-fluid">
              <section id="ranger-content">
                {this.state.loader ? (
                  <Loader />
                ) : (
                  <Switch>
                    <AuthRoute
                      exact
                      path="/"
                      component={HomeComp}
                      userProfile={userProfile}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/userprofile"
                      component={UserProfileComp}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/zones"
                      component={ZoneListingComp}
                      {...defaultProps}
                    />
                  </Switch>
                )}
              </section>
              <footer>
                <div className="main-footer">
                  <div className="pull-left copy-right-text">
                    <p className="text-left">
                      <a
                        target="_blank"
                        href="http://www.apache.org/licenses/LICENSE-2.0"
                        rel="noopener noreferrer"
                      >
                        Licensed under the Apache License, Version 2.0
                      </a>
                    </p>
                  </div>
                </div>
              </footer>
            </section>
          </Suspense>
        </Router>
      </ErrorBoundary>
    );
  }
}
