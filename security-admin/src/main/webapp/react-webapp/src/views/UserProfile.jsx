import React, { Component } from "react";
import { Button, Nav, Tab } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { toast } from "react-toastify";
import { getUserProfile, setUserProfile } from "Utils/appState";
import { commonBreadcrumb } from "../utils/XAUtils";

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
                    render={({ handleSubmit, form, submitting, values }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label text-right">
                            First Name *
                          </label>
                          <div className="col-sm-6">
                            <Field
                              name="firstName"
                              component="input"
                              type="text"
                              placeholder="First Name"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label text-right">
                            Last Name
                          </label>
                          <Field name="lastName">
                            {({ input, meta }) => (
                              <React.Fragment>
                                <div className="col-sm-6">
                                  <input
                                    {...input}
                                    type="text"
                                    className="form-control"
                                    placeholder="Last Name"
                                  />
                                </div>
                                {meta.error && meta.touched && (
                                  <div className="col-sm-2 invalid-field">
                                    {meta.error}
                                  </div>
                                )}
                              </React.Fragment>
                            )}
                          </Field>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label text-right">
                            Email Address
                          </label>
                          <div className="col-sm-6">
                            <Field
                              name="emailAddress"
                              component="input"
                              type="email"
                              placeholder="Email Address"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label text-right">
                            Select Role *
                          </label>
                          <div className="col-sm-6">
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
                          </div>
                        </div>

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
                    render={({ handleSubmit, form, submitting, values }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label text-right">
                            Old Password *
                          </label>
                          <Field name="oldPassword">
                            {({ input, meta }) => (
                              <React.Fragment>
                                <div className="col-sm-6">
                                  <input
                                    {...input}
                                    type="password"
                                    className="form-control"
                                    placeholder="Old Password"
                                  />
                                </div>
                                {meta.error && meta.touched && (
                                  <div className="col-sm-2 invalid-field">
                                    {meta.error}
                                  </div>
                                )}
                              </React.Fragment>
                            )}
                          </Field>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label text-right">
                            New Password *
                          </label>
                          <Field name="newPassword">
                            {({ input, meta }) => (
                              <React.Fragment>
                                <div className="col-sm-6">
                                  <input
                                    {...input}
                                    type="password"
                                    className="form-control"
                                    placeholder="New Password"
                                  />
                                </div>
                                {meta.error && meta.touched && (
                                  <div className="col-sm-2 invalid-field">
                                    {meta.error}
                                  </div>
                                )}
                              </React.Fragment>
                            )}
                          </Field>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label text-right">
                            Re-enter New Password *
                          </label>
                          <Field name="reEnterPassword">
                            {({ input, meta }) => (
                              <React.Fragment>
                                <div className="col-sm-6">
                                  <input
                                    {...input}
                                    type="password"
                                    className="form-control"
                                    placeholder="Re-enter New Password"
                                  />
                                </div>
                                {meta.error && meta.touched && (
                                  <div className="col-sm-2 invalid-field">
                                    {meta.error}
                                  </div>
                                )}
                              </React.Fragment>
                            )}
                          </Field>
                        </div>
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
