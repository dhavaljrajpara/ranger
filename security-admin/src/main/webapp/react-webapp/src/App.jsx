import React, { Suspense, lazy, Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import ErrorBoundary from "Views/ErrorBoundary";
import { Loader } from "../src/components/CommonComponents";

const HeaderComp = lazy(() => import("Views/Header"));
const HomeComp = lazy(() => import("Views/Home"));
const LoginComp = lazy(() => import("Views/Login"));
const UserProfileComp = lazy(() => import("Views/UserProfile"));

function AuthRoute({ path, component: Comp, userProfile, ...rest }) {
  if (!userProfile) {
    return <Redirect to="/login" />;
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
      userProfile: null
    };
  }

  componentDidMount() {
    this.fetchUserProfile();
  }

  fetchUserProfile = async () => {
    let userProfile = null;
    try {
      const { fetchApi } = await import("Utils/fetchAPI");
      const profResp = await fetchApi({
        url: "users/profile"
      });
      userProfile = profResp.data;
    } catch (error) {
      console.error(`Error occurred while fetching profile! ${error}`);
    }
    this.setState({
      loader: false,
      userProfile: userProfile
    });
  };

  render() {
    const currentPath = window.location.pathname;
    return (
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            {/* Add Header / Sidebar component here. */}
            {!this.state.loader && <HeaderComp />}
            <section className="container-fluid">
              <section id="r_content">
                {this.state.loader ? (
                  <Loader />
                ) : (
                  <Switch>
                    <AuthRoute
                      exact
                      path="/"
                      component={HomeComp}
                      userProfile={this.state.userProfile}
                    />
                    <Route exact path="/login" component={LoginComp} />
                    <AuthRoute
                      path="/userprofile"
                      component={UserProfileComp}
                      userProfile={this.state.userProfile}
                    />
                  </Switch>
                )}
              </section>
              <footer>
                <div id="main-footer">
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
