import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { Form, Field } from "react-final-form";
import { toast } from "react-toastify";

class ServiceForm extends Component {
  state = {
    serviceDef: [],
    show: false,
    initialValues: []
  };

  componentDidMount() {
    this.fetchServiceDef();
  }

  createService = async (values) => {
    console.log("onSubmit configJson", this.configJson);
    console.log("onSubmit createService", values);

    const serviceJson = {};

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
    console.log("onSubmit Final serviceJson ", serviceJson);
    const { fetchApi } = await import("Utils/fetchAPI");
    try {
      const serviceResp = await fetchApi({
        url: "plugins/services",
        method: "post",
        data: serviceJson
      });
      console.log(serviceResp.status);
      toast.success("Successfully created service");
      this.props.history.push("/");
    } catch (error) {
      console.error(`Error occurred while creating a service! ${error}`);
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
        this.configJson[configParam.name] = configParam.name.replaceAll(
          ".",
          "_"
        );
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
                      <select {...input} type="text" className="form-control">
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
                      <select {...input} type="text" className="form-control">
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
                onSubmit={this.createService}
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
                          {({ textarea, meta }) => (
                            <div className="form-group row">
                              <label className="col-sm-3 col-form-label">
                                Description
                              </label>
                              <div className="col-sm-6">
                                <textarea
                                  {...textarea}
                                  type="textarea"
                                  className="form-control"
                                />
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
                          disabled={submitting}
                        >
                          Add
                        </Button>
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={form.reset}
                          disabled={submitting || pristine}
                        >
                          Cancel
                        </Button>
                      </div>
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
