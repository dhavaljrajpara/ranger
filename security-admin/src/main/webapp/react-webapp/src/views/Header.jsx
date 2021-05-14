import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";

import rangerLogo from "Images/ranger_logo.png";
import { Link } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Navbar fixed="top" expand="lg" id="top-navbar" collapseOnSelect>
        <Navbar.Brand href="/" className="logo">
          <img src={rangerLogo} alt="Ranger logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Link to="/reports/audit/bigData" className="nav-link">
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
          </Nav>
          <Nav>
            <Nav.Link href="/">Admin</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
