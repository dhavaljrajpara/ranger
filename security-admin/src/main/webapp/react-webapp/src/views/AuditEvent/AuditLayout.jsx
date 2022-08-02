import React, { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import withRouter from "Hooks/withRouter";
import { Outlet } from "react-router-dom";

class AuditLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: this.activeTab()
    };
  }

  tabChange = (tabName) => {
    this.setState({ activeKey: tabName });
    this.props.navigate(`/reports/audit/${tabName}`, { replace: true });
  };

  activeTab = () => {
    let activeTabVal;
    if (this.props?.location?.pathname) {
      if (this.props.location.pathname == "/reports/audit/bigData") {
        activeTabVal = "bigData";
      } else if (this.props.location.pathname == "/reports/audit/admin") {
        activeTabVal = "admin";
      } else if (
        this.props.location.pathname == "/reports/audit/loginSession"
      ) {
        activeTabVal = "loginSession";
      } else if (this.props.location.pathname == "/reports/audit/agent") {
        activeTabVal = "agent";
      } else if (
        this.props.location.pathname == "/reports/audit/pluginStatus"
      ) {
        activeTabVal = "pluginStatus";
      } else {
        activeTabVal = "userSync";
      }
    }
    return activeTabVal;
  };

  render() {
    return (
      <>
        <Tabs
          id="AuditLayout"
          activeKey={this.state.activeKey}
          onSelect={(tabKey) => this.tabChange(tabKey)}
          className="mt-5"
        >
          <Tab eventKey="bigData" title="Access" />
          <Tab eventKey="admin" title="Admin" />
          <Tab eventKey="loginSession" title="Login Sessions" />
          <Tab eventKey="agent" title="Plugins" />
          <Tab eventKey="pluginStatus" title="Plugin Status" />
          <Tab eventKey="userSync" title="User Sync" />
        </Tabs>
        <Outlet />
      </>
    );
  }
}

export default withRouter(AuditLayout);
