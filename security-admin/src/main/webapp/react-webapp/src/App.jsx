import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import ErrorBoundary from "Views/ErrorBoundary";

const HomeComp = lazy(() => import("Views/Home"));
const LoginComp = lazy(() => import("Views/Login"));

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
            </Switch>
            {/* Add Footer component here. */}
          </Suspense>
        </Router>
      </ErrorBoundary>
    );
  }
}
