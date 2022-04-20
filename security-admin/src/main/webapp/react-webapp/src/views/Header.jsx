import React, { Component } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import rangerLogo from "Images/ranger_logo.png";
import { getUserProfile, setUserProfile } from "Utils/appState";
import {
  isKeyAdmin,
  hasAccessToTab,
  isSystemAdmin,
  isAuditor
} from "Utils/XAUtils";
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { fetchApi } = await import("Utils/fetchAPI");
      await fetchApi({
        url: "logout",
        baseURL: "",
        headers: {
          "cache-control": "no-cache"
        }
      });
      setUserProfile(null);
      window.location.replace("login.jsp");
    } catch (error) {
      console.error(`Error occurred while login! ${error}`);
    }
  };
  render() {
    const userProps = getUserProfile();
    const loginId = (
      <span className="login-id">
        <i className="fa fa-user-circle fa-lg"></i>
        {userProps?.loginId.charAt(0).toUpperCase() +
          userProps?.loginId.slice(1)}
      </span>
    );
    const accessManager = (
      <span>
        <i className="fa fa-fw fa-shield"></i> Access Manager
      </span>
    );
    const encryption = (
      <span>
        <i className="fa fa-fw fa-lock"></i> Encryption
      </span>
    );
    const settings = (
      <span>
        <i className="fa-fw fa fa-gear"></i> Settings
      </span>
    );

    return (
      <>
        <Navbar
          fixed="top"
          expand="lg"
          id="top-navbar"
          className="ranger-navbar"
          collapseOnSelect
        >
          <Navbar.Brand
            href="#/policymanager/resource"
            className="navbar-brand logo"
          >
            <img src={rangerLogo} alt="Ranger logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown title={accessManager} className="topnav_menu">
                {hasAccessToTab("Resource Based Policies") && (
                  <>
                    <NavDropdown.Item
                      href="#/policymanager/resource"
                      className="dropdown-item"
                      replace
                    >
                      <i className="fa fa-fw fa-file m-r-xs"></i> Resource Based
                      Policies
                    </NavDropdown.Item>
                  </>
                )}
                {hasAccessToTab("Tag Based Policies") && (
                  <>
                    <NavDropdown.Item
                      href="#/policymanager/tag"
                      className="dropdown-item"
                      replace
                    >
                      <i className="fa fa-fw fa-tags m-r-xs"></i> Tag Based
                      Policies
                    </NavDropdown.Item>
                  </>
                )}
                {hasAccessToTab("Reports") && (
                  <>
                    <NavDropdown.Item
                      href="#/reports"
                      className="dropdown-item"
                      replace
                    >
                      <i className="fa fa-fw fa-file-text m-r-xs"></i> Reports
                    </NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
              {hasAccessToTab("Audit") && (
                <>
                  <Nav.Link
                    href="#/reports/audit/bigData"
                    className="nav-link topnav_menu"
                    replace
                  >
                    <i className="fa fa-fw fa-file-o"></i>
                    Audit
                  </Nav.Link>
                </>
              )}

              {hasAccessToTab("Security Zone") && (
                <>
                  {!isKeyAdmin() && (
                    <Nav.Link
                      href="#/zones/zone/list"
                      className="nav-link topnav_menu"
                      replace
                    >
                      <span className="zone-icon fa-stack fa-lg">
                        <i className="fa fa-square-o fa-stack-2x"></i>
                        <i className="fa fa-bolt fa-stack-1x"></i>
                      </span>
                      {` Security Zone `}
                    </Nav.Link>
                  )}
                </>
              )}
              {hasAccessToTab("Key Manager") && (
                <>
                  {isKeyAdmin() && (
                    <NavDropdown title={encryption}>
                      <NavDropdown.Item
                        href="#/kms/keys/new/manage/service"
                        className="dropdown-item"
                        replace
                      >
                        <i className="fa fa-fw fa-key m-r-xs"></i> Key Manager
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}
                </>
              )}
              <>
                {hasAccessToTab("Users/Groups") ||
                  ((isAuditor() || isSystemAdmin()) && (
                    <NavDropdown title={settings}>
                      {hasAccessToTab("Users/Groups") && (
                        <NavDropdown.Item
                          href="#/users/usertab"
                          className="dropdown-item"
                          replace
                        >
                          <i className="fa-fw fa fa-group m-r-xs"></i>
                          Users/Groups/Roles
                        </NavDropdown.Item>
                      )}
                      {(isAuditor() || isSystemAdmin()) && (
                        <>
                          <NavDropdown.Item
                            href="#/permissions/models"
                            className="dropdown-item"
                            replace
                          >
                            <i className="fa-fw fa fa-file-o m-r-xs"></i>{" "}
                            Permissions
                          </NavDropdown.Item>
                        </>
                      )}
                    </NavDropdown>
                  ))}
              </>
            </Nav>
            <Nav>
              <NavDropdown title={loginId} id="user-dropdown" alignRight>
                <NavDropdown.Item
                  href="#/userprofile"
                  className="dropdown-item"
                  replace
                >
                  <i className="fa fa-user"></i> Profile
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#/logout"
                  onClick={this.handleLogout}
                  className="dropdown-item"
                  replace
                >
                  <i className="fa fa-power-off"></i> Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }
}

export default Header;
