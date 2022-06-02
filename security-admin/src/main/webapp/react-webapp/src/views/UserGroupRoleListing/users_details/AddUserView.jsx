import React, { Component } from "react";
import UserFormComp from "Views/UserGroupRoleListing/users_details/UserFormComp";
import { commonBreadcrumb } from "../../../utils/XAUtils";
class AddUserView extends Component {
  render() {
    return (
      <>
        {commonBreadcrumb(["Users", "UserCreate"])}
        <UserFormComp />
      </>
    );
  }
}

export default AddUserView;
