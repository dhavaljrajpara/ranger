import React, { Component } from "react";
import { Tab, Tabs, Alert } from "react-bootstrap";
import PolicyListing from "./PolicyListing";
import { fetchApi } from "Utils/fetchAPI";
import { isRenderMasking, isRenderRowFilter } from "Utils/XAUtils";
import { Loader } from "Components/CommonComponents";
import { commonBreadcrumb } from "../../utils/XAUtils";
import { pick } from "lodash";
import withRouter from "Hooks/withRouter";
import { alertMessage } from "../../utils/XAEnums";

class PolicyListingTabView extends Component {
  state = {
    serviceData: {},
    serviceDefData: {},
    loader: true,
    show: true
  };

  componentDidMount() {
    this.fetchServiceDetails();
  }

  fetchServiceDetails = async () => {
    let getServiceData;
    let getServiceDefData;
    try {
      getServiceData = await fetchApi({
        url: `plugins/services/${this.props.params.serviceId}`
      });
      getServiceDefData = await fetchApi({
        url: `plugins/definitions/name/${getServiceData.data.type}`
      });
    } catch (error) {
      console.error(`Error occurred while fetching service details ! ${error}`);
    }
    this.setState({
      serviceData: getServiceData.data,
      serviceDefData: getServiceDefData.data,
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
    policyDetails["serviceName"] = this.state.serviceData.displayName;
    policyDetails["selectedZone"] = JSON.parse(
      localStorage.getItem("zoneDetails")
    );
    if (this.state.serviceDefData.name === "tag") {
      if (policyDetails.selectedZone != null) {
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
      if (policyDetails.selectedZone != null) {
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
    const { serviceDefData } = this.state;
    return this.state.loader ? (
      <Loader />
    ) : (
      <React.Fragment>
        {this.policyBreadcrumb()}
        <h4 className="wrap-header bold">
          {`List of Policies : ${this.state.serviceData.displayName}`}
        </h4>
        {(this.state.serviceData.type == "hdfs" ||
          this.state.serviceData.type == "yarn") &&
          this.state.show && (
            <Alert
              variant="warning"
              onClose={() => this.setState({ show: false })}
              dismissible
            >
              <i className="fa-fw fa fa-info-circle d-inline text-dark"></i>
              <p className="pd-l-10 d-inline">
                {`By default, fallback to ${
                  // this.state.serviceData.type == "hdfs"
                  //   ? alertMessage.hdfs.label
                  //   : alertMessage.yarn.label
                  alertMessage[this.state.serviceData.type].label
                } ACLs are enabled. If access cannot be
              determined by Ranger policies, authorization will fall back to
              ${
                alertMessage[this.state.serviceData.type].label
              } ACLs. If this behavior needs to be changed, modify ${
                  alertMessage[this.state.serviceData.type].label
                }
              plugin config - ${
                alertMessage[this.state.serviceData.type].configs
              }-authorization.`}
              </p>
            </Alert>
          )}
        {isRenderMasking(serviceDefData.dataMaskDef) ||
        isRenderRowFilter(serviceDefData.rowFilterDef) ? (
          <Tabs
            id="PolicyListing"
            activeKey={this.props.params.policyType}
            onSelect={(k) => this.tabChange(k)}
          >
            <Tab eventKey="0" title="Access">
              {this.props.params.policyType == "0" && (
                <PolicyListing serviceDef={serviceDefData} />
              )}
            </Tab>
            {isRenderMasking(serviceDefData.dataMaskDef) && (
              <Tab eventKey="1" title="Masking">
                {this.props.params.policyType == "1" && (
                  <PolicyListing serviceDef={serviceDefData} />
                )}
              </Tab>
            )}
            {isRenderRowFilter(serviceDefData.rowFilterDef) && (
              <Tab eventKey="2" title="Row Level Filter">
                {this.props.params.policyType == "2" && (
                  <PolicyListing serviceDef={serviceDefData} />
                )}
              </Tab>
            )}
          </Tabs>
        ) : (
          <PolicyListing serviceDef={serviceDefData} />
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(PolicyListingTabView);
