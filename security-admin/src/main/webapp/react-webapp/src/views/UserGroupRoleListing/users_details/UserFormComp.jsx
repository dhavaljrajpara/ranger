import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { FieldError } from "Components/CommonComponents";
import AsyncSelect from "react-select/async";
import { fetchApi } from "Utils/fetchAPI";
import { ActivationStatus } from "Utils/XAEnums";

class UserFormComp extends Component {
  handleSubmit = async (formData) => {
    console.log(formData);
    const userFormData = { ...formData };
    userFormData.groupIdList = userFormData.groupIdList.map(
      (obj) => obj.value + ""
    );
    delete userFormData.passwordConfirm;
    userFormData.status = ActivationStatus.ACT_STATUS_ACTIVE.value;
    try {
      const { fetchApi } = await import("Utils/fetchAPI");
      const passwdResp = await fetchApi({
        url: "xusers/secure/users",
        method: "post",
        data: userFormData
      });
      this.props.history.push("/users/usertab");
    } catch (error) {
      console.error(`Error occurred while creating user`);
    }
  };
  groupNameList = ({ input, ...rest }) => {
    const loadOptions = async (inputValue, callback) => {
      let params = {},
        op = [];
      if (inputValue) {
        params["name"] = inputValue || "";
      }
      const opResp = await fetchApi({
        url: "xusers/groups",
        params: params
      });
      if (opResp.data && opResp.data.vXGroups) {
        op = opResp.data.vXGroups.map((obj) => {
          return {
            label: obj.name,
            value: obj.id
          };
        });
      }
      return op;
    };

    return (
      <AsyncSelect
        {...input}
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        isMulti
        // onInputChange={this.handleInputChange}
      />
    );
  };
  fetchUserData = async (userID) => {
    let userRespData;
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      userRespData = await fetchApi({
        url: "xusers/secure/users/" + userID
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Zones or CSRF headers! ${error}`
      );
    }
    this.setState({
      userInfo: userRespData.data
    });
  };

  componentDidMount = () => {
    if (this.props.isEditView) {
      this.fetchUserData(this.props.userID);
    }
  };

  userData = () => {
    if (this.state && this.state.userInfo) {
      return this.state.userInfo;
    } else {
      return "";
    }
  };

  render() {
    return (
      <div>
        <h4 className="wrap-header bold">User Form</h4>
        <Form
          onSubmit={this.handleSubmit}
          initialValues={this.userData()}
          render={({ handleSubmit, form, submitting, values, pristine }) => (
            <div className="wrap">
              <form onSubmit={handleSubmit}>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">User Name *</label>
                  <div className="col-sm-6">
                    <Field
                      name="name"
                      component="input"
                      placeholder="User Name"
                      className="form-control"
                    />
                  </div>
                  <FieldError name="name" />
                </div>
                {!this.props.isEditView && (
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">
                      New Password *
                    </label>
                    <div className="col-sm-6">
                      <Field
                        name="password"
                        type="password"
                        component="input"
                        placeholder="Enter New Password"
                        className="form-control"
                      />
                    </div>
                    <FieldError name="password" />
                  </div>
                )}
                {!this.props.isEditView && (
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">
                      Password Confirm *
                    </label>
                    <div className="col-sm-6">
                      <Field
                        name="passwordConfirm"
                        type="password"
                        component="input"
                        placeholder="Confirm New Password"
                        className="form-control"
                      />
                    </div>
                    <FieldError name="passwordConfirm" />
                  </div>
                )}
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">
                    First Name *
                  </label>
                  <div className="col-sm-6">
                    <Field
                      name="firstName"
                      component="input"
                      placeholder="First Name"
                      className="form-control"
                    />
                  </div>
                  <FieldError name="firstName" />
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Last Name</label>
                  <div className="col-sm-6">
                    <Field
                      name="lastName"
                      component="input"
                      placeholder="Last Name"
                      className="form-control"
                    />
                  </div>
                  <FieldError name="lastName" />
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">
                    Email Address
                  </label>
                  <div className="col-sm-6">
                    <Field
                      name="emailAddress"
                      type="email"
                      component="input"
                      placeholder="Email Address"
                      className="form-control"
                    />
                  </div>
                  <FieldError name="emailAddress" />
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
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Group</label>
                  <div className="col-sm-6">
                    <Field
                      name="groupIdList"
                      component={this.groupNameList}
                      className="form-control"
                    ></Field>
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
            </div>
          )}
        />
      </div>
    );
  }
}

export default UserFormComp;
