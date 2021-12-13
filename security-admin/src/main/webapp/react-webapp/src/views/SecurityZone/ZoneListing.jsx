import React, { Component } from "react";
import noZoneImage from "Images/defult_zone.png";
import { Link } from "react-router-dom";
import { fetchApi } from "Utils/fetchAPI";
import { ZoneDisplay } from "./ZoneDisplay";
import { Loader } from "Components/CommonComponents";

class ZoneListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zones: [],
      selectedZone: null,
      expand: true,
      loader: false,
      searchText: "",
      filterZone: []
    };
    this.onChangeSearch = this.onChangeSearch.bind(this);
  }

  componentDidMount() {
    this.fetchZones();
  }

  fetchZones = async () => {
    let zoneList = [],
      selectedZone = null,
      zoneId = this.props.match.params.id;
    try {
      const zonesResp = await fetchApi({
        url: "zones/zones"
      });
      zoneList = zonesResp.data.securityZones || [];
    } catch (error) {
      console.error(`Error occurred while fetching Zones! ${error}`);
    }
    if (zoneId) {
      selectedZone = zoneList.find((obj) => obj.id === +zoneId) || null;
    } else {
      if (zoneList.length > 0) {
        selectedZone = zoneList[0];
        this.props.history.replace({
          pathname: `/zones/zone/${zoneList[0].id}`
        });
      }
    }
    this.setState({
      selectedZone: selectedZone,
      zones: zoneList,
      loader: false,
      filterZone: zoneList
    });
  };

  clickBtn = (zoneid) => {
    let selectedZone = this.state.zones.find((obj) => zoneid === obj.id);
    if (selectedZone) {
      this.setState({ selectedZone });
      this.props.history.replace({
        pathname: `/zones/zone/${zoneid}`
      });
    }
  };
  onChangeSearch = (e) => {
    let filterZone = this.state.zones.filter((obj) =>
      obj.name.includes(e.target.value)
    );
    this.setState({ searchText: e.target.value, filterZone: filterZone });
  };

  render() {
    return this.state.loader ? (
      <Loader />
    ) : (
      <div className="wrap policy-manager">
        <div className="row">
          <div className="col-sm-3 border-right">
            <div className="clearfix">
              <div className="float-left">
                <h5 className="text-muted wrap-header bold pull-left">
                  Security Zones
                </h5>
              </div>
              <div className="float-right">
                <Link to="/zones/create" className="btn btn-secondary btn-sm">
                  <i className="fa-fw fa fa-plus"></i>
                </Link>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <input
                  className="form-control"
                  type="text"
                  value={this.state.searchText}
                  onChange={this.onChangeSearch}
                  placeholder="Search"
                ></input>
              </div>
            </div>
            <div className="row m-t-5">
              <div className="col-sm-12">
                {this.state.filterZone.length !== 0 ? (
                  <ul className="list-group mt-3">
                    {this.state.filterZone.map((zone) => (
                      <li className="list-group-item border" key={zone.id}>
                        <a
                          className="text-primary"
                          onClick={() => {
                            this.clickBtn(zone.id);
                          }}
                        >
                          {zone.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="p-4">
                    <li className="list-unstyled text-auto">
                      <h4 className="text-muted  large">No Zone Found!</h4>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="col-sm-9 ">
            {this.state.selectedZone === null ? (
              <div className="row justify-content-md-center">
                <div className="col-md-auto text-center">
                  <img
                    alt="Avatar"
                    className="w-50 p-3 d-block mx-auto"
                    src={noZoneImage}
                  />

                  <Link to="/zones/create">
                    <i className="fa-fw fa fa-plus"></i>Click here to Create new
                    Zone
                  </Link>
                </div>
              </div>
            ) : (
              <ZoneDisplay zoneslisting={this.state.selectedZone} />
            )}
            <div></div>
          </div>
        </div>
      </div>
    );
  }
}

export default ZoneListing;
