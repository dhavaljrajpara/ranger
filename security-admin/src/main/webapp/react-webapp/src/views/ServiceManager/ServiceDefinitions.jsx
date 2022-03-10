import React, { Component } from "react";
import Select from "react-select";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { filter, map } from "lodash";
import { fetchApi } from "Utils/fetchAPI";
import ServiceDefinition from "./ServiceDefinition";
import ExportPolicy from "./ExportPolicy";
import ImportPolicy from "./ImportPolicy";

class ServiceDefinitions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceDefs: [],
      services: [],
      zones: [],
      isTagView: this.props.isTagView,
      showExportModal: false,
      showImportModal: false,
      isDisabled: true
    };
  }

  componentDidMount() {
    this.fetchServiceDefs();
    this.fetchServices();
    this.fetchZones();
  }

  showExportModal = () => {
    this.setState({ showExportModal: true });
  };

  hideExportModal = () => {
    this.setState({ showExportModal: false });
  };

  showImportModal = () => {
    this.setState({ showImportModal: true });
  };

  hideImportModal = () => {
    this.setState({ showImportModal: false });
  };

  fetchZones = async () => {
    let zoneList = [];
    try {
      const zonesResp = await fetchApi({
        url: "zones/zones"
      });
      zoneList = zonesResp.data.securityZones || [];
    } catch (error) {
      console.error(`Error occurred while fetching Zones! ${error}`);
    }

    this.setState({
      zones: zoneList,
      isDisabled: zoneList.length === 0 ? true : false
    });
  };

  fetchServiceDefs = async () => {
    let serviceDefsResp;
    let resourceServiceDef;
    let tagServiceDef;

    try {
      serviceDefsResp = await fetchApi({
        url: "plugins/definitions"
      });

      if (this.state.isTagView) {
        tagServiceDef = _.filter(serviceDefsResp.data.serviceDefs, [
          "name",
          "tag"
        ]);
      } else {
        resourceServiceDef = _.filter(
          serviceDefsResp.data.serviceDefs,
          (serviceDef) => serviceDef.name !== "tag"
        );
      }
    } catch (error) {
      console.error(
        `Error occurred while fetching Service Definitions or CSRF headers! ${error}`
      );
    }
    this.setState({
      serviceDefs: this.state.isTagView ? tagServiceDef : resourceServiceDef
    });
  };

  fetchServices = async () => {
    let servicesResp;
    let resourceServices;
    let tagServices;

    try {
      servicesResp = await fetchApi({
        url: "plugins/services"
      });
      if (this.state.isTagView) {
        tagServices = _.filter(servicesResp.data.services, ["type", "tag"]);
      } else {
        resourceServices = _.filter(
          servicesResp.data.services,
          (service) => service.type !== "tag"
        );
      }
    } catch (error) {
      console.error(
        `Error occurred while fetching Services or CSRF headers! ${error}`
      );
    }
    this.setState({
      services: this.state.isTagView ? tagServices : resourceServices
    });
  };

  getSelectedZone = async (e) => {
    const { serviceDefs, services, isTagView } = this.state;

    try {
      let zonesResp = [];

      if (e && e !== undefined) {
        zonesResp = await fetchApi({
          url: `public/v2/api/zones/${e && e.value}/service-headers`
        });

        zonesResp &&
          this.props.history.replace({
            search: `?securityZone=${e.label}`
          });

        let zoneServiceNames = _.map(zonesResp.data, "name");

        let zoneServices = zoneServiceNames.map((zoneService) => {
          return services.filter((service) => {
            return service.name === zoneService;
          });
        });

        zoneServices = zoneServices.flat();

        if (isTagView) {
          zoneServices = _.filter(zoneServices, function (zoneService) {
            return zoneService.type === "tag";
          });
        } else {
          zoneServices = _.filter(zoneServices, function (zoneService) {
            return zoneService.type !== "tag";
          });
        }

        let zoneServiceDefTypes = _.map(zoneServices, "type");

        let filterZoneServiceDef = zoneServiceDefTypes.map((obj) => {
          return serviceDefs.find((serviceDef) => {
            return serviceDef.name == obj;
          });
        });

        this.setState({
          serviceDefs: filterZoneServiceDef,
          services: zoneServices
        });
      } else {
        this.props.history.push("/policymanager/resource");
        this.fetchServiceDefs();
        this.fetchServices();
      }
    } catch (error) {
      console.error(`Error occurred while fetching Zone Services ! ${error}`);
    }
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
    const {
      serviceDefs,
      services,
      zones,
      isDisabled,
      showExportModal,
      showImportModal
    } = this.state;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-sm-2">
            <h3 className="wrap-header bold pull-left">Service Manager</h3>
          </div>
          <div className="col-sm-5 text-right">
            <b className="bold"> Security Zone: </b>
          </div>
          <div className="col-sm-3">
            <Select
              isDisabled={zones ? false : true}
              onChange={this.getSelectedZone}
              isClearable={true}
              isDisabled={isDisabled}
              components={{
                IndicatorSeparator: () => null
              }}
              theme={this.Theme}
              options={zones.map((zone) => {
                return {
                  value: zone.id,
                  label: zone.name
                };
              })}
              name="colors"
              placeholder="Select Zone Name"
            />
          </div>
          <div className="col-sm-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={this.showImportModal}
            >
              <i className="fa fa-fw fa-rotate-180 fa-external-link-square" />
              Import
            </button>
            {serviceDefs.length > 0 && (
              <ImportPolicy
                serviceDef={serviceDefs}
                services={services}
                zones={zones}
                show={showImportModal}
                onHide={this.hideImportModal}
              />
            )}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm pull-right"
              onClick={this.showExportModal}
            >
              <i className="fa fa-fw fa-external-link-square" />
              Export
            </button>
            {serviceDefs.length > 0 && (
              <ExportPolicy
                serviceDef={serviceDefs}
                services={services}
                isParentExport={true}
                show={showExportModal}
                onHide={this.hideExportModal}
              />
            )}
          </div>
        </div>
        <div className="wrap policy-manager mt-3">
          <div className="row">
            {serviceDefs.map((serviceDef) => (
              <ServiceDefinition
                zones={zones}
                key={serviceDef.id}
                services={services}
                serviceDefData={serviceDef}
                servicesData={services.filter(
                  (service) => service.type === serviceDef.name
                )}
              ></ServiceDefinition>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(ServiceDefinitions);
