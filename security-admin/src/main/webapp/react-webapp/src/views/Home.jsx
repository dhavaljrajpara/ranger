import React, { Component } from "react";
import ServiceDefinitions from "./ServiceManager/ServiceDefinitions";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <ServiceDefinitions></ServiceDefinitions>;
  }
}

export default Home;
