import React, { Component } from "react";
import {Tab, Tabs} from "react-bootstrap";
import Access from "./AccessLogs";
import Admin from "./AdminLogs";
import Login_Sessions from "./LoginSessionsLogs";
import Plugins from "./PluginsLog";
import Plugin_Status from "./PluginStatusLogs";
import User_Sync from "./UserSync";

class AuditLayout extends Component {
  render() {
    return (
      <div>
        <h4 className="wrap-header bold">Audit Logs</h4>
        <div className="wrap">
        <Tabs defaultActiveKey="access" id="AuditLayout" className="mb-3">
          <Tab eventKey="access" title="Access">
            <Access />
          </Tab>
          <Tab eventKey="admin" title="Admin">
            <Admin />
          </Tab>
          <Tab eventKey="loginSessions" title="Login Sessions">
            <Login_Sessions />
          </Tab>
          <Tab eventKey="plugins" title="Plugins">
            <Plugins />
          </Tab>
          <Tab eventKey="pluginStatus" title="Plugin Status">
            <Plugin_Status />
          </Tab>
          <Tab eventKey="userSync" title="User Sync">
            <User_Sync />
          </Tab>
        </Tabs>
        </div>
      </div>
    );
  }
}

export default AuditLayout;
