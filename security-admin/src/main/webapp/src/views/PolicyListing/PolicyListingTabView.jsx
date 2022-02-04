import React, { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import PolicyListing from "./PolicyListing";
import { fetchApi } from "Utils/fetchAPI";
import { isRenderMasking, isRenderRowFilter } from "Utils/XAUtils";
import { Loader } from "Components/CommonComponents";

class policyTabView extends Component {
  state = {
    serviceDetails: {},
    componentDefinationDetails: {},
    loader: true,
    activeKey: "access"
  };

  componentDidMount() {
    this.fetchServiceDetails();
  }
  fetchServiceDetails = async () => {
    let getServiceDetails;
    let getComponentDefinationDetails;
    try {
      getServiceDetails = await fetchApi({
        url: `plugins/services/${this.props.match.params.serviceId}`
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
    let polivyType;
    if (tabName == "access") {
      polivyType = 0;
    } else if (tabName == "masking") {
      polivyType = 1;
    } else {
      polivyType = 2;
    }
    this.props.history.replace({
      pathname: `/service/${this.props.match.params.serviceId}/policies/${polivyType}`
    });
    this.setState({
      activeKey: tabName
    });
  };

  render() {
    const { serviceDetails } = this.state;
    const { componentDefinationDetails } = this.state;
    return (
      <div className="wrap">
        {this.state.loader ? (
          <Loader />
        ) : isRenderMasking(componentDefinationDetails.dataMaskDef) ||
          isRenderRowFilter(componentDefinationDetails.rowFilterDef) ? (
          <Tabs
            id="PolicyListing"
            className="mb-3"
            activeKey={this.state.activeKey}
            onSelect={(k) => this.tabChange(k)}
          >
            <Tab eventKey="access" title="Access">
              {this.state.activeKey == "access" && <PolicyListing />}
            </Tab>
            {isRenderMasking(componentDefinationDetails.dataMaskDef) && (
              <Tab eventKey="masking" title="Masking">
                {this.state.activeKey == "masking" && <PolicyListing />}
              </Tab>
            )}
            {isRenderRowFilter(componentDefinationDetails.rowFilterDef) && (
              <Tab eventKey="rowLevelFilter" title="Row Level Filter">
                {this.state.activeKey == "rowLevelFilter" && <PolicyListing />}
              </Tab>
            )}
          </Tabs>
        ) : (
          <PolicyListing />
        )}
      </div>
    );
  }
}

export default policyTabView;
