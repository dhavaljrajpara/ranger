import React, { Component } from "react";
import { Tab, Tabs, Breadcrumb } from "react-bootstrap";
import Users from "./users_details/UserListing";
import Groups from "./groups_details/GroupListing";
import Roles from "./role_details/RoleListing";
import withRouter from "Hooks/withRouter";
import { Outlet } from "react-router-dom";
import { commonBreadcrumb } from "../../utils/XAUtils";

class UserGroupRoleListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: this.activeTab()
    };
  }
  tabChange = (tabName) => {
    this.setState({ activeKey: tabName });
    this.props.navigate(`/users/${tabName}`, { replace: true });
  };
  activeTab = () => {
    let activeTabVal;
    if (this.props.location.pathname) {
      if (this.props.location.pathname == "/users/usertab") {
        activeTabVal = "usertab";
      } else if (this.props.location.pathname == "/users/grouptab") {
        activeTabVal = "grouptab";
      } else {
        activeTabVal = "roletab";
      }
    }
    return activeTabVal;
  };
  render() {
    return (
      <React.Fragment>
        {commonBreadcrumb(["Users"])}
        <Tabs
          id="userGroupRoleListing"
          activeKey={this.state.activeKey}
          onSelect={(tabKey) => this.tabChange(tabKey)}
        >
          <Tab eventKey="usertab" title="Users" />
          <Tab eventKey="grouptab" title="Groups" />
          <Tab eventKey="roletab" title="Roles" />
        </Tabs>
        <Outlet />
      </React.Fragment>
    );
  }
}

export default withRouter(UserGroupRoleListing);
