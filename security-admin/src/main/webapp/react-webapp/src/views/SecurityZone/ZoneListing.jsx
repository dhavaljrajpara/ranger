import React, { Component } from "react";
import noZoneImage from "Images/defult_zone.png";
import { Link } from "react-router-dom";

class ZoneListing extends React.Component {
  state = {
    zones: [],
  };

  componentDidMount() {
    this.fetchZones();
  }

  fetchZones = async () => {
    let zonesResp;
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      zonesResp = await fetchApi({
        url: "zones/zones",
      });
      await fetchCSRFConf();
      console.log(zonesResp.data.securityZones);
    } catch (error) {
      console.error(
        `Error occurred while fetching Zones or CSRF headers! ${error}`
      );
    }
    this.setState({
      zones: zonesResp.data.securityZones,
    });
  };

  render() {
    let isZoneEmpty = this.state.zones.length == 0;
    return (
      <div className="wrap policy-manager">
        <div className="row">
          <div className="col-sm-3 border-right">
            <div className="clearfix">
              <div className="float-left">
                <h4>Security Zones</h4>
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
                  placeholder="Search"
                ></input>
              </div>
            </div>
            <div className="row m-t-5">
              <div className="col-sm-12">
                <ul className="list-group mt-3">
                  {this.state.zones.map((zone) => (
                    <li className="list-group-item" key={zone.id}>
                      <a href={"/zones/zone/" + zone.id}>{zone.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-sm-9">
            {isZoneEmpty ? (
              <div className="row justify-content-md-center">
                <div className="col-md-auto text-center">
                  <img
                    alt="Avatar"
                    className="w-50 p-3 d-block mx-auto"
                    src={noZoneImage}
                  />
                  <a
                    href="/zones/create"
                    className="btn-add-security btn-lg"
                    title="Click here to Create new Zone"
                  >
                    <i className="fa-fw fa fa-plus"></i>Click here to Create new
                    Zone
                  </a>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-sm-12">
                  <div className="clearfix">
                    <div className="float-left"></div>
                    <div className="float-right">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary m-r-5"
                      >
                        <i className="fa-fw fa fa-edit"></i>
                        Edit
                      </button>
                      <button type="button" className="btn btn-sm btn-danger">
                        <i className="fa-fw fa fa-trash"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                  <div
                    className="accordion mt-3"
                    id="zone-administration-accordion"
                  >
                    <div className="card">
                      <div className="card-header" id="zone-administration">
                        <h2 className="mb-0">
                          <button
                            className="btn btn-link btn-block text-left"
                            type="button"
                            data-toggle="collapse"
                            data-target="#zone-administration-body"
                            aria-expanded="true"
                            aria-controls="zone-administration-body"
                          >
                            Zone Administrations
                          </button>
                        </h2>
                      </div>

                      <div
                        id="zone-administration-body"
                        className="collapse show"
                        aria-labelledby="zone-administration"
                        data-parent="#zone-administration"
                      >
                        <div className="card-body"></div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion mt-3"
                    id="zone-tag-services-accordion"
                  >
                    <div className="card">
                      <div className="card-header" id="zone-tag-services">
                        <h2 className="mb-0">
                          <button
                            className="btn btn-link btn-block text-left"
                            type="button"
                            data-toggle="collapse"
                            data-target="#zone-tag-services-body"
                            aria-expanded="true"
                            aria-controls="zone-tag-services-body"
                          >
                            Zone Tag Services
                          </button>
                        </h2>
                      </div>
                      <div
                        id="zone-tag-services-body"
                        className="collapse show"
                        aria-labelledby="zone-tag-services"
                        data-parent="#zone-tag-services"
                      >
                        <div className="card-body"></div>
                      </div>
                      Licensed
                    </div>
                  </div>
                  <div className="accordion mt-3" id="zone-services-accordion">
                    <div className="card">
                      <div className="card-header" id="zone-services">
                        <h2 className="mb-0">
                          <button
                            className="btn btn-link btn-block text-left"
                            type="button"
                            data-toggle="collapse"
                            data-target="#zone-services-body"
                            aria-expanded="true"
                            aria-controls="zone-services-body"
                          >
                            Zone Tag Services
                          </button>
                        </h2>
                      </div>

                      <div
                        id="zone-services-body"
                        className="collapse show"
                        aria-labelledby="zone-services"
                        data-parent="#zone-services"
                      >
                        <div className="card-body"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ZoneListing;
