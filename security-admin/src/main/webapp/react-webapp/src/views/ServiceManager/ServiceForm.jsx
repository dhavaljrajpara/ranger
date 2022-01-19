import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { Form, Field } from "react-final-form";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import { mapKeys } from "lodash";

class ServiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDelete: false,
      serviceDef: {},
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
        }
      },
      editInitialValues: {}
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
    if (this.props.match.params.serviceId !== undefined) {
      this.fetchService();
    }
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
    serviceJson["tagService"] = values.tagService;
    serviceJson["isEnabled"] = Boolean(values.isEnabled);

    console.log("onSubmit serviceJson", serviceJson);
    console.log("onSubmit configs values", values.configs);

    serviceJson["configs"] = {};
    for (const x in values.configs) {
      for (const y in this.configJson) {
        if (x === this.configJson[y]) {
          serviceJson["configs"][y] = values.configs[x];
        }
      }
    }
    serviceJson["configs"]["ranger.plugin.audit.filters"] = "";
    console.log("onSubmit Final serviceJson ", serviceJson);
    const { fetchApi } = await import("Utils/fetchAPI");
    try {
      await fetchApi({
        url: apiUrl,
        method: apiMethod,
        data: serviceJson
      });
      toast.success(`Successfully ${apiSuccess} the service`);
      this.props.history.push("/policymanager/resource");
    } catch (error) {
      console.error(`${apiError} ${error}`);
    }
  };

  fetchServiceDef = async () => {
    let serviceDefResp;
    let serviceDefId = this.props.match.params.serviceDefId;
    console.log("serviceDefId : ", serviceDefId);
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      serviceDefResp = await fetchApi({
        url: `plugins/definitions/${serviceDefId}`
      });
      console.log("serviceDefResp", serviceDefResp.data);
    } catch (error) {
      console.error(
        `Error occurred while fetching Service Definition or CSRF headers! ${error}`
      );
    }
    this.setState({
      serviceDef: serviceDefResp.data
    });
  };

  fetchService = async () => {
    let serviceResp;
    let serviceDefId = this.props.match.params.serviceDefId;
    let serviceId = this.props.match.params.serviceId;
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      serviceResp = await fetchApi({
        url: `plugins/services/${serviceId}`
      });
      console.log("serviceResp", serviceResp.data);
    } catch (error) {
      console.error(
        `Error occurred while fetching Service or CSRF headers! ${error}`
      );
    }

    let formConfigs = _.mapKeys(serviceResp.data.configs, (value, key) =>
      key.replaceAll(".", "_").replaceAll("-", "_")
    );

    serviceResp.data.configs = formConfigs;
    serviceResp.data.isEnabled = JSON.stringify(serviceResp.data.isEnabled);
    this.setState({
      editInitialValues: serviceResp.data
    });
  };

  deleteService = async (serviceId) => {
    console.log("Service Id to delete is ", serviceId);
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
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
    console.log("serviceDef", serviceDef);
    if (serviceDef.configs !== undefined) {
      const finalConfigs = serviceDef.configs.filter(
        (e) => e.name !== "ranger.plugin.audit.filters"
      );
      console.log("serviceDef configs", finalConfigs);
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
                    {meta.error && meta.touched && <span>{meta.error}</span>}
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
                    {meta.error && meta.touched && <span>{meta.error}</span>}
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
                    {meta.error && meta.touched && <span>{meta.error}</span>}
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
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
            );
            break;
        }
      });
      console.log("print configJson", this.configJson);
      console.log("print formField", formField);
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

  render() {
    return (
      <div>
        <div className="clearfix">
          <h4 className="wrap-header bold">Create Service</h4>
        </div>
        <div className="wrap policy-manager">
          <div className="row">
            <div className="col-sm-12">
              <Form
                onSubmit={this.onSubmit}
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
                  values
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
                                <span>{meta.error}</span>
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
                                <span>{meta.error}</span>
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
                                <span>{meta.error}</span>
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
                        <Field name="tagService">
                          {({ input, meta }) => (
                            <div className="form-group row">
                              <label className="col-sm-3 col-form-label">
                                Select Tag Service
                              </label>
                              <div className="col-sm-6">
                                <input
                                  {...input}
                                  type="text"
                                  className="form-control"
                                />
                              </div>
                              {meta.error && meta.touched && (
                                <span>{meta.error}</span>
                              )}
                            </div>
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12">
                        <p className="form-header">Config Properties :</p>
                        {this.serviceConfigs(this.state.serviceDef)}
                        <div className="form-group row">
                          <div className="col-sm-3 col-form-label">
                            <Button variant="secondary" type="button" size="sm">
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
                          onClick={form.reset}
                          disabled={submitting || pristine}
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
