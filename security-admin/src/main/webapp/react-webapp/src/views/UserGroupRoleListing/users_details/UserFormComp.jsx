import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { FieldError } from "Components/CommonComponents";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { fetchApi } from "Utils/fetchAPI";
import { ActivationStatus } from "Utils/XAEnums";
import { toast } from "react-toastify";
import { getUserAccessRoleList } from "Utils/XAUtils";
import { UserRoles, UserSource } from "Utils/XAEnums";
import { getUserProfile } from "Utils/appState";

class UserFormComp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleSubmit = async (formData) => {
    let userFormData = { ...formData };
    let userRoleListVal = [];
    if (userFormData.groupIdList) {
      userFormData.groupIdList = userFormData.groupIdList.map(
        (obj) => obj.value + ""
      );
    }
    if (userFormData.userRoleList) {
      userRoleListVal.push(userFormData.userRoleList.value);
      userFormData.userRoleList = userRoleListVal;
    }
    delete userFormData.passwordConfirm;
    userFormData.status = ActivationStatus.ACT_STATUS_ACTIVE.value;
    if (this.props && this.props.isEditView) {
      userFormData = {
        ...this.state.userInfo,
        ...userFormData
      };
      delete userFormData.password;
    }
    if (this.props && this.props.isEditView) {
      try {
        const { fetchApi } = await import("Utils/fetchAPI");
        const userEdit = await fetchApi({
          url: `xusers/secure/users/${this.state.userInfo.id}`,
          method: "put",
          data: userFormData
        });
        toast.success("User updated successfully!!");
        self.location.hash = "#/users/usertab";
      } catch (error) {
        console.error(`Error occurred while creating user`);
        toast.error(error.msgDesc);
      }
    } else {
      try {
        const { fetchApi } = await import("Utils/fetchAPI");
        const userCreate = await fetchApi({
          url: "xusers/secure/users",
          method: "post",
          data: userFormData
        });
        toast.success("User created successfully!!");
        self.location.hash = "#/users/usertab";
      } catch (error) {
        console.error(`Error occurred while creating user`);
        toast.error(error.msgDesc);
      }
    }
  };
  closeForm = () => {
    self.location.hash = "#/users/usertab";
    // this.props.history.push("/users/grouptab");
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
        isDisabled={
          this.props.isEditView &&
          this.state &&
          this.state.userInfo &&
          this.state.userInfo.userSource == UserSource.XA_USER.value
            ? true
            : false
        }
      />
    );
  };
  disabledUserRoleField = () => {
    const userProps = getUserProfile();
    let disabledUserRolefield;
    if (this.props.isEditView && this.state && this.state.userInfo) {
      if (this.state.userInfo.userSource == UserSource.XA_USER.value) {
        disabledUserRolefield = true;
      }
      if (userProps.loginId != "admin") {
        if (this.state.userInfo.name != "admin") {
          if (
            userProps.userRoleList[0] == "ROLE_SYS_ADMIN" ||
            userProps.userRoleList[0] == "ROLE_KEY_ADMIN"
          ) {
            disabledUserRolefield = false;
          } else {
            disabledUserRolefield = true;
          }
        } else {
          disabledUserRolefield = true;
        }
      } else {
        disabledUserRolefield = false;
      }
      if (this.state.userInfo.name == userProps.loginId) {
        disabledUserRolefield = true;
      }
    }
    return disabledUserRolefield;
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

  userRoleListData = () => {
    return getUserAccessRoleList();
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

  setUserFormData = () => {
    let formValueObj = {};
    if (this.props.isEditView && this.state && this.state.userInfo) {
      formValueObj.name = this.state.userInfo.name;
      formValueObj.firstName = this.state.userInfo.firstName;
      formValueObj.lastName = this.state.userInfo.lastName;
      formValueObj.emailAddress = this.state.userInfo.emailAddress;
      formValueObj.firstName = this.state.userInfo.firstName;
    }
    if (this.state && this.state.userInfo && this.state.userInfo.userRoleList) {
      formValueObj.userRoleList = {
        label: UserRoles[this.state.userInfo.userRoleList[0]].label,
        value: this.state.userInfo.userRoleList[0]
      };
      console.log(this.groupNameList);
    } else {
      formValueObj.userRoleList = this.userRoleListData()[0];
    }
    if (
      this.state &&
      this.state.userInfo &&
      this.state.userInfo.groupIdList &&
      this.state.userInfo.groupNameList
    ) {
      formValueObj.groupIdList = this.state.userInfo.groupNameList.map(
        (val, index) => {
          return { label: val, value: this.state.userInfo.groupIdList[index] };
        }
      );
    }

    return formValueObj;
  };

  render() {
    return (
      <>
        <h4 className="wrap-header bold">User Form</h4>
        <Form
          onSubmit={this.handleSubmit}
          initialValues={(this.userData(), this.setUserFormData())}
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
                      disabled={this.props.isEditView ? true : false}
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
                      disabled={
                        this.props.isEditView &&
                        this.state &&
                        this.state.userInfo &&
                        this.state.userInfo.userSource ==
                          UserSource.XA_USER.value
                          ? true
                          : false
                      }
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
                      disabled={
                        this.props.isEditView &&
                        this.state &&
                        this.state.userInfo &&
                        this.state.userInfo.userSource ==
                          UserSource.XA_USER.value
                          ? true
                          : false
                      }
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
                      disabled={
                        this.props.isEditView &&
                        this.state &&
                        this.state.userInfo &&
                        this.state.userInfo.userSource ==
                          UserSource.XA_USER.value
                          ? true
                          : false
                      }
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
                      className="form-control"
                      render={({ input }) => (
                        <Select
                          {...input}
                          options={this.userRoleListData()}
                          isDisabled={this.disabledUserRoleField()}
                        ></Select>
                      )}
                    ></Field>
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
                      onClick={() => {
                        form.reset;
                        this.closeForm();
                      }}
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
    );
  }
}

export default UserFormComp;
