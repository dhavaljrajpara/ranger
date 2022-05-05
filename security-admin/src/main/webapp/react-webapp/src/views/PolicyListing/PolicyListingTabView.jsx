import React, { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import PolicyListing from "./PolicyListing";
import { fetchApi } from "Utils/fetchAPI";
import { isRenderMasking, isRenderRowFilter } from "Utils/XAUtils";
import { Loader } from "Components/CommonComponents";
import { MoreLess } from "Components/CommonComponents";

class policyTabView extends Component {
  state = {
    serviceDetails: {},
    componentDefinationDetails: {},
    loader: true
    // activeKey: "0"
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
    this.props.history.replace({
      pathname: `/service/${this.props.match.params.serviceId}/policies/${tabName}`
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
            activeKey={this.props.match.params.policyType}
            onSelect={(k) => this.tabChange(k)}
          >
            <Tab eventKey="0" title="Access">
              {this.props.match.params.policyType == "0" && <PolicyListing />}
            </Tab>
            {isRenderMasking(componentDefinationDetails.dataMaskDef) && (
              <Tab eventKey="1" title="Masking">
                {this.props.match.params.policyType == "1" && <PolicyListing />}
              </Tab>
            )}
            {isRenderRowFilter(componentDefinationDetails.rowFilterDef) && (
              <Tab eventKey="2" title="Row Level Filter">
                {this.props.match.params.policyType == "2" && <PolicyListing />}
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
