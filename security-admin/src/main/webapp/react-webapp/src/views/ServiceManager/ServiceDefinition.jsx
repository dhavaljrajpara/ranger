import React, { Component } from "react";

class ServiceDefinition extends Component {
  state = {
    serviceDef: this.props.serviceDefData,
    service: this.props.serviceData,
  };

  render() {
    console.log("props", this.props);
    return (
      <div className="col-sm-4">
        <div className="position-relative">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>
                  <span className="policy-title">
                    <span className="pull-left">
                      {this.state.serviceDef.name}
                    </span>
                    <span className="pull-right">
                      <a className="text-decoration">
                        <i className="fa-fw fa fa-plus"></i>
                      </a>
                      <a className="text-decoration">
                        <i className="fa-fw fa fa-rotate-180 fa-external-link-square"></i>
                      </a>
                      <a className="text-decoration">
                        <i className="fa-fw fa fa-external-link-square"></i>
                      </a>
                    </span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.service.map((s) => (
                <tr>
                  <td>
                    <div>
                      <span className="pull-left">
                        <a>{s.name}</a>
                      </span>
                      <span className="pull-right">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-dark m-r-5"
                          title="View"
                        >
                          <i className="fa-fw fa fa-eye"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-dark m-r-5"
                          title="Edit"
                        >
                          <i className="fa-fw fa fa-edit"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          title="Delete"
                        >
                          <i className="fa-fw fa fa-trash"></i>
                        </button>
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ServiceDefinition;
