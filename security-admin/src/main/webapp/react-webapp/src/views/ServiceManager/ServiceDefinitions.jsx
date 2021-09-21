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
        <h4 className="wrap-header bold">Service Manager</h4>
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
