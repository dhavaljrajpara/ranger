import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  Accordion,
  Button,
  ButtonGroup,
  Dropdown,
  Card,
  Col,
  InputGroup,
  Row
} from "react-bootstrap";
import { Form, Field } from "react-final-form";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";
import { filter, find, isEmpty, join, map, sortBy, split } from "lodash";
import { toast } from "react-toastify";
import dateFormat from "dateformat";
import { fetchApi } from "Utils/fetchAPI";
import { useQuery } from "../../components/CommonComponents";
import SearchPolicyTable from "./SearchPolicyTable";

function UserAccessLayout(props) {
  const [show, setShow] = useState(true);
  const [serviceDefs, setServiceDefs] = useState([]);
  const [filterServiceDefs, setFilterServiceDefs] = useState([]);
  const [serviceDefOpts, setServiceDefOpts] = useState([]);
  const [zoneNameOpts, setZoneNameOpts] = useState([]);
  const [searchParamsObj, setSearchParamsObj] = useState({});
  const [userNameOpts, setUserNameOpts] = useState([]);
  const [groupNameOpts, setGroupNameOpts] = useState([]);
  const [roleNameOpts, setRoleNameOpts] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const searchParams = useQuery();

  const showMoreLess = () => {
    setShow(!show);
  };

  useEffect(() => {
    fetchServiceDefs(), fetchZones(), getSearchParams();
  }, []);

  const fetchServiceDefs = async () => {
    let serviceDefsResp;

    try {
      serviceDefsResp = await fetchApi({
        url: `plugins/definitions`
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Service Definitions ! ${error}`
      );
    }

    let resourceServiceDefs = filter(
      serviceDefsResp.data.serviceDefs,
      (serviceDef) => serviceDef.name !== "tag"
    );

    let filterResourceServiceDefs = resourceServiceDefs;
    if (searchParams.get("serviceType")) {
      let serviceTypes = split(searchParams.get("serviceType"), ",");
      filterResourceServiceDefs = map(serviceTypes, function (obj) {
        return find(resourceServiceDefs, { name: obj });
      });
    }

    setServiceDefs(resourceServiceDefs);
    setFilterServiceDefs(filterResourceServiceDefs);

    let serviceDefsList = map(
      serviceDefsResp.data.serviceDefs,
      function (serviceDef) {
        return { value: serviceDef.name, label: serviceDef.name };
      }
    );

    setServiceDefOpts(serviceDefsList);
  };

  const fetchZones = async () => {
    let zonesResp;
    try {
      zonesResp = await fetchApi({
        url: "zones/zones"
      });
    } catch (error) {
      console.error(`Error occurred while fetching Zones! ${error}`);
    }

    let zonesList = map(
      sortBy(zonesResp.data.securityZones, ["name"]),
      function (zone) {
        return { value: zone.name, label: zone.name };
      }
    );

    setZoneNameOpts(zonesList);
  };

  const fetchPolicyLabels = async (inputValue) => {
    let params = {};

    if (inputValue) {
      params["policyLabel"] = inputValue || "";
    }

    let policyLabelsResp = await fetchApi({
      url: "plugins/policyLabels",
      params: params
    });

    let policyLabelsList = map(policyLabelsResp.data, function (policyLabel) {
      return { value: policyLabel, label: policyLabel };
    });

    return policyLabelsList;
  };

  const fetchUsers = async (inputValue) => {
    let params = {};

    if (inputValue) {
      params["name"] = inputValue || "";
    }

    const usersResp = await fetchApi({
      url: "xusers/users",
      params: params
    });

    return usersResp.data.vXUsers.map(({ name }) => ({
      label: name,
      value: name
    }));
  };

  const fetchGroups = async (inputValue) => {
    let params = {};

    if (inputValue) {
      params["name"] = inputValue || "";
    }

    const groupsResp = await fetchApi({
      url: "xusers/groups",
      params: params
    });
    return groupsResp.data.vXGroups.map(({ name }) => ({
      label: name,
      value: name
    }));
  };

  const fetchRoles = async (inputValue) => {
    let params = {};

    if (inputValue) {
      params["name"] = inputValue || "";
    }

    const rolesResp = await fetchApi({
      url: "roles/roles",
      params: params
    });

    return rolesResp.data.roles.map(({ name }) => ({
      label: name,
      value: name
    }));
  };

  const onSubmit = async (values) => {
    let urlSearchParams = "";
    const searchFields = {};

    if (values.policyType !== undefined) {
      urlSearchParams = `policyType=${values.policyType.value}`;
      searchFields.policyType = values.policyType.value;
    }

    if (values.policyNamePartial !== undefined) {
      urlSearchParams = `${urlSearchParams}&policyNamePartial=${values.policyNamePartial}`;
      searchFields.policyNamePartial = values.policyNamePartial;
    }

    let serviceDefsList = serviceDefs;
    if (values.serviceType !== undefined && !isEmpty(values.serviceType)) {
      let serviceType = join(map(values.serviceType, "value"));

      serviceDefsList = map(map(values.serviceType, "value"), function (obj) {
        return find(serviceDefs, { name: obj });
      });

      urlSearchParams = `${urlSearchParams}&serviceType=${serviceType}`;
      searchFields.serviceType = serviceType;
    }

    if (values.polResource !== undefined) {
      urlSearchParams = `${urlSearchParams}&polResource=${values.polResource}`;
      searchFields.polResource = values.polResource;
    }

    if (
      values.policyLabelsPartial !== undefined &&
      values.policyLabelsPartial
    ) {
      urlSearchParams = `${urlSearchParams}&policyLabelsPartial=${values.policyLabelsPartial.value}`;
      searchFields.policyLabelsPartial = values.policyLabelsPartial.value;
    }

    if (values.zoneName !== undefined && values.zoneName) {
      urlSearchParams = `${urlSearchParams}&zoneName=${values.zoneName.value}`;
      searchFields.zoneName = values.zoneName.value;
    }

    history.replace({
      pathname: "/reports/userAccess",
      search: `?${urlSearchParams}`
    });

    setFilterServiceDefs(serviceDefsList);
    setSearchParamsObj(searchFields);
  };

  const getInitialSearchParams = () => {
    const initialSearchFields = {};

    if (searchParams.get("policyNamePartial")) {
      initialSearchFields.policyNamePartial =
        searchParams.get("policyNamePartial");
    }

    if (searchParams.get("policyType")) {
      let policyTypeLabel;

      if (searchParams.get("policyType") == 1) {
        policyTypeLabel = "Masking";
      } else if (searchParams.get("policyType") == 2) {
        policyTypeLabel = "Row Level Filter";
      } else {
        policyTypeLabel = "Access";
      }

      initialSearchFields.policyType = {
        value: searchParams.get("policyType"),
        label: policyTypeLabel
      };
    }

    if (searchParams.get("serviceType")) {
      let serviceTypes = split(searchParams.get("serviceType"), ",");
      initialSearchFields.serviceType = map(
        serviceTypes,
        function (serviceType) {
          return { value: serviceType, label: serviceType };
        }
      );
    }

    if (searchParams.get("polResource")) {
      initialSearchFields.polResource = searchParams.get("polResource");
    }

    if (searchParams.get("policyLabelsPartial")) {
      initialSearchFields.policyLabelsPartial = {
        value: searchParams.get("policyLabelsPartial"),
        label: searchParams.get("policyLabelsPartial")
      };
    }

    if (searchParams.get("zoneName")) {
      initialSearchFields.zoneName = {
        value: searchParams.get("zoneName"),
        label: searchParams.get("zoneName")
      };
    }

    return initialSearchFields;
  };

  const getSearchParams = () => {
    const searchFields = {};

    if (searchParams.get("policyNamePartial")) {
      searchFields.policyNamePartial = searchParams.get("policyNamePartial");
    }

    if (searchParams.get("policyType")) {
      searchFields.policyType = searchParams.get("policyType");
    }

    if (searchParams.get("serviceType")) {
      searchFields.serviceType = searchParams.get("serviceType");
    }

    if (searchParams.get("polResource")) {
      searchFields.polResource = searchParams.get("polResource");
    }

    if (searchParams.get("policyLabelsPartial")) {
      searchFields.policyLabelsPartial = searchParams.get(
        "policyLabelsPartial"
      );
    }

    if (searchParams.get("zoneName")) {
      searchFields.zoneName = searchParams.get("zoneName");
    }

    setSearchParamsObj(searchFields);
  };

  const exportPolicy = async (exportType) => {
    let exportResp;
    let exportApiUrl = "/plugins/policies/exportJson";

    if (exportType === "downloadExcel") {
      exportApiUrl = "/plugins/policies/downloadExcel";
    } else if (exportType === "csv") {
      exportApiUrl = "/plugins/policies/csv";
    }

    try {
      exportResp = await fetchApi({
        url: exportApiUrl,
        params: searchParamsObj
      });

      if (exportResp.status === 200) {
        downloadFile({
          apiUrl: exportApiUrl
        });
      } else {
        toast.warning("No policies found to export");
      }
    } catch (error) {
      console.error(`Error occurred while exporting policies ${error}`);
    }
  };

  const downloadFile = ({ apiUrl }) => {
    let downloadUrl =
      window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port ? ":" + window.location.port : "") +
      "/service" +
      apiUrl +
      location.search;

    const link = document.createElement("a");
    link.href = downloadUrl;

    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true
    });

    document.body.appendChild(link);
    link.dispatchEvent(clickEvt);
    link.remove();
  };

  return (
    <React.Fragment>
      <div className="clearfix">
        <h4 className="wrap-header bold">Reports</h4>
      </div>
      <div className="wrap">
        <Row>
          <Col sm={12}>
            <Accordion defaultActiveKey="0">
              <Card>
                <Accordion.Toggle
                  className="border-top-0 border-right-0 border-right-0"
                  as={Card.Header}
                  eventKey="0"
                  onClick={showMoreLess}
                >
                  <div className="clearfix">
                    <span className="bold float-left">Search Criteria</span>
                    <span className="float-right">
                      {show ? (
                        <i className="fa fa-angle-up fa-lg font-weight-bold"></i>
                      ) : (
                        <i className="fa fa-angle-down fa-lg font-weight-bold"></i>
                      )}
                    </span>
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <Form
                      onSubmit={onSubmit}
                      initialValues={getInitialSearchParams}
                      render={({ handleSubmit, submitting }) => (
                        <form onSubmit={handleSubmit}>
                          <Row className="form-group">
                            <Col sm={2} className="text-right">
                              <label className="col-form-label ">
                                Policy Name
                              </label>
                            </Col>
                            <Col sm={4}>
                              <Field name="policyNamePartial">
                                {({ input, meta }) => (
                                  <input
                                    {...input}
                                    type="text"
                                    placeholder="Enter Policy Name"
                                    className="form-control"
                                  />
                                )}
                              </Field>
                            </Col>
                            <Col sm={2} className="text-right">
                              <label className="col-form-label ">
                                Policy Type
                              </label>
                            </Col>
                            <Col sm={4}>
                              <Field name="policyType">
                                {({ input, meta }) => (
                                  <Select
                                    {...input}
                                    isClearable={false}
                                    options={[
                                      { value: "0", label: "Access" },
                                      { value: "1", label: "Masking" },
                                      {
                                        value: "2",
                                        label: "Row Level Filter"
                                      }
                                    ]}
                                    menuPlacement="auto"
                                    placeholder="Select Policy Type"
                                  />
                                )}
                              </Field>
                            </Col>
                          </Row>
                          <Row className="form-group">
                            <Col sm={2} className="text-right">
                              <label className="col-form-label ">
                                Component
                              </label>
                            </Col>
                            <Col sm={4}>
                              <Field name="serviceType">
                                {({ input, meta }) => (
                                  <Select
                                    {...input}
                                    isMulti
                                    isClearable={false}
                                    options={serviceDefOpts}
                                    placeholder=""
                                    menuPlacement="auto"
                                  />
                                )}
                              </Field>
                            </Col>
                            <Col sm={2} className="text-right">
                              <label className="col-form-label ">
                                Resource
                              </label>
                            </Col>
                            <Col sm={4}>
                              <Field name="polResource">
                                {({ input, meta }) => (
                                  <input
                                    {...input}
                                    type="text"
                                    placeholder="Enter Resource Name"
                                    className="form-control"
                                  />
                                )}
                              </Field>
                            </Col>
                          </Row>
                          <Row className="form-group">
                            <Col sm={2} className="text-right">
                              <label className="col-form-label ">
                                Policy Label
                              </label>
                            </Col>
                            <Col sm={4}>
                              <Field name="policyLabelsPartial">
                                {({ input, meta }) => (
                                  <AsyncCreatableSelect
                                    {...input}
                                    defaultOptions
                                    isClearable={true}
                                    loadOptions={fetchPolicyLabels}
                                    placeholder=""
                                  />
                                )}
                              </Field>
                            </Col>
                            <Col sm={2} className="text-right">
                              <label className="col-form-label ">
                                Zone Name
                              </label>
                            </Col>
                            <Col sm={4}>
                              <Field name="zoneName">
                                {({ input, meta }) => (
                                  <Select
                                    {...input}
                                    isClearable={true}
                                    options={zoneNameOpts}
                                    menuPlacement="auto"
                                    placeholder="Select Zone Name"
                                  />
                                )}
                              </Field>
                            </Col>
                          </Row>
                          {/*<Row>
                            <Col sm={2} className="text-right">
                              <label className="col-form-label ">
                                Search By
                              </label>
                            </Col>
                            <Col sm={4}>
                              <InputGroup className="mb-3">
                                <Field name="searchBy">
                                  {({ input, meta }) => (
                                    <Select
                                      {...input}
                                      isClearable={false}
                                      options={[
                                        {
                                          value: "searchByGroup",
                                          label: "Group Name"
                                        },
                                        {
                                          value: "searchByUser",
                                          label: "User Name"
                                        },
                                        {
                                          value: "searchByRole",
                                          label: "Role Name"
                                        }
                                      ]}
                                      menuPlacement="auto"
                                      placeholder="Select Search By"
                                    />
                                  )}
                                </Field>
                                <Field name="testSearchBy">
                                  {({ input, meta }) => (
                                    <AsyncSelect
                                      {...input}
                                      cacheOptions
                                      defaultOptions
                                      isClearable={true}
                                      loadOptions={fetchUsers}
                                      components={{
                                        DropdownIndicator: () => null,
                                        IndicatorSeparator: () => null
                                      }}
                                      placeholder="Select User"
                                    />
                                  )}
                                </Field>
                              </InputGroup>
                            </Col>
                                    </Row>*/}
                          <Row>
                            <Col sm={{ span: 10, offset: 2 }}>
                              <Button
                                variant="primary"
                                type="submit"
                                size="sm"
                                disabled={submitting}
                              >
                                <i className="fa-fw fa fa-search"></i>
                                Search
                              </Button>
                            </Col>
                          </Row>
                        </form>
                      )}
                    />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
        <Row>
          <Col sm={12} className="mt-3 text-right">
            <Dropdown as={ButtonGroup} key="left" drop="left" size="sm">
              <Dropdown.Toggle>
                <i className="fa-fw fa fa-external-link-square"></i> Export
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => exportPolicy("downloadExcel")}>
                  Excel file
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => exportPolicy("csv")}>
                  CSV file
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => exportPolicy("exportJson")}>
                  JSON file
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        {filterServiceDefs.map((serviceDef) => (
          <SearchPolicyTable
            key={serviceDef.name}
            serviceDef={serviceDef}
            searchParams={searchParamsObj}
            searchParamsUrl={location.search}
          ></SearchPolicyTable>
        ))}
      </div>
    </React.Fragment>
  );
}

export default UserAccessLayout;
