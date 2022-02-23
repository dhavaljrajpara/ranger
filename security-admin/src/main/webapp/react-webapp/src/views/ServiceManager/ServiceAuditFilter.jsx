import React, { useEffect, useReducer, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Field } from "react-final-form";
import { FieldError } from "Components/CommonComponents";
import { FieldArray } from "react-final-form-arrays";
import { Table, Button } from "react-bootstrap";
import { Col } from "react-bootstrap";
import ResourceComp from "../Resources/ResourceComp";
import Editable from "Components/Editable";
import AsyncSelect from "react-select/async";
import ModalResourceComp from "../Resources/ModalResourceComp";

export default function ServiceAuditFilter(props) {
  const {
    serviceDetails,
    serviceCompDetails,
    fetchUsersData,
    fetchGroupsData,
    fetchRolesData,
    addAuditFilter,
    formValue
  } = props;
  const [modelState, setModalstate] = useState({
    showModalResource: false,
    data: {}
  });
  const handleClose = () =>
    setModalstate({
      showModalResource: false,
      data: {}
    });
  const getAccessTypeOptions = () => {
    let srcOp = [];
    console.log(this);
    srcOp = serviceCompDetails.accessTypes;
    return srcOp.map(({ label, name: value }) => ({
      label,
      value
    }));
  };
  const SelectField = ({ input, ...rest }) => (
    <Select {...input} {...rest} searchable />
  );
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
  const renderResourcesModal = (input) => {
    setModalstate({
      showModalResource: true,
      resourceInput: input
    });
  };
  return (
    <div>
      <Col sm="12">
        <Table bordered size="sm" className="no-bg-color mt-3">
          <thead>
            <tr>{tableHeader()}</tr>
          </thead>
          <tbody>
            <FieldArray name="auditFilters">
              {({ fields }) =>
                fields.map((name, index) => (
                  <tr key={name}>
                    {permList.map((colName) => {
                      if (colName == "Is Audited") {
                        return (
                          <td key={colName}>
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
                          <td key={colName}>
                            <Field
                              className="form-control"
                              name={`${name}.accessResult`}
                              component="select"
                            >
                              <option />
                              <option value="DENIED">DENIED</option>
                              <option value="ALLOWED">ALLOWED</option>
                              <option value="NOT_DETERMINED">
                                NOT_DETERMINED
                              </option>
                            </Field>
                          </td>
                        );
                      }
                      if (colName == "Resources") {
                        return (
                          <td key={colName}>
                            <Field
                              name={`${name}.resources`}
                              render={(input) => (
                                <div>
                                  <div className="resource-list min-width-150">
                                    <div className="js-formInput">
                                      <div className="resourceGrp text-center">
                                        {input.value}
                                      </div>
                                    </div>
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      onClick={() =>
                                        renderResourcesModal(input)
                                      }
                                    >
                                      <i className="fa-fw fa fa-plus"></i>
                                    </Button>
                                    <a
                                      className="btn btn-danger btn-mini"
                                      data-action="deleteResources"
                                    >
                                      <i className="fa-fw fa fa-remove"></i>
                                    </a>
                                  </div>
                                </div>
                              )}
                            />
                          </td>
                        );
                      }
                      if (colName == "Operations") {
                        return (
                          <td key={colName}>
                            <Field
                              name={`${name}.actions`}
                              component="input"
                              className="form-control"
                            />
                          </td>
                        );
                      }
                      if (colName == "Permissions") {
                        return (
                          <td key={colName}>
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
                                </div>
                              )}
                            />
                          </td>
                        );
                      }
                      if (colName == "Groups") {
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
                                </div>
                              )}
                            />
                          </td>
                        );
                      }
                      if (colName == "Users") {
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
                                </div>
                              )}
                            />
                          </td>
                        );
                      }

                      return <td key={colName}>{colName}</td>;
                    })}
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
      <Button
        type="button"
        onClick={() => addAuditFilter("auditFilters", undefined)}
      >
        +
      </Button>
      <ModalResourceComp
        serviceDetails={serviceDetails}
        serviceCompDetails={serviceCompDetails}
        cancelButtonText="Cancel"
        actionButtonText="Submit"
        formValues={formValue}
        modelState={modelState}
        handleClose={handleClose}
      />
    </div>
  );
}
