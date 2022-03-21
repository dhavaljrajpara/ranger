import React, { Component } from "react";
import { Form, Field } from "react-final-form";
import Select from "react-select";
import { Alert, Button, Col, Modal, Row } from "react-bootstrap";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import { toast } from "react-toastify";
import { find, has, groupBy, map, toString, uniq } from "lodash";
import { fetchApi } from "Utils/fetchAPI";

class ImportPolicy extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      fileName: null,
      fileJsonData: null,
      sourceServicesMap: null,
      destServices: null,
      sourceZoneName: "",
      destZoneName: "",
      initialFormFields: {},
      filterFormFields: {}
    };
  }

  removeFile = () => {
    this.setState({ fileName: null, fileJsonData: null });
  };

  handleFileUpload = (e) => {
    e.preventDefault();
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0]);
    if (e.target && e.target.files.length > 0) {
      this.setState({
        fileName: e.target.files[0].name,
        file: e.target.files[0]
      });
    } else {
      return;
    }

    fileReader.onload = (e) => {
      let jsonParseFileData = JSON.parse(e.target.result);
      let servicesJsonParseFile = _.groupBy(
        jsonParseFileData.policies,
        function (policy) {
          return policy.service;
        }
      );

      let zoneNameJsonParseFile;
      if (
        _.has(jsonParseFileData, "policies") &&
        jsonParseFileData.policies.length > 0
      ) {
        zoneNameJsonParseFile = jsonParseFileData.policies[0].zoneName;
      }

      let serviceFieldsFromJson = Object.keys(servicesJsonParseFile).map(
        (obj) => {
          if (this.props.isParentImport) {
            return {
              sourceServiceName: { value: obj, label: obj },
              destServiceName: { value: obj, label: obj }
            };
          } else {
            let sameDefType = _.find(this.props.services, {
              name: obj,
              type: this.props.serviceDef.name
            });
            return {
              sourceServiceName: { value: obj, label: obj },
              destServiceName:
                sameDefType !== undefined
                  ? { value: obj, label: obj }
                  : undefined
            };
          }
        }
      );

      const formFields = {};
      formFields["serviceFields"] = serviceFieldsFromJson;
      formFields["sourceZoneName"] = zoneNameJsonParseFile;
      formFields["isOverride"] = false;

      this.setState({
        fileJsonData: jsonParseFileData,
        sourceServicesMap: servicesJsonParseFile,
        destServices: this.props.services,
        sourceZoneName: zoneNameJsonParseFile,
        initialFormFields: formFields,
        filterFormFields: formFields
      });
    };
  };

  importJsonFile = async (values) => {
    let serviceTypeList;
    let servicesMapJson = {};
    let zoneMapJson = {};

    _.map(values.serviceFields, function (field) {
      return (
        field !== undefined &&
        (servicesMapJson[field.sourceServiceName.value] =
          field.destServiceName.value)
      );
    });

    zoneMapJson[values.sourceZoneName] = this.state.destZoneName;

    let importData = new FormData();
    importData.append("file", this.state.file);
    importData.append(
      "servicesMapJson",
      new Blob([JSON.stringify(servicesMapJson)], {
        type: "application/json"
      })
    );
    importData.append(
      "zoneMapJson",
      new Blob([JSON.stringify(zoneMapJson)], {
        type: "application/json"
      })
    );

    if (this.props.isParentImport) {
      serviceTypeList = _.toString(_.uniq(_.map(this.props.services, "type")));
    } else {
      serviceTypeList = this.props.serviceDef.name;
    }

    try {
      await fetchApi({
        url: "/plugins/policies/importPoliciesFromFile",
        params: {
          serviceType: serviceTypeList,
          isOverride: values.isOverride
        },
        method: "post",
        data: importData
      });
      this.props.onHide();
      toast.success("Successfully imported the file");
    } catch (error) {
      this.props.onHide();
      toast.error(error.response.data.msgDesc);
      console.error(`Error occurred while importing policies! ${error}`);
    }
  };

  handleSelectedZone = async (e) => {
    let zonesResp = [];

    try {
      if (e && e !== undefined) {
        zonesResp = await fetchApi({
          url: `public/v2/api/zones/${e && e.value}/service-headers`
        });

        let zoneServiceNames = _.map(zonesResp.data, "name");

        let zoneServices = zoneServiceNames.map((zoneService) => {
          return this.props.services.filter((service) => {
            return service.name === zoneService;
          });
        });

        zoneServices = zoneServices.flat();

        let serviceFieldsFromJson = Object.keys(
          this.state.sourceServicesMap
        ).map((obj) => {
          let zoneServiceType = _.find(zoneServices, {
            name: obj
          });
          return {
            sourceServiceName: { value: obj, label: obj },
            destServiceName:
              zoneServiceType !== undefined
                ? { value: obj, label: obj }
                : undefined
          };
        });

        const formFields = {};
        formFields["serviceFields"] = serviceFieldsFromJson;
        formFields["sourceZoneName"] =
          this.state.initialFormFields["sourceZoneName"];

        this.setState({
          destZoneName: e && e.label,
          destServices: zoneServices,
          filterFormFields: formFields
        });
      } else {
        this.setState({
          destZoneName: "",
          destServices: this.props.services,
          filterFormFields: this.state.initialFormFields
        });
      }
    } catch (error) {
      console.error(
        `Error occurred while fetching Service Definitions or CSRF headers! ${error}`
      );
    }
  };

  SelectField = ({ input, ...rest }) => (
    <Select {...input} {...rest} searchable />
  );

  render() {
    return (
      <React.Fragment>
        <Modal show={this.props.show} onHide={this.props.onHide} size="lg">
          <Form
            onSubmit={this.importJsonFile}
            mutators={{
              ...arrayMutators
            }}
            initialValues={this.state.filterFormFields}
            render={({
              handleSubmit,
              values,
              form: {
                mutators: { push: addItem, pop: removeItem }
              }
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                  <Modal.Title>Import Policy </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <React.Fragment>
                    <Row>
                      <Col sm={12}>
                        <div className="form-row">
                          <Field name="uploadPolicyFile">
                            {({ input, meta }) => (
                              <div className="form-group col-sm-6">
                                <label className="">Select File :</label>
                                <input
                                  {...input}
                                  type="file"
                                  className="form-control-file"
                                  accept=" .json "
                                  onChange={this.handleFileUpload}
                                />
                              </div>
                            )}
                          </Field>
                          <div className="form-group col-sm-6 text-center">
                            <div className="form-check">
                              <Field
                                name="isOverride"
                                component="input"
                                type="checkbox"
                                className="form-check-input"
                              />
                              <label className="form-check-label">
                                Override Policy
                              </label>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    {this.state.fileJsonData && (
                      <React.Fragment>
                        <hr />
                        <Row>
                          <Col sm={12}>
                            <Alert variant="warning" show={true}>
                              <i className="fa-fw fa fa-info-circle searchInfo m-r-xs"></i>
                              All services gets listed on service destination
                              when Zone destination is blank. When zone is
                              selected at destination, then only services
                              associated with that zone will be listed.
                            </Alert>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={12}>
                            <p className="font-weight-bold">
                              Specify Zone Mapping :
                            </p>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col sm={4}>
                            <div className="col text-center">Source</div>
                          </Col>
                          <Col sm={4}>
                            <div className="col text-center">Destination</div>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col sm={4}>
                            <Field name="sourceZoneName">
                              {({ input, meta }) => (
                                <input
                                  {...input}
                                  type="text"
                                  className="form-control"
                                  disabled
                                />
                              )}
                            </Field>
                          </Col>
                          <Col sm={1}>To</Col>
                          <Col sm={4}>
                            <Select
                              onChange={this.handleSelectedZone}
                              isClearable
                              components={{
                                IndicatorSeparator: () => null
                              }}
                              theme={this.Theme}
                              options={this.props.zones.map((zone) => {
                                return {
                                  value: zone.id,
                                  label: zone.name
                                };
                              })}
                              placeholder="No Zone Selected"
                            />
                          </Col>
                        </Row>
                        <hr />
                        <Row>
                          <Col sm={12}>
                            <p className="font-weight-bold">
                              Specify Service Mapping :
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={4}>
                            <div className="col text-center">Source</div>
                          </Col>
                          <Col sm={4}>
                            <div className="col text-center">Destination</div>
                          </Col>
                        </Row>
                        <FieldArray name="serviceFields">
                          {({ fields }) =>
                            fields.map((name, index) => (
                              <Row className="mt-2" key={name}>
                                <Col sm={4}>
                                  <Field
                                    isClearable
                                    name={`${name}.sourceServiceName`}
                                    component={this.SelectField}
                                    options={Object.keys(
                                      this.state.sourceServicesMap
                                    ).map((obj) => {
                                      return { value: obj, label: obj };
                                    })}
                                    placeholder="No Service Selected"
                                  />
                                </Col>
                                <Col sm={1}>To</Col>
                                <Col sm={4}>
                                  <Field
                                    isClearable
                                    name={`${name}.destServiceName`}
                                    component={this.SelectField}
                                    options={this.state.destServices.map(
                                      (service) => {
                                        return {
                                          value: service.name,
                                          label: service.name
                                        };
                                      }
                                    )}
                                    placeholder="No Service Selected"
                                  />
                                </Col>
                                <Col sm={1}>
                                  <Button
                                    className="mt-1"
                                    variant="danger"
                                    size="sm"
                                    title="Remove"
                                    onClick={() => fields.remove(index)}
                                  >
                                    <i className="fa-fw fa fa-remove"></i>
                                  </Button>
                                </Col>
                              </Row>
                            ))
                          }
                        </FieldArray>
                        <Row className="mt-3">
                          <Col sm={2}>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                addItem("serviceFields", undefined)
                              }
                            >
                              <i className="fa-fw fa fa-plus"></i>
                            </Button>
                          </Col>
                        </Row>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.props.onHide}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Import
                  </Button>
                </Modal.Footer>
              </form>
            )}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

export default ImportPolicy;
