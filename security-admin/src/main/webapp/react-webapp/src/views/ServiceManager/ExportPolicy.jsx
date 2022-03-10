import React, { Component, Fragment } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { map, toString } from "lodash";
import { fetchApi } from "Utils/fetchAPI";

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
        primary25: "#0b7fad;",
        primary: "#0b7fad;"
      }
    };
  };

  downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });
    const a = document.createElement("a");

    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);

    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true
    });
    a.dispatchEvent(clickEvt);
    a.remove();
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
    let serviceNameList = _.toString(
      _.map(this.state.selectedServices, "value")
    );

    try {
      exportResp = await fetchApi({
        url: "/plugins/policies/exportJson",
        params: {
          serviceName: serviceNameList,
          checkPoliciesExists: true
        }
      });

      this.downloadFile({
        data: JSON.stringify(exportResp.data),
        fileName: "Ranger_Policy.json",
        fileType: "text/json"
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Services or CSRF headers! ${error}`
      );
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
                <b>
                  <h6>Service Type *</h6>
                </b>
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
                  placeholder="Select Service Type"
                />
              </div>
            )}

            <div className="mt-2">
              <b>
                <h6>Select Service Name *</h6>
              </b>
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
