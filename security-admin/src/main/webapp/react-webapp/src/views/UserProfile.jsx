import React, { Component } from "react";
import { Button, Nav, Tab, Row, Col } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { toast } from "react-toastify";
import { getUserProfile, setUserProfile } from "Utils/appState";
import { commonBreadcrumb } from "../utils/XAUtils";
import { scrollToError } from "../components/CommonComponents";

class UserProfile extends Component {
  updateUserInfo = async (values) => {
    const userProps = getUserProfile();

    userProps.firstName = values.firstName;
    userProps.emailAddress = values.emailAddress;
    userProps.lastName = values.lastName;

    try {
      const { fetchApi } = await import("Utils/fetchAPI");
      const profResp = await fetchApi({
        url: "users",
        method: "put",
        data: userProps
      });
      setUserProfile(profResp.data);
      toast.success("Successfully updated user profile");
      this.props.history.push("/");
    } catch (error) {
      console.error(`Error occurred while updating user profile! ${error}`);
    }
  };

  updatePassword = async (values) => {
    const userProps = getUserProfile();

    let jsonData = {};
    jsonData["emailAddress"] = "";
    jsonData["loginId"] = userProps.loginId;
    jsonData["oldPassword"] = values.oldPassword;
    jsonData["updPassword"] = values.newPassword;

    try {
      const { fetchApi } = await import("Utils/fetchAPI");
      const passwdResp = await fetchApi({
        url: "users/" + userProps.id + "/passwordchange",
        method: "post",
        data: jsonData
      });
      toast.success("Successfully updated user password");
      this.props.history.push("/");
    } catch (error) {
      console.error(`Error occurred while updating user password! ${error}`);
    }
  };

  validatePasswordForm = (values) => {
    const errors = {};

    if (!values.oldPassword) {
      errors.oldPassword = "Required";
    }

    if (!values.newPassword) {
      errors.newPassword = "Required";
    }

    if (!values.reEnterPassword) {
      errors.reEnterPassword = "Required";
    } else if (values.newPassword !== values.reEnterPassword) {
      errors.reEnterPassword = "Must match";
    }

    return errors;
  };

  validateUserForm = (values) => {
    const errors = {};
    if (!values.firstName) {
      errors.firstName = "Required";
    }
    if (!values.lastName) {
      errors.lastName = "Required";
    }

    return errors;
  };

  render() {
    const userProps = getUserProfile();
    return (
      <div>
        {commonBreadcrumb(["UserProfile"])}
        <h4 className="wrap-header bold">User Profile</h4>
        <div className="wrap">
          <Tab.Container transition={false} defaultActiveKey="edit-basic-info">
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="edit-basic-info">
                  <i className="fa-fw fa fa-edit bigger-125"></i>Basic Info
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="edit-password">
                  <i className="fa-fw fa fa-key bigger-125"></i>Change Password
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <div className="user-profile">
              <Tab.Content>
                <Tab.Pane eventKey="edit-basic-info">
                  <Form
                    onSubmit={this.updateUserInfo}
                    validate={this.validateUserForm}
                    initialValues={{
                      firstName: userProps.firstName,
                      lastName: userProps.lastName,
                      emailAddress: userProps.emailAddress,
                      userRoleList: userProps.userRoleList[0]
                    }}
                    render={({
                      handleSubmit,
                      form,
                      submitting,
                      values,
                      invalid,
                      errors
                    }) => (
                      <form
                        onSubmit={(event) => {
                          if (invalid) {
                            let selector =
                              document.getElementById("isError") ||
                              document.querySelector(
                                `input[name=${Object.keys(errors)[0]}]`
                              );
                            scrollToError(selector);
                          }
                          handleSubmit(event);
                        }}
                      >
                        <Field name="firstName">
                          {({ input, meta }) => (
                            <Row className="form-group">
                              <Col xs={3}>
                                <label className="form-label pull-right">
                                  First Name *
                                </label>
                              </Col>
                              <Col xs={4}>
                                <input
                                  {...input}
                                  type="text"
                                  name="firstName"
                                  placeholder="First Name"
                                  id={
                                    meta.error && meta.touched
                                      ? "isError"
                                      : "firstName"
                                  }
                                  className={
                                    meta.error && meta.touched
                                      ? "form-control border-danger"
                                      : "form-control"
                                  }
                                />
                                {meta.error && meta.touched && (
                                  <span className="invalid-field">
                                    {meta.error}
                                  </span>
                                )}
                              </Col>
                            </Row>
                          )}
                        </Field>
                        <Field name="lastName">
                          {({ input, meta }) => (
                            <Row className="form-group">
                              <Col xs={3}>
                                <label className="form-label pull-right">
                                  Last Name
                                </label>
                              </Col>
                              <Col xs={4}>
                                <input
                                  {...input}
                                  type="text"
                                  name="lastName"
                                  placeholder="Last Name"
                                  id={
                                    meta.error && meta.touched
                                      ? "isError"
                                      : "lastName"
                                  }
                                  className={
                                    meta.error && meta.touched
                                      ? "form-control border-danger"
                                      : "form-control"
                                  }
                                />
                                {meta.error && meta.touched && (
                                  <span className="invalid-field">
                                    {meta.error}
                                  </span>
                                )}
                              </Col>
                            </Row>
                          )}
                        </Field>
                        <Field name="emailAddress">
                          {({ input, meta }) => (
                            <Row className="form-group">
                              <Col xs={3}>
                                <label className="form-label pull-right">
                                  Email Address
                                </label>
                              </Col>
                              <Col xs={4}>
                                <input
                                  {...input}
                                  name="emailAddress"
                                  type="email"
                                  placeholder="Email Address"
                                  id={
                                    meta.error && meta.touched
                                      ? "isError"
                                      : "emailAddress"
                                  }
                                  className={
                                    meta.error && meta.touched
                                      ? "form-control border-danger"
                                      : "form-control"
                                  }
                                />
                                {meta.error && meta.touched && (
                                  <span className="invalid-field">
                                    {meta.error}
                                  </span>
                                )}
                              </Col>
                            </Row>
                          )}
                        </Field>

                        <Row className="form-group">
                          <Col xs={3}>
                            {" "}
                            <label className="form-label pull-right">
                              Select Role *
                            </label>
                          </Col>
                          <Col xs={4}>
                            <Field
                              name="userRoleList"
                              component="select"
                              className="form-control"
                              disabled
                            >
                              <option value="ROLE_SYS_ADMIN">Admin</option>
                              <option value="ROLE_USER">User</option>
                              <option value="ROLE_ADMIN_AUDITOR">
                                Auditor
                              </option>
                            </Field>
                          </Col>
                        </Row>

                        <div className="row form-actions">
                          <div className="col-md-9 offset-md-3">
                            <Button
                              variant="primary"
                              type="submit"
                              size="sm"
                              disabled={submitting}
                            >
                              Save
                            </Button>
                            <Button
                              variant="secondary"
                              type="button"
                              size="sm"
                              onClick={() => this.props.history.push("/")}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </form>
                    )}
                  />
                </Tab.Pane>
              </Tab.Content>
              <Tab.Content>
                <Tab.Pane eventKey="edit-password">
                  <Form
                    onSubmit={this.updatePassword}
                    validate={this.validatePasswordForm}
                    render={({
                      handleSubmit,
                      form,
                      submitting,
                      values,
                      invalid,
                      errors
                    }) => (
                      <form
                        onSubmit={(event) => {
                          if (invalid) {
                            let selector =
                              document.getElementById("isError") ||
                              document.querySelector(
                                `input[name=${Object.keys(errors)[0]}]`
                              );
                            scrollToError(selector);
                          }
                          handleSubmit(event);
                        }}
                      >
                        <Field name="oldPassword">
                          {({ input, meta }) => (
                            <Row className="form-group">
                              <Col xs={3}>
                                <label className="form-label pull-right">
                                  Old Password *
                                </label>
                              </Col>
                              <Col xs={4}>
                                <input
                                  {...input}
                                  type="password"
                                  autoComplete="off"
                                  name="oldPassword"
                                  placeholder="Old Password"
                                  id={
                                    meta.error && meta.touched
                                      ? "isError"
                                      : "oldPassword"
                                  }
                                  className={
                                    meta.error && meta.touched
                                      ? "form-control border-danger"
                                      : "form-control"
                                  }
                                />
                                {meta.error && meta.touched && (
                                  <span className="invalid-field">
                                    {meta.error}
                                  </span>
                                )}
                              </Col>
                            </Row>
                          )}
                        </Field>
                        <Field name="newPassword">
                          {({ input, meta }) => (
                            <Row className="form-group">
                              <Col xs={3}>
                                <label className="form-label pull-right">
                                  New Password *
                                </label>
                              </Col>
                              <Col xs={4}>
                                <input
                                  {...input}
                                  type="password"
                                  autoComplete="off"
                                  name="newPassword"
                                  placeholder="New Password"
                                  id={
                                    meta.error && meta.touched
                                      ? "isError"
                                      : "newPassword"
                                  }
                                  className={
                                    meta.error && meta.touched
                                      ? "form-control border-danger"
                                      : "form-control"
                                  }
                                />
                                {meta.error && meta.touched && (
                                  <span className="invalid-field">
                                    {meta.error}
                                  </span>
                                )}
                              </Col>
                            </Row>
                          )}
                        </Field>
                        <Field name="reEnterPassword">
                          {({ input, meta }) => (
                            <Row className="form-group">
                              <Col xs={3}>
                                <label className="form-label pull-right">
                                  Re-enter New Password *
                                </label>
                              </Col>
                              <Col xs={4}>
                                <input
                                  {...input}
                                  type="password"
                                  autoComplete="off"
                                  name="reEnterPassword"
                                  placeholder="Re-enter New Password"
                                  id={
                                    meta.error && meta.touched
                                      ? "isError"
                                      : "reEnterPassword"
                                  }
                                  className={
                                    meta.error && meta.touched
                                      ? "form-control border-danger"
                                      : "form-control"
                                  }
                                />
                                {meta.error && meta.touched && (
                                  <span className="invalid-field">
                                    {meta.error}
                                  </span>
                                )}
                              </Col>
                            </Row>
                          )}
                        </Field>
                        <div className="row form-actions">
                          <div className="col-md-9 offset-md-3">
                            <Button
                              variant="primary"
                              type="submit"
                              size="sm"
                              disabled={submitting}
                            >
                              Save
                            </Button>
                            <Button
                              variant="secondary"
                              type="button"
                              size="sm"
                              onClick={() => this.props.history.push("/")}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </form>
                    )}
                  />
                </Tab.Pane>
              </Tab.Content>
            </div>
          </Tab.Container>
        </div>
      </div>
    );
  }
}

export default UserProfile;
