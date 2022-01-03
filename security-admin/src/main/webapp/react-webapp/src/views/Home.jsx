import React, { Component } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import ServiceDefinitions from "./ServiceManager/ServiceDefinitions";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    this.props;
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item href="#"></Breadcrumb.Item>
        </Breadcrumb>
        <ServiceDefinitions
          isTagView={this.props.isTagView}
        ></ServiceDefinitions>
      </div>
    );
  }
}

export default Home;
