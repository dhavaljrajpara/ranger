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

import React, { useState, useReducer, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";
import PolicyListing from "./PolicyListing";
import { fetchApi } from "Utils/fetchAPI";
import { isRenderMasking, isRenderRowFilter } from "Utils/XAUtils";
import { Loader } from "Components/CommonComponents";
import TopNavBar from "../SideBar/TopNavBar";
import { findIndex, map, sortBy, isEmpty } from "lodash";
import { RangerPolicyType } from "../../utils/XAEnums";

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADER":
      return {
        ...state,
        loader: action.loader
      };
    case "SERVICES_DATA":
      return {
        ...state,
        serviceDefData: action.serviceDefData,
        serviceData: action.serviceData,
        allServiceData: action.allServiceData
      };

    default:
      throw new Error();
  }
}

export const PolicyListingTabView = () => {
  let location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [policyState, dispatch] = useReducer(reducer, {
    loader: true,
    serviceData: {},
    serviceDefData: {},
    allServiceData: []
  });

  const { loader, serviceDefData, serviceData, allServiceData } = policyState;
  const [zoneServicesData, setZoneServicesData] = useState([]);
  let localStorageZoneDetails = localStorage.getItem("zoneDetails");

  useEffect(() => {
    fetchServiceDetails();
  }, [params?.serviceId, JSON.parse(localStorageZoneDetails)?.value]);

  const fetchServiceDetails = async () => {
    dispatch({
      type: "SET_LOADER",
      loader: true
    });
    let getServiceData = {};
    let getAllServiceData = [];
    let getServiceDefData = {};
    let getService = {};
    try {
      getServiceData = await fetchApi({
        url: `plugins/services/${params.serviceId}`
      });

      getAllServiceData = await fetchApi({
        url: `plugins/services`
      });
      getService = getAllServiceData.data.services?.find((service) => {
        return service.id == params.serviceId;
      });
      getServiceDefData = await fetchApi({
        url: `plugins/definitions/name/${getService.type}`
      });

      dispatch({
        type: "SERVICES_DATA",
        allServiceData: getAllServiceData.data.services,
        serviceData: getServiceData.data,
        serviceDefData: getServiceDefData.data
      });
      zoneServices(getAllServiceData.data.services);
      dispatch({
        type: "SET_LOADER",
        loader: false
      });
    } catch (error) {
      console.error(`Error occurred while fetching service details ! ${error}`);
    }
  };
  const zoneServices = async (servciesData) => {
    if (localStorageZoneDetails !== null) {
      try {
        let serviceIndex;
        let zonesResp = [];
        zonesResp = await fetchApi({
          url: `public/v2/api/zones/${
            JSON.parse(localStorageZoneDetails)?.value
          }/service-headers`
        });
        let zoneServiceNames = map(zonesResp.data, "name");
        let zoneServices = zoneServiceNames?.map((zoneService) => {
          return servciesData?.filter((service) => {
            return service.name === zoneService;
          });
        });
        zoneServices = zoneServices.flat();
        setZoneServicesData(zoneServices);

        serviceIndex = findIndex(zoneServices, [
          "id",
          Number(params.serviceId)
        ]);
        if (!isEmpty(zoneServices) && serviceIndex == -1) {
          navigate(
            `/service/${zoneServices[0]?.id}/policies/${RangerPolicyType.RANGER_ACCESS_POLICY_TYPE.value}`,
            {
              replace: true
            }
          );
        }
      } catch (error) {
        console.error(`Error occurred while fetching Zone Services ! ${error}`);
      }
    }
  };
  const getServices = (services) => {
    let filterServices = [];

    filterServices = services?.filter((service) => {
      if (service?.type == serviceDefData?.name) {
        return service;
      }
    });

    return sortBy(
      filterServices?.map(({ displayName }) => ({
        label: displayName,
        value: displayName
      })),
      "label"
    );
  };
  const handleServiceChange = async (e) => {
    if (e !== "") {
      let selectedServiceData = allServiceData?.find((service) => {
        if (service.displayName == e?.label) {
          return service;
        }
      });
      navigate(
        `/service/${selectedServiceData?.id}/policies/${RangerPolicyType.RANGER_ACCESS_POLICY_TYPE.value}`,
        {
          replace: true
        }
      );
    }
  };
  const tabChange = (tabName) => {
    navigate(`/service/${params?.serviceId}/policies/${tabName}`, {
      replace: true
    });
  };

  return (
    <React.Fragment>
      <TopNavBar
        serviceDefData={serviceDefData}
        serviceData={serviceData}
        handleServiceChange={handleServiceChange}
        getServices={getServices}
        allServiceData={sortBy(allServiceData, "name")}
        policyLoader={loader}
        zoneServicesData={zoneServicesData}
        key={zoneServicesData}
      />
      {loader ? (
        <Loader />
      ) : isRenderMasking(serviceDefData.dataMaskDef) ||
        isRenderRowFilter(serviceDefData.rowFilterDef) ? (
        <Tabs
          id="PolicyListing"
          activeKey={params.policyType}
          onSelect={(k) => tabChange(k)}
        >
          <Tab eventKey="0" title="Access">
            {params.policyType == "0" && (
              <PolicyListing
                serviceDef={serviceDefData}
                serviceData={serviceData}
              />
            )}
          </Tab>
          {isRenderMasking(serviceDefData?.dataMaskDef) && (
            <Tab eventKey="1" title="Masking">
              {params.policyType == "1" && (
                <PolicyListing
                  serviceDef={serviceDefData}
                  serviceData={serviceData}
                />
              )}
            </Tab>
          )}
          {isRenderRowFilter(serviceDefData.rowFilterDef) && (
            <Tab eventKey="2" title="Row Level Filter">
              {params.policyType == "2" && (
                <PolicyListing
                  serviceDef={serviceDefData}
                  serviceData={serviceData}
                />
              )}
            </Tab>
          )}
        </Tabs>
      ) : (
        <PolicyListing serviceDef={serviceDefData} serviceData={serviceData} />
      )}
    </React.Fragment>
  );
};

export default PolicyListingTabView;
