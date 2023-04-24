/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useReducer, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import rangerIcon from "Images/sidebar/ranger.svg";
import keyIcon from "Images/sidebar/key.svg";
import tagsIcon from "Images/sidebar/tags.svg";
import reportsIcon from "Images/sidebar/reports.svg";
import auditsIcon from "Images/sidebar/audits.svg";
import zoneIcon from "Images/sidebar/zone.svg";
import settingsIcon from "Images/sidebar/settings.svg";
import accountIcon from "Images/sidebar/account.svg";
import Collapse from "react-bootstrap/Collapse";
import { fetchApi } from "Utils/fetchAPI";
import { getUserProfile, setUserProfile } from "Utils/appState";
import {
  hasAccessToTab,
  isAuditor,
  isKeyAdmin,
  isSystemAdmin,
  getBaseUrl,
  isKMSAuditor
} from "Utils/XAUtils";
import Select from "react-select";
import { filter, isEmpty, map, sortBy, uniq, upperCase } from "lodash";
import { toast } from "react-toastify";
import ResourceTagContent from "./ResourceTagContent";

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADER":
      return {
        ...state,
        loader: action.loader
      };
    case "SIDEBAR_COLLAPSE":
      return {
        ...state,
        resources: action.resources,
        tag: action.tag,
        audits: action.audits,
        settings: action.settings,
        account: action.account
      };
    case "SERVICEDEF_DATA":
      return {
        ...state,
        allserviceDefData: action.allserviceDefData,
        serviceDefData: action.serviceDefData,
        tagServiceDefData: action.tagServiceDefData
      };
    case "SERVICES_DATA":
      return {
        ...state,
        allServiceData: action.allServiceData,
        serviceData: action.serviceData,
        tagServiceData: action.tagServiceData
      };
    case "ZONE_DATA":
      return {
        ...state,
        zoneData: action.zoneData
      };
    case "SELECTED_ZONE_DATA":
      return {
        ...state,
        selectedZone: action.selectedZone
      };
    case "SELECTED_SERVCIEDEF_DATA":
      return {
        ...state,
        selectedServiceDef: action.selectedServiceDef
      };
    case "SERVICE_TYPES_OPTIONS":
      return {
        ...state,
        serviceTypesOptions: action.serviceTypesOptions
      };
    default:
      throw new Error();
  }
}

export const SideBar = () => {
  let location = useLocation();
  const navigate = useNavigate();
  const isKMSRole = isKeyAdmin() || isKMSAuditor();
  const [keyState, dispatch] = useReducer(reducer, {
    loader: false,
    resources: false,
    tag: false,
    audits: false,
    settings: false,
    account: false,
    allserviceDefData: [],
    serviceDefData: [],
    tagServiceDefData: [],
    allServiceData: [],
    serviceData: [],
    tagServiceData: [],
    zoneData: [],
    selectedZone: JSON.parse(localStorage.getItem("zoneDetails")) || "",
    selectedServiceDef: [],
    serviceTypesOptions: []
  });
  const {
    loader,
    resources,
    tag,
    audits,
    settings,
    account,
    serviceDefData,
    tagServiceDefData,
    serviceData,
    tagServiceData,
    allserviceDefData,
    allServiceData,
    zoneData,
    selectedZone,
    selectedServiceDef,
    serviceTypesOptions
  } = keyState;
  const userProps = getUserProfile();
  const apiUrl = getBaseUrl() + "apidocs/index.html";
  const loginId = <span className="login-id">{userProps?.loginId}</span>;
  let isListenerAttached = false;

  const zoneSelectCustomStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "black"
    })
  };
  const serviceSelectCustomStyle = {
    option: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "white" : "black"
    })
  };
  const zoneSelectTheme = (theme) => {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary: "#0081ab"
      }
    };
  };

  const serviceSelectThemes = (theme) => {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        text: "#444444",
        primary25: "#0b7fad;",
        primary: "#0b7fad;"
      }
    };
  };
  const handleClickOutside = (e) => {
    if (
      document.getElementById("sidebar")?.contains(e?.target) == false &&
      document.getElementById("drawer-content")?.contains(e?.target) == false
    ) {
      dispatch({
        type: "SIDEBAR_COLLAPSE",
        settings: false,
        audits: false,
        account: false,
        resources: false
      });
    }
    e?.stopPropagation();
  };

  useEffect(() => {
    if (
      location.pathname != "/policymanager/resource" &&
      location.pathname != "/policymanager/tag"
    ) {
      fetchServicesData();
    }
    fetchZones();
  }, []);
  useEffect(() => {
    if (!isListenerAttached) {
      document?.addEventListener("mousedown", handleClickOutside);
      isListenerAttached = true;
      return;
    }
    return () => {
      document?.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const fetchServicesData = async () => {
    dispatch({
      type: "SET_LOADER",
      loader: true
    });
    let getServiceDefData = [];
    let resourceServiceDef = [];
    let tagServiceDef = [];
    let servicesResp = [];
    let resourceServices = [];
    let tagServices = [];
    try {
      getServiceDefData = await fetchApi({
        url: `plugins/definitions`
      });

      tagServiceDef = sortBy(
        filter(getServiceDefData.data.serviceDefs, ["name", "tag"]),
        "name"
      );

      resourceServiceDef = getServiceDefData.data.serviceDefs;

      dispatch({
        type: "SERVICEDEF_DATA",
        allserviceDefData: filter(
          getServiceDefData.data.serviceDefs,
          (serviceDef) => serviceDef.name !== "tag"
        ),
        serviceDefData: sortBy(
          filter(resourceServiceDef, (serviceDef) => serviceDef.name !== "tag"),
          "id"
        ),
        tagServiceDefData: tagServiceDef
      });
      dispatch({
        type: "SERVICE_TYPES_OPTIONS",
        serviceTypesOptions: sortBy(
          filter(resourceServiceDef, (serviceDef) => serviceDef.name !== "tag"),
          "name"
        )
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching serviceDef details ! ${error}`
      );
    }

    try {
      servicesResp = await fetchApi({
        url: "plugins/services"
      });
      tagServices = filter(servicesResp.data.services, ["type", "tag"]);
      if (isKMSRole) {
        resourceServices = filter(
          servicesResp.data.services,
          (service) => service.type == "kms"
        );
      } else {
        resourceServices = filter(
          servicesResp.data.services,
          (service) => service.type !== "tag" && service.type !== "kms"
        );
      }
      dispatch({
        type: "SERVICES_DATA",
        allServiceData: servicesResp.data.services,
        serviceData: resourceServices,
        tagServiceData: tagServices
      });

      selectedZone != "" &&
        getSelectedZone(
          selectedZone,
          servicesResp.data.services,
          getServiceDefData.data.serviceDefs
        );
      selectedServiceDef.length > 0 &&
        handleServiceDefChange(
          selectedServiceDef,
          resourceServiceDef,
          resourceServices
        );
      dispatch({
        type: "SET_LOADER",
        loader: false
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Services or CSRF headers! ${error}`
      );
    }
  };

  const fetchZones = useCallback(async () => {
    dispatch({
      type: "SET_LOADER",
      loader: true
    });
    let zoneList = [];
    try {
      const zonesResp = await fetchApi({
        url: "public/v2/api/zone-headers"
      });
      zoneList = zonesResp.data;
    } catch (error) {
      console.error(`Error occurred while fetching Zones! ${error}`);
    }

    dispatch({
      type: "ZONE_DATA",
      zoneData: sortBy(zoneList, ["name"])
    });
    dispatch({
      type: "SET_LOADER",
      loader: false
    });
  }, []);

  const getSelectedZone = async (
    e,
    allFilterServiceData,
    allFilterServiceDefData,
    serviceChange
  ) => {
    dispatch({
      type: "SET_LOADER",
      loader: true
    });
    try {
      let zonesResp = [];
      if (e && e !== "") {
        zonesResp = await fetchApi({
          url: `public/v2/api/zones/${e && e.value}/service-headers`
        });
        if (!isEmpty(zonesResp.data)) {
          zonesResp &&
            navigate(`${location.pathname}?securityZone=${e.label}`, {
              replace: true
            });

          let zoneServiceNames = map(zonesResp.data, "name");

          let zoneServices = zoneServiceNames.map((zoneService) => {
            let zoneServiceData = !isEmpty(allServiceData)
              ? allServiceData
              : allFilterServiceData;

            return zoneServiceData.filter((service) => {
              return service.name === zoneService;
            });
          });

          zoneServices = zoneServices.flat();
          let zoneServiceDefTypes = uniq(
            filter(
              map(zoneServices, "type"),
              (serviceDef) => serviceDef !== "tag"
            )
          );

          let zoneDetails = {};
          zoneDetails["label"] = e.label;
          zoneDetails["value"] = e.value;
          localStorage.setItem("zoneDetails", JSON.stringify(zoneDetails));
          dispatch({
            type: "SELECTED_ZONE_DATA",
            selectedZone: { label: e.label, value: e.value }
          });
          if (serviceChange != undefined) {
            dispatch({
              type: "SELECTED_SERVCIEDEF_DATA",
              selectedServiceDef: []
            });
          }
          dispatch({
            type: "SERVICEDEF_DATA",
            allserviceDefData: !isEmpty(allserviceDefData)
              ? allserviceDefData
              : allFilterServiceDefData,
            serviceDefData: sortBy(
              zoneServiceDefTypes.map((obj) => {
                let zoneServiceDefData = !isEmpty(allserviceDefData)
                  ? allserviceDefData
                  : allFilterServiceDefData;
                return zoneServiceDefData.find((serviceDef) => {
                  return serviceDef.name == obj;
                });
              }),
              "name"
            ),
            tagServiceDefData: !isEmpty(tagServiceDefData)
              ? tagServiceDefData
              : sortBy(filter(allFilterServiceDefData, ["name", "tag"]), "id")
          });
          dispatch({
            type: "SERVICES_DATA",
            allServiceData: !isEmpty(allServiceData)
              ? allServiceData
              : allFilterServiceData,
            serviceData: filter(zoneServices, function (zoneService) {
              return zoneService.type !== "tag";
            }),
            tagServiceData: filter(zoneServices, function (zoneService) {
              return zoneService.type === "tag";
            })
          });
          dispatch({
            type: "SERVICE_TYPES_OPTIONS",
            serviceTypesOptions: sortBy(
              map(zoneServiceDefTypes, function (serviceDef) {
                return {
                  value: serviceDef,
                  label: upperCase(serviceDef)
                };
              }),
              "label"
            )
          });
          dispatch({
            type: "SET_LOADER",
            loader: false
          });
        } else {
          dispatch({
            type: "SELECTED_ZONE_DATA",
            selectedZone: ""
          });
          dispatch({
            type: "SET_LOADER",
            loader: false
          });
        }
      } else {
        localStorage.removeItem("zoneDetails");
        navigate(location.pathname);
        dispatch({
          type: "SELECTED_SERVCIEDEF_DATA",
          selectedServiceDef: []
        });
        dispatch({
          type: "SELECTED_ZONE_DATA",
          selectedZone: ""
        });
        dispatch({
          type: "SERVICEDEF_DATA",
          allserviceDefData: allserviceDefData,
          serviceDefData: allserviceDefData,
          tagServiceDefData: tagServiceDefData
        });
        dispatch({
          type: "SERVICES_DATA",
          allServiceData: allServiceData,
          serviceData: allServiceData,
          tagServiceData: allServiceData
        });

        dispatch({
          type: "SERVICE_TYPES_OPTIONS",
          serviceTypesOptions: sortBy(
            filter(
              allFilterServiceDefData,
              (serviceDef) => serviceDef.name !== "tag"
            ),
            "name"
          )
        });
        dispatch({
          type: "SET_LOADER",
          loader: false
        });
      }
    } catch (error) {
      console.error(`Error occurred while fetching Zone Services ! ${error}`);
    }
  };

  const checkKnoxSSO = async (e) => {
    e.preventDefault();
    let checkKnoxSSOresp;
    try {
      checkKnoxSSOresp = await fetchApi({
        url: "plugins/checksso",
        type: "GET",
        headers: {
          "cache-control": "no-cache"
        }
      });
      if (
        checkKnoxSSOresp.data == "true" &&
        userProps?.configProperties?.inactivityTimeout > 0
      ) {
        window.location.replace("index.html?action=timeout");
      } else {
        handleLogout(checkKnoxSSOresp.data);
      }
    } catch (error) {
      if (checkKnoxSSOresp?.status == "419") {
        setUserProfile(null);
        window.location.replace("login.jsp");
      }
      console.error(`Error occurred while logout! ${error}`);
    }
  };

  const handleLogout = async (checkKnoxSSOVal) => {
    try {
      let logoutResp = await fetchApi({
        url: "logout",
        baseURL: "",
        headers: {
          "cache-control": "no-cache"
        }
      });
      if (checkKnoxSSOVal !== undefined || checkKnoxSSOVal !== null) {
        if (checkKnoxSSOVal == false) {
          window.location.replace("locallogin");
          window.localStorage.clear();
          setUserProfile(null);
        } else {
          navigate("/knoxSSOWarning");
        }
      } else {
        window.location.replace("login.jsp");
      }
    } catch (error) {
      toast.error(`Error occurred while logout! ${error}`);
    }
  };
  const closeResourceCollapse = () => {
    dispatch({
      type: "SIDEBAR_COLLAPSE",
      resources: !resources,
      account: account,
      audits: audits,
      settings: settings,
      tag: tag
    });
  };
  const closeTagCollapse = () => {
    dispatch({
      type: "SIDEBAR_COLLAPSE",
      tag: !tag,
      resources: resources,
      account: account,
      audits: audits,
      settings: settings
    });
  };
  const handleServiceDefChange = (
    value,
    allSelectedServicesDefs,
    allSelectedServices
  ) => {
    if (value.length !== 0) {
      let selectedServiceDefs = [];
      let selectedService = [];
      let filterSelectedService = [];
      value.map((serviceDef) => {
        if (allSelectedServicesDefs == undefined) {
          allserviceDefData.filter((servicedefs) => {
            if (servicedefs.name === serviceDef.value) {
              selectedServiceDefs.push(servicedefs);
            }
          });
        } else {
          allSelectedServicesDefs.filter((servicedefs) => {
            if (servicedefs.name === serviceDef.value) {
              selectedServiceDefs.push(servicedefs);
            }
          });
        }
      });

      value.map((serviceDef) => {
        if (allSelectedServices == undefined) {
          allServiceData.filter((services) => {
            if (services.type === serviceDef.value) {
              selectedService.push(services);
            }
          });
        } else {
          allSelectedServices.filter((services) => {
            if (services.type === serviceDef.value) {
              selectedService.push(services);
            }
          });
        }
      });
      if (isKMSRole) {
        filterSelectedService = filter(
          selectedService,
          (service) => service.type == "kms"
        );
      } else {
        filterSelectedService = filter(
          selectedService,
          (service) => service.type !== "tag" && service.type !== "kms"
        );
      }
      dispatch({
        type: "SERVICEDEF_DATA",
        allserviceDefData: filter(
          allserviceDefData,
          (serviceDef) => serviceDef.name !== "tag"
        ),
        serviceDefData: sortBy(
          filter(
            selectedServiceDefs,
            (serviceDef) => serviceDef.name !== "tag"
          ),
          "id"
        ),
        tagServiceDefData: tagServiceDefData
      });
      if (selectedZone == "") {
        dispatch({
          type: "SERVICES_DATA",
          allServiceData: allServiceData,
          serviceData: filterSelectedService,
          tagServiceData: tagServiceData
        });
      }
    }
    if (value.length == 0) {
      let filterSelectedService = [];
      if (isKMSRole) {
        filterSelectedService = filter(
          allServiceData,
          (service) => service.type == "kms"
        );
      } else {
        filterSelectedService = filter(
          allServiceData,
          (service) => service.type !== "tag" && service.type !== "kms"
        );
      }
      if (selectedZone == "") {
        dispatch({
          type: "SERVICEDEF_DATA",
          allserviceDefData: allserviceDefData,
          serviceDefData: sortBy(
            filter(
              allserviceDefData,
              (serviceDef) => serviceDef.name !== "tag"
            ),
            "id"
          ),
          tagServiceDefData: tagServiceDefData
        });
        dispatch({
          type: "SERVICES_DATA",
          allServiceData: allServiceData,
          serviceData: filterSelectedService,
          tagServiceData: tagServiceData
        });
      } else {
        getSelectedZone(selectedZone, allServiceData, allserviceDefData);
      }
    }
    dispatch({
      type: "SELECTED_SERVCIEDEF_DATA",
      selectedServiceDef: value
    });
  };

  return (
    <React.Fragment>
      <nav id="sidebar">
        <div className="sidebar-header">
          <NavLink
            to="/policymanager/resource"
            onClick={() =>
              dispatch({
                type: "SIDEBAR_COLLAPSE",
                settings: false,
                audits: false,
                account: false,
                resources: false
              })
            }
          >
            <img className="logo" src={rangerIcon} alt="Ranger logo" />
          </NavLink>
        </div>

        <ul className="list-unstyled components">
          {hasAccessToTab("Resource Based Policies") && (
            <li>
              <Button
                aria-expanded={resources}
                aria-controls="resourcesCollapse"
                onClick={() => {
                  dispatch({
                    type: "SIDEBAR_COLLAPSE",
                    resources: !resources
                  });

                  if (!resources) {
                    fetchZones();
                    if (selectedZone == "" && selectedServiceDef.length == 0) {
                      fetchServicesData();
                    } else if (
                      selectedZone !== "" &&
                      selectedServiceDef.length == 0
                    ) {
                      fetchServicesData();
                    } else if (
                      selectedZone == "" &&
                      selectedServiceDef.length > 0
                    ) {
                      fetchServicesData();
                    }
                  }
                }}
              >
                <img src={keyIcon} />
                <span>Resource Policies</span>
              </Button>
            </li>
          )}

          {hasAccessToTab("Tag Based Policies") && (
            <li>
              <Button
                aria-expanded={tag}
                aria-controls="tagCollapse"
                onClick={() => {
                  dispatch({
                    type: "SIDEBAR_COLLAPSE",
                    tag: !tag
                  });

                  if (!tag) {
                    fetchZones();
                    if (selectedZone == "" && selectedServiceDef.length == 0) {
                      fetchServicesData();
                    } else if (
                      selectedZone !== "" &&
                      selectedServiceDef.length == 0
                    ) {
                      fetchServicesData();
                    } else if (
                      selectedZone == "" &&
                      selectedServiceDef.length > 0
                    ) {
                      fetchServicesData();
                    }
                  }
                }}
              >
                <img src={tagsIcon} />
                <span>Tag Policies</span>
              </Button>
            </li>
          )}

          {hasAccessToTab("Reports") && (
            <li>
              <NavLink
                to="/reports/userAccess?policyType=0"
                onClick={() => {
                  dispatch({
                    type: "SIDEBAR_COLLAPSE",
                    settings: false,
                    audits: false,
                    account: false,
                    resources: false
                  });
                }}
              >
                <img src={reportsIcon} />
                <span>Reports</span>
              </NavLink>
            </li>
          )}

          {hasAccessToTab("Audit") && (
            <li>
              <Button
                aria-expanded={audits}
                aria-controls="auditCollapse"
                onClick={() =>
                  dispatch({
                    type: "SIDEBAR_COLLAPSE",
                    audits: !audits
                  })
                }
              >
                <img src={auditsIcon} />
                <span>Audits</span>
              </Button>
            </li>
          )}
          {hasAccessToTab("Security Zone") && (
            <React.Fragment>
              {!isKeyAdmin() && (
                <li>
                  <NavLink
                    to="/zones/zone/list"
                    onClick={() =>
                      dispatch({
                        type: "SIDEBAR_COLLAPSE",
                        settings: false,
                        audits: false,
                        account: false,
                        resources: false
                      })
                    }
                  >
                    <img src={zoneIcon} />
                    <span>Security Zone</span>
                  </NavLink>
                </li>
              )}
            </React.Fragment>
          )}
          {hasAccessToTab("Key Manager") && (
            <React.Fragment>
              {(isKeyAdmin() || isKMSAuditor()) && (
                <li>
                  <NavLink
                    to="/kms/keys/new/manage/service"
                    onClick={() =>
                      dispatch({
                        type: "SIDEBAR_COLLAPSE",
                        settings: false,
                        audits: false,
                        account: false,
                        resources: false
                      })
                    }
                  >
                    <i className="fa fa-fw fa-key"></i>
                    <span>Key Manager</span>
                  </NavLink>
                </li>
              )}
            </React.Fragment>
          )}

          {(hasAccessToTab("Users/Groups") ||
            isAuditor() ||
            isSystemAdmin()) && (
            <li>
              <Button
                aria-expanded={settings}
                aria-controls="settingsCollapse"
                onClick={() =>
                  dispatch({
                    type: "SIDEBAR_COLLAPSE",
                    settings: !settings
                  })
                }
              >
                <img src={settingsIcon} />
                <span>Settings</span>
              </Button>
            </li>
          )}

          <li>
            <Button
              aria-expanded={account}
              aria-controls="accountCollapse"
              onClick={() =>
                dispatch({
                  type: "SIDEBAR_COLLAPSE",
                  account: !account
                })
              }
            >
              <img src={accountIcon} />
              <span>{loginId}</span>
            </Button>
          </li>
        </ul>
      </nav>
      <div className="drawer" id="drawer-content">
        <Collapse in={resources}>
          <div id="resourcesCollapse">
            <div className="nav-drawer overflow-y-auto">
              <span className="drawer-menu-title"> RESOURCE POLICIES</span>

              {!isKMSRole && (
                <div
                  title={`${isEmpty(zoneData) ? "Create zone first" : ""} `}
                  className={isEmpty(zoneData) ? "not-allowed" : ""}
                >
                  <Select
                    className={`${
                      isEmpty(zoneData) ? "not-allowed" : ""
                    } select-nav-drawer`}
                    value={
                      isEmpty(selectedZone)
                        ? ""
                        : {
                            label: selectedZone && selectedZone.label,
                            value: selectedZone && selectedZone.value
                          }
                    }
                    isDisabled={isEmpty(zoneData) ? true : false}
                    onChange={(e) =>
                      getSelectedZone(
                        e,
                        allServiceData,
                        allserviceDefData,
                        "serviceChange"
                      )
                    }
                    isClearable
                    components={{
                      IndicatorSeparator: () => null
                    }}
                    theme={zoneSelectTheme}
                    styles={zoneSelectCustomStyles}
                    options={zoneData.map((zone) => {
                      return {
                        value: zone.id,
                        label: zone.name
                      };
                    })}
                    menuPlacement="auto"
                    placeholder="Select Zone Name"
                  />
                </div>
              )}
              <Select
                isClearable={false}
                className={`select-nav-drawer ${loader ? "not-allowed" : ""}`}
                theme={serviceSelectThemes}
                value={selectedServiceDef}
                isDisabled={loader ? true : false}
                styles={serviceSelectCustomStyle}
                onChange={(e) => handleServiceDefChange(e)}
                isMulti
                options={sortBy(
                  map(serviceTypesOptions, function (serviceDef) {
                    return {
                      value: serviceDef.name ?? serviceDef.value,
                      label: upperCase(serviceDef.name ?? serviceDef.value)
                    };
                  }),
                  "name"
                )}
                placeholder="Select Service Types"
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null
                }}
                menuPlacement="auto"
              />
              {resources != false && resources != undefined && (
                <ResourceTagContent
                  serviceDefData={sortBy(
                    serviceDefData?.filter(Boolean)?.filter((serviceDef) => {
                      return serviceDef.name !== "tag";
                    }),
                    "name"
                  )}
                  serviceData={sortBy(
                    serviceData?.filter(Boolean)?.filter((serviceDef) => {
                      return serviceDef.name !== "tag";
                    }),
                    "name"
                  )}
                  closeResourceCollapse={closeResourceCollapse}
                  closeTagCollapse={closeTagCollapse}
                  tagView={tag}
                  loader={loader}
                  selectedZone={selectedZone}
                />
              )}
            </div>
          </div>
        </Collapse>

        <Collapse in={tag}>
          <div id="resourcesCollapse">
            <div className="nav-drawer overflow-y-auto">
              <span className="drawer-menu-title"> TAG POLICIES</span>
              <div
                title={`${isEmpty(zoneData) ? "Create zone first" : ""} `}
                className={isEmpty(zoneData) ? "not-allowed" : ""}
              >
                <Select
                  className={`${
                    isEmpty(zoneData) ? "not-allowed" : ""
                  } select-nav-drawer`}
                  value={
                    isEmpty(selectedZone)
                      ? ""
                      : {
                          label: selectedZone && selectedZone.label,
                          value: selectedZone && selectedZone.value
                        }
                  }
                  isDisabled={isEmpty(zoneData) ? true : false}
                  onChange={(e) =>
                    getSelectedZone(e, allServiceData, allserviceDefData)
                  }
                  isClearable
                  components={{
                    IndicatorSeparator: () => null
                  }}
                  theme={zoneSelectTheme}
                  styles={zoneSelectCustomStyles}
                  options={zoneData.map((zone) => {
                    return {
                      value: zone.id,
                      label: zone.name
                    };
                  })}
                  menuPlacement="auto"
                  placeholder="Select Zone Name"
                />
              </div>
              {tag != false && tag != undefined && (
                <ResourceTagContent
                  serviceDefData={tagServiceDefData
                    ?.filter(Boolean)
                    .filter((serviceDef) => {
                      return serviceDef.name == "tag";
                    })}
                  serviceData={sortBy(
                    tagServiceData.filter(Boolean)?.filter((serviceDef) => {
                      return serviceDef.type == "tag";
                    }),
                    "name"
                  )}
                  closeTagCollapse={closeTagCollapse}
                  closeResourceCollapse={closeResourceCollapse}
                  tagView={tag}
                  loader={loader}
                  selectedZone={selectedZone}
                />
              )}
            </div>
          </div>
        </Collapse>

        <Collapse in={settings}>
          <div id="settingsCollapse">
            <div className="nav-drawer">
              <span className="drawer-menu-title">SETTINGS</span>
              <ul className="list-group list-group-flush">
                {hasAccessToTab("Users/Groups") && (
                  <React.Fragment>
                    <li className="list-group-item">
                      <NavLink
                        to="/users/usertab"
                        onClick={() =>
                          dispatch({
                            type: "SIDEBAR_COLLAPSE",
                            settings: !settings,
                            account: account,
                            audits: audits,
                            resources: resources
                          })
                        }
                        className="list-group-item"
                      >
                        User
                      </NavLink>
                    </li>

                    <li className="list-group-item">
                      <NavLink
                        to="/users/grouptab"
                        onClick={() =>
                          dispatch({
                            type: "SIDEBAR_COLLAPSE",
                            settings: !settings,
                            account: account,
                            audits: audits,
                            resources: resources
                          })
                        }
                        className="list-group-item"
                      >
                        Group
                      </NavLink>
                    </li>

                    <li className="list-group-item">
                      <NavLink
                        to="/users/roletab"
                        onClick={() =>
                          dispatch({
                            type: "SIDEBAR_COLLAPSE",
                            settings: !settings,
                            account: account,
                            audits: audits,
                            resources: resources
                          })
                        }
                        className="list-group-item"
                      >
                        Role
                      </NavLink>
                    </li>
                  </React.Fragment>
                )}
                {(isAuditor() || isSystemAdmin()) && (
                  <li className="list-group-item">
                    <NavLink
                      to="/permissions/models"
                      onClick={() =>
                        dispatch({
                          type: "SIDEBAR_COLLAPSE",
                          settings: !settings,
                          account: account,
                          audits: audits,
                          resources: resources
                        })
                      }
                      className="list-group-item"
                    >
                      Permission
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Collapse>
        <Collapse in={audits}>
          <div id="auditCollapse">
            <div className="nav-drawer">
              <span className="drawer-menu-title"> AUDITS</span>
              <ul className="list-group list-group-flush">
                {hasAccessToTab("Audit") && (
                  <React.Fragment>
                    <li className="list-group-item">
                      <NavLink
                        to="/reports/audit/bigData"
                        onClick={() =>
                          dispatch({
                            type: "SIDEBAR_COLLAPSE",
                            audits: !audits,
                            settings: settings,
                            account: account,
                            resources: resources
                          })
                        }
                        className="list-group-item"
                      >
                        Access
                      </NavLink>
                    </li>
                    <li className="list-group-item">
                      <NavLink
                        to="/reports/audit/admin"
                        onClick={() =>
                          dispatch({
                            type: "SIDEBAR_COLLAPSE",
                            audits: !audits,
                            settings: settings,
                            account: account,
                            resources: resources
                          })
                        }
                        className="list-group-item"
                      >
                        Admin
                      </NavLink>
                    </li>
                    <li className="list-group-item">
                      <NavLink
                        to="/reports/audit/loginSession"
                        onClick={() =>
                          dispatch({
                            type: "SIDEBAR_COLLAPSE",
                            audits: !audits,
                            settings: settings,
                            account: account,
                            resources: resources
                          })
                        }
                        className="list-group-item"
                      >
                        Login Sessions
                      </NavLink>
                    </li>
                    <li className="list-group-item">
                      <NavLink
                        to="/reports/audit/agent"
                        onClick={() =>
                          dispatch({
                            type: "SIDEBAR_COLLAPSE",
                            audits: !audits,
                            settings: settings,
                            account: account,
                            resources: resources
                          })
                        }
                        className="list-group-item"
                      >
                        Plugins
                      </NavLink>
                    </li>
                    <li className="list-group-item">
                      <NavLink
                        to="/reports/audit/pluginStatus"
                        onClick={() =>
                          dispatch({
                            type: "SIDEBAR_COLLAPSE",
                            audits: !audits,
                            settings: settings,
                            account: account,
                            resources: resources
                          })
                        }
                        className="list-group-item"
                      >
                        Plugin Status
                      </NavLink>
                    </li>
                    <li className="list-group-item">
                      <NavLink
                        to="/reports/audit/userSync"
                        onClick={() =>
                          dispatch({
                            type: "SIDEBAR_COLLAPSE",
                            audits: !audits,
                            settings: settings,
                            account: account,
                            resources: resources
                          })
                        }
                        className="list-group-item"
                      >
                        User Sync
                      </NavLink>
                    </li>
                  </React.Fragment>
                )}
              </ul>
            </div>
          </div>
        </Collapse>
        <Collapse in={account}>
          <div id="accountCollapse">
            <div className="nav-drawer height-auto justify-content-end fixed-bottom">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <NavLink
                    to="/userprofile"
                    onClick={() =>
                      dispatch({
                        type: "SIDEBAR_COLLAPSE",
                        account: !account,
                        audits: audits,
                        settings: settings,
                        resources: resources
                      })
                    }
                    className="list-group-item"
                  >
                    Profile
                  </NavLink>
                </li>
                <li className="list-group-item">
                  <a
                    href={apiUrl}
                    target="_blank"
                    onClick={() =>
                      dispatch({
                        type: "SIDEBAR_COLLAPSE",
                        account: !account,
                        audits: audits,
                        settings: settings,
                        resources: resources
                      })
                    }
                  >
                    API Documentation
                  </a>
                </li>
                <li className="list-group-item">
                  <NavLink onClick={checkKnoxSSO} to="#">
                    Log Out
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </Collapse>
      </div>
    </React.Fragment>
  );
};

export default SideBar;
