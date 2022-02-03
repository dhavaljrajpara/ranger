import React, { Component, Fragment } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { fetchApi } from "Utils/fetchAPI";

class ExportPolicy extends Component {
  constructor() {
    super();
    this.state = {
      service: [],
      selectedServices: [],
      services: [],
      servicename: []
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

  handletypeChange = (e) => {
    e.map((serviceDef) => {
      this.state.selectedServices = [];
      this.state.services = [];
      let service = this.props.service.filter(
        (s) => s.type === serviceDef.label
      );

      service.forEach((s) => {
        this.state.selectedServices.push(s.name);
        this.state.services.push({ name: s.name });
      });
      this.setState({ servicename: service });
    });
  };
  export = async (e) => {
    e.preventDefault();
    let exportResp;

    try {
      exportResp = await fetchApi({
        url: "/plugins/policies/exportJson"
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
    let option = this.props.serviceDef.map((servicedef) => {
      return {
        label: servicedef.name
      };
    });
    return (
      <>
        <Modal show={this.props.show} onHide={this.props.onHide} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Export Policy </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!this.props.isCardButton && (
              <div>
                <b>
                  <h6 className="servicename">Service Type*</h6>
                </b>
                <Select
                  onChange={this.handletypeChange}
                  isMulti
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null
                  }}
                  isClearable={false}
                  theme={this.Theme}
                  name="colors"
                  options={option}
                  defaultValue={option.slice(0, 19)}
                  placeholder="Select Component"
                />
              </div>
            )}
            <br />

            <div>
              <b>
                <h6 className="servicename">Select Service Name*</h6>
              </b>
              <Select
                isMulti
                isClearable={false}
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null
                }}
                theme={this.Theme}
                name="colors"
                options={this.state.selectedServices.map((obj) => {
                  return { label: obj };
                })}
                // defaultValue={options.slice(0)}
                placeholder="Select Component"
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
      </>
    );
  }
}

export default ExportPolicy;
