import React, { Component } from "react";

import ServiceDefinition from "./ServiceDefinition";
import ExportPolicy from "./ExportPolicy";
import ImportPolicy from "./ImportPolicy";
import Select from "react-select";
import { fetchApi } from "Utils/fetchAPI";
import { withRouter } from "react-router-dom";

class ServiceDefinitions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceDefs: [],
      services: [],
      show: false,
      shows: false,
      zones: [],
      selectedzone: [],
      isCardButton: false,
      filterDef: []
    };
  }

  componentDidMount() {
    this.fetchServiceDefs();
    this.fetchServices();
    this.fetchZones();
  }

  showModal = () => {
    this.setState({ show: true });
  };
  hideModal = () => {
    this.setState({ show: false });
  };
  showModals = () => {
    this.setState({ shows: true });
  };
  hideModals = () => {
    this.setState({ shows: false });
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
      zones: zoneList
    });
  };

  fetchServiceDefs = async () => {
    let serviceDefsResp;
    let tags;
    let filterdef;
    let tag;

    try {
      serviceDefsResp = await fetchApi({
        url: "plugins/definitions"
      });

      if (this.props.isTagView) {
        try {
          const tagResp = await fetchApi({
            url: "plugins/definitions/name/tag"
          });
          tags = serviceDefsResp.data.serviceDefs.filter((obj) => {
            return obj.name == "tag";
          });
        } catch (error) {
          console.error(`Error occurred while fetching Zones! ${error}`);
        }
      } else {
        tag = serviceDefsResp.data.serviceDefs.filter((obj) => {
          return obj.name == "tag";
        });
        filterdef = serviceDefsResp.data.serviceDefs.filter(
          (val) => !tag.includes(val)
        );
      }
    } catch (error) {
      console.error(
        `Error occurred while fetching Service Definitions or CSRF headers! ${error}`
      );
    }
    this.setState({
      serviceDefs: serviceDefsResp.data.serviceDefs,
      filterDef: !this.props.isTagView ? filterdef : tags
    });
  };

  fetchServices = async () => {
    let servicesResp;
    try {
      servicesResp = await fetchApi({
        url: "plugins/services"
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Services or CSRF headers! ${error}`
      );
    }
    this.setState({
      services: servicesResp.data.services,
      filterserv: servicesResp.data.services
    });
  };

  selectedZone = async (e) => {
    try {
      let zonesResp = [];

      if (e != undefined) {
        zonesResp = await fetchApi({
          url: `public/v2/api/zones/${e && e.value}/service-headers`
        });
        zonesResp &&
          this.props.history.replace({
            search: `?securityZone=${e.label}`
          });

        let zonenames = zonesResp.data.map((obj) => {
          return obj.name;
        });

        let zoneservice = zonenames.map((obj) => {
          return this.state.services.filter((serv) => {
            return serv.name == obj;
          });
        });

        let zoneservicetype = zoneservice.map((obj) => {
          return obj.map((obj) => {
            return obj.type;
          });
        });
        let zoneservicetypes = zoneservicetype.flat();
        let filterzonetype = zoneservicetypes.filter((element, index) => {
          return zoneservicetypes.indexOf(element) === index;
        });
        let zonetag = this.state.serviceDefs.filter((obj) => {
          return obj.name == "tag";
        });
        let filterzonedef = filterzonetype.map((obj) => {
          return this.state.serviceDefs.find((servc) => {
            return servc.name == obj;
          });
        });
        let filterdef = filterzonedef.filter((val) => !zonetag.includes(val));

        this.setState({
          selectedzone: zonenames,
          filterDef: filterdef,
          filterserv: zoneservice
        });
      }
    } catch (error) {
      console.error(
        `Error occurred while fetching Service Definitions or CSRF headers! ${error}`
      );
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
    return (
      <div>
        <div className="row">
          <div className="col">
            <h3 className="wrap-header bold pull-left">Service Manager</h3>
          </div>
          <div className="col-md-auto">
            <b className="bold"> Security Zone: </b>
          </div>

          <Select
            className="w-25 p-1"
            isDisabled={this.state.zones ? false : true}
            onChange={this.selectedZone}
            isClearable
            components={{
              IndicatorSeparator: () => null
            }}
            theme={this.Theme}
            options={this.state.zones.map((zone) => {
              return {
                value: zone.id,
                label: zone.name
              };
            })}
            name="colors"
            placeholder="Select Zone Name"
          />

          <div className="col col-lg-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={this.showModals}
            >
              <i className="fa fa-fw fa-rotate-180 fa-external-link-square" />
              Import
            </button>
            {/* {
this.state.filterDef.map((obj)=>{let services =this.state.services.filter((o)=>{return o.type === obj.name});
console.log(services.map((ser)=>{return ser}))})} */}
            <ImportPolicy
              shows={this.state.shows}
              serviceDef={this.state.filterDef}
              onHides={this.hideModals}
              // service={this.state.filterDef.map((serviceDef) => {
              //   let service = this.state.services.filter(
              //     (s) => s.type === serviceDef.name
              //   );
              // })}
              zones={this.state.zones}
            />

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm pull-right"
              onClick={this.showModal}
            >
              <i className="fa fa-fw fa-external-link-square" />
              Export
            </button>

            <ExportPolicy
              serviceDef={this.state.filterDef}
              service={this.state.services}
              isCardButton={this.state.isCardButton}
              show={this.state.show}
              onHide={this.hideModal}
            />
          </div>
        </div>
        {/* {this.state.filterDef.map((serviceDef) => {
          let service = this.state.services.filter(
            (s) => s.type === serviceDef.name
          );
          console.log(
            serviceDef.name +
              ":" +
              service.map((ser) => {
                return ser.name;
              })
          );
        })} */}
        <div className="wrap policy-manager">
          <div className="row">
            {this.state.filterDef.map((serviceDef) => (
              <ServiceDefinition
                zones={this.state.zones}
                key={serviceDef.id}
                servicedefs={this.state.serviceDefs}
                services={this.state.services}
                selectedzoneservice={this.state.selectedzone}
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

export default withRouter(ServiceDefinitions);
