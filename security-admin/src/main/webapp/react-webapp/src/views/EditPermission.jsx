import { Form, Field } from "react-final-form";
import { Button, Col, Form as FormB, Row } from "react-bootstrap";
import React, { useEffect, useReducer } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import { Loader } from "Components/CommonComponents";
import { fetchApi } from "Utils/fetchAPI";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";
import { cloneDeep, find, findIndex } from "lodash";
import { AccessResult } from "Utils/XAEnums";

const initialState = {
  loader: true,
  permissionData: null,
  selectedGrp: [],
  selectedUsr: []
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        loader: false,
        permissionData: action.data,
        selectedGrp: action.grpData,
        selectedUsr: action.usrData
      };
    case "SET_SELECTED_GRP":
      return {
        ...state,
        selectedGrp: action.grpData
      };
    case "SET_SELECTED_USR":
      return {
        ...state,
        selectedUsr: action.usrData
      };
    default:
      throw new Error();
  }
}
const EditPermission = (props) => {
  let { permissionId } = useParams();
  const history = useHistory();
  const [permissionState, dispatch] = useReducer(reducer, initialState);
  const { loader, permissionData, selectedGrp, selectedUsr } = permissionState;

  useEffect(() => {
    fetchPermissions();
  }, []);

  const onSubmit = async (values) => {
    const formData = cloneDeep(values);
    if (
      (values.selectgroup && values.selectgroup.length > 0) ||
      (values.selectuser && values.selectuser.length > 0)
    ) {
      toast.error(
        "Please add selected user/group to permissions else user/group will not be added."
      );
      return false;
    }
    for (const grpObj of formData.groupPermList) {
      let index = findIndex(selectedGrp, { value: grpObj.groupId });
      if (index === -1) {
        grpObj.isAllowed = AccessResult.ACCESS_RESULT_DENIED.value;
      }
    }
    for (const grpObj of selectedGrp) {
      let obj = find(formData.groupPermList, { groupId: grpObj.value });
      if (!obj) {
        formData.groupPermList.push({
          groupId: grpObj.value,
          isAllowed: AccessResult.ACCESS_RESULT_ALLOWED.value,
          moduleId: formData.id
        });
      }
    }
    for (const userObj of formData.userPermList) {
      let index = findIndex(selectedUsr, { value: userObj.userId });
      if (index === -1) {
        userObj.isAllowed = AccessResult.ACCESS_RESULT_DENIED.value;
      }
    }
    for (const userObj of selectedUsr) {
      let obj = find(formData.userPermList, { userId: userObj.value });
      if (!obj) {
        formData.userPermList.push({
          userId: userObj.value,
          isAllowed: AccessResult.ACCESS_RESULT_ALLOWED.value,
          moduleId: formData.id
        });
      }
    }
    // delete formData.selectgroup;
    // delete formData.selectuser;
    try {
      await fetchApi({
        url: `xusers/permission/${permissionId}`,
        method: "PUT",
        data: formData
      });

      history.push("/permissions/models");
      toast.success("Success! Module Permissions updated successfully");
    } catch (error) {
      console.error(`Error occurred while fetching Policies ! ${error}`);
    }
  };

  const fetchPermissions = async () => {
    let data = null;
    try {
      const permissionResp = await fetchApi({
        url: `xusers/permission/${permissionId}`,
        params: {}
      });
      data = permissionResp.data;
    } catch (error) {
      console.error(`Error occurred while fetching Permissions ! ${error}`);
    }
    dispatch({
      type: "SET_DATA",
      data,
      grpData: data?.groupPermList.map((obj) => ({
        label: obj.groupName,
        value: obj.groupId
      })),
      usrData: data?.userPermList.map((obj) => ({
        label: obj.userName,
        value: obj.userId
      }))
    });
  };

  const fetchGroups = async (inputValue) => {
    let params = {};
    if (inputValue) {
      params["name"] = inputValue || "";
    }
    const groupResp = await fetchApi({
      url: "xusers/groups",
      params: params
    });
    return groupResp.data.vXGroups.map(({ name, id }) => ({
      label: name,
      value: id
    }));
  };

  const filterGrpOp = ({ data }) => {
    return findIndex(selectedGrp, data) === -1;
  };

  const addInSelectedGrp = (formData, input) => {
    dispatch({
      type: "SET_SELECTED_GRP",
      grpData: [...selectedGrp, ...formData.selectgroup]
    });
    input.onChange([]);
  };

  const handleRemoveGrp = (obj) => {
    let index = findIndex(selectedGrp, obj);
    if (index !== -1) {
      selectedGrp.splice(index, 1);
      dispatch({
        type: "SET_SELECTED_GRP",
        grpData: selectedGrp
      });
    }
  };

  const fetchUsers = async (inputValue) => {
    let params = {};
    if (inputValue) {
      params["name"] = inputValue || "";
    }
    const userResp = await fetchApi({
      url: "xusers/users",
      params: params
    });

    return userResp.data.vXUsers.map(({ name, id }) => ({
      label: name,
      value: id
    }));
  };

  const filterUsrOp = ({ data }) => {
    return findIndex(selectedUsr, data) === -1;
  };

  const addInSelectedUsr = (formData, input) => {
    dispatch({
      type: "SET_SELECTED_USR",
      usrData: [...selectedUsr, ...formData.selectuser]
    });
    input.onChange([]);
  };

  const handleRemoveUsr = (obj) => {
    let index = findIndex(selectedUsr, obj);
    if (index !== -1) {
      selectedUsr.splice(index, 1);
      dispatch({
        type: "SET_SELECTED_USR",
        usrData: selectedUsr
      });
    }
  };
  return loader ? (
    <Loader />
  ) : (
    <div>
      <h3 className="wrap-header bold">Edit Permission</h3>

      <div className="wrap non-collapsible">
        <Form
          id="myform2"
          name="myform2"
          onSubmit={onSubmit}
          initialValues={permissionData}
          render={({ handleSubmit, submitting, values }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-horizontal">
                <header>Module Details:</header>
                <hr className="zoneheader" />

                <div>
                  <Field
                    className="form-control"
                    name="module"
                    render={({ input }) => (
                      <FormB.Group
                        as={Row}
                        className="mb-3"
                        controlId="moduleName"
                      >
                        <FormB.Label column sm="3" className="text-right">
                          <strong>Module Name *</strong>
                        </FormB.Label>
                        <Col sm="4">
                          <FormB.Control {...input} disabled />
                        </Col>
                      </FormB.Group>
                    )}
                  />
                </div>
              </div>
              <br />
              <br />
              <div className="form-horizontal">
                <header>User and Group Permissions:</header>
                <hr className="zoneheader" />

                <Field
                  className="form-control"
                  name="zoneservices"
                  render={() => (
                    <FormB.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextEmail"
                    >
                      <FormB.Label className="text-right" column sm="2">
                        Permissions
                      </FormB.Label>
                      <Col sm="10">
                        <Table striped bordered>
                          <thead>
                            <tr>
                              <th className="text-center text-muted">
                                Select and Add Group
                              </th>
                              <th className="text-center text-muted">
                                Select and Add User{" "}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <Field
                                  className="form-control"
                                  name="selectgroup"
                                  render={({ input, meta }) => (
                                    <div>
                                      <AsyncSelect
                                        {...input}
                                        className="editpermselect"
                                        defaultOptions
                                        filterOption={filterGrpOp}
                                        loadOptions={fetchGroups}
                                        components={{
                                          DropdownIndicator: () => null,
                                          IndicatorSeparator: () => null
                                        }}
                                        isClearable={false}
                                        placeholder="Select Groups"
                                        width="500px"
                                        isMulti
                                      />

                                      <Button
                                        size="sm"
                                        className="ml-2"
                                        variant="outline-primary"
                                        onClick={() => {
                                          if (
                                            !values.selectgroup ||
                                            values.selectgroup.length === 0
                                          ) {
                                            toast.error(
                                              "Please select group!!"
                                            );
                                            return false;
                                          }
                                          addInSelectedGrp(values, input);
                                        }}
                                      >
                                        <i className="fa fa-plus"></i>
                                      </Button>
                                    </div>
                                  )}
                                />
                              </td>
                              <td>
                                <Field
                                  className="form-control"
                                  name="selectuser"
                                  render={({ input }) => (
                                    <div>
                                      <AsyncSelect
                                        {...input}
                                        className="editpermselect"
                                        defaultOptions
                                        filterOption={filterUsrOp}
                                        loadOptions={fetchUsers}
                                        isMulti
                                        width="500px"
                                        components={{
                                          DropdownIndicator: () => null,
                                          IndicatorSeparator: () => null
                                        }}
                                        isClearable={false}
                                        placeholder="Select Users"
                                      />
                                      <Button
                                        size="sm"
                                        className="ml-2"
                                        variant="outline-primary"
                                        onClick={() => {
                                          if (
                                            !values.selectuser ||
                                            values.selectuser.length === 0
                                          ) {
                                            toast.error("Please select user!!");
                                            return false;
                                          }
                                          addInSelectedUsr(values, input);
                                        }}
                                      >
                                        <i className="fa fa-plus"></i>
                                      </Button>
                                    </div>
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              {selectedGrp.length !== 0 ? (
                                <td>
                                  {selectedGrp.map((obj, index) => (
                                    <span
                                      className="selected-widget"
                                      key={index}
                                    >
                                      <i
                                        className="icon remove fa-fw fa fa-remove"
                                        onClick={(e) => handleRemoveGrp(obj)}
                                      />
                                      {obj.label}
                                    </span>
                                  ))}
                                </td>
                              ) : (
                                <td className="align-middle text-center">
                                  <strong className="text-danger font-italic">
                                    No Selected Groups
                                  </strong>
                                </td>
                              )}
                              {selectedUsr.length > 0 ? (
                                <td>
                                  {selectedUsr.map((obj, index) => (
                                    <span
                                      className="selected-widget"
                                      key={index}
                                    >
                                      <i
                                        className="icon remove fa-fw fa fa-remove"
                                        onClick={(e) => handleRemoveUsr(obj)}
                                      />
                                      {obj.label}
                                    </span>
                                  ))}
                                </td>
                              ) : (
                                <td className="align-middle text-center">
                                  <strong className="text-danger font-italic">
                                    No Selected Users
                                  </strong>
                                </td>
                              )}
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                    </FormB.Group>
                  )}
                />
              </div>

              <br />
              <hr />
              <div className="text-center">
                <Button
                  className="mr-2"
                  type="submit"
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={submitting}
                >
                  Save
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => {
                    props.history.push(`/permissions/models`);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        />
      </div>
    </div>
  );
};
export default EditPermission;
