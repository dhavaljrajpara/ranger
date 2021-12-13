import React from "react";
import { fetchApi } from "Utils/fetchAPI";
import { Accordion, Card, Form, Row, Col, Table, Badge } from "react-bootstrap";

export class ZoneDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoneslist: this.props.zoneslisting,
      expand: true,
      services: []
    };
    this.expandbtn = this.expandbtn.bind(this);
  }

  componentDidMount() {
    this.fetchServices();
  }
  fetchServices = async () => {
    var servicesResp;
    try {
      servicesResp = await fetchApi({
        url: "plugins/services"
      });
    } catch (error) {
      console.error(`Error occurred while fetching Services! ${error}`);
    }
    this.setState({
      services: servicesResp.data.services
    });
  };
  expandbtn = () => {
    this.setState({ expand: !this.state.expand });
  };

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="clearfix">
            <div className="float-left">
              <button
                onClick={this.expandbtn}
                className="btn btn-sm btn-slide-toggle m-r-sm btn-secondary pull-left"
              >
                <i className="fa-fw fa fa-reorder"></i>
              </button>
              <span className="text-info h2 px-2">
                {this.props.zoneslisting.name}
              </span>
            </div>
            <div className="float-right">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary m-r-5"
              >
                <i className="fa-fw fa fa-edit"></i>
                Edit
              </button>
              <button type="button" className="btn btn-sm btn-danger">
                <i className="fa-fw fa fa-trash"></i>
                Delete
              </button>
            </div>
          </div>
          <br />
          <span className="h6">{this.props.zoneslisting.name}</span>
          <br />
          <div>
            <Accordion defaultActiveKey="0">
              <div>
                {" "}
                <Card>
                  <Card.Header>
                    Zone Administrations
                    <div className="pull-right">
                      <Accordion.Toggle
                        eventKey="0"
                        style={{
                          background: "#f7f7f7",
                          border: "none"
                        }}
                      >
                        <i className="fa fa-angle-down"></i>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body className="p-0">
                      <Form className="border border-white shadow-none p-0">
                        <Form.Group as={Row} className="mb-3 ">
                          <Form.Label className="text-right" column sm="3">
                            Admin Users
                          </Form.Label>
                          <Col sm="15">
                            {this.props.zoneslisting.adminUsers.map((obj) => {
                              return (
                                <Badge
                                  key={obj.id}
                                  variant="info"
                                  className="usersbadge"
                                >
                                  {obj}
                                </Badge>
                              );
                            })}
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label className="text-right" column sm="3">
                            Admin Usergroups
                          </Form.Label>
                          <Col sm="15">
                            {this.props.zoneslisting.adminUserGroups.map(
                              (obj) => {
                                return (
                                  <Badge
                                    key={obj.id}
                                    variant="secondary"
                                    className="usersbadge"
                                  >
                                    {obj}
                                  </Badge>
                                );
                              }
                            )}
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label className="text-right" column sm="3">
                            Auditor Users
                          </Form.Label>
                          <Col sm="15">
                            {this.props.zoneslisting.auditUsers.map((obj) => {
                              return (
                                <Badge
                                  key={obj.id}
                                  variant="info"
                                  className="usersbadge"
                                >
                                  {obj}
                                </Badge>
                              );
                            })}
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label className="text-right" column sm="3">
                            Auditor Usergroups
                          </Form.Label>
                          <Col sm="15">
                            {this.props.zoneslisting.auditUserGroups.map(
                              (obj) => {
                                return (
                                  <Badge
                                    key={obj.id}
                                    variant="secondary"
                                    className="usersbadge"
                                  >
                                    {obj}
                                  </Badge>
                                );
                              }
                            )}
                          </Col>
                        </Form.Group>
                      </Form>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </div>
              <br />
              <div>
                <Card>
                  <Card.Header>
                    Zone Tag Services
                    <div className="pull-right">
                      <Accordion.Toggle
                        eventKey="1"
                        style={{
                          background: "#f7f7f7",
                          border: "none"
                        }}
                      >
                        <i className="fa fa-angle-down"></i>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      {this.props.zoneslisting.tagServices.length !== 0 ? (
                        this.props.zoneslisting.tagServices
                      ) : (
                        <h6 className="text-muted h6 large">
                          No tag based services are associated with this zone
                        </h6>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </div>
              <br />
              <div>
                <Card>
                  <Card.Header>
                    Services
                    <div className="pull-right">
                      <Accordion.Toggle
                        eventKey="2"
                        style={{
                          background: "#f7f7f7",
                          border: "none"
                        }}
                      >
                        <i className="fa fa-angle-down"></i>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="2">
                    <Card.Body>
                      {" "}
                      <Table striped bordered>
                        <thead>
                          <tr>
                            <th className="p-3 mb-2 bg-white text-dark serviceth">
                              Service Name
                            </th>
                            <th className="p-3 mb-2 bg-white text-dark">
                              Service Type
                            </th>
                            <th className="p-3 mb-2 bg-white text-dark">
                              Resource
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(this.props.zoneslisting.services).map(
                            (key) => {
                              let servicetype = Object.values(
                                this.state.services
                              ).find((obj) => {
                                return obj.name === key;
                              });

                              return (
                                <tr className="bg-white">
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
                                    {this.props.zoneslisting.services[
                                      key
                                    ].resources.map((resource) => (
                                      <div className="resourceGrp">
                                        {Object.keys(resource).map(
                                          (resourceKey) => (
                                            <p>
                                              <strong>{`${resourceKey} : `}</strong>
                                              {resource[resourceKey].join(", ")}
                                            </p>
                                          )
                                        )}
                                      </div>
                                    ))}
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
              </div>
            </Accordion>
          </div>
          <br />
        </div>
      </div>
    );
  }
}
export default ZoneDisplay;
