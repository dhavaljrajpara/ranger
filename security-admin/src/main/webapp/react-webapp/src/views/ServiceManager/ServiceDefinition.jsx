import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import folderLogo from "Images/folder-grey.png";

class ServiceDefinition extends Component {
  state = {
    serviceDef: this.props.serviceDefData,
    service: this.props.serviceData
  };

  render() {
    console.log("props", this.props);
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
                      <a className="text-decoration">
                        <i className="fa-fw fa fa-rotate-180 fa-external-link-square"></i>
                      </a>
                      <a className="text-decoration">
                        <i className="fa-fw fa fa-external-link-square"></i>
                      </a>
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
                        <Link to={`/policies/${s.id}`} className="service-name">
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
                        <Button variant="danger" size="sm" title="Delete">
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
