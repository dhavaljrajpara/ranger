import React, { Component } from "react";
import {
  Button,
  Form as BForm,
  Col,
  Row,
  Table,
  Breadcrumb
} from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { scrollToError } from "Components/CommonComponents";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { findIndex, isEmpty } from "lodash";
import { commonBreadcrumb } from "../../../utils/XAUtils";
import { Loader } from "Components/CommonComponents";
import withRouter from "Hooks/withRouter";

class GroupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: [],
      selectedGroup: [],
      selectedRole: [],
      loader: true
    };
  }
  componentDidMount = () => {
    if (this?.props?.params?.roleID) {
      this.fetchRoleData(this.props.params.roleID);
    } else {
      this.setState({
        loader: false
      });
    }
  };
  filterUsrOp = (data, formVal) => {
    if (formVal && formVal.users) {
      let userSelectedData = formVal.users.map((m) => {
        return { label: m.name, value: m.name };
      });
      return findIndex(userSelectedData, data) === -1;
    } else {
      return findIndex(this.state.selectedUser, data) === -1;
    }
  };
  filterGroupOp = (data, formVal) => {
    if (formVal && formVal.groups) {
      let groupSelectedData = formVal.groups.map((m) => {
        return { label: m.name, value: m.name };
      });
      return findIndex(groupSelectedData, data) === -1;
    } else {
      return findIndex(this.state.selectedGroup, data) === -1;
    }
  };
  filterRoleOp = (data, formVal) => {
    if (formVal && formVal.roles) {
      let roleSelectedData = formVal.roles.map((m) => {
        return { label: m.name, value: m.name };
      });
      return findIndex(roleSelectedData, data) === -1;
    } else {
      return findIndex(this.state.selectedRole, data) === -1;
    }
  };
  fetchRoleData = async (roleID) => {
    let roleRespData;
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      roleRespData = await fetchApi({
        url: "roles/roles/" + roleID
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Role or CSRF headers! ${error}`
      );
    }
    this.setState({
      roleInfo: roleRespData.data,
      loader: false
    });
  };

  handleSubmit = async (formData) => {
    let roleFormData = {
      ...this.state.roleInfo,
      ...formData
    };
    let tblpageData = {};
    if (this.props.location.state && this.props.location.state != null) {
      tblpageData = this.props.location.state.tblpageData;
      if (
        this.props.location.state.tblpageData.pageRecords %
          this.props.location.state.tblpageData.pageSize ==
        0
      ) {
        tblpageData["totalPage"] =
          this.props.location.state.tblpageData.totalPage + 1;
      } else {
        if (tblpageData !== undefined) {
          tblpageData["totalPage"] =
            this.props.location.state.tblpageData.totalPage;
        }
      }
    }
    if (
      !isEmpty(this.state.selectedUser) ||
      !isEmpty(this.state.selectedGroup) ||
      !isEmpty(this.state.selectedRole)
    ) {
      return toast.warning(
        `Please add selected user/group/roles to there respective table else user/group/roles will not be added.`
      );
    }
    if (this?.props?.params?.roleID) {
      try {
        const { fetchApi } = await import("Utils/fetchAPI");
        const userEdit = await fetchApi({
          url: `roles/roles/${this.props.params.roleID}`,
          method: "put",
          data: roleFormData
        });
        toast.success("Role updated successfully!!");
        this.props.navigate("/users/roletab");
      } catch (error) {
        if (
          error.response !== undefined &&
          _.has(error.response, "data.msgDesc")
        ) {
          toast.error(error.response.data.msgDesc);
          this.props.navigate("/users/roletab");
        }
        console.error(`Error occurred while creating Role`);
      }
    } else {
      try {
        const { fetchApi } = await import("Utils/fetchAPI");
        const passwdResp = await fetchApi({
          url: "roles/roles",
          method: "post",
          data: formData
        });
        toast.success("Role created successfully!!");
        this.props.navigate("/users/roletab", {
          state: {
            showLastPage: true,
            addPageData: tblpageData
          }
        });
      } catch (error) {
        if (
          error.response !== undefined &&
          _.has(error.response, "data.msgDesc")
        ) {
          toast.error(error.response.data.msgDesc);
          this.props.navigate("/users/roletab");
        }
        console.error(`Error occurred while updating role! ${error}`);
      }
    }
  };

  fetchUserOp = async (inputValue) => {
    let params = { name: inputValue || "", isVisible: 1 };
    let op = [];
    const { fetchApi } = await import("Utils/fetchAPI");
    const userResp = await fetchApi({
      url: "xusers/lookup/users",
      params: params
    });
    op = userResp.data.vXStrings;
    return op.map((obj) => ({
      label: obj.value,
      value: obj.value
    }));
  };
  handleUserChange = (value) => {
    this.setState({
      selectedUser: value
    });
  };
  handleUserAdd = (push) => {
    if (this.state.selectedUser.length == 0) {
      toast.warning("Please select atleast one user!!");
    } else {
      let usr = this.state.selectedUser.map(({ value }) => ({
        name: value,
        isAdmin: false
      }));
      usr.map((val) => {
        push("users", val);
      });
      this.setState({
        selectedUser: []
      });
    }
  };

  handleGroupAdd = (push) => {
    if (this.state.selectedGroup.length == 0) {
      toast.warning("Please select atleast one group!!");
    } else {
      let grp = this.state.selectedGroup.map(({ value }) => ({
        name: value,
        isAdmin: false
      }));
      grp.map((val) => {
        push("groups", val);
      });
      this.setState({
        selectedGroup: []
      });
    }
  };
  fetchGroupOp = async (inputValue) => {
    let params = { name: inputValue || "", isVisible: 1 };
    let op = [];
    const { fetchApi } = await import("Utils/fetchAPI");
    const userResp = await fetchApi({
      url: "xusers/lookup/groups",
      params: params
    });
    op = userResp.data.vXStrings;
    return op.map((obj) => ({
      label: obj.value,
      value: obj.value
    }));
  };
  handleGroupChange = (value) => {
    this.setState({
      selectedGroup: value
    });
  };
  handleRoleAdd = (push) => {
    if (this.state.selectedRole.length == 0) {
      toast.warning("Please select atleast one role!!");
    } else {
      let rol = this.state.selectedRole.map(({ value }) => ({
        name: value,
        isAdmin: false
      }));
      rol.map((val) => {
        push("roles", val);
      });
      this.setState({
        selectedRole: []
      });
    }
  };
  fetchRoleOp = async (inputValue) => {
    let params = { roleNamePartial: inputValue || "" };
    let op = [];
    const { fetchApi } = await import("Utils/fetchAPI");
    const userResp = await fetchApi({
      url: "roles/roles",
      params: params
    });
    op = userResp.data.roles;
    return op.map((obj) => ({
      label: obj.name,
      value: obj.name
    }));
  };
  handleRoleChange = (value) => {
    this.setState({
      selectedRole: value
    });
  };
  closeForm = () => {
    this.props.navigate("/users/roletab");
  };
  setRoleFormData = () => {
    let formValueObj = {};
    if (this?.props?.params?.roleID) {
      console.log(this.props);

      if (this.state && this.state.roleInfo) {
        formValueObj.name = this.state.roleInfo.name;
        formValueObj.description = this.state.roleInfo.description;
        formValueObj.users = this.state.roleInfo.users;
        formValueObj.groups = this.state.roleInfo.groups;
        formValueObj.roles = this.state.roleInfo.roles;
      }
    }
    return formValueObj;
  };
  validateForm = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Required";
    }
    return errors;
  };
  render() {
    return this.state.loader ? (
      <Loader />
    ) : (
      <>
        {commonBreadcrumb(
          ["Roles", this.props.params.roleID ? "RoleEdit" : "RoleCreate"],
          this.props.params.roleID
        )}
        <h4 className="wrap-header bold">Role Detail</h4>
        <Form
          onSubmit={this.handleSubmit}
          initialValues={this.setRoleFormData()}
          validate={this.validateForm}
          mutators={{
            ...arrayMutators
          }}
          render={({
            handleSubmit,
            form: {
              mutators: { push, pop }
            },
            form,
            submitting,
            invalid,
            errors,
            values,
            fields,
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
                          Role Name *
                        </label>
                      </Col>
                      <Col xs={4}>
                        <input
                          {...input}
                          type="text"
                          name="name"
                          placeholder="Role Name"
                          id={meta.error && meta.touched ? "isError" : "name"}
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
                <Field name="description">
                  {({ input }) => (
                    <Row className="form-group">
                      <Col xs={3}>
                        <label className="form-label pull-right">
                          Description
                        </label>
                      </Col>
                      <Col xs={4}>
                        <textarea
                          {...input}
                          placeholder="Description"
                          className="form-control"
                        />
                      </Col>
                    </Row>
                  )}
                </Field>
                <div>
                  <fieldset>
                    <p className="formHeader">Users:</p>
                  </fieldset>
                  <div className="wrap">
                    <Col sm="6">
                      <FieldArray name="users">
                        {({ fields }) => (
                          <Table bordered>
                            <thead>
                              <tr>
                                <td>User Name</td>
                                <td>Is Role Admin</td>
                                <td>Action</td>
                              </tr>
                            </thead>
                            <tbody>
                              {fields.value == undefined ? (
                                <tr>
                                  <td
                                    className="text-center text-muted"
                                    colSpan="3"
                                  >
                                    No users found
                                  </td>
                                </tr>
                              ) : (
                                fields.map((name, index) => (
                                  <tr key={index}>
                                    <td>{fields.value[index].name}</td>
                                    <td className="text-center">
                                      <Field
                                        className="form-control"
                                        name={`${name}.isAdmin`}
                                        render={({ input, meta }) => (
                                          <div>
                                            <BForm.Group>
                                              <BForm.Check
                                                {...input}
                                                checked={input.value}
                                                type="checkbox"
                                              />
                                            </BForm.Group>
                                          </div>
                                        )}
                                      />
                                    </td>
                                    <td>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        title="Remove"
                                        onClick={() => fields.remove(index)}
                                      >
                                        <i className="fa-fw fa fa-remove"></i>
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </Table>
                        )}
                      </FieldArray>
                      <div className="form-group row">
                        <div className="col-sm-9">
                          <AsyncSelect
                            value={this.state.selectedUser}
                            filterOption={({ data }) =>
                              this.filterUsrOp(data, values)
                            }
                            onChange={this.handleUserChange}
                            loadOptions={this.fetchUserOp}
                            defaultOptions
                            isMulti
                          />
                        </div>
                        <div className="col-sm-3">
                          <Button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => this.handleUserAdd(push)}
                            size="sm"
                          >
                            Add Users
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </div>
                </div>
                <div>
                  <fieldset>
                    <p className="formHeader">Groups:</p>
                  </fieldset>
                  <div className="wrap">
                    <Col sm="6">
                      <FieldArray name="groups">
                        {({ fields }) => (
                          <Table bordered>
                            <thead>
                              <tr>
                                <td>Group Name</td>
                                <td>Is Role Admin</td>
                                <td>Action</td>
                              </tr>
                            </thead>
                            <tbody>
                              {fields.value == undefined ? (
                                <tr>
                                  <td
                                    className="text-center text-muted"
                                    colSpan="3"
                                  >
                                    No groups found
                                  </td>
                                </tr>
                              ) : (
                                fields.map((name, index) => (
                                  <tr>
                                    <td>{fields.value[index].name}</td>
                                    <td className="text-center">
                                      <Field
                                        className="form-control"
                                        name={`${name}.isAdmin`}
                                        render={({ input, meta }) => (
                                          <div>
                                            <BForm.Group>
                                              <BForm.Check
                                                {...input}
                                                checked={input.value}
                                                type="checkbox"
                                              />
                                            </BForm.Group>
                                          </div>
                                        )}
                                      />
                                    </td>
                                    <td>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        title="Remove"
                                        onClick={() => fields.remove(index)}
                                      >
                                        <i className="fa-fw fa fa-remove"></i>
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </Table>
                        )}
                      </FieldArray>
                      <div className="form-group row">
                        <div className="col-sm-9">
                          <AsyncSelect
                            value={this.state.selectedGroup}
                            filterOption={({ data }) =>
                              this.filterGroupOp(data, values)
                            }
                            onChange={this.handleGroupChange}
                            loadOptions={this.fetchGroupOp}
                            defaultOptions
                            isMulti
                          />
                        </div>
                        <div className="col-sm-3">
                          <Button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => this.handleGroupAdd(push)}
                            size="sm"
                          >
                            Add Group
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </div>
                </div>
                <div>
                  <fieldset>
                    <p className="formHeader">Roles:</p>
                  </fieldset>
                  <div className="wrap">
                    <Col sm="6">
                      <FieldArray name="roles">
                        {({ fields }) => (
                          <Table bordered>
                            <thead>
                              <tr>
                                <td>Role Name</td>
                                <td>Is Role Admin</td>
                                <td>Action</td>
                              </tr>
                            </thead>
                            <tbody>
                              {fields.value == undefined ? (
                                <tr>
                                  <td
                                    className="text-center text-muted"
                                    colSpan="3"
                                  >
                                    No roles found
                                  </td>
                                </tr>
                              ) : (
                                fields.map((name, index) => (
                                  <tr>
                                    <td>{fields.value[index].name}</td>
                                    <td className="text-center">
                                      <Field
                                        className="form-control"
                                        name={`${name}.isAdmin`}
                                        render={({ input, meta }) => (
                                          <div>
                                            <BForm.Group>
                                              <BForm.Check
                                                {...input}
                                                checked={input.value}
                                                type="checkbox"
                                              />
                                            </BForm.Group>
                                          </div>
                                        )}
                                      />
                                    </td>
                                    <td>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        title="Remove"
                                        onClick={() => fields.remove(index)}
                                      >
                                        <i className="fa-fw fa fa-remove"></i>
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </Table>
                        )}
                      </FieldArray>
                      <div className="form-group row">
                        <div className="col-sm-9">
                          <AsyncSelect
                            value={this.state.selectedRole}
                            filterOption={({ data }) =>
                              this.filterRoleOp(data, values)
                            }
                            onChange={this.handleRoleChange}
                            loadOptions={this.fetchRoleOp}
                            defaultOptions
                            isMulti
                          />
                        </div>
                        <div className="col-sm-3">
                          <Button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => this.handleRoleAdd(push)}
                            size="sm"
                          >
                            Add Role
                          </Button>
                        </div>
                      </div>
                    </Col>
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

export default withRouter(GroupForm);
