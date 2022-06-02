import React, { Component } from "react";
import { Tab, Button, Nav } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { getUserProfile, setUserProfile } from "Utils/appState";
import UserFormComp from "Views/UserGroupRoleListing/users_details/UserFormComp";
import { Loader } from "Components/CommonComponents";
import { fetchApi } from "Utils/fetchAPI";
import { UserTypes, RegexValidation } from "Utils/XAEnums";
import { commonBreadcrumb } from "../../../utils/XAUtils";
import { toast } from "react-toastify";

const Error = ({ name }) => (
  <Field name={name}>
    {({ meta: { error, touched } }) => {
      return error && touched ? <div className="col-sm-2">{error}</div> : null;
    }}
  </Field>
);

const validateForm = (values) => {
  const errors = {};
  if (!values.newPassword) {
    errors.newPassword = "Required";
  } else {
    if (!RegexValidation.PASSWORD.regexExpression.test(values.newPassword)) {
      errors.newPassword = RegexValidation.PASSWORD.message;
    }
  }
  if (!values.reEnterPassword) {
    errors.reEnterPassword = "Required";
  } else if (values.newPassword !== values.reEnterPassword) {
    errors.reEnterPassword = "Password must be match with new password";
  }
  return errors;
};

class AddUserView extends Component {
  constructor(props) {
    super(props);
    this.state = { loader: true };
  }
  handleSubmit = async (values) => {
    const userProps = getUserProfile();

    let userDetails = {};
    userDetails.password = values.newPassword;
    userDetails = {
      ...this.state.userInfo,
      ...userDetails
    };
    try {
      const passwdResp = await fetchApi({
        url: `xusers/secure/users/${this.props.match.params.userID}`,
        method: "PUT",
        data: userDetails
      });
      toast.success("User password change successfully!!");
      this.props.history.push("/users/usertab");
    } catch (error) {
      console.error(`Error occurred while updating user password! ${error}`);
    }
  };
  fetchUserData = async (userID) => {
    let userRespData;
    try {
      userRespData = await fetchApi({
        url: "xusers/secure/users/" + userID
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Zones or CSRF headers! ${error}`
      );
    }
    this.setState({
      userInfo: userRespData.data,
      loader: false
    });
  };
  componentDidMount = () => {
    this.fetchUserData(this.props.match.params.userID);
  };
  closeForm = () => {
    this.props.history.push("/users/usertab");
  };
  render() {
    const userProps = getUserProfile();
    return this.state.loader ? (
      <Loader />
    ) : this.state.userInfo.userSource == UserTypes.USER_EXTERNAL.value ? (
      <UserFormComp
        isEditView={true}
        userID={this.props.match.params.userID}
        userInfo={this.state.userInfo}
      />
    ) : (
      <>
        {commonBreadcrumb(
          ["Users", "UserEdit"],
          this.props.match.params.userID
        )}
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
                    userInfo={this.state.userInfo}
                  />
                </Tab.Pane>
              </Tab.Content>
              <Tab.Content>
                <Tab.Pane eventKey="edit-password">
                  <>
                    <h4 className="wrap-header bold">User Password Change</h4>
                    <Form
                      onSubmit={this.handleSubmit}
                      validate={validateForm}
                      render={({
                        handleSubmit,
                        form,
                        submitting,
                        values,
                        pristine
                      }) => (
                        <div className="wrap">
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
                                <Error name="newPassword" />
                              </div>
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
                                <Error name="reEnterPassword" />
                              </div>
                            </div>
                            <div className="row form-actions">
                              <div className="col-md-9 offset-md-3">
                                <Button
                                  variant="primary"
                                  type="submit"
                                  disabled={submitting}
                                  size="sm"
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="secondary"
                                  type="button"
                                  onClick={() => {
                                    form.reset;
                                    this.closeForm();
                                  }}
                                  size="sm"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </form>
                        </div>
                      )}
                    />
                  </>
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
