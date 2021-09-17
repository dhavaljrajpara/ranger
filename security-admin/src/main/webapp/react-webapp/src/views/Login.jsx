import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Field } from "react-final-form";
import { Button } from "react-bootstrap";

import { getUserProfile } from "Utils/appState";
import rangerLogo from "Images/ranger_logo.png";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSubmit = async (values) => {
    console.log(values)
    let bodyFormData = new FormData();
    bodyFormData.append('username', values.userName);
    bodyFormData.append('password', values.password);
    try {
      const { fetchApi } = await import("Utils/fetchAPI");
      const profResp = await fetchApi({
        url: "login",
        baseURL: '',
        method:"post",
        data: bodyFormData,
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });
      this.props.history.push("/userprofile")
    } catch (error) {
      console.error(
        `Error occurred while login! ${error}`
      );
    }
  };

  render() {
    const userProfile = getUserProfile();
    if (userProfile) {
      return <Redirect to="/" />;
    }
    return (
      <div  className="login">
        <section id="signin-container">
          <div className="l-logo">
              <img src={rangerLogo}/>
            </div>
            <Form
             onSubmit={this.onSubmit}
             render={({ handleSubmit, form, submitting, pristine, values }) => (
              <form onSubmit={handleSubmit}>
                <div className="fields">
                  <label><i className="fa fa-user"></i> Username:</label>
                  <Field
                    name="userName"
                    component="input"
                    type="text"
                    placeholder="User Name"
                  />
                  <label><i className="fa fa-user"></i> Password:</label>
                  <Field
                    name="password"
                    component="input"
                    type="Password"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <Button type="submit" block variant="primary" id="signIn" disabled={submitting}>
                    Sign In
                  </Button>
                </div>
              </form>
             )}
            >
            </Form>
        </section>
      </div>
    );
  }
}

export default Login;
