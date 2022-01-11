import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import folderLogo from "Images/folder-grey.png";
import { RangerPolicyType } from "Utils/XAEnums";
import ExportPolicy from "./ExportPolicy";
import ImportPolicy from "./ImportPolicy";
import { Button } from "react-bootstrap";

class ServiceDefinition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceDef: this.props.serviceDefData,
      service: this.props.serviceData,
      show: false,
      shows: false,
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
  render() {
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
                        >
                          <i className="fa-fw fa fa-eye"></i>
                        </Button>
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
                          onClick={(sid) => this.props.handleDelete(s.id)}
                        >
                          <i className="fa-fw fa fa-trash"></i>
                        </Button>
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
