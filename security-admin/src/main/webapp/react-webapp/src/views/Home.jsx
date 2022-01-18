import React, { Component } from "react";
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
        <ServiceDefinitions
          isTagView={this.props.isTagView}
        ></ServiceDefinitions>
      </div>
    );
  }
}

export default Home;
