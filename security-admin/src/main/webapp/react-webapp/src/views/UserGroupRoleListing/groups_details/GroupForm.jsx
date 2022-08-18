import React, { useState, useEffect, useReducer } from "react";
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
import { useParams, useLocation, useNavigate } from "react-router-dom";
import usePrompt from "Hooks/usePrompt";
import Switch from "react-bootstrap/esm/Switch";
import { fetchApi } from "Utils/fetchAPI";
import { RegexValidation, GroupSource } from "../../../utils/XAEnums";

const initialState = {
  groupInfo: {},
  groupType: {},
  loader: true,
  preventUnBlock: false
};

const PromtDialog = (props) => {
  const { isDirtyField, isUnblock } = props;
  usePrompt("Are you sure you want to leave", isDirtyField && !isUnblock);
  return null;
};

const groupFormReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADER":
      return {
        ...state,
        loader: action.loader
      };
    case "SET_GROUP_DATA":
      return {
        ...state,
        groupInfo: action.groupInfo,
        groupType: action.groupType,
        loader: action.loader
      };
    case "SET_PREVENT_ALERT":
      return {
        ...state,
        preventUnBlock: action.preventUnBlock
      };
    default:
      throw new Error();
  }
};

function GroupForm(props) {
  const params = useParams();
  const [groupDetails, dispatch] = useReducer(groupFormReducer, initialState);
  const { groupType, groupInfo, loader, preventUnBlock } = groupDetails;
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (params?.groupID) {
      fetchGroupData(params.groupID);
    } else {
      dispatch({
        type: "SET_LOADER",
        loader: false
      });
    }
  }, []);

  const fetchGroupData = async (groupID) => {
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
    dispatch({
      type: "SET_GROUP_DATA",
      groupInfo: groupRespData.data,
      groupType: groupRespData.data.groupType,
      loader: false
    });
  };

  const handleSubmit = async (values) => {
    let formData = {};
    formData.name = values.name;
    formData.description = values.description || "";
    let groupFormData = {
      ...groupInfo,
      ...formData
    };
    let tblpageData = {};
    if (state && state != null) {
      tblpageData = state.tblpageData;
      if (state.tblpageData.pageRecords % state.tblpageData.pageSize == 0) {
        tblpageData["totalPage"] = state.tblpageData.totalPage + 1;
      } else {
        if (tblpageData !== undefined) {
          tblpageData["totalPage"] = state.tblpageData.totalPage;
        }
      }
    }
    dispatch({
      type: "SET_PREVENT_ALERT",
      preventUnBlock: true
    });
    if (params?.groupID) {
      try {
        const userEdit = await fetchApi({
          url: `xusers/secure/groups/${params.groupID}`,
          method: "put",
          data: groupFormData
        });
        toast.success("Group updated successfully!!");
        self.location.hash = "#/users/grouptab"; // change to navigate
      } catch (error) {
        console.error(`Error occurred while fetching User list! ${error}`);
        if (
          error.response !== undefined &&
          _.has(error.response, "data.msgDesc")
        ) {
          toast.error(error.response.data.msgDesc);
        }
        console.error(`Error occurred while creating proup`);
      }
    } else {
      try {
        const passwdResp = await fetchApi({
          url: "xusers/secure/groups",
          method: "post",
          data: formData
        });
        toast.success("Group created successfully!!");
        navigate("/users/grouptab", {
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
        }
        console.error(`Error occurred while updating user password! ${error}`);
      }
    }
  };

  const setGroupFormData = () => {
    let formValueObj = {};
    if (params?.groupID) {
      if (Object.keys(groupInfo).length > 0) {
        formValueObj.name = groupInfo.name;
        formValueObj.description = groupInfo.description;
      }
    }
    return formValueObj;
  };

  const closeForm = () => {
    navigate("/users/grouptab");
  };

  const validateForm = (values) => {
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

    return errors;
  };

  return loader ? (
    <Loader />
  ) : (
    <div>
      {commonBreadcrumb(
        ["Groups", params.groupID ? "GroupEdit" : "GroupCreate"],
        params.groupID
      )}
      <h4 className="wrap-header bold">Group Detail</h4>
      <Form
        onSubmit={handleSubmit}
        validate={validateForm}
        initialValues={setGroupFormData()}
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
            <PromtDialog isDirtyField={dirty} isUnblock={preventUnBlock} />
            <form
              onSubmit={(event) => {
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
                        onKeyDown={(e) => {
                          e.key === "Enter" && e.preventDefault();
                        }}
                        placeholder="Group Name"
                        id={meta.error && meta.touched ? "isError" : "name"}
                        className={
                          meta.error && meta.touched
                            ? "form-control border-danger"
                            : "form-control"
                        }
                        disabled={
                          params.groupID &&
                          groupInfo &&
                          groupInfo.groupSource == GroupSource.XA_GROUP.value
                            ? true
                            : false
                        }
                      />
                      <span className="info-user-role-grp-icon">
                        <CustomTooltip
                          placement="right"
                          content={
                            <p className="pd-10" style={{ fontSize: "small" }}>
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
                        disabled={
                          params.groupID &&
                          groupInfo &&
                          groupInfo.groupSource == GroupSource.XA_GROUP.value
                            ? true
                            : false
                        }
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
                        Object.keys(groupInfo).length > 0 &&
                        groupInfo.otherAttributes
                          ? JSON.parse(groupInfo.otherAttributes)
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
                    onClick={() => {
                      if (invalid) {
                        let selector =
                          document.getElementById("isError") ||
                          document.querySelector(
                            `input[name=${Object.keys(errors)[0]}]`
                          );
                        scrollToError(selector);
                      }
                      handleSubmit(values);
                    }}
                    className="btn-mini"
                    size="sm"
                    disabled={groupType === 1 ? true : submitting}
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
                      dispatch({
                        type: "SET_PREVENT_ALERT",
                        preventUnBlock: true
                      });
                      closeForm();
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
export default GroupForm;
