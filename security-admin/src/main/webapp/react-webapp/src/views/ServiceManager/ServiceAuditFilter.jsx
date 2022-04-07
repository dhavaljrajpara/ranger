import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import Editable from "Components/Editable";
import ModalResourceComp from "../Resources/ModalResourceComp";
import { uniq, map, join, isEmpty } from "lodash";

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
    data: {},
    index: 0
  });

  const handleClose = () =>
    setModalstate({
      showModalResource: false,
      resourceInput: null,
      data: {},
      index: 0
    });

  const renderResourcesModal = (input) => {
    setModalstate({
      showModalResource: true,
      resourceInput: input,
      data: {},
      index: -1
    });
  };

  const handleSave = () => {
    if (modelState.index === -1) {
      let add;
      add = modelState.data;
      modelState.resourceInput.onChange(add);
      handleClose();
    } else {
      let edit = modelState.resourceInput.value;
      edit = modelState.data;
      modelState.resourceInput.onChange(edit);
      handleClose();
    }
  };

  const getResourceData = (resourceData) => {
    let dataStructure = [];

    let level = uniq(map(serviceDefDetails.resources, "level"));

    dataStructure = level.map((l, index) => {
      if (
        resourceData[`resourceName-${l}`] !== undefined &&
        resourceData[`value-${l}`] !== undefined
      ) {
        return (
          <div className="clearfix text-left" key={index}>
            <p className="pull-left">
              <span className="bold mr-1">
                {resourceData[`resourceName-${l}`].name}
              </span>
              :
              <span className="ml-1">
                {join(map(resourceData[`value-${l}`], "value"), ", ")}
              </span>
            </p>
            <p className="pull-right"></p>
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
                <td colSpan={permList.length}>No Audit Filter Data Found !!</td>
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
                            className="form-control"
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
                                <div className="resource-list min-width-150">
                                  <div className="resource-group text-center">
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
                                  <a className="btn btn-danger btn-sm">
                                    <i className="fa-fw fa fa-remove"></i>
                                  </a>
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
                              <CreatableSelect
                                {...input}
                                components={{
                                  DropdownIndicator: () => null
                                }}
                                menuIsOpen={false}
                                isClearable={false}
                                isMulti
                                placeholder="Type Action Name"
                              />
                            )}
                          </Field>
                        </td>
                      );
                    }
                    if (colName == "Permissions") {
                      return (
                        <td key={`${name}.accessTypes`} style={{ width: 120 }}>
                          <Field
                            className="form-control"
                            name={`${name}.accessTypes`}
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
                              </div>
                            )}
                          />
                        </td>
                      );
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
