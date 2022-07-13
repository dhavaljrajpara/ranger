import React, { Component } from "react";
import { Button, Table, Row, Col } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { toast } from "react-toastify";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import { fetchApi } from "Utils/fetchAPI";
import { Loader, scrollToError } from "../../components/CommonComponents";
import { commonBreadcrumb } from "../../utils/XAUtils";
import { isUndefined, has } from "lodash";
import withRouter from "Hooks/withRouter";

class KeyCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      service: {},
      definition: {},
      loader: true
    };
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  fetchInitialData = async () => {
    await this.fetchKmsServices();
    await this.fetchKmsDefinition();
  };

  onSubmit = async (values) => {
    const serviceJson = {};
    let apiError = "Error occurred while creating Key";
    serviceJson.name = values.name;
    serviceJson.cipher = values.cipher;
    serviceJson.length = values.length;
    serviceJson.description = values.description;
    serviceJson.attributes = {};

    for (let key of Object.keys(values.attributes))
      if (!isUndefined(values.attributes[key])) {
        serviceJson.attributes[values.attributes[key].name] =
          values.attributes[key].value;
      }
    try {
      await fetchApi({
        url: "keys/key",
        method: "post",
        params: {
          provider: this.props.params.serviceName
        },
        data: serviceJson
      });
      toast.success(`Success! Key created succesfully`);
      this.props.navigate(
        `/kms/keys/edit/manage/${this.props.location.state.detail}`,
        { state: { detail: this.props.location.state.detail } }
      );
    } catch (error) {
      if (error.response !== undefined && has(error.response, "data.msgDesc")) {
        toast.error(apiError + " : " + error.response.data.msgDesc);
      }
    }
  };
  fetchKmsServices = async () => {
    let serviceResp;
    try {
      serviceResp = await fetchApi({
        url: `plugins/services/name/${this.props.params.serviceName}`
      });
    } catch (error) {
      console.error(`Error occurred while fetching Services! ${error}`);
    }
    this.setState({ service: serviceResp, loader: false });
  };

  fetchKmsDefinition = async () => {
    this.setState({ loader: true });
    let kmsDefinition;
    try {
      kmsDefinition = await fetchApi({
        url: `plugins/definitions/name/${
          this.state.service.data && this.state.service.data.type
        }`
      });
    } catch (error) {
      console.error(`Error occurred while fetching Definitions! ${error}`);
    }
    this.setState({ definition: kmsDefinition, loader: false });
  };

  closeForm = () => {
    this.props.navigate(
      `/kms/keys/edit/manage/${this.props.params.serviceName}`
    );
  };
  validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = {
        required: true,
        text: "Required"
      };
    }
    return errors;
  };
  keyCreateBreadcrumb = () => {
    let serviceDetails = {};
    serviceDetails["serviceDefId"] =
      this.state.definition.data && this.state.definition.data.id;
    serviceDetails["serviceId"] =
      this.state.service.data && this.state.service.data.id;
    serviceDetails["serviceName"] = this.props.params.serviceName;
    return commonBreadcrumb(
      ["Kms", "KmsKeyForService", "KmsKeyCreate"],
      serviceDetails
    );
  };
  render() {
    return this.state.loader ? (
      <Loader />
    ) : (
      <div>
        {this.keyCreateBreadcrumb()}
        <h4 className="wrap-header bold">Key Detail</h4>
        <Form
          onSubmit={this.onSubmit}
          mutators={{
            ...arrayMutators
          }}
          validate={this.validate}
          initialValues={{
            attributes: [{ name: "", value: "" }],
            cipher: "AES/CTR/NoPadding",
            length: "128"
          }}
          render={({
            handleSubmit,
            form,
            submitting,
            pristine,
            invalid,
            errors,
            form: {
              mutators: { push: addItem }
            }
          }) => (
            <div className="wrap">
              <form
                onSubmit={(event) => {
                  if (invalid) {
                    let selector =
                      document.getElementById("isError") ||
                      document.querySelector(
                        `input[name=${Object.keys(errors)[0]}]`
                      );
                    scrollToError(selector);
                  }
                  handleSubmit(event);
                }}
              >
                <Field name="name">
                  {({ input, meta }) => (
                    <Row className="form-group">
                      <Col xs={3}>
                        <label className="form-label pull-right">
                          Key Name *
                        </label>
                      </Col>
                      <Col xs={4}>
                        <input
                          {...input}
                          name="name"
                          type="text"
                          id={meta.error && meta.touched ? "isError" : "name"}
                          className={
                            meta.error && meta.touched
                              ? "form-control border-danger"
                              : "form-control"
                          }
                        />
                        {meta.error && meta.touched && (
                          <span className="invalid-field">
                            {meta.error.text}
                          </span>
                        )}
                      </Col>
                    </Row>
                  )}
                </Field>

                <Field name="cipher">
                  {({ input }) => (
                    <Row className="form-group">
                      <Col xs={3}>
                        <label className="form-label pull-right">Cipher</label>
                      </Col>
                      <Col xs={4}>
                        <input
                          {...input}
                          name="cipher"
                          type="text"
                          className="form-control"
                        />
                      </Col>
                    </Row>
                  )}
                </Field>

                <Field name="length">
                  {({ input }) => (
                    <Row className="form-group">
                      <Col xs={3}>
                        <label className="form-label pull-right">Length</label>
                      </Col>
                      <Col xs={4}>
                        <input
                          {...input}
                          name="length"
                          type="number"
                          className="form-control"
                        />
                      </Col>
                    </Row>
                  )}
                </Field>
                <Field name="description">
                  {({ input }) => (
                    <Row className="form-group">
                      <Col xs={3}>
                        <label className="form-label pull-right">
                          Description
                        </label>
                      </Col>
                      <Col xs={4}>
                        <textarea {...input} className="form-control" />
                      </Col>
                    </Row>
                  )}
                </Field>
                <Row className="form-group">
                  <Col xs={3}>
                    <label className="form-label pull-right">Attributes</label>
                  </Col>
                  <Col xs={6}>
                    <Table bordered size="sm" className="no-bg-color w-75">
                      <thead>
                        <tr>
                          <th className="text-center">Name</th>
                          <th className="text-center" colSpan="2">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <FieldArray name="attributes">
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
                                    title="Yes"
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
                </Row>
                <Row className="form-group">
                  <Col xs={3}>
                    <label className="form-label pull-right"></label>
                  </Col>
                  <Col xs={6}>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => addItem("attributes")}
                    >
                      <i className="fa-fw fa fa-plus"></i>
                    </Button>
                  </Col>
                </Row>
                <Row className="form-actions">
                  <Col sm={{ span: 9, offset: 3 }}>
                    <Button
                      variant="primary"
                      type="submit"
                      size="sm"
                      disabled={submitting}
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      type="button"
                      size="sm"
                      onClick={() => {
                        form.reset;
                        this.closeForm();
                      }}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </form>
            </div>
          )}
        />
      </div>
    );
  }
}

export default withRouter(KeyCreate);
