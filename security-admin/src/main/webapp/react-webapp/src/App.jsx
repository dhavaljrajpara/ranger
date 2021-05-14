import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import ErrorBoundary from "Views/ErrorBoundary";

const HeaderComp = lazy(() => import("Views/Header"));
const HomeComp = lazy(() => import("Views/Home"));
const LoginComp = lazy(() => import("Views/Login"));
const UserProfileComp = lazy(() => import("Views/UserProfile"));

export default class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            {/* Add Header / Sidebar component here. */}
            <HeaderComp />
            <section className="container-fluid">
              <section id="r_content">
                <Switch>
                  <Route exact path="/" component={HomeComp} />
                  <Route exact path="/login" component={LoginComp} />
                  <Route
                    exact
                    path="/userprofile"
                    component={UserProfileComp}
                  />
                </Switch>
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
