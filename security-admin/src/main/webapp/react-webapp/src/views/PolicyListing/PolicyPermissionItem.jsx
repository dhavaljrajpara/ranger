import React, { useMemo, useState } from "react";
import { Table, Button, Badge, Form } from "react-bootstrap";
import { FieldArray } from "react-final-form-arrays";
import { Col } from "react-bootstrap";
import { Field } from "react-final-form";
import AsyncSelect from "react-select/async";
import { find, groupBy, isEmpty, isObject } from "lodash";

import Editable from "Components/Editable";
import { RangerPolicyType } from "Utils/XAEnums";
import { fetchApi } from "Utils/fetchAPI";
import { toast } from "react-toastify";
import TagBasePermissionItem from "./TagBasePermissionItem";

const noneOptions = {
  label: "None",
  value: "none"
};

export default function PolicyPermissionItem(props) {
  const {
    addPolicyItem,
    attrName,
    serviceCompDetails,
    fetchUsersData,
    fetchGroupsData,
    fetchRolesData,
    formValues
  } = props;
  // const [showTagPermissionItem, tagPermissionItem] = useState(false);
  const permList = ["Select Roles", "Select Groups", "Select Users"];
  if (serviceCompDetails?.policyConditions?.length > 0) {
    permList.push("Policy Conditions");
  }
  permList.push("Permissions");
  if (
    RangerPolicyType.RANGER_ACCESS_POLICY_TYPE.value == formValues.policyType &&
    serviceCompDetails.name !== "tag"
  ) {
    permList.push("Deligate Admin");
  }
  if (
    RangerPolicyType.RANGER_MASKING_POLICY_TYPE.value == formValues.policyType
  ) {
    permList.push("Select Masking Option");
  }
  if (
    RangerPolicyType.RANGER_ROW_FILTER_POLICY_TYPE.value ==
    formValues.policyType
  ) {
    permList.push("Row Level Filter");
  }

  const tableHeader = () => {
    return permList.map((data) => {
      return <th key={data}>{data}</th>;
    });
  };

  const grpResourcesKeys = useMemo(() => {
    const { resources = [] } = serviceCompDetails;
    const grpResources = groupBy(resources, "level");
    let grpResourcesKeys = [];
    for (const resourceKey in grpResources) {
      grpResourcesKeys.push(+resourceKey);
    }
    grpResourcesKeys = grpResourcesKeys.sort();
    return grpResourcesKeys;
  }, []);

  const getAccessTypeOptions = () => {
    let srcOp = [];
    for (let i = grpResourcesKeys.length - 1; i >= 0; i--) {
      let selectedResource = `resourceName-${grpResourcesKeys[i]}`;
      if (
        formValues[selectedResource] &&
        formValues[selectedResource].value !== noneOptions.value
      ) {
        if (
          RangerPolicyType.RANGER_MASKING_POLICY_TYPE.value ==
          formValues.policyType
        ) {
          srcOp = serviceCompDetails.dataMaskDef.accessTypes;
        } else if (
          RangerPolicyType.RANGER_ROW_FILTER_POLICY_TYPE.value ==
          formValues.policyType
        ) {
          srcOp = serviceCompDetails.rowFilterDef.accessTypes;
        } else {
          srcOp = serviceCompDetails.accessTypes;
        }
        if (formValues[selectedResource].accessTypeRestrictions?.length > 0) {
          let op = [];
          for (const name of formValues[selectedResource]
            .accessTypeRestrictions) {
            let typeOp = find(srcOp, { name });
            if (typeOp) {
              op.push(typeOp);
            }
          }
          srcOp = op;
        }
        break;
      }
    }
    return srcOp.map(({ label, name: value }) => ({
      label,
      value
    }));
  };
  const getMaskingAccessTypeOptions = () => {
    if (serviceCompDetails.dataMaskDef.maskTypes.length > 0) {
      return serviceCompDetails.dataMaskDef.maskTypes.map(
        ({ label, name: value }) => ({
          label,
          value
        })
      );
    }
  };

  const requiredForPermission = (fieldVals, index) => {
    if (fieldVals && !isEmpty(fieldVals[index])) {
      let error, accTypes;
      let users = (fieldVals[index]?.users || []).length > 0;
      let grps = (fieldVals[index]?.groups || []).length > 0;
      let roles = (fieldVals[index]?.roles || []).length > 0;
      if (fieldVals[index]?.accesses && isObject(fieldVals[index]?.accesses)) {
        accTypes = (fieldVals[index]?.accesses || {}) !== {};
      } else {
        accTypes = (fieldVals[index]?.accesses || []).length > 0;
      }
      if ((users || grps || roles) && !accTypes) {
        error = "Please select permision item for selected users/groups/roles";
      }
      if (accTypes && !users && !grps && !roles) {
        error = "Please select users/groups/roles for selected permission item";
      }
      return error;
    }
  };

  const tagAccessTypeDisplayVal = (val) => {
    return val.map((m, index) => {
      return (
        <>
          <h6 className="d-inline mr-1" key={index}>
            <Badge variant="info">{m.serviceName.toUpperCase()}</Badge>
          </h6>
        </>
      );
    });
  };

  const required = (value) => (value ? undefined : "Required");
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "235px"
    }),
    multiValueLabel: () => ({
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    })
  };
  return (
    <div>
      <Col sm="12" className="policyTable">
        <Table bordered className="plcypermissiontable table-responsive">
          <thead className="thead-light">
            <tr>
              {tableHeader()}
              <th></th>
            </tr>
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
                                    defaultOptions
                                    styles={customStyles}
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
                                    styles={customStyles}
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
                              // validate={required}
                              render={({ input, meta }) => (
                                <div>
                                  <AsyncSelect
                                    {...input}
                                    loadOptions={fetchUsersData}
                                    styles={customStyles}
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
                      if (colName == "Policy Conditions") {
                        return serviceCompDetails?.policyConditions?.length ==
                          1 ? (
                          <td key={colName}>
                            <Field
                              className="form-control"
                              name={`${name}.conditions`}
                              render={({ input, meta }) => (
                                <div className="table-editable">
                                  <Editable
                                    {...input}
                                    placement="auto"
                                    type="select"
                                    conditionDefVal={
                                      serviceCompDetails.policyConditions[0]
                                    }
                                    servicedefName={serviceCompDetails.name}
                                    selectProps={{ isMulti: true }}
                                  />
                                  {meta.touched && meta.error && (
                                    <span>{meta.error}</span>
                                  )}
                                </div>
                              )}
                            />
                          </td>
                        ) : (
                          <td key={colName}>
                            <Field
                              className="form-control"
                              name={`${name}.conditions`}
                              render={({ input, meta }) => (
                                <div className="table-editable">
                                  <Editable
                                    {...input}
                                    placement="auto"
                                    type="custom"
                                    conditionDefVal={
                                      serviceCompDetails.policyConditions
                                    }
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
                        if (serviceCompDetails.name == "tag") {
                          return (
                            <td key={colName}>
                              {fields?.value[index]?.accesses?.tableList
                                .length > 0 ? (
                                <h6 className="d-inline mr-1 mb-1">
                                  <span className="editable-edit-text">
                                    {tagAccessTypeDisplayVal(
                                      fields.value[index].accesses.tableList
                                    )}
                                  </span>
                                </h6>
                              ) : (
                                <></>
                              )}
                              <Field
                                className="form-control"
                                name={`${name}.accesses`}
                                validate={(value, formValues) =>
                                  requiredForPermission(
                                    formValues[attrName],
                                    index
                                  )
                                }
                                render={({ input, meta }) => (
                                  <div className="table-editable">
                                    <TagBasePermissionItem
                                      options={getAccessTypeOptions()}
                                      inputVal={input}
                                    />
                                    {meta.error && (
                                      <div className="invalid-field">
                                        {meta.error}
                                      </div>
                                    )}
                                  </div>
                                )}
                              />
                            </td>
                          );
                        } else {
                          return (
                            <td key={colName}>
                              <Field
                                className="form-control"
                                name={`${name}.accesses`}
                                validate={(value, formValues) =>
                                  requiredForPermission(
                                    formValues[attrName],
                                    index
                                  )
                                }
                                render={({ input, meta }) => (
                                  <div className="table-editable">
                                    <Editable
                                      {...input}
                                      placement="auto"
                                      type="checkbox"
                                      options={getAccessTypeOptions()}
                                      showSelectAll={true}
                                      selectAllLabel="Select All"
                                    />
                                    {meta.error && (
                                      <span className="invalid-field">
                                        {meta.error}
                                      </span>
                                    )}
                                  </div>
                                )}
                              />
                            </td>
                          );
                        }
                      }
                      if (colName == "Select Masking Option") {
                        return (
                          <td key={colName}>
                            <Field
                              className="form-control"
                              name={`${name}.dataMaskInfo`}
                              render={({ input, meta }) => (
                                <div className="table-editable">
                                  <Editable
                                    {...input}
                                    placement="auto"
                                    type="radio"
                                    options={getMaskingAccessTypeOptions()}
                                    showSelectAll={false}
                                    selectAllLabel="Select All"
                                  />
                                  {fields?.value[index]?.dataMaskInfo?.label ==
                                    "Custom" && (
                                    <>
                                      <Field
                                        className="form-control"
                                        name={`${name}.dataMaskInfo.valueExpr`}
                                        validate={required}
                                        render={({ input, meta }) => (
                                          <>
                                            <Form.Control
                                              type="text"
                                              {...input}
                                              placeholder="Enter masked value or expression..."
                                              // width="80%"
                                            />
                                            {meta.error && (
                                              <span>{meta.error}</span>
                                            )}
                                          </>
                                        )}
                                      />
                                    </>
                                  )}
                                  {meta.touched && meta.error && (
                                    <span>{meta.error}</span>
                                  )}
                                </div>
                              )}
                            />
                          </td>
                        );
                      }
                      if (colName == "Row Level Filter") {
                        return (
                          <td key={colName}>
                            <Field
                              className="form-control"
                              name={`${name}.rowFilterInfo`}
                              render={({ input, meta }) => (
                                <div className="table-editable">
                                  <Editable
                                    {...input}
                                    placement="auto"
                                    type="input"
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
                      if (
                        colName == "Deligate Admin" &&
                        serviceCompDetails.name !== "tag"
                      ) {
                        return (
                          <td className="text-center">
                            <Field
                              name={`${name}.delegateAdmin`}
                              component="input"
                              type="checkbox"
                              data-js="delegatedAdmin"
                              data-cy="delegatedAdmin"
                            />
                          </td>
                        );
                      }
                      return <td key={colName}>{colName}</td>;
                    })}
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        title="Remove"
                        onClick={() => fields.remove(index)}
                        data-action="delete"
                        data-cy="delete"
                      >
                        <i className="fa-fw fa fa-remove"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              }
            </FieldArray>
          </tbody>
        </Table>
      </Col>
      <Button
        className="btn btn-mini"
        type="button"
        onClick={() => addPolicyItem(attrName, undefined)}
        data-action="addGroup"
        data-cy="addGroup"
        title="Add"
      >
        <i className="fa-fw fa fa-plus"></i>{" "}
      </Button>
    </div>
  );
}
