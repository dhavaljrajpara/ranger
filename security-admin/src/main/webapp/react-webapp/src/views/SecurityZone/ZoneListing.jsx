import React, { Component } from "react";
import noZoneImage from "Images/defult_zone.png";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchApi } from "Utils/fetchAPI";
import { isSystemAdmin, isKeyAdmin } from "Utils/XAUtils";
import { Loader } from "Components/CommonComponents";
import ZoneDisplay from "./ZoneDisplay";
import { Row, Col, Collapse } from "react-bootstrap";
import { sortBy } from "lodash";

class ZoneListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zones: [],
      selectedZone: null,
      isCollapse: true,
      loader: false,
      searchText: "",
      filterZone: [],
      isAdminRole: isSystemAdmin() || isKeyAdmin()
    };
    this.onChangeSearch = this.onChangeSearch.bind(this);
  }

  componentDidMount() {
    this.fetchZones();
  }

  fetchZones = async () => {
    let zoneList = [],
      selectedZone = null,
      zoneId = this.props.match.params.zoneId;
    try {
      const zonesResp = await fetchApi({
        url: "zones/zones"
      });
      zoneList = zonesResp.data.securityZones || [];
    } catch (error) {
      console.error(`Error occurred while fetching Zones! ${error}`);
    }

    zoneList = sortBy(zoneList, ["name"]);
    if (zoneId !== undefined) {
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
      loader: false,
      selectedZone: selectedZone,
      zones: zoneList,
      filterZone: zoneList
    });
  };

  clickBtn = (zoneid) => {
    let selectedZone = this.state.zones.find((obj) => zoneid === obj.id);
    if (selectedZone) {
      this.setState({ selectedZone: selectedZone });
      this.props.history.replace({
        pathname: `/zones/zone/${zoneid}`
      });
    }
  };

  onChangeSearch = (e) => {
    let filterZone = this.state.zones.filter((obj) =>
      obj.name.includes(e.target.value)
    );
    this.setState({ filterZone: filterZone });
  };

  deleteZone = async (zoneId) => {
    let getSelectedZone = [];

    try {
      await fetchApi({
        url: `zones/zones/${zoneId}`,
        method: "delete"
      });
      let availableZone = this.state.filterZone.filter(
        (obj) => obj.id !== zoneId
      );
      getSelectedZone = availableZone.length > 0 ? availableZone[0] : null;

      this.setState({
        selectedZone: getSelectedZone,
        filterZone: availableZone,
        zones: availableZone
      });

      if (getSelectedZone && getSelectedZone !== undefined) {
        this.props.history.replace(`/zones/zone/${getSelectedZone.id}`);
      } else {
        this.props.history.replace(`/zones/zone/list`);
      }
      toast.success("Successfully deleted the zone");
    } catch (error) {
      console.error(
        `Error occurred while deleting Zone id - ${zoneId}!  ${error}`
      );
    }
  };

  expandBtn = (open) => {
    this.setState({
      isCollapse: !open
    });
  };

  render() {
    return this.state.loader ? (
      <Loader />
    ) : (
      <div className="wrap">
        <Row>
          <Collapse in={this.state.isCollapse}>
            <Col sm={3} className="border-right border-grey">
              <Row>
                <Col>
                  <h5 className="text-muted wrap-header bold pull-left">
                    Security Zones
                  </h5>
                </Col>

                {this.state.isAdminRole && (
                  <Col>
                    <Link
                      to="/zones/create"
                      className="btn btn-outline-secondary btn-sm pull-right"
                    >
                      <i className="fa-fw fa fa-plus"></i>
                    </Link>
                  </Col>
                )}
              </Row>
              <Row>
                <Col>
                  <input
                    className="form-control mt-2"
                    type="text"
                    value={this.state.searchText}
                    onChange={this.onChangeSearch}
                    placeholder="Search"
                  ></input>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  {this.state.filterZone.length !== 0 ? (
                    <ul className="zone-listing">
                      {this.state.filterZone.map((zone) => (
                        <li
                          className="trim-containt"
                          key={zone.id}
                          onClick={() => {
                            this.clickBtn(zone.id);
                          }}
                        >
                          <a
                            className={
                              this.state.selectedZone != null &&
                              this.state.selectedZone.id === zone.id
                                ? `selected`
                                : ``
                            }
                          >
                            {zone.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="p-4">
                      <li className="list-unstyled text-auto" key="no-zone">
                        <h5 className="text-muted large">No Zone Found!</h5>
                      </li>
                    </ul>
                  )}
                </Col>
              </Row>
            </Col>
          </Collapse>
          <Col>
            {this.state.selectedZone === null ? (
              <Row className="justify-content-md-center">
                <Col md="auto">
                  <img
                    alt="Avatar"
                    className="w-50 p-3 d-block mx-auto"
                    src={noZoneImage}
                  />
                  <br />
                  <span className="pt-5 pr-5">
                    <Link
                      to="/zones/create"
                      className="btn-add-security2 btn-lg"
                    >
                      <i className="fa-fw fa fa-plus"></i>Click here to Create
                      new Zone
                    </Link>
                  </span>
                </Col>
              </Row>
            ) : (
              <ZoneDisplay
                history={this.props.history}
                zone={this.state.selectedZone}
                deleteZone={this.deleteZone}
                expandBtn={this.expandBtn}
                isCollapse={this.state.isCollapse}
              />
            )}
            <div></div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ZoneListing;
