import React, { Component } from "react";
import {
  Accordion,
  Card,
  Form,
  Row,
  Col,
  Table,
  Badge,
  Button,
  Modal
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchApi } from "Utils/fetchAPI";
import { isSystemAdmin, isKeyAdmin } from "Utils/XAUtils";

class ZoneDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      expand: true,
      show: true,
      showDeleteModal: null,
      isAdminRole: isSystemAdmin() || isKeyAdmin()
    };
    this.expandbtn = this.expandbtn.bind(this);
    this.showMoreLess = this.showMoreLess.bind(this);
    this.closeZoneModal = this.closeZoneModal.bind(this);
  }

  componentDidMount() {
    this.fetchServices();
  }

  deleteZoneModal = (zoneId) => {
    this.setState({ showDeleteModal: zoneId });
  };

  closeZoneModal = () => {
    this.setState({ showDeleteModal: null });
  };

  fetchServices = async () => {
    var servicesResp;
    try {
      servicesResp = await fetchApi({
        url: "plugins/services",
        params: {
          page: 0,
          pageSize: 200,
          total_pages: 0,
          startIndex: 0
        }
      });
    } catch (error) {
      console.error(`Error occurred while fetching Services! ${error}`);
    }
    this.setState({
      services: servicesResp.data.services
    });
  };

  expandbtn = () => {
    this.setState({ expand: true });
  };

  showMoreLess = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="clearfix">
            <div className="float-left">
              <Button
                variant="outline-secondary"
                size="sm"
                className="btn-slide-toggle m-r-sm pull-left"
                aria-controls="example-collapse-text"
                aria-expanded={this.props.isCollapse}
                onClick={() => this.props.expandBtn(this.props.isCollapse)}
              >
                <i className="fa-fw fa fa-reorder"></i>
              </Button>
              <span className="text-info h2 px-2">{this.props.zone.name}</span>
            </div>
            {this.state.isAdminRole && (
              <div className="float-right">
                <Link
                  className="btn btn-sm btn-outline-primary m-r-5"
                  title="Edit"
                  to={`/zones/edit/${this.props.zone.id}`}
                >
                  <i className="fa-fw fa fa-edit"></i> Edit
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  title="Delete"
                  onClick={() => this.deleteZoneModal(this.props.zone.id)}
                >
                  <i className="fa-fw fa fa-trash"></i> Delete
                </Button>
                <Modal
                  show={this.state.showDeleteModal === this.props.zone.id}
                  onHide={this.closeZoneModal}
                  backdrop="static"
                >
                  <Modal.Header
                    closeButton
                  >{`Are you sure you want to delete ?`}</Modal.Header>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeZoneModal}>
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        this.props.deleteZone(this.props.zone.id);
                      }}
                    >
                      OK
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            )}
          </div>
          <br />
          <span className="h6">{this.props.zone.description}</span>
          <br />
          <div>
            <Accordion defaultActiveKey="0">
              <Card>
                <div className="border-bottom">
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey="0"
                    onClick={this.showMoreLess}
                    className="border-bottom-0"
                  >
                    Zone Administrations
                    {this.state.show ? (
                      <i className="fa fa-angle-up pull-right fa-lg font-weight-bold"></i>
                    ) : (
                      <i className="fa fa-angle-down pull-right fa-lg font-weight-bold"></i>
                    )}
                  </Accordion.Toggle>
                </div>
                <Accordion.Collapse eventKey="0">
                  <Card.Body className="p-0">
                    <Form className="border border-white shadow-none p-0">
                      <Form.Group as={Row} className="mb-3 ">
                        <Form.Label className="text-right" column sm="3">
                          Admin Users
                        </Form.Label>
                        <Col sm="9">
                          {this.props.zone.adminUsers.length > 0 ? (
                            this.props.zone.adminUsers.map((obj, index) => {
                              return (
                                <h6 key={index} className="d-inline mr-1">
                                  <Badge variant="info">{obj}</Badge>
                                </h6>
                              );
                            })
                          ) : (
                            <p className="mt-1">--</p>
                          )}
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label className="text-right" column sm="3">
                          Admin Usergroups
                        </Form.Label>
                        <Col sm="9">
                          {this.props.zone.adminUserGroups.length > 0 ? (
                            this.props.zone.adminUserGroups.map(
                              (obj, index) => {
                                return (
                                  <h6 key={index} className="d-inline mr-1">
                                    <Badge variant="secondary">{obj}</Badge>
                                  </h6>
                                );
                              }
                            )
                          ) : (
                            <span className="mt-1">--</span>
                          )}
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label className="text-right" column sm="3">
                          Auditor Users
                        </Form.Label>
                        <Col sm="9">
                          {this.props.zone.auditUsers.length > 0 ? (
                            this.props.zone.auditUsers.map((obj, index) => {
                              return (
                                <h6 key={index} className="d-inline mr-1">
                                  <Badge variant="info">{obj}</Badge>
                                </h6>
                              );
                            })
                          ) : (
                            <span className="mt-1">--</span>
                          )}
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label className="text-right" column sm="3">
                          Auditor Usergroups
                        </Form.Label>
                        <Col sm="9">
                          {this.props.zone.auditUserGroups.length > 0 ? (
                            this.props.zone.auditUserGroups.map(
                              (obj, index) => {
                                return (
                                  <h6 key={index} className="d-inline mr-1">
                                    <Badge variant="secondary">{obj}</Badge>
                                  </h6>
                                );
                              }
                            )
                          ) : (
                            <span className="mt-1">--</span>
                          )}
                        </Col>
                      </Form.Group>
                    </Form>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
          <br />
          <div>
            <Accordion defaultActiveKey="1">
              <Card>
                <div className="border-bottom">
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey="1"
                    onClick={this.showMoreLess}
                    className="border-bottom-0"
                  >
                    Zone Tag Services
                    {this.state.show ? (
                      <i className="fa fa-angle-up pull-right fa-lg font-weight-bold"></i>
                    ) : (
                      <i className="fa fa-angle-down pull-right fa-lg font-weight-bold"></i>
                    )}
                  </Accordion.Toggle>
                </div>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    {this.props.zone.tagServices.length !== 0 ? (
                      this.props.zone.tagServices.map((obj, index) => (
                        <h6 key={index} className="d-inline mr-1">
                          <Badge variant="info">{obj}</Badge>
                        </h6>
                      ))
                    ) : (
                      <h6 className="text-muted large mt-2">
                        No tag based services are associated with this zone
                      </h6>
                    )}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
          <br />
          <div>
            <Accordion defaultActiveKey="2">
              <Card>
                <div className="border-bottom">
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey="2"
                    onClick={this.showMoreLess}
                    className="border-bottom-0"
                  >
                    Services
                    {this.state.show ? (
                      <i className="fa fa-angle-up pull-right fa-lg font-weight-bold"></i>
                    ) : (
                      <i className="fa fa-angle-down pull-right fa-lg font-weight-bold"></i>
                    )}
                  </Accordion.Toggle>
                </div>
                <Accordion.Collapse eventKey="2">
                  <Card.Body>
                    <Table striped bordered>
                      <thead>
                        <tr>
                          <th className="p-3 mb-2 bg-white text-dark  align-middle text-center">
                            Service Name
                          </th>
                          <th className="p-3 mb-2 bg-white text-dark align-middle text-center">
                            Service Type
                          </th>
                          <th className="p-3 mb-2 bg-white text-dark align-middle text-center">
                            Resource
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(this.props.zone.services).map(
                          (key, index) => {
                            let servicetype = Object.values(
                              this.state.services
                            ).find((obj) => {
                              return obj.name === key;
                            });

                            return (
                              <tr className="bg-white" key={index}>
                                <td className="align-middle" width="20%">
                                  {key}
                                </td>
                                <td className="align-middle" width="20%">
                                  {servicetype &&
                                    servicetype.type.toString().toUpperCase()}
                                </td>
                                <td
                                  className="text-center"
                                  width="32%"
                                  height="55px"
                                >
                                  {this.props.zone.services[key].resources.map(
                                    (resource, index) => (
                                      <div
                                        className="resource-group"
                                        key={index}
                                      >
                                        {Object.keys(resource).map(
                                          (resourceKey, index) => (
                                            <p key={index}>
                                              <strong>{`${resourceKey} : `}</strong>
                                              {resource[resourceKey].join(", ")}
                                            </p>
                                          )
                                        )}
                                      </div>
                                    )
                                  )}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        </div>
        <br />
      </div>
    );
  }
}
export default ZoneDisplay;
