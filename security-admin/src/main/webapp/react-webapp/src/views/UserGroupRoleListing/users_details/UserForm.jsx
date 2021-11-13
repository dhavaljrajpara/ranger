import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { FieldError } from "Components/CommonComponents";

class UserForm extends Component {
  handleSubmit = () => {};
  render() {
    return (
      <div>
        <h4 className="wrap-header bold">User Form</h4>
        <Form
          onSubmit={this.handleSubmit}
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
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">
                    New Password *
                  </label>
                  <div className="col-sm-6">
                    <Field
                      name="password"
                      component="input"
                      placeholder="Enter New Password"
                      className="form-control"
                    />
                  </div>
                  <FieldError name="password" />
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">
                    Password Confirm *
                  </label>
                  <div className="col-sm-6">
                    <Field
                      name="passwordConfirm"
                      component="input"
                      placeholder="Confirm New Password"
                      className="form-control"
                    />
                  </div>
                  <FieldError name="passwordConfirm" />
                </div>
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

export default UserForm;