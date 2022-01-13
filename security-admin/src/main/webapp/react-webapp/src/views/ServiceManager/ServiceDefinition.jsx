import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import folderLogo from "Images/folder-grey.png";
import { RangerPolicyType } from "Utils/XAEnums";
import ExportPolicy from "./ExportPolicy";
import ImportPolicy from "./ImportPolicy";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";

class ServiceDefinition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceDef: this.props.serviceDefData,
      service: this.props.serviceData,
      show: false,
      shows: false,
      showDelete: false,
      showView: false,
      isCardButton: true,
      filterselzone: this.props.selectedzoneservice
    };
  }

  showModal = () => {
    this.setState({ show: true });
  };
  hideModal = () => {
    this.setState({ show: false });
  };
  showModals = () => {
    this.setState({ shows: true });
  };
  hideModals = () => {
    this.setState({ shows: false });
  };
  showDeleteModal = () => {
    this.setState({ showDelete: true });
  };
  hideDeleteModal = () => {
    this.setState({ showDelete: false });
  };
  showViewModal = () => {
    this.setState({ showView: true });
  };
  hideViewModal = () => {
    this.setState({ showView: false });
  };

  Theme = (theme) => {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary25: "#0b7fad;",
        primary: "#0b7fad;"
      }
    };
  };

  deleteService = async (sid) => {
    console.log("Service Id to delete - ", sid);
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      await fetchApi({
        url: `plugins/services/${sid}`,
        method: "delete"
      });
      this.setState({
        service: this.state.service.filter((s) => s.id != sid)
      });
      toast.success("Successfully deleted the service");
    } catch (error) {
      console.error(
        `Error occurred while deleting Service id - ${sid}!  ${error}`
      );
    }
  };

  getServiceConfigs = (serviceDef, serviceConfigs) => {
    console.log("Print ServiceDef : ==== ", serviceDef.configs);
    console.log("Print serviceConfigs : ==== ", serviceConfigs);
    let tableRow = [];
    serviceConfigs = _.omit(serviceConfigs, "ranger.plugin.audit.filters");

    let skey = Object.keys(serviceConfigs);
    let sdefkey = serviceDef.configs.map((s) => s.name);
    let customConfigs = _.difference(skey, sdefkey);

    console.log("Print customConfigs : ==== ", customConfigs);
    console.log("Print skey : ==== ", skey);
    console.log("Print sdefkey : ==== ", sdefkey);

    Object.entries(serviceConfigs).map(([key, val]) =>
      tableRow.push(
        <tr key={key}>
          <td>{key}</td>
          <td>{val}</td>
        </tr>
      )
    );
    return tableRow;
  };

  getAuditFilters = (serviceConfigs) => {
    let tableRow = [];
    let auditFilters = _.pick(serviceConfigs, "ranger.plugin.audit.filters");
    console.log("Print auditFilters : ==== ", auditFilters);
    console.log(
      "Print auditFilters JSON: ==== ",
      JSON.parse(auditFilters["ranger.plugin.audit.filters"].replace(/'/g, '"'))
    );

    auditFilters = JSON.parse(
      auditFilters["ranger.plugin.audit.filters"].replace(/'/g, '"')
    );

    auditFilters.map((a, index) =>
      tableRow.push(
        <tr key={index}>
          <td>
            {a.isAudited == true ? (
              <h6>
                <Badge variant="primary">Yes</Badge>
              </h6>
            ) : (
              <h6>
                <Badge variant="primary">No</Badge>
              </h6>
            )}
          </td>
          <td>
            {a.accessResult != undefined ? (
              <h6>
                <Badge variant="primary">{a.accessResult}</Badge>
              </h6>
            ) : (
              "--"
            )}
          </td>
          <td>{a.resources != undefined ? "--" : "--"}</td>
          <td>
            {a.actions != undefined
              ? a.actions.map((action) => (
                  <h6 key={action}>
                    <Badge variant="primary">{action}</Badge>
                  </h6>
                ))
              : "--"}
          </td>
          <td>
            {a.accessTypes != undefined
              ? a.accessTypes.map((accessType) => (
                  <h6 key={accessType}>
                    <Badge variant="primary">{accessType}</Badge>
                  </h6>
                ))
              : "--"}
          </td>
          <td>
            {a.users != undefined
              ? a.users.map((user) => (
                  <h6 key={user}>
                    <Badge variant="primary">{user}</Badge>
                  </h6>
                ))
              : "--"}
          </td>
          <td>
            {a.groups != undefined
              ? a.groups.map((group) => (
                  <h6 key={group}>
                    <Badge variant="primary">{group}</Badge>
                  </h6>
                ))
              : "--"}
          </td>
          <td>
            {a.roles != undefined
              ? a.roles.map((role) => (
                  <h6 key={role}>
                    <Badge variant="primary">{role}</Badge>
                  </h6>
                ))
              : "--"}
          </td>
        </tr>
      )
    );

    return tableRow;
  };

  render() {
    console.log("Print services", this.state.service);
    return (
      <div className="col-sm-4">
        <div className="position-relative">
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>
                  <div className="policy-title clearfix">
                    <span className="float-left">
                      <img
                        src={folderLogo}
                        alt="Folder logo"
                        className="m-r-5"
                      />
                      {this.state.serviceDef.name}
                    </span>
                    <span className="float-right">
                      <Link to={`/service/${this.state.serviceDef.id}/create`}>
                        <i className="fa-fw fa fa-plus"></i>
                      </Link>
                      <a className="text-decoration" onClick={this.showModals}>
                        <i className="fa-fw fa fa-rotate-180 fa-external-link-square"></i>
                      </a>
                      <a className="text-decoration" onClick={this.showModal}>
                        <i className="fa-fw fa fa-external-link-square"></i>
                      </a>
                      <ImportPolicy
                        shows={this.state.shows}
                        onHides={this.hideModals}
                        zones={this.props.zones}
                        service={this.props.serviceData}
                        serviceDef={this.props.servicedefs}
                      />

                      <ExportPolicy
                        serviceDef={this.props.servicedefs}
                        service={this.props.serviceData}
                        isCardButton={this.state.isCardButton}
                        show={this.state.show}
                        onHide={this.hideModal}
                      />
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.service.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="clearfix">
                      <span className="float-left">
                        <Link
                          to={`/service/${s.id}/policies/${RangerPolicyType.RANGER_ACCESS_POLICY_TYPE.value}`}
                          className="service-name text-info"
                        >
                          {s.name}
                        </Link>
                      </span>
                      <span className="float-right">
                        <Button
                          variant="outline-dark"
                          size="sm"
                          className="m-r-5"
                          title="View"
                          onClick={this.showViewModal}
                        >
                          <i className="fa-fw fa fa-eye"></i>
                        </Button>
                        <Modal
                          show={this.state.showView}
                          onHide={this.hideViewModal}
                          size="lg"
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Service Details</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="row">
                              <div className="col-sm-12">
                                <p className="form-header">Service Details :</p>
                                <Table bordered size="sm">
                                  <tbody>
                                    <tr>
                                      <td>Service Name</td>
                                      <td>{s.name}</td>
                                    </tr>
                                    <tr>
                                      <td>Display Name</td>
                                      <td>{s.displayName}</td>
                                    </tr>
                                    <tr>
                                      <td>Description</td>
                                      <td>{s.description}</td>
                                    </tr>
                                    <tr>
                                      <td>Active Status</td>
                                      <td>
                                        {s.isEnabled ? `Enabled` : `Disabled`}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Tag Service</td>
                                      <td>{s.tagService}</td>
                                    </tr>
                                  </tbody>
                                </Table>
                                <p className="form-header">
                                  Config Properties :
                                </p>
                                <Table bordered size="sm">
                                  <tbody>
                                    {this.getServiceConfigs(
                                      this.state.serviceDef,
                                      s.configs
                                    )}
                                  </tbody>
                                </Table>
                                <p className="form-header">Audit Filter :</p>
                                <Table bordered size="sm">
                                  <thead>
                                    <tr>
                                      <th>Is Audited</th>
                                      <th>Access Result</th>
                                      <th>Resources</th>
                                      <th>Operations</th>
                                      <th>Permissions</th>
                                      <th>Users</th>
                                      <th>Groups</th>
                                      <th>Roles</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.getAuditFilters(s.configs)}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="primary"
                              onClick={this.hideViewModal}
                            >
                              OK
                            </Button>
                          </Modal.Footer>
                        </Modal>
                        <Button
                          variant="outline-dark"
                          size="sm"
                          className="m-r-5"
                          title="Edit"
                        >
                          <i className="fa-fw fa fa-edit"></i>
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          title="Delete"
                          onClick={this.showDeleteModal}
                        >
                          <i className="fa-fw fa fa-trash"></i>
                        </Button>
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
                              onClick={(sid) => this.deleteService(s.id)}
                            >
                              Yes
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default ServiceDefinition;
