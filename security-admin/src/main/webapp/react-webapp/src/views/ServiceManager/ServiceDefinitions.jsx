import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { filter, map, uniq } from "lodash";
import { fetchApi } from "Utils/fetchAPI";
import {
  isSystemAdmin,
  isKeyAdmin,
  isAuditor,
  isKMSAuditor,
  isUser
} from "Utils/XAUtils";
import ServiceDefinition from "./ServiceDefinition";
import ExportPolicy from "./ExportPolicy";
import ImportPolicy from "./ImportPolicy";

class ServiceDefinitions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceDefs: [],
      filterServiceDefs: [],
      services: [],
      filterServices: [],
      selectedZone: null,
      zones: [],
      isTagView: this.props.isTagView,
      showExportModal: false,
      showImportModal: false,
      isDisabled: true,
      isAdminRole: isSystemAdmin() || isKeyAdmin(),
      isAuditorRole: isAuditor() || isKMSAuditor(),
      isUserRole: isUser(),
      loader: true
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
        tagServiceDef = filter(serviceDefsResp.data.serviceDefs, [
          "name",
          "tag"
        ]);
      } else {
        resourceServiceDef = filter(
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
      serviceDefs: this.state.isTagView ? tagServiceDef : resourceServiceDef,
      filterServiceDefs: this.state.isTagView
        ? tagServiceDef
        : resourceServiceDef
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
        tagServices = filter(servicesResp.data.services, ["type", "tag"]);
      } else {
        resourceServices = filter(
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
      services: this.state.isTagView ? tagServices : resourceServices,
      filterServices: this.state.isTagView ? tagServices : resourceServices,
      loader: false
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

        let zoneServiceNames = map(zonesResp.data, "name");

        let zoneServices = zoneServiceNames.map((zoneService) => {
          return services.filter((service) => {
            return service.name === zoneService;
          });
        });

        zoneServices = zoneServices.flat();

        if (isTagView) {
          zoneServices = filter(zoneServices, function (zoneService) {
            return zoneService.type === "tag";
          });
        } else {
          zoneServices = filter(zoneServices, function (zoneService) {
            return zoneService.type !== "tag";
          });
        }

        let zoneServiceDefTypes = uniq(map(zoneServices, "type"));

        let filterZoneServiceDef = zoneServiceDefTypes.map((obj) => {
          return serviceDefs.find((serviceDef) => {
            return serviceDef.name == obj;
          });
        });

        this.setState({
          filterServiceDefs: filterZoneServiceDef,
          filterServices: zoneServices,
          selectedZone: e.label
        });
      } else {
        this.props.history.push(this.props.location.pathname);
        this.setState({
          filterServiceDefs: serviceDefs,
          filterServices: services,
          selectedZone: null
        });
      }
    } catch (error) {
      console.error(`Error occurred while fetching Zone Services ! ${error}`);
    }
  };

  deleteService = async (sid) => {
    console.log("Service Id to delete is ", sid);
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      await fetchApi({
        url: `plugins/services/${sid}`,
        method: "delete"
      });
      this.setState({
        services: this.state.filterServices.filter((s) => s.id !== sid),
        filterServices: this.state.filterServices.filter((s) => s.id !== sid)
      });
      toast.success("Successfully deleted the service");
    } catch (error) {
      console.error(
        `Error occurred while deleting Service id - ${sid}!  ${error}`
      );
    }
  };

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

  render() {
    const {
      filterServiceDefs,
      filterServices,
      zones,
      isDisabled,
      selectedZone,
      showExportModal,
      showImportModal,
      isAdminRole,
      isUserRole
    } = this.state;
    return (
      <React.Fragment>
        <Row>
          <Col sm={2}>
            <h3 className="wrap-header bold text-left">Service Manager</h3>
          </Col>
          <Col sm={5} className="text-right">
            <b className="bold"> Security Zone: </b>
          </Col>
          <Col sm={3}>
            <Select
              isDisabled={isDisabled}
              onChange={this.getSelectedZone}
              isClearable
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
              menuPlacement="auto"
              placeholder="Select Zone Name"
            />
          </Col>
          <Col sm={2} className="text-right">
            {isAdminRole && (
              <Button
                variant="outline-secondary"
                size="sm"
                className="mr-2"
                onClick={this.showImportModal}
              >
                <i className="fa fa-fw fa-rotate-180 fa-external-link-square" />
                Import
              </Button>
            )}
            {filterServiceDefs.length > 0 && showImportModal && (
              <ImportPolicy
                serviceDef={filterServiceDefs}
                services={filterServices}
                zones={zones}
                isParentImport={true}
                show={showImportModal}
                onHide={this.hideImportModal}
              />
            )}
            {isAdminRole && (
              <Button
                variant="outline-secondary"
                size="sm"
                className="pull-right"
                onClick={this.showExportModal}
              >
                <i className="fa fa-fw fa-external-link-square" />
                Export
              </Button>
            )}
            {filterServiceDefs.length > 0 && showExportModal && (
              <ExportPolicy
                serviceDef={filterServiceDefs}
                services={filterServices}
                zone={selectedZone}
                isParentExport={true}
                show={showExportModal}
                onHide={this.hideExportModal}
              />
            )}
          </Col>
        </Row>
        <div className="wrap policy-manager mt-3">
          {this.state.loader ? (
            <Row className="row">
              <Col sm={12} className="text-center">
                <div className="spinner-border mr-2" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </Col>
            </Row>
          ) : (
            <Row className="row">
              {filterServiceDefs.map((serviceDef) => (
                <ServiceDefinition
                  key={serviceDef.id}
                  serviceDefData={serviceDef}
                  servicesData={filterServices.filter(
                    (service) => service.type === serviceDef.name
                  )}
                  deleteService={this.deleteService}
                  selectedZone={selectedZone}
                  zones={zones}
                  isAdminRole={isAdminRole}
                  isUserRole={isUserRole}
                ></ServiceDefinition>
              ))}
            </Row>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(ServiceDefinitions);
