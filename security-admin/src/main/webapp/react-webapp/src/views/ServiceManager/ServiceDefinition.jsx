import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Col, Modal, Row, Table } from "react-bootstrap";
import { difference, isEmpty, keys, map, omit, pick } from "lodash";
import { RangerPolicyType } from "Utils/XAEnums";
import ExportPolicy from "./ExportPolicy";
import ImportPolicy from "./ImportPolicy";
import folderLogo from "Images/folder-grey.png";

class ServiceDefinition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceDef: this.props.serviceDefData,
      showExportModal: false,
      showImportModal: false,
      showDelete: null,
      showView: null
    };
  }

  showExportModal = () => {
    this.setState({ showExportModal: true });
  };

  hideExportModal = () => {
    this.setState({ showExportModal: false });
  };

  showImportModal = () => {
    this.setState({ showImportModal: true });
  };

  hideImportModal = () => {
    this.setState({ showImportModal: false });
  };

  showDeleteModal = (id) => {
    this.setState({ showDelete: id });
  };

  hideDeleteModal = () => {
    this.setState({ showDelete: null });
  };

  showViewModal = (id) => {
    this.setState({ showView: id });
  };

  hideViewModal = () => {
    this.setState({ showView: null });
  };

  getServiceConfigs = (serviceDef, serviceConfigs) => {
    let tableRow = [];
    let configs = {};
    let customConfigs = {};

    let serviceDefConfigs = serviceDef.configs.filter(
      (config) => config.name !== "ranger.plugin.audit.filters"
    );

    serviceConfigs = omit(serviceConfigs, "ranger.plugin.audit.filters");

    let serviceConfigsKey = keys(serviceConfigs);
    let serviceDefConfigsKey = map(serviceDefConfigs, "name");
    let customConfigsKey = difference(serviceConfigsKey, serviceDefConfigsKey);

    serviceDefConfigs.map(
      (config) =>
        (configs[config.label !== undefined ? config.label : config.name] =
          serviceConfigs[config.name])
    );

    Object.entries(configs).map(([key, value]) =>
      tableRow.push(
        <tr key={key}>
          <td>{key}</td>
          <td>{value ? value : "--"}</td>
        </tr>
      )
    );

    customConfigsKey.map(
      (config) => (customConfigs[config] = serviceConfigs[config])
    );

    tableRow.push(
      <tr key="custom-configs-title">
        <td colSpan="2">
          <b>Add New Configurations :</b>
        </td>
      </tr>
    );

    if (isEmpty(customConfigs)) {
      tableRow.push(
        <tr key="custom-configs-empty">
          <td>--</td>
          <td>--</td>
        </tr>
      );
    }

    Object.entries(customConfigs).map(([key, value]) =>
      tableRow.push(
        <tr key={key}>
          <td>{key}</td>
          <td>{value ? value : "--"}</td>
        </tr>
      )
    );

    return tableRow;
  };

  getFilterResources = (resources) => {
    let keyname = Object.keys(resources);
    return keyname.map((key, index) => {
      let val = resources[key].values;
      return (
        <div key={index} className="clearfix mb-2">
          <span className="float-left">
            <b>{key}: </b>
            {val.join()}
          </span>
          {resources[key].isExcludes !== undefined ? (
            <h6 className="d-inline">
              {resources[key].isExcludes ? (
                <span className="badge badge-dark float-right">Include</span>
              ) : (
                <span className="badge badge-dark float-right">Exclude</span>
              )}
            </h6>
          ) : (
            ""
          )}
          {resources[key].isRecursive !== undefined ? (
            <h6 className="d-inline">
              {resources[key].isRecursive ? (
                <span className="badge badge-dark float-right">Recursive</span>
              ) : (
                <span className="badge badge-dark float-right">
                  Non Recursive
                </span>
              )}
            </h6>
          ) : (
            ""
          )}
        </div>
      );
    });
  };

  getAuditFilters = (serviceConfigs) => {
    let tableRow = [];
    let auditFilters = pick(serviceConfigs, "ranger.plugin.audit.filters");

    if (isEmpty(auditFilters)) {
      return tableRow;
    }

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
            {a.accessResult !== undefined ? (
              <h6>
                <Badge variant="primary">{a.accessResult}</Badge>
              </h6>
            ) : (
              "--"
            )}
          </td>
          <td>
            {a.resources !== undefined ? (
              <div className="resource-grp">
                {this.getFilterResources(a.resources)}
              </div>
            ) : (
              "--"
            )}
          </td>
          <td>
            {a.actions !== undefined
              ? a.actions.map((action) => (
                  <h6 key={action}>
                    <Badge variant="primary">{action}</Badge>
                  </h6>
                ))
              : "--"}
          </td>
          <td>
            {a.accessTypes !== undefined
              ? a.accessTypes.map((accessType) => (
                  <h6 key={accessType}>
                    <Badge variant="primary">{accessType}</Badge>
                  </h6>
                ))
              : "--"}
          </td>
          <td>
            {a.users !== undefined
              ? a.users.map((user) => (
                  <h6 key={user}>
                    <Badge variant="primary">{user}</Badge>
                  </h6>
                ))
              : "--"}
          </td>
          <td>
            {a.groups !== undefined
              ? a.groups.map((group) => (
                  <h6 key={group}>
                    <Badge variant="primary">{group}</Badge>
                  </h6>
                ))
              : "--"}
          </td>
          <td>
            {a.roles !== undefined
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
    const { serviceDef, showImportModal, showExportModal } = this.state;
    return (
      <Col sm={4}>
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
                      {serviceDef.displayName}
                    </span>
                    {this.props.isAdminRole && (
                      <span className="float-right">
                        {isEmpty(this.props.selectedZone) ? (
                          <Link
                            to={`/service/${serviceDef.id}/create`}
                            title="Add New Service"
                          >
                            <i className="fa-fw fa fa-plus"></i>
                          </Link>
                        ) : (
                          <a
                            className="not-allowed"
                            title="Services cannot be added while filtering Security Zones"
                          >
                            <i className="fa-fw fa fa-plus"></i>
                          </a>
                        )}
                        <a
                          className="text-decoration"
                          onClick={this.showImportModal}
                          title="Import"
                        >
                          <i className="fa-fw fa fa-rotate-180 fa-external-link-square"></i>
                        </a>
                        <a
                          className="text-decoration"
                          onClick={this.showExportModal}
                          title="Export"
                        >
                          <i className="fa-fw fa fa-external-link-square"></i>
                        </a>
                        {[serviceDef].length > 0 && showImportModal && (
                          <ImportPolicy
                            serviceDef={serviceDef}
                            services={this.props.servicesData}
                            zones={this.props.zones}
                            isParentImport={false}
                            selectedZone={this.props.selectedZone}
                            show={showImportModal}
                            onHide={this.hideImportModal}
                          />
                        )}
                        {[serviceDef].length > 0 && showExportModal && (
                          <ExportPolicy
                            serviceDef={[serviceDef]}
                            services={this.props.servicesData}
                            zone={this.props.selectedZone.label}
                            isParentExport={false}
                            show={showExportModal}
                            onHide={this.hideExportModal}
                          />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.servicesData.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="clearfix">
                      <span className="float-left">
                        {!s.isEnabled && (
                          <i
                            className="fa-fw fa fa-ban text-color-red fa-lg"
                            title="Disable"
                          ></i>
                        )}
                        <Link
                          to={{
                            pathname: `/service/${s.id}/policies/${RangerPolicyType.RANGER_ACCESS_POLICY_TYPE.value}`,
                            detail: this.props.selectedZone
                          }}
                          className="service-name text-info"
                        >
                          {s.displayName !== undefined ? s.displayName : s.name}
                        </Link>
                        {/* <Link
                          to={`/service/${s.id}/policies/${RangerPolicyType.RANGER_ACCESS_POLICY_TYPE.value}`}
                          className="service-name text-info"
                        >
                          {s.displayName !== undefined ? s.displayName : s.name}
                        </Link> */}
                      </span>
                      <span className="float-right">
                        {!this.props.isUserRole && (
                          <Button
                            variant="outline-dark"
                            size="sm"
                            className="m-r-5"
                            title="View"
                            onClick={() => {
                              this.showViewModal(s.id);
                            }}
                          >
                            <i className="fa-fw fa fa-eye"></i>
                          </Button>
                        )}
                        <Modal
                          show={this.state.showView === s.id}
                          onHide={this.hideViewModal}
                          size="xl"
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Service Details</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Row>
                              <Col sm={12}>
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
                                      <td>
                                        {s.description ? s.description : "--"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Active Status</td>
                                      <td>
                                        <h6>
                                          <Badge variant="primary">
                                            {s.isEnabled
                                              ? `Enabled`
                                              : `Disabled`}
                                          </Badge>
                                        </h6>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Tag Service</td>
                                      <td>
                                        {s.tagService ? (
                                          <h6>
                                            <Badge variant="primary">
                                              {s.tagService}
                                            </Badge>
                                          </h6>
                                        ) : (
                                          "--"
                                        )}
                                      </td>
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
                                <Table
                                  bordered
                                  size="sm"
                                  className="table-audit-filter-ready-only"
                                >
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
                              </Col>
                            </Row>
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
                        {this.props.isAdminRole && (
                          <React.Fragment>
                            <Link
                              className="btn btn-outline-dark btn-sm m-r-5"
                              title="Edit"
                              to={`/service/${this.state.serviceDef.id}/edit/${s.id}`}
                            >
                              <i className="fa-fw fa fa-edit"></i>
                            </Link>
                            <Button
                              variant="danger"
                              size="sm"
                              title="Delete"
                              onClick={() => {
                                this.showDeleteModal(s.id);
                              }}
                            >
                              <i className="fa-fw fa fa-trash"></i>
                            </Button>
                            <Modal
                              show={this.state.showDelete === s.id}
                              onHide={this.hideDeleteModal}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Delete Service</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure want to delete ?
                              </Modal.Body>
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
                                  onClick={() => this.props.deleteService(s.id)}
                                >
                                  Yes
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </React.Fragment>
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Col>
    );
  }
}

export default ServiceDefinition;
