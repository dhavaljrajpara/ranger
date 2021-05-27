import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { getUserProfile } from "Utils/appState";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const userProfile = getUserProfile();
    if (userProfile) {
      return <Redirect to="/" />;
    }
    return <h1>Login Page</h1>;
  }
}

export default Login;
