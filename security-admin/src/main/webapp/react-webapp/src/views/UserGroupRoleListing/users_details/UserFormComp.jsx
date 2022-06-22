import React, { Component } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { FieldError, scrollToError } from "Components/CommonComponents";
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
        <h4 className="wrap-header bold">User Detail</h4>
        <Form
          onSubmit={this.handleSubmit}
          validate={this.validateForm}
          initialValues={(this.userData(), this.setUserFormData())}
          render={({
            handleSubmit,
            form,
            submitting,
            values,
            invalid,
            errors,
            pristine
          }) => (
            <div className="wrap">
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
                <Field name="name">
                  {({ input, meta }) => (
                    <Row className="form-group">
                      <Col xs={3}>
                        <label className="form-label pull-right">
                          User Name *
                        </label>
                      </Col>
                      <Col xs={4}>
                        <input
                          {...input}
                          type="text"
                          name="name"
                          placeholder="User Name"
                          id={meta.error && meta.touched ? "isError" : "name"}
                          className={
                            meta.error && meta.touched
                              ? "form-control border-danger"
                              : "form-control"
                          }
                          disabled={this.props.isEditView ? true : false}
                        />
                        {meta.error && meta.touched && (
                          <span className="invalid-field">{meta.error}</span>
                        )}
                      </Col>
                    </Row>
                  )}
                </Field>
                {!this.props.isEditView && (
                  <Field name="password">
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
                            name="password"
                            placeholder="Enter New Password"
                            id={
                              meta.error && meta.touched
                                ? "isError"
                                : "password"
                            }
                            className={
                              meta.error && meta.touched
                                ? "form-control border-danger"
                                : "form-control"
                            }
                          />
                          {meta.error && meta.touched && (
                            <span className="invalid-field">{meta.error}</span>
                          )}
                        </Col>
                      </Row>
                    )}
                  </Field>
                )}
                {!this.props.isEditView && (
                  <Field name="passwordConfirm">
                    {({ input, meta }) => (
                      <Row className="form-group">
                        <Col xs={3}>
                          <label className="form-label pull-right">
                            Password Confirm *
                          </label>
                        </Col>
                        <Col xs={4}>
                          <input
                            {...input}
                            name="passwordConfirm"
                            type="password"
                            autoComplete="off"
                            placeholder="Confirm New Password"
                            id={
                              meta.error && meta.touched
                                ? "isError"
                                : "passwordConfirm"
                            }
                            className={
                              meta.error && meta.touched
                                ? "form-control border-danger"
                                : "form-control"
                            }
                          />
                          {meta.error && meta.touched && (
                            <span className="invalid-field">{meta.error}</span>
                          )}
                        </Col>
                      </Row>
                    )}
                  </Field>
                )}
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
                          name="firstName"
                          type="text"
                          placeholder="First Name"
                          id={
                            meta.error && meta.touched ? "isError" : "firstName"
                          }
                          className={
                            meta.error && meta.touched
                              ? "form-control border-danger"
                              : "form-control"
                          }
                          disabled={
                            this.props.isEditView &&
                            this.props.userInfo &&
                            this.props.userInfo.userSource ==
                              UserSource.XA_USER.value
                              ? true
                              : false
                          }
                        />
                        {meta.error && meta.touched && (
                          <span className="invalid-field">{meta.error}</span>
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
                          name="lastName"
                          type="text"
                          placeholder="Last Name"
                          id={
                            meta.error && meta.touched ? "isError" : "lastName"
                          }
                          className={
                            meta.error && meta.touched
                              ? "form-control border-danger"
                              : "form-control"
                          }
                          disabled={
                            this.props.isEditView &&
                            this.props.userInfo &&
                            this.props.userInfo.userSource ==
                              UserSource.XA_USER.value
                              ? true
                              : false
                          }
                        />
                        {meta.error && meta.touched && (
                          <span className="invalid-field">{meta.error}</span>
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
                          disabled={
                            this.props.isEditView &&
                            this.props.userInfo &&
                            this.props.userInfo.userSource ==
                              UserSource.XA_USER.value
                              ? true
                              : false
                          }
                        />
                        {meta.error && meta.touched && (
                          <span className="invalid-field">{meta.error}</span>
                        )}
                      </Col>
                    </Row>
                  )}
                </Field>

                <Row className="form-group">
                  <Col xs={3}>
                    <label className="form-label pull-right">Group</label>
                  </Col>
                  <Col xs={4}>
                    <Field
                      name="groupIdList"
                      component={this.groupNameList}
                      className="form-control"
                    ></Field>
                  </Col>
                </Row>
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
