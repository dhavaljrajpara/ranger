import React, { Component } from "react";
import ServiceDefinitions from "./ServiceManager/ServiceDefinitions";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <Breadcrumb>
          <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        </Breadcrumb>
        <div className="clearfix">
        <div className="pull-left">
            <h3 className="wrap-header bold">Service Manager</h3>
        </div>
        <div className="pull-right m-b-sm">
                <div className="inline-block">
                    <b style={{fontSize:"13px"}}> Security Zone: </b>
                    <span title="Create zone first" className="zoneEmptyMsg">
                      <input type="text" id="selectZoneName" placeholder="Select Zone Name" disabled="disabled" /></span>
                </div>
                <button type="button" title="Import" className="btn btn btn-mini btn-import-export" id="importBtn" > <i class="fa-fw fa fa-rotate-180 fa-fw fa fa-external-link-square"></i>
                 Import
                </button>
                <button type="button" title="Export" className="btn btn btn-mini btn-import-export" id="exportBtn" > <i class="fa-fw fa fa-rotate-180 fa-fw fa fa-external-link-square"></i>
                 Export
                </button>
        </div>
    </div>
      </>
    )
  }
}

export default Home;
