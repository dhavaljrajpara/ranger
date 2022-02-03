import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { FieldError } from "Components/CommonComponents";

class GroupForm extends Component {
  handleSubmit = async (formData) => {
    console.log(formData);
    // const data = {};
    // data['name'] = formData.name;
    // data['description'] = formData.description;

    try {
      const { fetchApi } = await import("Utils/fetchAPI");
      const passwdResp = await fetchApi({
        url: "xusers/secure/groups",
        method: "post",
        data: formData
      });
      this.props.history.push("/user");
    } catch (error) {
      console.error(`Error occurred while updating user password! ${error}`);
    }
  };
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
                      placeholder="Group Name"
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

export default GroupForm;
