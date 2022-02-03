import React, { Component } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { fetchApi } from "Utils/fetchAPI";
import Select from "react-select";
import { groupBy } from "lodash";
export class ImportPolicy extends Component {
  constructor() {
    super();
    this.state = {
      files: null,
      fileselc: null,
      fields: [{ value: null }],
      servicemap: null
    };
  }

  addServices = () => {
    const values = [...this.state.fields];
    values.push([{ value: null }]);
    this.setState({ fields: values });
  };

  removeServices = (i) => {
    const values = [...this.state.fields];
    values.splice(i, 1);
    this.setState({ fields: values });
  };
  removeFile = () => {
    this.setState({ files: null, fileselc: null });
  };
  handleUpload = (e) => {
    e.preventDefault();
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0]);
    if (e.target && e.target.files.length > 0) {
      this.setState({
        files: e.target.files[0].name
      });
    } else {
      return;
    }

    fileReader.onload = (e) => {
      this.setState({
        fileselc: JSON.parse(e.target.result),
        servicemap: groupBy(JSON.parse(e.target.result).policies, function (m) {
          return m.service;
        })
      });
    };
  };
  import = async () => {
    let importResp;

    try {
      importResp = await fetchApi({
        url: "/plugins/policies/importPoliciesFromFile"
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Services or CSRF headers! ${error}`
      );
    }
  };

  selectedZone = async (e) => {
    try {
      let zonesResp = [];

      if (e != undefined) {
        zonesResp = await fetchApi({
          url: `public/v2/api/zones/${e && e.value}/service-headers`
        });
      }
    } catch (error) {
      console.error(
        `Error occurred while fetching Service Definitions or CSRF headers! ${error}`
      );
    }
  };
  render() {
    return (
      <>
        <Modal show={this.props.shows} onHide={this.props.onHides} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Import Policy </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div>
                <div className="row">
                  <div className="col">
                    <b>Select File : </b>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label className="btn btn-default btn-file btn-sm border">
                      Select file
                      <i className="fa-fw fa fa-arrow-circle-o-up"> </i>
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={this.handleUpload}
                        accept=" .json "
                      />
                    </label>
                  </div>
                  <div className="col">
                    <label>
                      Override Policy:
                      <input type="checkbox" />
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    {this.state.files}
                    {this.state.files && (
                      <label
                        className="icon fa-fw fa fa-remove fa-fw fa fa-1x fa-fw fa fa-remove-btn"
                        onClick={() => {
                          this.removeFile();
                        }}
                      ></label>
                    )}
                  </div>
                </div>

                <div>
                  {!this.state.files && (
                    <div className="selectFile margin-left6">
                      No file chosen
                    </div>
                  )}
                </div>
              </div>
              {this.state.fileselc && (
                <div>
                  <hr />
                  <div className="alert alert-warning show">
                    <i className="fa-fw fa fa-info-circle searchInfo m-r-xs"></i>
                    All services gets listed on service destination when Zone
                    destination is blank. When zone is selected at destination,
                    then only services associated with that zone will be listed.
                  </div>

                  <Form>
                    <span className="font-weight-bold">
                      Specify Zone Mapping :
                    </span>

                    <Row className="mt-3">
                      <Col xs={4}>
                        <div className="col text-center">Source</div>
                      </Col>
                      <Col xs={4}>
                        <div className="col text-center">Destination</div>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col xs={4}>
                        <input
                          type="text"
                          className="form-control h-100 w-100"
                          disabled
                        />
                      </Col>
                      To
                      <Col xs={4}>
                        <Select
                          onChange={this.selectedZone}
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
                          name="colors"
                          placeholder="Enter service "
                        />
                      </Col>
                    </Row>
                  </Form>
                  <hr />

                  <Form>
                    <span className="font-weight-bold">
                      Specify Service Mapping :
                    </span>

                    <Row className="mt-3">
                      <Col xs={4}>
                        <div className="col text-center">Source</div>
                      </Col>
                      <Col xs={4}>
                        <div className="col text-center">Destination</div>
                      </Col>
                    </Row>
                    {this.state.fields.map((field, index) => {
                      return (
                        <Row className="mt-3" key={`${field}-${index}`}>
                          <Col xs={4}>
                            <Select
                              isClearable
                              components={{
                                IndicatorSeparator: () => null
                              }}
                              theme={this.Theme}
                              options={Object.keys(this.state.servicemap).map(
                                (obj) => {
                                  return { label: obj };
                                }
                              )}
                              name="colors"
                              placeholder="Enter service "
                            />
                          </Col>
                          To
                          <Col xs={4}>
                            <Select
                              isClearable
                              components={{
                                IndicatorSeparator: () => null
                              }}
                              theme={this.Theme}
                              options={this.props.service.map((services) => {
                                return {
                                  label: services.name
                                };
                              })}
                              name="colors"
                              placeholder="Enter service "
                            />
                          </Col>
                          <Col xs={1}>
                            <div className="col">
                              <a
                                className="pull-right"
                                onClick={() => this.removeServices(index)}
                              >
                                <i className="icon fa-fw fa fa-remove fa-fw fa fa-1x fa-fw fa fa-remove-btn"></i>
                              </a>
                            </div>
                          </Col>
                        </Row>
                      );
                    })}
                    <Row>
                      <Col className="pt-3 d-flex justify-content-between">
                        <button
                          type="button"
                          className="btn btn-sm border"
                          onClick={this.addServices}
                        >
                          <i className="fa-fw fa fa-plus"></i>
                        </button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.onHides}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.import}>
              Import
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ImportPolicy;
