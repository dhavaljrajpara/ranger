import React, { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Users from "./users_details/UserListing";
import Groups from "./groups_details/GroupListing";
import Roles from "./role_details/RoleListing";

class UserGroupRoleListing extends Component {
  state = {
    activeKey: "usertab"
  };
  tabChange = (tabName) => {
    this.props.history.replace({
      pathname: `/users/${tabName}`
    });
    this.setState({
      activeKey: tabName
    });
  };
  render() {
    return (
      <div>
        <h4 className="wrap-header bold">Users/Groups/Roles</h4>
        <div className="wrap">
          <Tabs
            // defaultActiveKey="userTab"
            id="userGroupRoleListing"
            className="mb-3"
            activeKey={this.state.activeKey}
            onSelect={(k) => this.tabChange(k)}
          >
            <Tab eventKey="usertab" title="Users">
              <Users />
            </Tab>
            <Tab eventKey="grouptab" title="Groups">
              <Groups />
            </Tab>
            <Tab eventKey="roletab" title="Roles">
              <Roles />
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default UserGroupRoleListing;
