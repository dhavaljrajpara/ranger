import React, { Component } from "react";
import Button from "react-bootstrap/Button";
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
        <div className="clearfix">
          <div className="float-left">
            <h4 className="wrap-header bold">Service Manager</h4>
          </div>
          <div className="float-right">
            <b> Security Zone: </b>
            <span title="Create zone first" className="m-r-5">
              <input
                type="text"
                className="select-zone-name"
                placeholder="Select Zone Name"
                disabled="disabled"
              />
            </span>
            <Button variant="outline-secondary" size="sm" className="m-r-5">
              <i className="fa fa-fw fa-rotate-180 fa-external-link-square"></i>
              Import
            </Button>
            <Button variant="outline-secondary" size="sm">
              <i className="fa fa-fw fa-external-link-square"></i>
              Export
            </Button>
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
