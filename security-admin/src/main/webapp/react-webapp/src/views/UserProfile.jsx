import React, { Component } from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { Form, Field } from "react-final-form";
import { getUserProfile, setUserProfile } from "Utils/appState";

const onSubmit = async (values) => {
  const userProps = getUserProfile();

  console.log("Form values : " + JSON.stringify(values));

  userProps.firstName = values.firstName;
  userProps.emailAddress = values.emailAddress;
  userProps.lastName = values.lastName;
  userProps.userSource = "";

  userProps.password = "";
  userProps.oldPassword = "";
  userProps.newPassword = "";
  userProps.reEnterPassword = "";

  console.log("Final Form data : " + JSON.stringify(userProps));

  try {
    const { fetchApi } = await import("Utils/fetchAPI");
    const profResp = await fetchApi({
      url: "users",
      method: "put",
      data: userProps,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(profResp);
  } catch (error) {
    console.error(`Error occurred while updating profile! ${error}`);
  }
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
            <Tab.Content className="user-profile-tab-content">
              <Form
                onSubmit={onSubmit}
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
                    <Tab.Pane eventKey="edit-basic-info">
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
                          >
                            <option value="ROLE_SYS_ADMIN">Admin</option>
                            <option value="ROLE_USER">User</option>
                            <option value="ROLE_ADMIN_AUDITOR">Auditor</option>
                          </Field>
                        </div>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="edit-password">
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
                      </div>
                    </Tab.Pane>
                    <div className="row form-actions">
                      <div className="col-md-9 offset-md-3">
                        <button className="btn btn-primary" type="submit">
                          Save
                        </button>
                        <button className="btn btn-secondary" type="button">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              />
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    );
  }
}

export default UserProfile;
