import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import Select, { components } from "react-select";

class ExportPolicy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceDefs: [],
      services: [],
      showModal: false,
      serviceDef: this.props.serviceDefData,
      service: this.props.serviceData,
    };
  }

  change = (event) => {
    console.log(event);
  };

  changes = (event) => {
    console.log(event);
  };

  componentDidMount() {
    this.fetchServiceDefs();
    this.fetchServices();
  }

  ShowModal = (status) => {
    this.Close();
    this.setState({ showModal: status });
  };
  Close = () => {
    this.props.hide(false);
  };
  Theme = (theme) => {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary25: "#0b7fad;",
        primary: "#0b7fad;",
      },
    };
  };

  fetchServiceDefs = async () => {
    let serviceDefsResp;
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      serviceDefsResp = await fetchApi({
        url: "plugins/definitions",
      });

      await fetchCSRFConf();
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

  export = async () => {
    let exportResp;

    try {
      const axios = require("axios");
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");

      const exportResp = await axios.get("/plugins/policies/exportJson", {
        params: {
          serviceName: "TestService",
          checkPoliciesExists: "true",
        },
      });

      await fetchCSRFConf();
    } catch (error) {
      console.error(
        `Error occurred while fetching Services or CSRF headers! ${error}`
      );
    }
  };

  render() {
    const { serviceDefs } = this.state;
    let option = [];
    serviceDefs.map((serviceDef) => {
      let options = {};
      options.value = serviceDef.id;
      options.label = serviceDef.name;
      option.push(options);
    });

    const { services } = this.state;
    let option1 = [];
    services.map((service) => {
      let options1 = {};
      options1.value = service.type;
      options1.label = service.name;
      option1.push(options1);
    });

    return (
      <>
        <Modal show={this.props.show} onHide={this.Close} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Export Policy </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <b>
              <h6 className="servicename">Service Type*</h6>
            </b>
            <Select
              onChange={this.change}
              isMulti
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              isClearable={false}
              theme={this.Theme}
              name="colors"
              options={option}
              defaultValue={option.slice(0, 19)}
              placeholder="Select Component"
            />{" "}
            <br />
            <b>
              <h6 className="servicename">Select Service Name*</h6>
            </b>
            <Select
              onChange={this.changes}
              isMulti
              isClearable={false}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              theme={this.Theme}
              name="colors"
              options={option1}
              defaultValue={option1.slice(0)}
              placeholder="Select Component"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.Close}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.export}>
              Export
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ExportPolicy;
