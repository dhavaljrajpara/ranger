import React, { Component } from "react";
import ServiceDefinition from "./ServiceDefinition";

class ServiceDefinitions extends Component {
  state = {
    serviceDefs: [],
    services: [],
  };

  componentDidMount() {
    this.fetchServiceDefs();
    this.fetchServices();
  }

  fetchServiceDefs = async () => {
    let serviceDefsResp;
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      serviceDefsResp = await fetchApi({
        url: "plugins/definitions",
      });
      await fetchCSRFConf();
      console.log(serviceDefsResp.data.serviceDefs);
    } catch (error) {
      console.error(
        `Error occurred while fetching Service Definitions or CSRF headers! ${error}`
      );
    }
    this.setState({
      serviceDefs: serviceDefsResp.data.serviceDefs,
    });
  };

  fetchServices = async () => {
    let servicesResp;
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      servicesResp = await fetchApi({
        url: "plugins/services",
      });
      await fetchCSRFConf();
      console.log(servicesResp.data.services);
    } catch (error) {
      console.error(
        `Error occurred while fetching Services or CSRF headers! ${error}`
      );
    }
    this.setState({
      services: servicesResp.data.services,
    });
  };

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-7">
            <h4 className="wrap-header bold">Service Manager</h4>
          </div>
          <div className="col-sm-5">
            <b> Security Zone: </b>
            <span title="Create zone first" className="m-r-5">
              <input
                type="text"
                className="select-zone-name"
                placeholder="Select Zone Name"
                disabled="disabled"
              />
            </span>
            <button
              type="button"
              title="Import"
              className="btn btn-sm btn-outline-secondary m-r-5"
            >
              <i className="fa fa-fw fa-rotate-180 fa-external-link-square"></i>
              Import
            </button>
            <button
              type="button"
              title="Export"
              className="btn btn-sm btn-outline-secondary"
            >
              <i className="fa fa-fw fa-external-link-square"></i>
              Export
            </button>
          </div>
        </div>

        <div className="wrap policy-manager">
          <div className="row">
            {this.state.serviceDefs.map((serviceDef) => (
              <ServiceDefinition
                key={serviceDef.id}
                serviceDefData={serviceDef}
                serviceData={this.state.services.filter(
                  (s) => s.type === serviceDef.name
                )}
              ></ServiceDefinition>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ServiceDefinitions;
