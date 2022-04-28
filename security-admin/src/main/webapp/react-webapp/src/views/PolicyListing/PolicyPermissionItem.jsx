import React, { useMemo } from "react";
import { Table, Button } from "react-bootstrap";
import { FieldArray } from "react-final-form-arrays";
import { Col } from "react-bootstrap";
import { Field } from "react-final-form";
import AsyncSelect from "react-select/async";
import { find, groupBy } from "lodash";

import Editable from "Components/Editable";
import { RangerPolicyType } from "Utils/XAEnums";
import { fetchApi } from "Utils/fetchAPI";

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
  const permList = [
    "Select Roles",
    "Select Groups",
    "Select Users",
    "Permissions"
  ];
  if (
    RangerPolicyType.RANGER_ACCESS_POLICY_TYPE.value == formValues.policyType
  ) {
    permList.push("DeligateAdmin");
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
  return (
    <div>
      <Col sm="12">
        <Table bordered>
          <thead className="thead-light">
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
                                <div className="table-editable">
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
                                    placement="right"
                                    type="checkbox"
                                    options={getMaskingAccessTypeOptions()}
                                    showSelectAll={false}
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
                                    placement="right"
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
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        title="Remove"
                        onClick={() => fields.remove(index)}
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
      <Button type="button" onClick={() => addPolicyItem(attrName, undefined)}>
        +
      </Button>
    </div>
  );
}
