import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { FieldError } from "Components/CommonComponents";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { fetchApi } from "Utils/fetchAPI";
import { ActivationStatus, RegexValidation } from "Utils/XAEnums";
import { toast } from "react-toastify";
import { getUserAccessRoleList } from "Utils/XAUtils";
import { UserRoles, UserSource } from "Utils/XAEnums";
import { getUserProfile } from "Utils/appState";
import _ from "lodash";
import { SyncSourceDetails } from "../SyncSourceDetails";

class UserFormComp extends Component {
  constructor(props) {
    super(props);
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
        ...this.props.userInfo,
        ...userFormData
      };
      delete userFormData.password;
    }
    if (this.props && this.props.isEditView) {
      try {
        const userEdit = await fetchApi({
          url: `xusers/secure/users/${this.props.userInfo.id}`,
          method: "put",
          data: userFormData
        });
        toast.success("User updated successfully!!");
        self.location.hash = "#/users/usertab";
      } catch (error) {
        if (
          error.response !== undefined &&
          _.has(error.response, "data.msgDesc")
        ) {
          toast.error(error.response.data.msgDesc);
          self.location.hash = "#/users/usertab";
        }
        console.error(`Error occurred while creating user`);
      }
    } else {
      try {
        const userCreate = await fetchApi({
          url: "xusers/secure/users",
          method: "post",
          data: userFormData
        });
        toast.success("User created successfully!!");
        self.location.hash = "#/users/usertab";
      } catch (error) {
        if (
          error.response !== undefined &&
          _.has(error.response, "data.msgDesc")
        ) {
          toast.error(error.response.data.msgDesc);
          self.location.hash = "#/users/usertab";
        }
        console.error(`Error occurred while creating user`);
      }
    }
  };
  closeForm = () => {
    self.location.hash = "#/users/usertab";
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
          this.props.userInfo &&
          this.props.userInfo.userSource == UserSource.XA_USER.value
            ? true
            : false
        }
      />
    );
  };
  disabledUserRoleField = () => {
    const userProps = getUserProfile();
    let disabledUserRolefield;
    if (this.props.isEditView && this.props.userInfo) {
      if (this.props.userInfo.userSource == UserSource.XA_USER.value) {
        disabledUserRolefield = true;
      }
      if (userProps.loginId != "admin") {
        if (this.props.userInfo.name != "admin") {
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
      if (this.props.userInfo.name == userProps.loginId) {
        disabledUserRolefield = true;
      }
    }
    return disabledUserRolefield;
  };
  userRoleListData = () => {
    return getUserAccessRoleList();
  };

  userData = () => {
    if (this.props.userInfo) {
      return this.props.userInfo;
    } else {
      return "";
    }
  };

  setUserFormData = () => {
    let formValueObj = {};
    if (this.props.isEditView && this.props.userInfo) {
      formValueObj.name = this.props.userInfo.name;
      formValueObj.firstName = this.props.userInfo.firstName;
      formValueObj.lastName = this.props.userInfo.lastName;
      formValueObj.emailAddress = this.props.userInfo.emailAddress;
      formValueObj.firstName = this.props.userInfo.firstName;
    }
    if (this.props.userInfo && this.props.userInfo.userRoleList) {
      formValueObj.userRoleList = {
        label: UserRoles[this.props.userInfo.userRoleList[0]].label,
        value: this.props.userInfo.userRoleList[0]
      };
      console.log(this.groupNameList);
    } else {
      formValueObj.userRoleList = this.userRoleListData()[0];
    }
    if (
      this.props.userInfo &&
      this.props.userInfo.groupIdList &&
      this.props.userInfo.groupNameList
    ) {
      formValueObj.groupIdList = this.props.userInfo.groupNameList.map(
        (val, index) => {
          return { label: val, value: this.props.userInfo.groupIdList[index] };
        }
      );
    }

    return formValueObj;
  };

  validateForm = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Required";
    } else {
      if (
        !RegexValidation.NAME_VALIDATION.regexExpressionForName.test(
          values.name
        )
      ) {
        errors.name = RegexValidation.NAME_VALIDATION.nameValidationMessage;
      }
    }
    if (!values.password && !this.props.isEditView) {
      errors.password = "Required";
    }
    if (!values.passwordConfirm && !this.props.isEditView) {
      errors.passwordConfirm = "Required";
    }
    if (this.props.isEditView) {
      if (
        !values.firstName &&
        this.props.userInfo.userSource !== UserSource.XA_USER.value
      ) {
        errors.firstName = "Required";
      }
    } else {
      if (!values.firstName) {
        errors.firstName = "Required";
      } else {
        if (
          !RegexValidation.NAME_VALIDATION.regexExpressionForName.test(
            values.firstName
          )
        ) {
          errors.firstName =
            RegexValidation.NAME_VALIDATION.secondaryNameValidationMessage;
        }
      }
    }

    if (
      values &&
      _.has(values, "password") &&
      !RegexValidation.PASSWORD.regexExpression.test(values.password)
    ) {
      errors.password = RegexValidation.PASSWORD.message;
    }

    if (
      values &&
      _.has(values, "password") &&
      _.has(values, "passwordConfirm") &&
      values.password !== values.passwordConfirm
    ) {
      errors.passwordConfirm = "Password must be match with new password";
    }

    return errors;
  };

  render() {
    return (
      <>
        <h4 className="wrap-header bold">User Form</h4>
        <Form
          onSubmit={this.handleSubmit}
          validate={this.validateForm}
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
                    <FieldError name="name" />
                  </div>
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
                      <FieldError name="password" />
                    </div>
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
                      <FieldError name="passwordConfirm" />
                    </div>
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
                        this.props.userInfo &&
                        this.props.userInfo.userSource ==
                          UserSource.XA_USER.value
                          ? true
                          : false
                      }
                    />
                    <FieldError name="firstName" />
                  </div>
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
                        this.props.userInfo &&
                        this.props.userInfo.userSource ==
                          UserSource.XA_USER.value
                          ? true
                          : false
                      }
                    />
                    <FieldError name="lastName" />
                  </div>
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
                        this.props.userInfo &&
                        this.props.userInfo.userSource ==
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
                <div className="row">
                  <div className="col-sm-12">
                    <p className="form-header">Sync Details :</p>
                    <div>
                      <SyncSourceDetails
                        syncDetails={
                          this.props.userInfo &&
                          this.props.userInfo.otherAttributes
                            ? JSON.parse(this.props.userInfo.otherAttributes)
                            : {}
                        }
                      ></SyncSourceDetails>
                    </div>
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
