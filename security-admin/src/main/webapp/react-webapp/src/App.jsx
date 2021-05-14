import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";

import ErrorBoundary from "Views/ErrorBoundary";

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
            <Switch>
              <Route exact path="/" component={HomeComp} />
              <Route exact path="/login" component={LoginComp} />
              <Route exact path="/userprofile" component={UserProfileComp} />
            </Switch>
            {/* Add Footer component here. */}
          </Suspense>
        </Router>
      </ErrorBoundary>
    );
  }
}
