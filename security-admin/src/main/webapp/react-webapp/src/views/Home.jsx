import React, { Component } from "react";
import ServiceDefinitions from "./ServiceManager/ServiceDefinitions";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTagView: this.props.isTagView
    };
  }

  render() {
    return (
      <ServiceDefinitions isTagView={this.state.isTagView}></ServiceDefinitions>
    );
  }
}

export default Home;
