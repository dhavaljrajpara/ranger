import React, { useState, useCallback, useEffect, useRef } from "react";
import { Badge, Button, Row, Col, Table, Modal } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import dateFormat from "dateformat";
import { fetchApi } from "Utils/fetchAPI";
import {
  AuditFilterEntries,
  CustomPopoverOnClick,
  CustomPopoverTagOnClick
} from "Components/CommonComponents";
import moment from "moment-timezone";
import AccessLogsTable from "./AccessLogsTable";
import {
  isEmpty,
  isUndefined,
  capitalize,
  pick,
  indexOf,
  map,
  sortBy,
  toString,
  toUpper
} from "lodash";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { AccessMoreLess } from "Components/CommonComponents";
import { PolicyViewDetails } from "./AdminLogs/PolicyViewDetails";
import StructuredFilter from "../../components/structured-filter/react-typeahead/tokenizer";
import { getTableSortBy, getTableSortType } from "../../utils/XAUtils";
import { CustomTooltip } from "../../components/CommonComponents";

function Access() {
  const [accessListingData, setAccessLogs] = useState([]);
  const [serviceDefs, setServiceDefs] = useState([]);
  const [services, setServices] = useState([]);
  const [zones, setZones] = useState([]);
  const [searchFilterParams, setSearchFilter] = useState({});
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const [entries, setEntries] = useState([]);
  const [showrowmodal, setShowRowModal] = useState(false);
  const [policyviewmodal, setPolicyViewModal] = useState(false);
  const [policyParamsData, setPolicyParamsData] = useState(null);
  const [rowdata, setRowData] = useState([]);
  const [checked, setChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    fetchServiceDefs(), fetchServices(), fetchZones();
  }, []);

  const fetchAccessLogsInfo = useCallback(
    async ({ pageSize, pageIndex, sortBy }) => {
      let logsResp = [];
      let logs = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      let params = { ...searchFilterParams };
      if (fetchId === fetchIdRef.current) {
        params["pageSize"] = pageSize;
        params["startIndex"] = pageIndex * pageSize;
        params["excludeServiceUser"] = checked ? true : false;
        if (sortBy.length > 0) {
          params["sortBy"] = getTableSortBy(sortBy);
          params["sortType"] = getTableSortType(sortBy);
        }
        try {
          logsResp = await fetchApi({
            url: "assets/accessAudit",
            params: params
          });
          logs = logsResp.data.vXAccessAudits;
          totalCount = logsResp.data.totalCount;
        } catch (error) {
          console.error(`Error occurred while fetching Access logs! ${error}`);
        }
        setAccessLogs(logs);
        setEntries(logsResp.data);
        setPageCount(Math.ceil(totalCount / pageSize));
        setLoader(false);
      }
    },
    [updateTable, searchFilterParams]
  );

  const fetchServiceDefs = async () => {
    let serviceDefsResp = [];
    try {
      serviceDefsResp = await fetchApi({
        url: "plugins/definitions"
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Service Definitions or CSRF headers! ${error}`
      );
    }

    setServiceDefs(serviceDefsResp.data.serviceDefs);
    setLoader(false);
  };

  const fetchServices = async () => {
    let servicesResp = [];
    try {
      servicesResp = await fetchApi({
        url: "plugins/services"
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Services or CSRF headers! ${error}`
      );
    }

    setServices(servicesResp.data.services);
    setLoader(false);
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

    setZones(sortBy(zonesResp.data.securityZones, ["name"]));
    setLoader(false);
  };

  const toggleChange = () => {
    setAccessLogs([]);
    setChecked(!checked);
    setLoader(true);
    setUpdateTable(moment.now());
  };

  const handleClosePolicyId = () => setPolicyViewModal(false);
  const handleClose = () => setShowRowModal(false);
  const rowModal = (row) => {
    setShowRowModal(true);
    setRowData(row.original);
  };

  const openModal = (policyDetails) => {
    let policyParams = pick(policyDetails, [
      "eventTime",
      "policyId",
      "policyVersion"
    ]);
    setPolicyViewModal(true);
    setPolicyParamsData(policyParams);
    fetchVersions(policyDetails.policyId);
  };

  const fetchVersions = async (policyId) => {
    let versionsResp = {};
    try {
      versionsResp = await fetchApi({
        url: `plugins/policy/${policyId}/versionList`
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Policy Version or CSRF headers! ${error}`
      );
    }
    setCurrentPage(
      versionsResp.data.value
        .split(",")
        .map(Number)
        .sort(function (a, b) {
          return a - b;
        })
    );
    setLoader(false);
  };

  const refreshTable = () => {
    setAccessLogs([]);
    setLoader(true);
    setUpdateTable(moment.now());
  };

  const rsrcContent = (requestData) => {
    const copyText = (val) => {
      !isEmpty(val) && toast.success("Copied succesfully!!");
      return val;
    };
    return (
      <Row>
        <Col sm={9} className="popover-span">
          <span>{requestData}</span>
        </Col>
        <Col sm={3} className="pull-right">
          <button
            className="pull-right link-tag query-icon btn btn-sm"
            size="sm"
            variant="link"
            title="Copied!"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(copyText(requestData));
            }}
          >
            <i className="fa-fw fa fa-copy"> </i>
          </button>
        </Col>
      </Row>
    );
  };

  const rsrcTagContent = (requestData) => {
    return (
      <>
        <Table bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(requestData).map((obj, idx) => {
              return (
                <tr key={idx}>
                  <td>{obj}</td>
                  <td>{requestData[obj]}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    );
  };

  const rsrctitle = (title) => {
    let filterTitle = "";
    if (title == "hive") {
      filterTitle = `Hive Query`;
    }
    if (title == "hbase") {
      filterTitle = `HBase Audit Data`;
    }
    if (title == "hdfs") {
      filterTitle = `HDFS Operation Name`;
    }
    return (filterTitle = `${capitalize(title)} Query`);
  };

  const previousVer = (e) => {
    if (e.currentTarget.classList.contains("active")) {
      let curr = policyParamsData && policyParamsData.policyVersion;
      let policyVersionList = currentPage;
      var previousVal =
        policyVersionList[
          (indexOf(policyVersionList, curr) - 1) % policyVersionList.length
        ];
    }
    let prevVal = {};
    prevVal.policyVersion = previousVal;
    prevVal.policyId = policyParamsData.policyId;
    prevVal.isChangeVersion = true;
    setPolicyParamsData(prevVal);
  };

  const nextVer = (e) => {
    if (e.currentTarget.classList.contains("active")) {
      let curr = policyParamsData && policyParamsData.policyVersion;
      let policyVersionList = currentPage;
      var nextValue =
        policyVersionList[
          (indexOf(policyVersionList, curr) + 1) % policyVersionList.length
        ];
    }
    let nextVal = {};
    nextVal.policyVersion = nextValue;
    nextVal.policyId = policyParamsData.policyId;
    nextVal.isChangeVersion = true;
    setPolicyParamsData(nextVal);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Policy ID",
        accessor: "policyId",
        Cell: (rawValue) => {
          return rawValue.value == -1 ? (
            <div className="text-center">--</div>
          ) : (
            <div className="text-center">
              <a
                role="button"
                title={rawValue.value}
                className="text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(rawValue.row.original);
                }}
              >
                {rawValue.value}
              </a>
            </div>
          );
        },
        width: 90,
        disableResizing: true,
        getResizerProps: () => {}
      },
      {
        Header: "Policy Version",
        accessor: "policyVersion",
        Cell: (rawValue) => {
          return rawValue.value !== undefined ? (
            <div className="text-center">{rawValue.value}</div>
          ) : (
            <div className="text-center">--</div>
          );
        },
        width: 110,
        disableResizing: true,
        disableSortBy: true,
        getResizerProps: () => {}
      },
      {
        Header: "Event Time",
        accessor: "eventTime",
        Cell: (rawValue) => {
          return dateFormat(rawValue.value, "mm/dd/yyyy h:MM:ss TT");
        },
        width: 160,
        disableResizing: true,
        getResizerProps: () => {}
      },
      {
        Header: "Application",
        accessor: "agentId",
        width: 100,
        disableResizing: true,
        disableSortBy: true,
        getResizerProps: () => {}
      },
      {
        Header: "User",
        accessor: "requestUser",
        width: 120,
        disableResizing: true,
        getResizerProps: () => {}
      },
      {
        Header: "Service (Name / Type)",
        accessor: (s) => (
          <div>
            <div className="text-left" title={s.repoDisplayName}>
              {s.repoDisplayName}
            </div>
            <div className="bt-1 text-left" title={s.serviceTypeDisplayName}>
              {s.serviceTypeDisplayName}
            </div>
          </div>
        ),
        disableResizing: true,
        disableSortBy: true,
        getResizerProps: () => {}
      },
      {
        Header: "Resource (Name / Type)",
        accessor: "resourceType",
        Cell: (r) => {
          return (
            <>
              <div style={{ display: "flex", flexWrap: "nowrap", margin: "0" }}>
                <div
                  className="pull-left resource-text"
                  title={r.row.original.resourcePath}
                >
                  {r.row.original.resourcePath}
                </div>

                <div>
                  {!isEmpty(r.row.original.requestData) && (
                    <CustomPopoverOnClick
                      icon="fa-fw fa fa-table "
                      title={rsrctitle(r.row.original.serviceType)}
                      content={rsrcContent(r.row.original.requestData)}
                      placement="left"
                      trigger={["click", "focus"]}
                    ></CustomPopoverOnClick>
                  )}
                </div>
              </div>
              {!isEmpty(r.row.original.resourcePath) ? (
                <div
                  className="bt-1 text-center"
                  title={r.row.original.resourceType}
                >
                  {r.row.original.resourceType}
                </div>
              ) : (
                <div className="text-center">--</div>
              )}
            </>
          );
        },
        minWidth: 180
      },
      {
        Header: "Access Type",
        accessor: "accessType",
        width: 130,
        disableResizing: true,
        getResizerProps: () => {}
      },
      {
        Header: "Permission",
        accessor: "action",
        Cell: (rawValue) => {
          return (
            <h6>
              <Badge variant="info">{rawValue.value}</Badge>
            </h6>
          );
        },
        width: 100,
        disableResizing: true,
        getResizerProps: () => {}
      },
      {
        Header: "Result",
        accessor: "accessResult",
        Cell: (rawValue) => {
          if (rawValue.value == 1) {
            return (
              <h6>
                <Badge variant="success">Allowed</Badge>
              </h6>
            );
          } else
            return (
              <h6>
                <Badge variant="danger">Denied</Badge>
              </h6>
            );
        },
        width: 100,
        disableResizing: true,
        disableSortBy: true,
        getResizerProps: () => {}
      },
      {
        Header: "Access Enforcer",
        accessor: "aclEnforcer",
        width: 120,
        disableResizing: true,
        getResizerProps: () => {}
      },
      {
        Header: "Agent Host Name",
        accessor: "agentHost",
        Cell: (rawValue) => {
          if (!isUndefined(rawValue.value) || !isEmpty(rawValue.value)) {
            return rawValue.value;
          } else return "--";
        },
        width: 150,
        disableResizing: true,
        disableSortBy: true,
        getResizerProps: () => {}
      },
      {
        Header: "Client IP",
        accessor: "clientIP",
        width: 110,
        disableResizing: true,
        getResizerProps: () => {}
      },
      {
        Header: "Cluster Name",
        accessor: "clusterName",
        width: 100,
        disableResizing: true,
        disableSortBy: true,
        getResizerProps: () => {}
      },
      {
        Header: "Zone Name",
        accessor: "zoneName",
        Cell: (rawValue) => {
          if (!isUndefined(rawValue.value) || !isEmpty(rawValue.value)) {
            return (
              <h6>
                <Badge bg="dark">{rawValue.value}</Badge>
              </h6>
            );
          } else return <div className="text-center">--</div>;
        },
        width: 100,
        disableResizing: true,
        getResizerProps: () => {}
      },
      {
        Header: "Event Count",
        accessor: "eventCount",
        width: 100,
        disableResizing: true,
        disableSortBy: true,
        getResizerProps: () => {}
      },
      {
        Header: "Tags",
        accessor: "tags",
        Cell: (rawValue) => {
          let Tags = [];
          if (!isEmpty(rawValue.value)) {
            Tags = JSON.parse(rawValue.value).map((tag) => {
              if (tag.attributes && !isEmpty(tag.attributes)) {
                return (
                  <CustomPopoverTagOnClick
                    icon="text-info"
                    data={tag.type}
                    title={"Atrribute Details"}
                    content={rsrcTagContent(tag.attributes)}
                    placement="left"
                    trigger={["click", "focus"]}
                  ></CustomPopoverTagOnClick>
                );
              }

              return tag.type;
            });
          } else {
            return <div className="text-center">--</div>;
          }
          return (
            <>
              <h6>
                <AccessMoreLess data={Tags} />
              </h6>
            </>
          );
        },
        width: 100,
        disableResizing: true,
        disableSortBy: true,
        getResizerProps: () => {}
      }
    ],
    []
  );

  const getServiceDefType = () => {
    let serviceDefType = [];

    serviceDefType = map(serviceDefs, function (serviceDef) {
      return {
        label: toUpper(serviceDef.name),
        value: toString(serviceDef.id)
      };
    });

    return serviceDefType;
  };

  const getServices = () => {
    let servicesName = [];

    servicesName = map(services, function (service) {
      return { label: service.name, value: service.name };
    });

    return servicesName;
  };

  const getZones = () => {
    let zonesName = [];

    zonesName = map(zones, function (zone) {
      return zone.name;
    });

    return zonesName;
  };

  const updateSearchFilter = (filter) => {
    console.log("PRINT Filter : ", filter);
    let searchFilter = {};

    map(filter, function (obj) {
      searchFilter[obj.category] = obj.value;
    });
    setSearchFilter(searchFilter);
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col sm={12}>
          <StructuredFilter
            options={sortBy(
              [
                {
                  category: "aclEnforcer",
                  label: "Access Enforcer",
                  type: "text"
                },
                {
                  category: "accessType",
                  label: "Access Type",
                  type: "text"
                },
                {
                  category: "agentHost",
                  label: "Agent Host Name",
                  type: "text"
                },
                {
                  category: "agentId",
                  label: "Application",
                  type: "text"
                },
                {
                  category: "eventId",
                  label: "Audit ID",
                  type: "number"
                },
                {
                  category: "clientIP",
                  label: "Client IP",
                  type: "text"
                },
                {
                  category: "cluster",
                  label: "Cluster Name",
                  type: "text"
                },
                {
                  category: "endDate",
                  label: "End Date",
                  type: "text"
                },
                {
                  category: "excludeUser",
                  label: "Exclude User",
                  type: "number"
                },
                {
                  category: "policyId",
                  label: "Policy ID",
                  type: "text"
                },
                {
                  category: "resourcePath",
                  label: "Resource Name",
                  type: "text"
                },
                {
                  category: "resourceType",
                  label: "Resource Type",
                  type: "text"
                },
                {
                  category: "accessResult",
                  label: "Result",
                  type: "text"
                },
                {
                  category: "repoName",
                  label: "Service Name",
                  type: "textoptions",
                  options: getServices
                },
                {
                  category: "repoType",
                  label: "Service Type",
                  type: "textoptions",
                  options: getServiceDefType
                },
                {
                  category: "startDate",
                  label: "Start Date",
                  type: "date"
                },
                {
                  category: "tags",
                  label: "Tags",
                  type: "text"
                },
                {
                  category: "requestUser",
                  label: "Users",
                  type: "text"
                },
                {
                  category: "zoneName",
                  label: "Zone Name",
                  type: "textoptions",
                  options: getZones
                }
              ],
              ["label"]
            )}
            onTokenAdd={updateSearchFilter}
            onTokenRemove={updateSearchFilter}
          />
          <span className="info-icon">
            <CustomTooltip
              placement="left"
              content={
                <p className="pd-10" style={{ fontSize: "small" }}>
                  Wildcard searches( for example using * or ? ) are not
                  currently supported.
                  <br /> <b>Access Enforcer :</b> Search by access enforcer
                  name.
                  <br />
                  <b> Access Type :</b> Search by access Type like READ_EXECUTE,
                  WRITE_EXECUTE.
                  <br />
                  <b>Client IP :</b> Search by IP address from where resource
                  was accessed.
                  <br />
                  <b>Cluster Name : </b> Name of cluster <br />
                  <b>Zone Name :</b> Name of Zone. <br />
                  <b>End Date :</b> Set end date. <br />
                  <b>Resource Name :</b> Resource name.
                  <br /> <b>Resource Type :</b> Search by resource type based on
                  component. eg. path in HDFS, database ,table in Hive.
                  <br />
                  <b> Result :</b> Search by access result i.e Allowed/Denied
                  logs.
                  <br /> <b> Service Name :</b> Name of service.
                  <br /> <b> Service Type :</b> Select type of service.
                  <br /> <b> Start Date :</b> Set start date.
                  <br /> <b> User :</b> Name of User.
                  <br /> <b> Exclude User :</b> Name of User.
                  <br /> <b> Application :</b> Application.
                  <br /> <b> Tags :</b> Tag Name.
                  <br /> <b> Permission :</b> Permission
                </p>
              }
              icon="fa-fw fa fa-info-circle"
            />
          </span>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col sm={2}>
          <span>Exclude Service Users: </span>
          <input
            type="checkbox"
            className="align-middle"
            defaultChecked={checked}
            onChange={() => {
              toggleChange();
            }}
          />
        </Col>
        <Col sm={9}>
          <AuditFilterEntries entries={entries} refreshTable={refreshTable} />
        </Col>
      </Row>
      <XATableLayout
        data={accessListingData}
        columns={columns}
        fetchData={fetchAccessLogsInfo}
        totalCount={entries && entries.totalCount}
        loading={loader}
        pageCount={pageCount}
        getRowProps={(row) => ({
          onClick: (e) => {
            e.stopPropagation();
            rowModal(row);
          }
        })}
        columnHide={true}
        columnResizable={true}
        columnSort={true}
      />
      <Modal show={showrowmodal} size="lg" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4>
              Audit Access Log Detail
              <Link
                className="text-info"
                target="_blank"
                title="Show log details in next tab"
                to={{
                  pathname: `/reports/audit/eventlog/${rowdata.eventId}`
                }}
              >
                <i className="fa-fw fa fa-external-link pull-right text-info"></i>
              </Link>
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="overflow-auto p-3 mb-3 mb-md-0 mr-md-3">
          <AccessLogsTable data={rowdata}></AccessLogsTable>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={policyviewmodal} onHide={handleClosePolicyId} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Policy Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PolicyViewDetails
            paramsData={policyParamsData}
            serviceDefs={serviceDefs}
            policyView={false}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="policy-version pull-left">
            <i
              className={
                policyParamsData && policyParamsData.policyVersion > 1
                  ? "fa-fw fa fa-chevron-left active"
                  : "fa-fw fa fa-chevron-left"
              }
              onClick={(e) =>
                e.currentTarget.classList.contains("active") && previousVer(e)
              }
            ></i>
            <span>{`Version ${
              policyParamsData && policyParamsData.policyVersion
            }`}</span>
            <i
              className={
                !isUndefined(
                  currentPage[
                    indexOf(
                      currentPage,
                      policyParamsData && policyParamsData.policyVersion
                    ) + 1
                  ]
                )
                  ? "fa-fw fa fa-chevron-right active"
                  : "fa-fw fa fa-chevron-right"
              }
              onClick={(e) =>
                e.currentTarget.classList.contains("active") && nextVer(e)
              }
            ></i>
          </div>
          <Button variant="primary" onClick={handleClosePolicyId}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default Access;
