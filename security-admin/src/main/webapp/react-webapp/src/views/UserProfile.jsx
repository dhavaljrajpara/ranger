import React, { Component } from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { Form, Field } from "react-final-form";
import { getUserProfile, setUserProfile } from "Utils/appState";

const updateUserInfo = async (values) => {
  const userProps = getUserProfile();

  userProps.firstName = values.firstName;
  userProps.emailAddress = values.emailAddress;
  userProps.lastName = values.lastName;

  try {
    const { fetchApi } = await import("Utils/fetchAPI");
    const profResp = await fetchApi({
      url: "users",
      method: "put",
      data: userProps,
    });
    console.log(profResp.status);
    setUserProfile(profResp.data);
    this.props.history.push("/");
  } catch (error) {
    console.error(`Error occurred while updating user profile! ${error}`);
  }
};

const updatePassword = async (values) => {
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
      data: jsonData,
    });
  } catch (error) {
    console.error(`Error occurred while updating user password! ${error}`);
  }
};

const Error = ({ name }) => (
  <Field name={name}>
    {({ meta: { error, touched } }) => {
      return error && touched ? <div className="col-sm-2">{error}</div> : null;
    }}
  </Field>
);

const validateForm = (values) => {
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

class UserProfile extends Component {
  render() {
    const userProps = getUserProfile();
    return (
      <div>
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
                    onSubmit={updateUserInfo}
                    initialValues={{
                      firstName: userProps.firstName,
                      lastName: userProps.lastName,
                      emailAddress: userProps.emailAddress,
                      userRoleList: userProps.userRoleList[0],
                    }}
                    render={({
                      handleSubmit,
                      form,
                      submitting,
                      pristine,
                      values,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">
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
                          <label className="col-sm-2 col-form-label">
                            Last Name
                          </label>
                          <div className="col-sm-6">
                            <Field
                              name="lastName"
                              component="input"
                              type="text"
                              placeholder="Last Name"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">
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
                          <label className="col-sm-2 col-form-label">
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
                              disabled={submitting}
                            >
                              Save
                            </Button>
                            <Button
                              variant="secondary"
                              type="button"
                              onClick={form.reset}
                              disabled={submitting || pristine}
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
                    onSubmit={updatePassword}
                    validate={validateForm}
                    render={({
                      handleSubmit,
                      form,
                      submitting,
                      values,
                      pristine,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">
                            Old Password *
                          </label>
                          <div className="col-sm-6">
                            <Field
                              name="oldPassword"
                              component="input"
                              type="password"
                              placeholder="Old Password"
                              className="form-control"
                            />
                          </div>
                          <Error name="oldPassword" />
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">
                            New Password *
                          </label>
                          <div className="col-sm-6">
                            <Field
                              name="newPassword"
                              component="input"
                              type="password"
                              placeholder="New Password"
                              className="form-control"
                            />
                          </div>
                          <Error name="newPassword" />
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">
                            Re-enter New Password *
                          </label>
                          <div className="col-sm-6">
                            <Field
                              name="reEnterPassword"
                              component="input"
                              type="password"
                              placeholder="Re-enter New Password"
                              className="form-control"
                            />
                          </div>
                          <Error name="reEnterPassword" />
                        </div>
                        <div className="row form-actions">
                          <div className="col-md-9 offset-md-3">
                            <Button
                              variant="primary"
                              type="submit"
                              disabled={submitting}
                            >
                              Save
                            </Button>
                            <Button
                              variant="secondary"
                              type="button"
                              onClick={form.reset}
                              disabled={submitting || pristine}
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
