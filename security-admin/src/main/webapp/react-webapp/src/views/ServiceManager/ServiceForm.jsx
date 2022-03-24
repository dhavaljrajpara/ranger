import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Form, Field } from "react-final-form";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { fetchApi, fetchCSRFConf } from "Utils/fetchAPI";
import Editable from "Components/Editable";
import ModalResourceComp from "../Resources/ModalResourceComp";
import ServiceAuditFilter from "./ServiceAuditFilter";
import { difference, keys, map, find } from "lodash";

class ServiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDelete: false,
      showModalResource: false,
      serviceDef: {},
      service: {},
      tagService: [],
      createInitialValues: {
        isEnabled: "true",
        configs: {
          hadoop_security_authorization: "true",
          hadoop_security_authentication: "simple",
          hadoop_rpc_protection: "authentication",
          hbase_security_authentication: "simple",
          nifi_authentication: "NONE",
          nifi_ssl_use_default_context: "true",
          nifi_registry_authentication: "NONE",
          nifi_registry_ssl_use_default_context: "true",
          schema_registry_authentication: "KERBEROS"
        },
        customConfigs: [undefined]
      },
      editInitialValues: {},
      usersDataRef: null,
      grpDataRef: null,
      rolesDataRef: null
    };
  }

  showDeleteModal = () => {
    this.setState({ showDelete: true });
  };

  hideDeleteModal = () => {
    this.setState({ showDelete: false });
  };

  componentDidMount() {
    this.fetchServiceDef();
    this.fetchTagService();
    this.loadUsers();
    this.loadGroups();
    this.loadRoles();
  }

  onSubmit = async (values) => {
    let serviceId;
    let apiMethod;
    let apiUrl;
    let apiSuccess;
    let apiError;
    const serviceJson = {};

    if (this.props.match.params.serviceId !== undefined) {
      serviceId = this.props.match.params.serviceId;
      apiMethod = "put";
      apiUrl = `plugins/services/${serviceId}`;
      apiSuccess = "updated";
      serviceJson["id"] = serviceId;
      apiError = "Error occurred while updating a service";
    } else {
      apiMethod = "post";
      apiUrl = `plugins/services`;
      apiSuccess = "created";
      apiError = "Error occurred while creating a service!";
    }

    serviceJson["name"] = values.name;
    serviceJson["displayName"] = values.displayName;
    serviceJson["description"] = values.description;
    serviceJson["type"] = this.state.serviceDef.name;
    serviceJson["tagService"] =
      values.tagService !== undefined ? values.tagService.value : "";
    serviceJson["isEnabled"] = values.isEnabled === "true";

    serviceJson["configs"] = {};
    for (const x in values.configs) {
      for (const y in this.configJson) {
        if (x === this.configJson[y]) {
          serviceJson["configs"][y] = values.configs[x];
        }
      }
    }

    values.customConfigs.map((c) => {
      c !== undefined && (serviceJson["configs"][c.name] = c.value);
    });

    // TODO to update ranger.plugin.audit.filters
    serviceJson["configs"]["ranger.plugin.audit.filters"] = "";

    try {
      await fetchApi({
        url: apiUrl,
        method: apiMethod,
        data: { ...this.state.service, ...serviceJson }
      });
      toast.success(`Successfully ${apiSuccess} the service`);
      this.props.history.push(
        this.state.serviceDef.name === "tag"
          ? "/policymanager/tag"
          : "/policymanager/resource"
      );
    } catch (error) {
      if (
        error.response !== undefined &&
        _.has(error.response, "data.msgDesc")
      ) {
        toast.error(error.response.data.msgDesc);
        this.props.history.push(
          this.state.serviceDef.name === "tag"
            ? "/policymanager/tag"
            : "/policymanager/resource"
        );
      }
    }
  };

  fetchServiceDef = async () => {
    let serviceDefResp;
    let serviceDefId = this.props.match.params.serviceDefId;
    try {
      serviceDefResp = await fetchApi({
        url: `plugins/definitions/${serviceDefId}`
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Service Definition or CSRF headers! ${error}`
      );
    }
    this.setState({
      serviceDef: serviceDefResp.data
    });
    console.log(
      "PRINT initial values from state",
      this.state.createInitialValues
    );
    let getAuditFilters = _.find(this.state.serviceDef.configs, {
      name: "ranger.plugin.audit.filters"
    });

    if (getAuditFilters && getAuditFilters !== undefined) {
      getAuditFilters = JSON.parse(
        getAuditFilters.defaultValue.replace(/'/g, '"')
      );
    }

    if (this.props.match.params.serviceId !== undefined) {
      this.fetchService();
    }
  };

  fetchService = async () => {
    let serviceResp;
    let serviceId = this.props.match.params.serviceId;
    try {
      serviceResp = await fetchApi({
        url: `plugins/services/${serviceId}`
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Service or CSRF headers! ${error}`
      );
    }

    this.setState({
      service: serviceResp.data
    });

    const serviceJson = {};
    serviceJson["name"] = serviceResp.data.name;
    serviceJson["displayName"] = serviceResp.data.displayName;
    serviceJson["description"] = serviceResp.data.description;
    serviceJson["isEnabled"] = JSON.stringify(serviceResp.data.isEnabled);

    serviceJson["tagService"] =
      serviceResp.data.tagService !== undefined
        ? {
            value: serviceResp.data.tagService,
            label: serviceResp.data.tagService
          }
        : null;

    serviceJson["configs"] = {};

    let configs = _.map(this.state.serviceDef.configs, "name");
    let customConfigs = _.difference(_.keys(serviceResp.data.configs), configs);

    configs.map((c) => {
      serviceJson["configs"][c.replaceAll(".", "_").replaceAll("-", "_")] =
        serviceResp.data.configs[c];
    });

    let editCustomConfigs = customConfigs.map((c) => {
      return { name: c, value: serviceResp.data.configs[c] };
    });

    serviceJson["customConfigs"] =
      editCustomConfigs.length == 0 ? [undefined] : editCustomConfigs;

    this.setState({
      editInitialValues: serviceJson
    });
  };

  fetchTagService = async () => {
    let tagServiceResp;
    try {
      tagServiceResp = await fetchApi({
        url: `plugins/services?serviceNamePartial=&serviceType=tag`
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Service of type tag or CSRF headers! ${error}`
      );
    }

    this.setState({
      tagService: tagServiceResp.data.services
    });
  };

  deleteService = async (serviceId) => {
    try {
      await fetchApi({
        url: `plugins/services/${serviceId}`,
        method: "delete"
      });
      toast.success("Successfully deleted the service");
      this.props.history.push("/policymanager/resource");
    } catch (error) {
      console.error(
        `Error occurred while deleting Service id - ${serviceId}!  ${error}`
      );
    }
  };

  serviceConfigs(serviceDef) {
    if (serviceDef.configs !== undefined) {
      const finalConfigs = serviceDef.configs.filter(
        (e) => e.name !== "ranger.plugin.audit.filters"
      );
      this.configJson = {};
      let formField = [];
      finalConfigs.map((configParam) => {
        this.configJson[configParam.name] = configParam.name
          .replaceAll(".", "_")
          .replaceAll("-", "_");
        switch (configParam.type) {
          case "string":
          case "int":
            formField.push(
              <Field
                name={"configs." + this.configJson[configParam.name]}
                key={configParam.itemId}
                validate={this.validateRequired(configParam.mandatory)}
              >
                {({ input, meta }) => (
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                      {configParam.label !== undefined
                        ? configParam.label
                        : configParam.name}
                      {configParam.mandatory ? " * " : ""}
                    </label>
                    <div className="col-sm-6">
                      <input {...input} type="text" className="form-control" />
                    </div>
                    {meta.error && meta.touched && (
                      <span className="invalid-field">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>
            );
            break;
          case "enum":
            const paramEnum = serviceDef.enums.find(
              (e) => e.name == configParam.subType
            );
            formField.push(
              <Field
                name={"configs." + this.configJson[configParam.name]}
                key={configParam.itemId}
                validate={this.validateRequired(configParam.mandatory)}
              >
                {({ input, meta }) => (
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                      {configParam.label !== undefined
                        ? configParam.label
                        : configParam.name}
                      {configParam.mandatory ? " * " : ""}
                    </label>
                    <div className="col-sm-6">
                      <select {...input} className="form-control">
                        {this.enumOptions(paramEnum)}
                      </select>
                    </div>
                    {meta.error && meta.touched && (
                      <span className="invalid-field">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>
            );
            break;
          case "bool":
            formField.push(
              <Field
                name={"configs." + this.configJson[configParam.name]}
                key={configParam.itemId}
                validate={this.validateRequired(configParam.mandatory)}
              >
                {({ input, meta }) => (
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                      {configParam.label !== undefined
                        ? configParam.label
                        : configParam.name}
                      {configParam.mandatory ? " * " : ""}
                    </label>
                    <div className="col-sm-6">
                      <select {...input} className="form-control">
                        {this.booleanOptions(configParam.subType)}
                      </select>
                    </div>
                    {meta.error && meta.touched && (
                      <span className="invalid-field">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>
            );
            break;
          case "password":
            formField.push(
              <Field
                name={"configs." + this.configJson[configParam.name]}
                key={configParam.itemId}
                validate={this.validateRequired(configParam.mandatory)}
              >
                {({ input, meta }) => (
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                      {configParam.label !== undefined
                        ? configParam.label
                        : configParam.name}
                      {configParam.mandatory ? " * " : ""}
                    </label>
                    <div className="col-sm-6">
                      <input
                        {...input}
                        type="password"
                        className="form-control"
                      />
                    </div>
                    {meta.error && meta.touched && (
                      <span className="invalid-field">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>
            );
            break;
        }
      });
      return formField;
    }
  }

  enumOptions(paramEnum) {
    let optionField = [];
    paramEnum.elements.map((e) => {
      optionField.push(
        <option value={e.name} key={e.name}>
          {e.label}
        </option>
      );
    });
    return optionField;
  }

  booleanOptions(paramBool) {
    let optionField = [];
    let b = paramBool.split(":");
    b = [b[0].substr(0, b[0].length - 4), b[1].substr(0, b[1].length - 5)];
    b.map((e) => {
      optionField.push(
        <option value={e === "Yes" ? true : false} key={e}>
          {e}
        </option>
      );
    });
    return optionField;
  }

  validateRequired = (isRequired) =>
    isRequired ? (value) => (value ? undefined : "Required") : () => {};

  SelectField = ({ input, ...rest }) => (
    <Select {...input} {...rest} searchable />
  );

  AsyncSelectField = ({ input, ...rest }) => (
    <AsyncSelect {...input} {...rest} cacheOptions isMulti />
  );

  loadUsers = async (inputValue, callback) => {
    let params = { name: inputValue || "", isVisible: 1 };
    let op = [];
    if (this.state.usersDataRef === null || inputValue) {
      const userResp = await fetchApi({
        url: "xusers/lookup/users",
        params: params
      });
      op = userResp.data.vXStrings;
      if (!inputValue) {
        this.state.usersDataRef = op;
      }
    } else {
      op = this.state.usersDataRef;
    }

    return op.map((obj) => ({
      label: obj.value,
      value: obj.value
    }));
  };

  loadGroups = async (inputValue, callback) => {
    let params = { name: inputValue || "", isVisible: 1 };
    let op = [];
    if (this.state.grpDataRef === null || inputValue) {
      const userResp = await fetchApi({
        url: "xusers/lookup/groups",
        params: params
      });
      op = userResp.data.vXStrings;
      if (!inputValue) {
        this.state.grpDataRef = op;
      }
    } else {
      op = this.state.grpDataRef;
    }

    return op.map((obj) => ({
      label: obj.value,
      value: obj.value
    }));
  };

  loadRoles = async (inputValue, callback) => {
    let params = { name: inputValue || "", isVisible: 1 };
    let op = [];
    if (this.state.rolesDataRef === null || inputValue) {
      const roleResp = await fetchApi({
        url: "roles/roles",
        params: params
      });
      op = roleResp.data.roles;
      if (!inputValue) {
        this.state.rolesDataRef = op;
      }
    } else {
      op = this.state.rolesDataRef;
    }

    return op.map((obj) => ({
      label: obj.name,
      value: obj.name
    }));
  };

  renderResourcesModal = (val) => {
    this.setState({
      showModalResource: val
    });
  };

  render() {
    return (
      <div>
        <div className="clearfix">
          <h4 className="wrap-header bold">
            {this.props.match.params.serviceId !== undefined
              ? `Edit`
              : `Create`}{" "}
            Service
          </h4>
        </div>
        <div className="wrap policy-manager">
          <div className="row">
            <div className="col-sm-12">
              <Form
                onSubmit={this.onSubmit}
                mutators={{
                  ...arrayMutators
                }}
                initialValues={
                  this.props.match.params.serviceId !== undefined
                    ? this.state.editInitialValues
                    : this.state.createInitialValues
                }
                render={({
                  handleSubmit,
                  form,
                  submitting,
                  pristine,
                  values,
                  form: {
                    mutators: { push: addItem, pop: removeItem }
                  }
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-sm-12">
                        <p className="form-header">Service Details :</p>
                        <Field
                          name="name"
                          validate={this.validateRequired(true)}
                        >
                          {({ input, meta }) => (
                            <div className="form-group row">
                              <label className="col-sm-3 col-form-label">
                                Service Name *
                              </label>
                              <div className="col-sm-6">
                                <input
                                  {...input}
                                  type="text"
                                  className="form-control"
                                />
                              </div>
                              {meta.error && meta.touched && (
                                <span className="invalid-field">
                                  {meta.error}
                                </span>
                              )}
                            </div>
                          )}
                        </Field>
                        <Field name="displayName">
                          {({ input, meta }) => (
                            <div className="form-group row">
                              <label className="col-sm-3 col-form-label">
                                Display Name
                              </label>
                              <div className="col-sm-6">
                                <input
                                  {...input}
                                  type="text"
                                  className="form-control"
                                />
                              </div>
                              {meta.error && meta.touched && (
                                <span className="invalid-field">
                                  {meta.error}
                                </span>
                              )}
                            </div>
                          )}
                        </Field>
                        <Field name="description">
                          {({ input, meta }) => (
                            <div className="form-group row">
                              <label className="col-sm-3 col-form-label">
                                Description
                              </label>
                              <div className="col-sm-6">
                                <textarea {...input} className="form-control" />
                              </div>
                              {meta.error && meta.touched && (
                                <span className="invalid-field">
                                  {meta.error}
                                </span>
                              )}
                            </div>
                          )}
                        </Field>
                        <div className="form-group row">
                          <label className="col-sm-3 col-form-label">
                            Active Status
                          </label>
                          <div className="col-sm-3 form-check form-check-inline">
                            <Field
                              name="isEnabled"
                              component="input"
                              type="radio"
                              value="true"
                              className="form-control"
                            />
                            <label className="form-check-label">Enabled</label>
                            <Field
                              name="isEnabled"
                              component="input"
                              type="radio"
                              value="false"
                              className="form-control"
                            />
                            <label className="form-check-label">Disabled</label>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-3 col-form-label">
                            Select Tag Service
                          </label>
                          <div className="col-sm-6">
                            <Field
                              name="tagService"
                              component={this.SelectField}
                              options={this.state.tagService.map((s) => {
                                return {
                                  value: s.name,
                                  label: s.name
                                };
                              })}
                              placeholder="Select Tag Service"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12">
                        <p className="form-header">Config Properties :</p>
                        {this.serviceConfigs(this.state.serviceDef)}
                        <div className="form-group row">
                          <label className="col-sm-3 col-form-label">
                            Add New Configurations
                          </label>
                          <div className="col-sm-6">
                            <Table bordered size="sm" className="no-bg-color">
                              <thead>
                                <tr>
                                  <th className="text-center">Name</th>
                                  <th className="text-center" colSpan="2">
                                    Value
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <FieldArray name="customConfigs">
                                  {({ fields }) =>
                                    fields.map((name, index) => (
                                      <tr key={name}>
                                        <td className="text-center">
                                          <Field
                                            name={`${name}.name`}
                                            component="input"
                                            className="form-control"
                                          />
                                        </td>
                                        <td className="text-center">
                                          <Field
                                            name={`${name}.value`}
                                            component="input"
                                            className="form-control"
                                          />
                                        </td>
                                        <td className="text-center">
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
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-4 offset-sm-3">
                            <Button
                              variant="outline-dark"
                              size="sm"
                              onClick={() =>
                                addItem("customConfigs", undefined)
                              }
                            >
                              <i className="fa-fw fa fa-plus"></i>
                            </Button>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="form-header">
                              Audit Filter :
                              <div className="form-check form-check-inline align-middle ml-1">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                />
                              </div>
                            </div>
                            <ServiceAuditFilter
                              serviceDetails={this.state.service}
                              serviceCompDetails={this.state.serviceDef}
                              fetchUsersData={this.loadUsers}
                              fetchGroupsData={this.loadGroups}
                              fetchRolesData={this.loadRoles}
                              addAuditFilter={addItem}
                              formValue={values}
                            />
                          </div>
                        </div>
                        <div className="form-group row mt-2 text-right">
                          <div className="col-sm-3 col-form-label">
                            <Button variant="outline-dark" size="sm">
                              Test Connection
                            </Button>
                          </div>
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
                          {this.props.match.params.serviceId !== undefined
                            ? `Save`
                            : `Add`}
                        </Button>
                        <Button
                          variant="secondary"
                          type="button"
                          size="sm"
                          onClick={() =>
                            this.props.history.push(
                              this.state.serviceDef.name === "tag"
                                ? "/policymanager/tag"
                                : "/policymanager/resource"
                            )
                          }
                        >
                          Cancel
                        </Button>
                        {this.props.match.params.serviceId !== undefined && (
                          <Button
                            variant="danger"
                            type="button"
                            size="sm"
                            onClick={() => {
                              this.showDeleteModal();
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                      {this.props.match.params.serviceId !== undefined && (
                        <Modal
                          show={this.state.showDelete}
                          onHide={this.hideDeleteModal}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Delete Service</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>Are you sure want to delete ?</Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="secondary"
                              size="sm"
                              title="Cancel"
                              onClick={this.hideDeleteModal}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              title="Yes"
                              onClick={(serviceId) =>
                                this.deleteService(
                                  this.props.match.params.serviceId
                                )
                              }
                            >
                              Yes
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      )}
                    </div>
                  </form>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ServiceForm;
