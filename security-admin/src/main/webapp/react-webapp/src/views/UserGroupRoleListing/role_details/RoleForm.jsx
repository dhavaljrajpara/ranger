import React, { Component } from "react";
import { Button, Form as BForm, Col, Table } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { FieldError } from "Components/CommonComponents";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import AsyncSelect from "react-select/async";

class GroupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: [],
      selectedGroup: [],
      selectedRole: []
    };
  }

  handleSubmit = async (formData) => {
    console.log(formData);
    try {
      const { fetchApi } = await import("Utils/fetchAPI");
      const passwdResp = await fetchApi({
        url: "xusers/secure/groups",
        method: "post",
        data: formData
      });
      this.props.history.push("/users/usertab");
    } catch (error) {
      console.error(`Error occurred while updating user password! ${error}`);
    }
  };

  handleUserAdd = (push) => {
    let usr = this.state.selectedUser.map(({ value }) => ({
      name: value,
      isAdmin: false
    }));
    push("users", usr);
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
  handleGroupAdd = (push) => {
    let grp = this.state.selectedGroup.map(({ value }) => ({
      name: value,
      isAdmin: false
    }));
    push("groups", grp);
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
    let rol = this.state.selectedRole.map(({ value }) => ({
      name: value,
      isAdmin: false
    }));
    push("roles", rol);
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
  render() {
    return (
      <>
        <h4 className="wrap-header bold">User Form</h4>
        <Form
          onSubmit={this.handleSubmit}
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
            values,
            pristine
          }) => (
            <div className="wrap">
              <form onSubmit={handleSubmit}>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Role Name *</label>
                  <div className="col-sm-6">
                    <Field
                      name="name"
                      component="input"
                      placeholder="Role Name"
                      className="form-control"
                    />
                  </div>
                  <FieldError name="name" />
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Description</label>
                  <div className="col-sm-6">
                    <Field
                      name="description"
                      component="textarea"
                      placeholder="Description"
                      className="form-control"
                    />
                  </div>
                  <FieldError name="description" />
                </div>
                <div>
                  <fieldset>
                    <p className="formHeader">Users:</p>
                  </fieldset>
                  <div className="wrap">
                    <Col sm="6">
                      <FieldArray name="users">
                        {({ fields }) => (
                          <Table striped bordered>
                            <thead>
                              <tr>
                                <td>User Name</td>
                                <td>Is Role Admin</td>
                                <td>Action</td>
                              </tr>
                            </thead>
                            <tbody>
                              {fields.map((name, index) => (
                                <tr>
                                  <td>{fields.value[index][0].name}</td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name={`${name}.isAdmin`}
                                      render={({ input, meta }) => (
                                        <div>
                                          <BForm.Group>
                                            <BForm.Check
                                              {...input}
                                              type="checkbox"
                                            />
                                          </BForm.Group>
                                        </div>
                                      )}
                                    />
                                  </td>
                                  <td>
                                    <span
                                      onClick={() => fields.remove(index)}
                                      style={{ cursor: "pointer" }}
                                    >
                                      ❌
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        )}
                      </FieldArray>
                      <AsyncSelect
                        value={this.state.selectedUser}
                        onChange={this.handleUserChange}
                        loadOptions={this.fetchUserOp}
                        defaultOptions
                        isMulti
                      />
                      <button
                        type="button"
                        onClick={() => this.handleUserAdd(push)}
                      >
                        Add Users
                      </button>
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
                          <Table striped bordered>
                            <thead>
                              <tr>
                                <td>Group Name</td>
                                <td>Is Role Admin</td>
                                <td>Action</td>
                              </tr>
                            </thead>
                            <tbody>
                              {fields.map((name, index) => (
                                <tr>
                                  <td>{fields.value[index][0].name}</td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name={`${name}.isAdmin`}
                                      render={({ input, meta }) => (
                                        <div>
                                          <BForm.Group>
                                            <BForm.Check
                                              {...input}
                                              type="checkbox"
                                            />
                                          </BForm.Group>
                                        </div>
                                      )}
                                    />
                                  </td>
                                  <td>
                                    <span
                                      onClick={() => fields.remove(index)}
                                      style={{ cursor: "pointer" }}
                                    >
                                      ❌
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        )}
                      </FieldArray>
                      <AsyncSelect
                        value={this.state.selectedGroup}
                        onChange={this.handleGroupChange}
                        loadOptions={this.fetchGroupOp}
                        defaultOptions
                        isMulti
                      />
                      <button
                        type="button"
                        onClick={() => this.handleGroupAdd(push)}
                      >
                        Add Group
                      </button>
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
                          <Table striped bordered>
                            <thead>
                              <tr>
                                <td>Role Name</td>
                                <td>Is Role Admin</td>
                                <td>Action</td>
                              </tr>
                            </thead>
                            <tbody>
                              {fields.map((name, index) => (
                                <tr>
                                  <td>{fields.value[index][0].name}</td>
                                  <td>
                                    <Field
                                      className="form-control"
                                      name={`${name}.isAdmin`}
                                      render={({ input, meta }) => (
                                        <div>
                                          <BForm.Group>
                                            <BForm.Check
                                              {...input}
                                              type="checkbox"
                                            />
                                          </BForm.Group>
                                        </div>
                                      )}
                                    />
                                  </td>
                                  <td>
                                    <span
                                      onClick={() => fields.remove(index)}
                                      style={{ cursor: "pointer" }}
                                    >
                                      ❌
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        )}
                      </FieldArray>
                      <AsyncSelect
                        value={this.state.selectedRole}
                        onChange={this.handleRoleChange}
                        loadOptions={this.fetchRoleOp}
                        defaultOptions
                        isMulti
                      />
                      <button
                        type="button"
                        onClick={() => this.handleRoleAdd(push)}
                      >
                        Add Role
                      </button>
                    </Col>
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
      </>
    );
  }
}

export default GroupForm;
