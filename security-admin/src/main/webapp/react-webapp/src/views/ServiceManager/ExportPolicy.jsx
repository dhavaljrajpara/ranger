import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { has, map, toString } from "lodash";
import { fetchApi } from "Utils/fetchAPI";
import { toast } from "react-toastify";

class ExportPolicy extends Component {
  constructor(props) {
    super(props);
    this.serviceDefOptions = this.props.serviceDef.map((serviceDef) => {
      return {
        value: serviceDef.name,
        label: serviceDef.displayName
      };
    });
    this.serviceOptions = this.props.services.map((service) => {
      return {
        value: service.name,
        label: service.displayName
      };
    });
    this.state = {
      isParentExport: this.props.isParentExport,
      selectedServices: this.serviceOptions,
      serviceOptions: this.serviceOptions
    };
  }

  Theme = (theme) => {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        text: "#444444",
        primary25: "#0b7fad;",
        primary: "#0b7fad;"
      }
    };
  };

  downloadFile = ({ responseData }) => {
    let serviceNameList = responseData.config.params.serviceName;
    let zoneName = responseData.config.params.zoneName;

    let downloadUrl =
      window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port ? ":" + window.location.port : "") +
      "/service/plugins/policies/exportJson?serviceName=" +
      serviceNameList +
      "&checkPoliciesExists=false" +
      (zoneName !== null ? "&zoneName=" + zoneName : "");

    const link = document.createElement("a");

    link.href = downloadUrl;

    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true
    });
    document.body.appendChild(link);
    link.dispatchEvent(clickEvt);
    link.remove();
  };

  handleServiceChange = (value) => {
    let difference = this.state.selectedServices.filter(
      (service) => !value.includes(service)
    );

    this.setState({ selectedServices: value });
  };

  handleServiceDefChange = (value) => {
    let filterServices = value.map((serviceDef) => {
      return this.props.services.filter(
        (service) => service.type === serviceDef.value
      );
    });

    let filterServiceOptions = filterServices.flat().map((service) => {
      return {
        value: service.name,
        label: service.displayName
      };
    });

    this.setState({
      selectedServices: filterServiceOptions,
      serviceOptions: filterServiceOptions
    });
  };

  export = async (e) => {
    e.preventDefault();

    let exportResp;
    let serviceNameList = toString(map(this.state.selectedServices, "value"));

    try {
      exportResp = await fetchApi({
        url: "/plugins/policies/exportJson",
        params: {
          serviceName: serviceNameList,
          checkPoliciesExists: true,
          zoneName: this.props.zone
        }
      });

      if (exportResp.status === 200) {
        this.downloadFile({
          responseData: exportResp
        });
      } else {
        toast.warning("No policies found to export");
      }
      this.props.onHide();
    } catch (error) {
      this.props.onHide();
      if (error.response !== undefined && has(error.response, "data.msgDesc")) {
        toast.error(error.response.data.msgDesc);
      }
      console.error(`Error occurred while exporting policies ${error}`);
    }
  };

  render() {
    const { isParentExport, serviceOptions, selectedServices } = this.state;
    return (
      <React.Fragment>
        <Modal show={this.props.show} onHide={this.props.onHide} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Export Policy</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isParentExport && (
              <div className="mb-3">
                <h6 className="bold">Service Type *</h6>
                <Select
                  isMulti
                  onChange={this.handleServiceDefChange}
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null
                  }}
                  isClearable={false}
                  theme={this.Theme}
                  options={this.serviceDefOptions}
                  defaultValue={this.serviceDefOptions}
                  menuPlacement="auto"
                  placeholder="Select Service Type"
                />
              </div>
            )}

            <div className="mt-2">
              <h6 className="bold">Select Service Name *</h6>
              <Select
                isMulti
                onChange={this.handleServiceChange}
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null
                }}
                isClearable={false}
                theme={this.Theme}
                options={serviceOptions}
                defaultValue={this.serviceOptions}
                value={selectedServices}
                menuPlacement="auto"
                placeholder="Select Service Name"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.onHide}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.export}>
              Export
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ExportPolicy;
