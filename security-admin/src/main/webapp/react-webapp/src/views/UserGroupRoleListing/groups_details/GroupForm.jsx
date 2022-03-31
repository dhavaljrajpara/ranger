import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { FieldError } from "Components/CommonComponents";
import { toast } from "react-toastify";
import { SyncSourceDetails } from "../SyncSourceDetails";
import { Loader } from "Components/CommonComponents";

class GroupForm extends Component {
  constructor(props) {
    super(props);
    this.state = { loader: true };
  }
  componentDidMount = () => {
    if (
      this.props &&
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.groupId
    ) {
      this.fetchGroupData(this.props.match.params.groupId);
    } else {
      this.setState({
        loader: false
      });
    }
  };
  fetchGroupData = async (groupId) => {
    let groupRespData;
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      groupRespData = await fetchApi({
        url: "xusers/secure/groups/" + groupId
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Group or CSRF headers! ${error}`
      );
    }
    this.setState({
      groupInfo: groupRespData.data,
      loader: false
    });
  };

  handleSubmit = async (formData) => {
    console.log(formData);
    let groupFormData = {
      ...this.state.groupInfo,
      ...formData
    };
    if (
      this.props &&
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.groupId
    ) {
      try {
        const { fetchApi } = await import("Utils/fetchAPI");
        const userEdit = await fetchApi({
          url: `xusers/secure/groups/${this.props.match.params.groupId}`,
          method: "put",
          data: groupFormData
        });
        toast.success("Group updated successfully!!");
        self.location.hash = "#/users/grouptab";
      } catch (error) {
        console.error(`Error occurred while creating proup`);
        toast.error(error.msgDesc);
      }
    } else {
      try {
        const { fetchApi } = await import("Utils/fetchAPI");
        const passwdResp = await fetchApi({
          url: "xusers/secure/groups",
          method: "post",
          data: formData
        });
        toast.success("Group created successfully!!");
        this.props.history.push("/users/grouptab");
      } catch (error) {
        toast.error("Group created successfully!!");
        console.error(`Error occurred while updating user password! ${error}`);
      }
    }
  };
  setGroupFormData = () => {
    let formValueObj = {};
    if (
      this.props &&
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.groupId
    ) {
      if (this.state && this.state.groupInfo) {
        formValueObj.name = this.state.groupInfo.name;
        formValueObj.description = this.state.groupInfo.description;
      }
    }
    return formValueObj;
  };
  closeForm = () => {
    this.props.history.push("/users/grouptab");
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
      <div>
        <h4 className="wrap-header bold">Group Form</h4>
        <Form
          onSubmit={this.handleSubmit}
          validate={this.validateForm}
          initialValues={this.setGroupFormData()}
          render={({ handleSubmit, form, submitting, values, pristine }) => (
            <div className="wrap">
              <form onSubmit={handleSubmit}>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">
                    Group Name *
                  </label>
                  <div className="col-sm-6">
                    <Field
                      name="name"
                      component="input"
                      placeholder="Group Name"
                      className="form-control"
                    />
                    <FieldError name="name" />
                  </div>
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
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <p className="form-header">Sync Details :</p>
                    <div>
                      <SyncSourceDetails
                        syncDetails={
                          this.state &&
                          this.state.groupInfo &&
                          this.state.groupInfo.otherAttributes
                            ? JSON.parse(this.state.groupInfo.otherAttributes)
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
      </div>
    );
  }
}

export default GroupForm;
