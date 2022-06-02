import React, { Component } from "react";
import { Tab, Tabs, Badge, Row, Col } from "react-bootstrap";
import Access from "./AccessLogs";
import Admin from "./AdminLogs";
import Login_Sessions from "./LoginSessionsLogs";
import Plugins from "./PluginsLog";
import Plugin_Status from "./PluginStatusLogs";
import User_Sync from "./UserSync";
import moment from "moment-timezone";
import { AuditFilterEntries } from "Components/CommonComponents";

class AuditLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: this.activeTab()
    };
  }

  tabChange = (tabName) => {
    this.props.history.replace({
      pathname: `/reports/audit/${tabName}`
    });
  };

  activeTab = () => {
    let activeTabVal;
    if (this.props && this.props.match && this.props.match.path) {
      if (this.props.match.path == "/reports/audit/bigData") {
        activeTabVal = "bigData";
      } else if (this.props.match.path == "/reports/audit/admin") {
        activeTabVal = "admin";
      } else if (this.props.match.path == "/reports/audit/loginSession") {
        activeTabVal = "loginSession";
      } else if (this.props.match.path == "/reports/audit/agent") {
        activeTabVal = "agent";
      } else if (this.props.match.path == "/reports/audit/pluginStatus") {
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
        <div className="mt-n1 mb-2 headerBreadcrumbs">
          <div className="text-right mt-2">
            <b>Last Response Time: </b>
            {moment
              .tz(moment(), "Asia/Kolkata")
              .format("DD/MM/YYYY HH:mm:ss A")}
          </div>
        </div>
        <h4 className="wrap-header bold">Audit Logs</h4>
        <div className="wrap">
          <Tabs
            id="AuditLayout"
            className="mb-3"
            activeKey={this.state.activeKey}
            onSelect={(tabKey) => this.tabChange(tabKey)}
          >
            <Tab eventKey="bigData" title="Access">
              {this.state.activeKey == "bigData" && <Access />}
            </Tab>
            <Tab eventKey="admin" title="Admin">
              {this.state.activeKey == "admin" && <Admin />}
            </Tab>
            <Tab eventKey="loginSession" title="Login Sessions">
              {this.state.activeKey == "loginSession" && <Login_Sessions />}
            </Tab>
            <Tab eventKey="agent" title="Plugins">
              {this.state.activeKey == "agent" && <Plugins />}
            </Tab>
            <Tab eventKey="pluginStatus" title="Plugin Status">
              {this.state.activeKey == "pluginStatus" && <Plugin_Status />}
            </Tab>
            <Tab eventKey="userSync" title="User Sync">
              {this.state.activeKey == "userSync" && <User_Sync />}
            </Tab>
          </Tabs>
        </div>
      </>
    );
  }
}

export default AuditLayout;
