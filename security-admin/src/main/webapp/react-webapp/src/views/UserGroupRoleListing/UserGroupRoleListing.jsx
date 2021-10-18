import React, { Component } from "react";
import {Tab, Tabs} from "react-bootstrap";
import Users from "./users_details/UserListing";
import Groups from "./groups_details/GroupListing";
import Roles from "./role_details/RoleListing";

class UserGroupRoleListing extends Component {
  render() {
    return (
      <div>
        <h4 className="wrap-header bold">Users/Groups/Roles</h4>
        <div className="wrap">
        <Tabs defaultActiveKey="userTab" id="userGroupRoleListing" className="mb-3">
          <Tab eventKey="userTab" title="Users">
            <Users />
          </Tab>
          <Tab eventKey="groupTab" title="Groups">
            <Groups />
          </Tab>
          <Tab eventKey="roleTab" title="Roles">
            <Roles />
          </Tab>
        </Tabs>
        </div>
      </div>
    );
  }
}

export default UserGroupRoleListing;
