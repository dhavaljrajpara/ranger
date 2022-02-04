import React, { useEffect, useReducer } from "react";
import { Table, Button } from "react-bootstrap";
import { FieldArray } from "react-final-form-arrays";
import { Form as FormB, Row, Col } from "react-bootstrap";
import { Field } from "react-final-form";
import AsyncSelect from "react-select/async";
// import { fetchApi } from "Utils/fetchAPI";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { groupBy } from "lodash";

import Editable from "Components/Editable";
import { fetchApi } from "Utils/fetchAPI";

export default function PolicyPermissionItem(props) {
  const {
    addPolicyItem,
    attrName,
    serviceCompDetails,
    fetchUsersData,
    fetchGroupsData,
    fetchRolesData
  } = props;
  const permList = [
    "Select Roles",
    "Select Groups",
    "Select Users",
    "Permissions",
    "DeligateAdmin"
  ];
  const tableHeader = () => {
    return permList.map((data) => {
      return <th key={data}>{data}</th>;
    });
  };

  const getAccessTypeOptions = () => {
    return serviceCompDetails.accessTypes.map(({ label, name: value }) => ({
      label,
      value
    }));
  };
  // const fetchUsersData = async (inputValue) => {
  //   let params = { name: inputValue || "", isVisible: 1 };
  //   let op = [];
  //   if (usersDataRef.current === null || inputValue) {
  //     const userResp = await fetchApi({
  //       url: "xusers/lookup/users",
  //       params: params
  //     });
  //     op = userResp.data.vXStrings;
  //     if (!inputValue) {
  //       usersDataRef.current = op;
  //     }
  //   } else {
  //     op = usersDataRef.current;
  //   }

  //   return op.map((obj) => ({
  //     label: obj.value,
  //     value: obj.value
  //   }));
  // };
  // const fetchGroupsData = async (inputValue) => {
  //   let params = { name: inputValue || "", isVisible: 1 };
  //   let op = [];
  //   if (grpDataRef.current === null || inputValue) {
  //     const userResp = await fetchApi({
  //       url: "xusers/lookup/groups",
  //       params: params
  //     });
  //     op = userResp.data.vXStrings;
  //     if (!inputValue) {
  //       grpDataRef.current = op;
  //     }
  //   } else {
  //     op = grpDataRef.current;
  //   }

  //   return op.map((obj) => ({
  //     label: obj.value,
  //     value: obj.value
  //   }));
  // };
  // const fetchRolesData = async (inputValue) => {
  //   let params = { name: inputValue || "", isVisible: 1 };
  //   let op = [];
  //   if (rolesDataRef.current === null || inputValue) {
  //     const roleResp = await fetchApi({
  //       url: "roles/roles",
  //       params: params
  //     });
  //     op = roleResp.data.roles;
  //     if (!inputValue) {
  //       rolesDataRef.current = op;
  //     }
  //   } else {
  //     op = rolesDataRef.current;
  //   }

  //   return op.map((obj) => ({
  //     label: obj.name,
  //     value: obj.name
  //   }));
  // };
  return (
    <div>
      <Col sm="12">
        <Table striped bordered>
          <thead>
            <tr>{tableHeader()}</tr>
          </thead>
          <tbody>
            <FieldArray name={attrName}>
              {({ fields }) =>
                fields.map((name, index) => (
                  <tr key={name}>
                    {permList.map((colName) => {
                      if (colName == "Select Roles") {
                        return (
                          <td key={colName}>
                            <Field
                              className="form-control"
                              name={`${name}.roles`}
                              render={({ input, meta }) => (
                                <div>
                                  <AsyncSelect
                                    {...input}
                                    loadOptions={fetchRolesData}
                                    // onFocus={() => fetchRolesData()}
                                    defaultOptions
                                    cacheOptions
                                    isMulti
                                  />
                                  {meta.touched && meta.error && (
                                    <span>{meta.error}</span>
                                  )}
                                </div>
                              )}
                            />
                          </td>
                        );
                      }
                      if (colName == "Select Groups") {
                        return (
                          <td key={colName}>
                            <Field
                              className="form-control"
                              name={`${name}.groups`}
                              render={({ input, meta }) => (
                                <div>
                                  <AsyncSelect
                                    {...input}
                                    loadOptions={fetchGroupsData}
                                    defaultOptions
                                    cacheOptions
                                    isMulti
                                  />
                                  {meta.touched && meta.error && (
                                    <span>{meta.error}</span>
                                  )}
                                </div>
                              )}
                            />
                          </td>
                        );
                      }
                      if (colName == "Select Users") {
                        return (
                          <td key={colName}>
                            <Field
                              className="form-control"
                              name={`${name}.users`}
                              render={({ input, meta }) => (
                                <div>
                                  <AsyncSelect
                                    {...input}
                                    loadOptions={fetchUsersData}
                                    defaultOptions
                                    cacheOptions
                                    isMulti
                                  />
                                  {meta.touched && meta.error && (
                                    <span>{meta.error}</span>
                                  )}
                                </div>
                              )}
                            />
                          </td>
                        );
                      }
                      if (colName == "Permissions") {
                        return (
                          <td key={colName}>
                            <Field
                              className="form-control"
                              name={`${name}.accesses`}
                              render={({ input, meta }) => (
                                <div>
                                  <Editable
                                    {...input}
                                    placement="right"
                                    type="checkbox"
                                    options={getAccessTypeOptions()}
                                    showSelectAll={true}
                                    selectAllLabel="Select All"
                                  />
                                  {meta.touched && meta.error && (
                                    <span>{meta.error}</span>
                                  )}
                                </div>
                              )}
                            />
                          </td>
                        );
                      }
                      if (colName == "DeligateAdmin") {
                        return (
                          <td className="text-center">
                            <Field
                              name={`${name}.delegateAdmin`}
                              component="input"
                              type="checkbox"
                            />
                          </td>
                        );
                      }
                      return <td key={colName}>{colName}</td>;
                    })}
                    {/* <Field
                      name={`${name}.firstName`}
                      component="input"
                      placeholder="First Name"
                    /> */}
                    <td>
                      <span
                        onClick={() => fields.remove(index)}
                        style={{ cursor: "pointer" }}
                      >
                        ❌
                      </span>
                    </td>
                  </tr>
                ))
              }
            </FieldArray>
          </tbody>
        </Table>
      </Col>
      <Button type="button" onClick={() => addPolicyItem(attrName, undefined)}>
        +
      </Button>
    </div>
  );
}
