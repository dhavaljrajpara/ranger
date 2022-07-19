import React, { Component } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { toast } from "react-toastify";
import { commonBreadcrumb } from "../../../utils/XAUtils";
import { SyncSourceDetails } from "../SyncSourceDetails";
import {
  Loader,
  scrollToError,
  CustomTooltip
} from "Components/CommonComponents";
import withRouter from "Hooks/withRouter";
import usePrompt from "Hooks/usePrompt";

class GroupForm extends Component {
  constructor(props) {
    super(props);
    this.state = { loader: true };
  }
  componentDidMount = () => {
    if (this?.props?.params?.groupID) {
      this.fetchGroupData(this.props.params.groupID);
    } else {
      this.setState({
        loader: false
      });
    }
  };
  fetchGroupData = async (groupID) => {
    let groupRespData;
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      groupRespData = await fetchApi({
        url: "xusers/secure/groups/" + groupID
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Group or CSRF headers! ${error}`
      );
    }
    this.setState({
      groupInfo: groupRespData.data,
      groupType: groupRespData.data.groupType,
      loader: false
    });
  };

  handleSubmit = async (values) => {
    let formData = {};
    formData.name = values.name;
    formData.description = values.description || "";
    let groupFormData = {
      ...this.state.groupInfo,
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
    if (this?.props?.params?.groupID) {
      try {
        const { fetchApi } = await import("Utils/fetchAPI");
        const userEdit = await fetchApi({
          url: `xusers/secure/groups/${this.props.params.groupID}`,
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
        this.props.navigate("/users/grouptab", {
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
          toast.error(`Group creation failed!! ${error.response.data.msgDesc}`);
          this.props.navigate("/users/grouptab");
        }
        console.error(`Error occurred while updating user password! ${error}`);
      }
    }
  };
  setGroupFormData = () => {
    let formValueObj = {};
    if (this?.props?.params?.groupID) {
      if (this?.state?.groupInfo) {
        formValueObj.name = this.state.groupInfo.name;
        formValueObj.description = this.state.groupInfo.description;
      }
    }
    return formValueObj;
  };
  closeForm = () => {
    this.props.navigate("/users/grouptab");
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
        {commonBreadcrumb(
          ["Groups", this.props.params.groupID ? "GroupEdit" : "GroupCreate"],
          this.props.params.groupID
        )}
        <h4 className="wrap-header bold">Group Detail</h4>
        <Form
          onSubmit={this.handleSubmit}
          validate={this.validateForm}
          initialValues={this.setGroupFormData()}
          render={({
            handleSubmit,
            form,
            submitting,
            invalid,
            errors,
            values,
            pristine,
            dirty
          }) => (
            <div className="wrap user-role-grp-form">
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
                          Group Name *
                        </label>
                      </Col>
                      <Col xs={4}>
                        <input
                          {...input}
                          type="text"
                          name="name"
                          placeholder="Group Name"
                          id={meta.error && meta.touched ? "isError" : "name"}
                          className={
                            meta.error && meta.touched
                              ? "form-control border-danger"
                              : "form-control"
                          }
                        />
                        <span className="info-user-role-grp-icon">
                          <CustomTooltip
                            placement="right"
                            content={
                              <p
                                className="pd-10"
                                style={{ fontSize: "small" }}
                              >
                                1. User name should be start with alphabet /
                                numeric / underscore / non-us characters.
                                <br />
                                2. Allowed special character ,._-+/@= and space.
                                <br />
                                3. Name length should be greater than one.
                              </p>
                            }
                            icon="fa-fw fa fa-info-circle"
                          />
                        </span>
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
                          disabled={this.props.params.groupID ? true : false}
                        />
                      </Col>
                    </Row>
                  )}
                </Field>
                <div className="row">
                  <div className="col-sm-12">
                    <p className="form-header mg-0">Sync Details :</p>
                    <div className="wrap">
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
                      className="btn-mini"
                      size="sm"
                      disabled={this.state.groupType === 1 ? true : submitting}
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      type="button"
                      className="btn-mini"
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

export default withRouter(GroupForm);
