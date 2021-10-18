import React from "react";
import ReactDOM from "react-dom";
import { Form, Field } from "react-final-form";
import { Button } from "react-bootstrap";

import rangerLogo from "Images/ranger_logo.png";

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.min.css";
import "./styles/login.css";

const LoginComp = () => {
  const onSubmit = async (values) => {
    let data = {
      username: values.userName,
      password: values.password
    };
    const formData = Object.keys(data)
      .map((key) => `${key}=${encodeURIComponent(data[key])}`)
      .join("&");
    try {
      const { fetchApi } = await import("Utils/fetchAPI");
      const loginResp = await fetchApi({
        url: "login",
        baseURL: "",
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      let url = "/";
      if (location.hash.length > 2) {
        url += location.hash;
      }
      window.location.replace(url);
    } catch (error) {
      console.error(`Error occurred while login! ${error}`);
    }
  };

  return (
    <div className="login">
      <section id="signin-container">
        <div className="l-logo">
          <img className="rangerlogo" src={rangerLogo} />
        </div>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit}>
              <div className="fields">
                <label>
                  <i className="fa fa-user"></i> Username:
                </label>
                <Field
                  name="userName"
                  component="input"
                  type="text"
                  placeholder="User Name"
                />
                <label>
                  <i className="fa fa-user"></i> Password:
                </label>
                <Field
                  name="password"
                  component="input"
                  type="Password"
                  placeholder="Password"
                />
              </div>
              <div>
                <Button
                  type="submit"
                  block
                  variant="primary"
                  id="signIn"
                  disabled={submitting}
                >
                  Sign In
                </Button>
              </div>
            </form>
          )}
        ></Form>
      </section>
    </div>
  );
};
ReactDOM.render(<LoginComp />, document.getElementById("app"));
