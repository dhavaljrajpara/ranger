import React, { Component } from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { Form, Field } from "react-final-form";
import { getUserProfile, setUserProfile } from "Utils/appState";
import UserFormComp from "Views/UserGroupRoleListing/users_details/UserFormComp";

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
      data: jsonData
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

class AddUserView extends Component {
  render() {
    const userProps = getUserProfile();
    return (
      <>
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
            <div className="user-details">
              <Tab.Content>
                <Tab.Pane eventKey="edit-basic-info">
                  <UserFormComp
                    isEditView={true}
                    userID={this.props.match.params.userID}
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
                      pristine
                    }) => (
                      <form onSubmit={handleSubmit}>
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
                            Password Confirm *
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
      </>
    );
  }
}

export default AddUserView;
