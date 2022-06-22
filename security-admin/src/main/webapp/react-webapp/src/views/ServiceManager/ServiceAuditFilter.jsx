import React, { useState } from "react";
import { Badge, Button, Table } from "react-bootstrap";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import Editable from "Components/Editable";
import CreatableField from "Components/CreatableField";
import ModalResourceComp from "../Resources/ModalResourceComp";
import { uniq, map, join, isEmpty, find, toUpper } from "lodash";
import TagBasePermissionItem from "../PolicyListing/TagBasePermissionItem";

export default function ServiceAuditFilter(props) {
  const {
    serviceDetails,
    serviceDefDetails,
    fetchUsersData,
    fetchGroupsData,
    fetchRolesData,
    addAuditFilter,
    formValues
  } = props;

  const [modelState, setModalstate] = useState({
    showModalResource: false,
    resourceInput: null,
    data: {}
  });

  const handleClose = () =>
    setModalstate({
      showModalResource: false,
      resourceInput: null,
      data: {}
    });

  const renderResourcesModal = (input) => {
    setModalstate({
      showModalResource: true,
      resourceInput: input,
      data: isEmpty(input.value) ? {} : input.value
    });
  };

  const handleSave = () => {
    let inputData;
    inputData = modelState.data;
    modelState.resourceInput.onChange(inputData);
    handleClose();
  };

  const handleRemove = (input) => {
    for (const obj in input.value) {
      delete input.value[obj];
    }
    setModalstate({
      showModalResource: false,
      resourceInput: null,
      data: {}
    });
  };

  const getResourceData = (resourceData) => {
    let dataStructure = [];

    let levels = uniq(map(serviceDefDetails.resources, "level"));

    dataStructure = levels.map((level, index) => {
      if (
        resourceData[`resourceName-${level}`] !== undefined &&
        resourceData[`value-${level}`] !== undefined
      ) {
        let excludesSupported = find(serviceDefDetails.resources, {
          level: level,
          excludesSupported: true
        });
        let recursiveSupported = find(serviceDefDetails.resources, {
          level: level,
          recursiveSupported: true
        });
        return (
          <div className="resource-filter" key={index}>
            <div>
              <span className="bold mr-1">
                {resourceData[`resourceName-${level}`].name}
              </span>
              :
              <span className="ml-1">
                {join(map(resourceData[`value-${level}`], "value"), ", ")}
              </span>
            </div>
            <div className="pull-right ml-3">
              {resourceData[`isRecursiveSupport-${level}`] !== undefined && (
                <h6>
                  {resourceData[`isRecursiveSupport-${level}`] ? (
                    <span className="badge badge-dark">Recursive</span>
                  ) : (
                    <span className="badge badge-dark">Non Recursive</span>
                  )}
                </h6>
              )}
              {resourceData[`isExcludesSupport-${level}`] !== undefined && (
                <h6>
                  {resourceData[`isExcludesSupport-${level}`] ? (
                    <span className="badge badge-dark">Include</span>
                  ) : (
                    <span className="badge badge-dark">Exclude</span>
                  )}
                </h6>
              )}
              {recursiveSupported !== undefined &&
                resourceData[`isRecursiveSupport-${level}`] === undefined && (
                  <h6>
                    <span className="badge badge-dark">Recursive</span>
                  </h6>
                )}
              {excludesSupported !== undefined &&
                resourceData[`isExcludesSupport-${level}`] === undefined && (
                  <h6>
                    <span className="badge badge-dark">Include</span>
                  </h6>
                )}
            </div>
          </div>
        );
      }
    });

    return dataStructure;
  };

  const getResourceIcon = (resourceData) => {
    let iconClass = !isEmpty(resourceData)
      ? "fa fa-fw fa-pencil"
      : "fa fa-fw fa-plus";

    return iconClass;
  };

  const getAccessTypeOptions = () => {
    let srcOp = [];
    srcOp = serviceDefDetails.accessTypes;
    return srcOp.map(({ label, name: value }) => ({
      label,
      value
    }));
  };

  const getTagAccessType = (value) => {
    return value.map((obj, index) => {
      return (
        <h6 className="d-inline mr-1" key={index}>
          <Badge variant="info">{toUpper(obj.serviceName)}</Badge>
        </h6>
      );
    });
  };

  const permList = [
    "Is Audited",
    "Access Result",
    "Resources",
    "Operations",
    "Permissions",
    "Users",
    "Groups",
    "Roles"
  ];

  const tableHeader = () => {
    return permList.map((data) => {
      return <th key={data}>{data}</th>;
    });
  };

  const handleSelectChange = (value, input) => {
    input.onChange(value);
  };

  return (
    <React.Fragment>
      <Table bordered size="sm" className="mt-3 table-audit-filter text-center">
        <thead>
          <tr>{tableHeader()}</tr>
        </thead>
        <tbody>
          {formValues.auditFilters !== undefined &&
            formValues.auditFilters.length === 0 && (
              <tr className="text-center">
                <td colSpan={permList.length}>
                  Click on below <i className="fa-fw fa fa-plus"></i>
                  button to add audit filter !!
                </td>
              </tr>
            )}

          <FieldArray name="auditFilters">
            {({ fields }) =>
              fields.map((name, index) => (
                <tr key={name}>
                  {permList.map((colName) => {
                    if (colName == "Is Audited") {
                      return (
                        <td key={`${name}.isAudited`}>
                          <Field
                            className="form-control audit-filter-select"
                            name={`${name}.isAudited`}
                            component="select"
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </Field>
                        </td>
                      );
                    }
                    if (colName == "Access Result") {
                      return (
                        <td key={colName} style={{ width: 200 }}>
                          <Field
                            className="form-control"
                            name={`${name}.accessResult`}
                          >
                            {({ input, meta }) => (
                              <Select
                                {...input}
                                isClearable={false}
                                options={[
                                  { value: "DENIED", label: "DENIED" },
                                  { value: "ALLOWED", label: "ALLOWED" },
                                  {
                                    value: "NOT_DETERMINED",
                                    label: "NOT_DETERMINED"
                                  }
                                ]}
                                menuPlacement="auto"
                                placeholder="Select Value"
                              />
                            )}
                          </Field>
                        </td>
                      );
                    }
                    if (colName == "Resources") {
                      return (
                        <td key={`${name}.resources`} style={{ width: 170 }}>
                          <Field
                            name={`${name}.resources`}
                            render={({ input }) => (
                              <React.Fragment>
                                <div>
                                  <div className="resource-group">
                                    {getResourceData(input.value)}
                                  </div>

                                  <Button
                                    className="mr-1"
                                    variant="primary"
                                    size="sm"
                                    onClick={() => renderResourcesModal(input)}
                                  >
                                    <i
                                      className={getResourceIcon(input.value)}
                                    ></i>
                                  </Button>
                                  <Button
                                    className="mr-1"
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleRemove(input)}
                                  >
                                    <i className="fa-fw fa fa-remove"></i>
                                  </Button>
                                </div>
                              </React.Fragment>
                            )}
                          />
                        </td>
                      );
                    }
                    if (colName == "Operations") {
                      return (
                        <td key={`${name}.actions`} style={{ width: 180 }}>
                          <Field
                            className="form-control"
                            name={`${name}.actions`}
                          >
                            {({ input, meta }) => (
                              <CreatableField
                                actionValues={input.value}
                                creatableOnChange={(value) =>
                                  handleSelectChange(value, input)
                                }
                              />
                            )}
                          </Field>
                        </td>
                      );
                    }
                    if (colName == "Permissions") {
                      if (serviceDefDetails.name == "tag") {
                        return (
                          <td
                            key={`${name}.accessTypes`}
                            style={{ width: 120 }}
                          >
                            <Field
                              className="form-control"
                              name={`${name}.accessTypes`}
                              render={({ input }) => (
                                <React.Fragment>
                                  <div className="table-editable">
                                    <TagBasePermissionItem
                                      options={getAccessTypeOptions()}
                                      inputVal={input}
                                    />
                                  </div>
                                  <div>
                                    {input.value.tableList !== undefined &&
                                    input.value.tableList.length > 0
                                      ? getTagAccessType(input.value.tableList)
                                      : "----"}
                                  </div>
                                </React.Fragment>
                              )}
                            />
                          </td>
                        );
                      } else {
                        return (
                          <td
                            key={`${name}.accessTypes`}
                            style={{ width: 120 }}
                          >
                            <Field
                              className="form-control"
                              name={`${name}.accessTypes`}
                              render={({ input }) => (
                                <div>
                                  <Editable
                                    {...input}
                                    placement="right"
                                    type="checkbox"
                                    options={getAccessTypeOptions()}
                                    showSelectAll={true}
                                    selectAllLabel="Select All"
                                  />
                                </div>
                              )}
                            />
                          </td>
                        );
                      }
                    }
                    if (colName == "Roles") {
                      return (
                        <td key={`${name}.roles`} style={{ width: 200 }}>
                          <Field
                            className="form-control"
                            name={`${name}.roles`}
                            render={({ input, meta }) => (
                              <div>
                                <AsyncSelect
                                  {...input}
                                  components={{
                                    IndicatorSeparator: () => null
                                  }}
                                  loadOptions={fetchRolesData}
                                  isClearable={false}
                                  menuPlacement="auto"
                                  defaultOptions
                                  cacheOptions
                                  isMulti
                                />
                              </div>
                            )}
                          />
                        </td>
                      );
                    }
                    if (colName == "Groups") {
                      return (
                        <td key={`${name}.groups`} style={{ width: 200 }}>
                          <Field
                            className="form-control"
                            name={`${name}.groups`}
                            render={({ input, meta }) => (
                              <div>
                                <AsyncSelect
                                  {...input}
                                  components={{
                                    IndicatorSeparator: () => null
                                  }}
                                  loadOptions={fetchGroupsData}
                                  isClearable={false}
                                  menuPlacement="auto"
                                  defaultOptions
                                  cacheOptions
                                  isMulti
                                />
                              </div>
                            )}
                          />
                        </td>
                      );
                    }
                    if (colName == "Users") {
                      return (
                        <td key={`${name}.users`} style={{ width: 200 }}>
                          <Field
                            className="form-control"
                            name={`${name}.users`}
                            render={({ input, meta }) => (
                              <div>
                                <AsyncSelect
                                  {...input}
                                  components={{
                                    IndicatorSeparator: () => null
                                  }}
                                  loadOptions={fetchUsersData}
                                  isClearable={false}
                                  menuPlacement="auto"
                                  defaultOptions
                                  cacheOptions
                                  isMulti
                                />
                              </div>
                            )}
                          />
                        </td>
                      );
                    }

                    return <td key={colName}>{colName}</td>;
                  })}
                  <td key={`${index}.remove`}>
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

      <Button
        variant="outline-dark"
        size="sm"
        type="button"
        onClick={() => addAuditFilter("auditFilters", undefined)}
      >
        <i className="fa-fw fa fa-plus"></i>
      </Button>

      <ModalResourceComp
        serviceDetails={serviceDetails}
        serviceCompDetails={serviceDefDetails}
        cancelButtonText="Cancel"
        actionButtonText="Submit"
        handleSave={handleSave}
        modelState={modelState}
        handleClose={handleClose}
        policyItem={false}
      />
    </React.Fragment>
  );
}
