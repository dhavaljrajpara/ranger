import React, { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import PolicyListing from "./PolicyListing";
import { fetchApi } from "Utils/fetchAPI";
import { isRenderMasking, isRenderRowFilter } from "Utils/XAUtils";
import { Loader } from "Components/CommonComponents";
import { commonBreadcrumb } from "../../utils/XAUtils";
import { pick } from "lodash";
import withRouter from "Hooks/withRouter";

class policyTabView extends Component {
  state = {
    serviceDetails: {},
    componentDefinationDetails: {},
    loader: true
  };

  componentDidMount() {
    this.fetchServiceDetails();
  }
  fetchServiceDetails = async () => {
    let getServiceDetails;
    let getComponentDefinationDetails;
    try {
      getServiceDetails = await fetchApi({
        url: `plugins/services/${this.props.params.serviceId}`
      });
      getComponentDefinationDetails = await fetchApi({
        url: `plugins/definitions/name/${getServiceDetails.data.type}`
      });
    } catch (error) {
      console.error(`Error occurred while fetching service details ! ${error}`);
    }
    this.setState({
      serviceDetails: getServiceDetails.data,
      componentDefinationDetails: getComponentDefinationDetails.data,
      loader: false
    });
  };

  tabChange = (tabName) => {
    this.props.navigate(
      `/service/${this.props.params.serviceId}/policies/${tabName}`,
      { replace: true }
    );
  };
  policyBreadcrumb = () => {
    let policyDetails = {};
    policyDetails["serviceId"] = this.props.params.serviceId;
    policyDetails["policyType"] = this.props.params.policyType;
    policyDetails["serviceName"] = this.state.serviceDetails.displayName;
    policyDetails["selectedZone"] = JSON.parse(
      localStorage.getItem("zoneDetails")
    );
    if (this.state.componentDefinationDetails.name === "tag") {
      if (policyDetails.selectedZone) {
        return commonBreadcrumb(
          ["TagBasedServiceManager", "ManagePolicies"],
          policyDetails
        );
      } else {
        return commonBreadcrumb(
          ["TagBasedServiceManager", "ManagePolicies"],
          pick(policyDetails, ["serviceId", "policyType", "serviceName"])
        );
      }
    } else {
      if (policyDetails.selectedZone) {
        return commonBreadcrumb(
          ["ServiceManager", "ManagePolicies"],
          policyDetails
        );
      } else {
        return commonBreadcrumb(
          ["ServiceManager", "ManagePolicies"],
          pick(policyDetails, ["serviceId", "policyType", "serviceName"])
        );
      }
    }
  };
  render() {
    const { componentDefinationDetails } = this.state;
    return this.state.loader ? (
      <Loader />
    ) : (
      <>
        {this.policyBreadcrumb()}
        <div className="wrap">
          {isRenderMasking(componentDefinationDetails.dataMaskDef) ||
          isRenderRowFilter(componentDefinationDetails.rowFilterDef) ? (
            <Tabs
              id="PolicyListing"
              className="mb-3"
              activeKey={this.props.params.policyType}
              onSelect={(k) => this.tabChange(k)}
            >
              <Tab eventKey="0" title="Access">
                {this.props.params.policyType == "0" && <PolicyListing />}
              </Tab>
              {isRenderMasking(componentDefinationDetails.dataMaskDef) && (
                <Tab eventKey="1" title="Masking">
                  {this.props.params.policyType == "1" && <PolicyListing />}
                </Tab>
              )}
              {isRenderRowFilter(componentDefinationDetails.rowFilterDef) && (
                <Tab eventKey="2" title="Row Level Filter">
                  {this.props.params.policyType == "2" && <PolicyListing />}
                </Tab>
              )}
            </Tabs>
          ) : (
            <PolicyListing />
          )}
        </div>
      </>
    );
  }
}

export default withRouter(policyTabView);
