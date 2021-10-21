import React, { Component } from "react";
import {Button} from "react-bootstrap";
import { Form, Field } from "react-final-form";

class UserForm extends Component {
    handleSubmit = () => {

    }
    render() {
        return (<div><h1>User Form</h1>
            <Form
                onSubmit={this.handleSubmit}
                render={({
                      handleSubmit,
                      form,
                      submitting,
                      values,
                      pristine,
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
                              placeholder="New Password"
                              className="form-control"
                            />
                          </div>
                          <Error name="newPassword" />
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
        </div>)
    }
}

export default UserForm;