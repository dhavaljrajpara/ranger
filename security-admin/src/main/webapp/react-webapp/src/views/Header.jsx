import React, { Component } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

import rangerLogo from "Images/ranger_logo.png";
import { Link, withRouter } from "react-router-dom";
import { getUserProfile, setUserProfile } from "Utils/appState";

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
      window.location.replace("login.html");
      // this.props.history.push("/signin")
    } catch (error) {
      console.error(`Error occurred while login! ${error}`);
    }
  };
  render() {
    const userProps = getUserProfile();
    const loginId = (
      <span className="login-id">
        <i className="fa fa-user-circle fa-lg"></i>
        {/* {userProps.loginId} */}
        {userProps?.loginId.charAt(0).toUpperCase() +
          userProps?.loginId.slice(1)}
      </span>
    );
    const accessManager = (
      <span>
        <i className="fa fa-fw fa-shield"></i> Access Manager
      </span>
    );
    const settings = (
      <span>
        <i className="fa-fw fa fa-gear"></i> Settings
      </span>
    );
    // if (this.props.location && this.props.location.pathname === "/signin") {
    //   return null;
    // }
    return (
      <Navbar
        fixed="top"
        expand="lg"
        id="top-navbar"
        className="ranger-navbar"
        collapseOnSelect
      >
        <Link to="/" className="navbar-brand logo">
          <img src={rangerLogo} alt="Ranger logo" />
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title={accessManager}>
              <Link to="/" className="dropdown-item">
                <i className="fa fa-fw fa-file m-r-xs"></i> Resource Based
                Policies
              </Link>
              <Link to="/tag_policies" className="dropdown-item">
                <i className="fa fa-fw fa-tags m-r-xs"></i> Tag Based Policies
              </Link>
              <Link to="/reports" className="dropdown-item">
                <i className="fa fa-fw fa-file-text m-r-xs"></i> Reports
              </Link>
            </NavDropdown>
            <Link to="/bigData" className="nav-link">
              <i className="fa fa-fw fa-file-o"></i>
              {` Audit `}
            </Link>
            <Link to="/zones/zone/list" className="nav-link">
              <span className="zone-icon fa-stack fa-lg">
                <i className="fa fa-square-o fa-stack-2x"></i>
                <i className="fa fa-bolt fa-stack-1x"></i>
              </span>
              {` Security Zone `}
            </Link>
            <NavDropdown title={settings}>
              <Link to="/users/usertab" className="dropdown-item">
                <i className="fa-fw fa fa-group m-r-xs"></i> Users/Groups/Roles
              </Link>
              <Link to="/permissions" className="dropdown-item">
                <i className="fa-fw fa fa-file-o m-r-xs"></i> Permissions
              </Link>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavDropdown title={loginId} id="user-dropdown" alignRight>
              <Link to="/userprofile" className="dropdown-item">
                <i className="fa fa-user"></i> Profile
              </Link>
              <Link
                to="/logout"
                onClick={this.handleLogout}
                className="dropdown-item"
              >
                <i className="fa fa-power-off"></i> Logout
              </Link>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(Header);
