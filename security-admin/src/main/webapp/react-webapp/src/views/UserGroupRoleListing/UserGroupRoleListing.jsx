import React, { Component } from "react";
import { Tab, Tabs, Breadcrumb } from "react-bootstrap";
import Users from "./users_details/UserListing";
import Groups from "./groups_details/GroupListing";
import Roles from "./role_details/RoleListing";
import moment from "moment-timezone";
import { commonBreadcrumb } from "../../utils/XAUtils";

class UserGroupRoleListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: this.activeTab()
    };
  }
  tabChange = (tabName) => {
    this.props.history.replace({
      pathname: `/users/${tabName}`
    });
  };
  activeTab = () => {
    let activeTabVal;
    if (this.props && this.props.match && this.props.match.path) {
      if (this.props.match.path == "/users/usertab") {
        activeTabVal = "usertab";
      } else if (this.props.match.path == "/users/grouptab") {
        activeTabVal = "grouptab";
      } else {
        activeTabVal = "roletab";
      }
    }
    return activeTabVal;
  };
  render() {
    return (
      <div>
        {commonBreadcrumb(["Users"])}
        <h4 className="wrap-header bold">Users/Groups/Roles</h4>
        <div className="wrap">
          <Tabs
            id="userGroupRoleListing"
            className="mb-3"
            activeKey={this.state.activeKey}
            onSelect={(tabKey) => this.tabChange(tabKey)}
          >
            <Tab eventKey="usertab" title="Users">
              {this.state.activeKey == "usertab" && <Users />}
            </Tab>
            <Tab eventKey="grouptab" title="Groups">
              {this.state.activeKey == "grouptab" && <Groups />}
            </Tab>
            <Tab eventKey="roletab" title="Roles">
              {this.state.activeKey == "roletab" && <Roles />}
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default UserGroupRoleListing;
