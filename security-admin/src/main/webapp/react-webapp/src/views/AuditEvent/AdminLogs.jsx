import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Badge, Row, Col } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { fetchApi } from "Utils/fetchAPI";
import { ClassTypes, enumValueToLabel } from "../../utils/XAEnums";
import dateFormat from "dateformat";
import AdminModal from "./AdminModal";
import { AuditFilterEntries } from "Components/CommonComponents";
import OperationAdminModal from "./OperationAdminModal";
import moment from "moment-timezone";
import { capitalize, find, map, startCase, sortBy, toLower } from "lodash";
import StructuredFilter from "../../components/structured-filter/react-typeahead/tokenizer";
import {
  getTableSortBy,
  getTableSortType,
  fetchSearchFilterParams
} from "../../utils/XAUtils";

function Admin() {
  const [adminListingData, setAdminLogs] = useState([]);
  const [sessionId, setSessionId] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [showmodal, setShowModal] = useState(false);
  const [entries, setEntries] = useState([]);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const [showrowmodal, setShowRowModal] = useState(false);
  const [rowdata, setRowData] = useState([]);
  const fetchIdRef = useRef(0);
  const [contentLoader, setContentLoader] = useState(true);
  const [searchFilterParams, setSearchFilterParams] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [defaultSearchFilterParams, setDefaultSearchFilterParams] = useState(
    []
  );

  const handleClose = () => setShowModal(false);
  const handleClosed = () => setShowRowModal(false);
  const navigate = useNavigate();

  const updateSessionId = (id) => {
    navigate(`/reports/audit/admin?sessionId=${id}`);
    setSearchParams({ sessionId: id });
    setContentLoader(true);
  };

  const rowModal = async (row) => {
    const { original = {} } = row;
    original.objectId;
    setShowRowModal(true);
    setRowData(original);
  };

  useEffect(() => {
    let { searchFilterParam, defaultSearchFilterParam, searchParam } =
      fetchSearchFilterParams("admin", searchParams, searchFilterOptions);

    // Updating the states for search params, search filter, default search filter and localStorage
    setSearchParams(searchParam);
    setSearchFilterParams(searchFilterParam);
    setDefaultSearchFilterParams(defaultSearchFilterParam);
    localStorage.setItem("admin", JSON.stringify(searchParam));
    setContentLoader(false);
  }, [searchParams]);

  const fetchAdminLogsInfo = useCallback(
    async ({ pageSize, pageIndex, sortBy }) => {
      setLoader(true);
      let logsResp = [];
      let adminlogs = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      let params = { ...searchFilterParams };
      if (fetchId === fetchIdRef.current) {
        params["pageSize"] = pageSize;
        params["startIndex"] = pageIndex * pageSize;
        if (sortBy.length > 0) {
          params["sortBy"] = getTableSortBy(sortBy);
          params["sortType"] = getTableSortType(sortBy);
        }
        try {
          logsResp = await fetchApi({
            url: "assets/report",
            params: params
          });
          adminlogs = logsResp.data.vXTrxLogs;
          totalCount = logsResp.data.totalCount;
        } catch (error) {
          console.error(`Error occurred while fetching Admin logs! ${error}`);
        }
        setAdminLogs(adminlogs);
        setEntries(logsResp.data);
        setPageCount(Math.ceil(totalCount / pageSize));
        setLoader(false);
      }
    },
    [updateTable, searchFilterParams]
  );

  const refreshTable = () => {
    setAdminLogs([]);
    setLoader(true);
    setUpdateTable(moment.now());
  };

  const openModal = (sessionId) => {
    setShowModal(true);
    setSessionId(sessionId);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Operation",
        accessor: "operation",
        Cell: (rawValue) => {
          let classtype = rawValue.row.original.objectClassType;
          let action = rawValue.row.original.action;
          let objectname = rawValue.row.original.objectName;

          let operation = "";
          let hasAction = [
            "EXPORT JSON",
            "EXPORT EXCEL",
            "EXPORT CSV",
            "IMPORT START",
            "IMPORT END"
          ];
          if (hasAction.includes(action)) {
            if (
              action == "EXPORT JSON" ||
              action == "EXPORT EXCEL" ||
              action == "EXPORT CSV"
            )
              return "Exported policies";
            else return action;
          } else {
            if (
              classtype == ClassTypes.CLASS_TYPE_XA_ASSET.value ||
              classtype == ClassTypes.CLASS_TYPE_RANGER_SERVICE.value
            )
              operation = (
                <span>
                  Service {action}d <strong>{objectname}</strong>
                </span>
              );
            else if (
              classtype == ClassTypes.CLASS_TYPE_XA_RESOURCE.value ||
              classtype == ClassTypes.CLASS_TYPE_RANGER_POLICY.value
            )
              operation = (
                <span>
                  Policy {action}d <strong>{objectname}</strong>
                </span>
              );
            else if (classtype == ClassTypes.CLASS_TYPE_XA_USER.value)
              operation = (
                <span>
                  User {action}d <strong>{objectname}</strong>
                </span>
              );
            else if (classtype == ClassTypes.CLASS_TYPE_XA_GROUP.value)
              operation = (
                <span>
                  Group {action}d <strong>{objectname}</strong>
                </span>
              );
            else if (classtype == ClassTypes.CLASS_TYPE_USER_PROFILE.value)
              operation = (
                <span>
                  User profile {action}d <strong>{objectname}</strong>
                </span>
              );
            else if (classtype == ClassTypes.CLASS_TYPE_PASSWORD_CHANGE.value)
              operation = (
                <span>
                  User profile {action}d <strong>{objectname}</strong>
                </span>
              );
            else if (
              classtype == ClassTypes.CLASS_TYPE_RANGER_SECURITY_ZONE.value
            )
              operation = (
                <span>
                  Security Zone {action}d <strong>{objectname}</strong>
                </span>
              );
            else if (classtype == ClassTypes.CLASS_TYPE_RANGER_ROLE.value)
              operation = (
                <span>
                  Role {action}d <strong>{objectname}</strong>
                </span>
              );
            return <div className="overflow-text">{operation}</div>;
          }
        },
        disableSortBy: true
      },
      {
        Header: "Audit Type",
        accessor: "objectClassType",
        Cell: (rawValue) => {
          let classtype = rawValue.row.original.objectClassType;
          var audittype = enumValueToLabel(ClassTypes, classtype);
          return Object.values(audittype.label);
        },
        disableSortBy: true
      },
      {
        Header: "User",
        accessor: "owner",
        Cell: (rawValue) => {
          return rawValue.value !== undefined ? (
            <div className="text-center">{rawValue.value}</div>
          ) : (
            <div className="text-center">--</div>
          );
        },
        disableSortBy: true
      },
      {
        Header: "Date ( India Standard Time )",
        accessor: "createDate",
        Cell: (rawValue) => {
          const date = rawValue.value;
          const newdate = dateFormat(date, "mm/dd/yyyy hh:MM:ss TT");
          return newdate;
        }
      },
      {
        Header: "Actions",
        accessor: "action",
        Cell: (rawValue) => {
          var operation = "";
          if (rawValue.value == "create") {
            operation = (
              <h6>
                <Badge variant="success">{capitalize(rawValue.value)}</Badge>
              </h6>
            );
          } else if (rawValue.value == "update") {
            operation = (
              <h6>
                <Badge variant="warning">{capitalize(rawValue.value)}</Badge>
              </h6>
            );
          } else if (rawValue.value == "delete") {
            operation = (
              <h6>
                <Badge variant="danger">{capitalize(rawValue.value)}</Badge>
              </h6>
            );
          } else if (rawValue.value == "IMPORT START") {
            operation = (
              <h6>
                <Badge variant="info">{capitalize(rawValue.value)}</Badge>
              </h6>
            );
          } else if (rawValue.value == "IMPORT END") {
            operation = (
              <h6>
                <Badge variant="info">{capitalize(rawValue.value)}</Badge>
              </h6>
            );
          } else {
            operation = (
              <h6>
                <Badge variant="secondary">
                  {startCase(toLower(rawValue.value))}
                </Badge>{" "}
              </h6>
            );
          }
          return operation;
        },
        disableSortBy: true
      },
      {
        Header: "Session ID",
        accessor: "sessionId",
        Cell: (rawValue) => {
          var sessionId = rawValue.value;
          if (sessionId != undefined) {
            return (
              <div className="text-center">
                <a
                  role="button"
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(sessionId);
                  }}
                >
                  {sessionId}
                </a>
              </div>
            );
          } else {
            return <div className="text-center">--</div>;
          }
        },
        disableSortBy: true
      }
    ],
    []
  );

  const getDefaultSort = React.useMemo(
    () => [
      {
        id: "createDate",
        desc: true
      }
    ],
    []
  );

  const updateSearchFilter = (filter) => {
    console.log("PRINT Filter from tokenizer : ", filter);

    let searchFilterParam = {};
    let searchParam = {};

    map(filter, function (obj) {
      searchFilterParam[obj.category] = obj.value;

      let searchFilterObj = find(searchFilterOptions, {
        category: obj.category
      });

      let urlLabelParam = searchFilterObj.urlLabel;

      if (searchFilterObj.type == "textoptions") {
        let textOptionObj = find(searchFilterObj.options(), {
          value: obj.value
        });
        searchParam[urlLabelParam] = textOptionObj.label;
      } else {
        searchParam[urlLabelParam] = obj.value;
      }
    });

    setSearchFilterParams(searchFilterParam);
    setSearchParams(searchParam);
    localStorage.setItem("admin", JSON.stringify(searchParam));
  };

  const searchFilterOptions = [
    {
      category: "action",
      label: "Actions",
      urlLabel: "actions",
      type: "textoptions",
      options: () => {
        return [
          { value: "create", label: "Create" },
          { value: "update", label: "Update" },
          { value: "delete", label: "Delete" },
          { value: "password change", label: "Password Change" },
          { value: "EXPORT JSON", label: "Export Json" },
          { value: "EXPORT CSV", label: "Export Csv" },
          { value: "EXPORT EXCEL", label: "Export Excel" },
          { value: "IMPORT END", label: "Import End" },
          { value: "IMPORT START", label: "Import Start" },
          { value: "Import Create", label: "Import Create" },
          { value: "Import Delete", label: "Import Delete" }
        ];
      }
    },
    {
      category: "objectClassType",
      label: "Audit Type",
      urlLabel: "auditType",
      type: "textoptions",
      options: () => {
        return [
          { value: "1020", label: "Ranger Policy" },
          { value: "1002", label: "Ranger Group" },
          { value: "1056", label: "Ranger Security Zone" },
          { value: "1030", label: "Ranger Service" },
          { value: "1003", label: "Ranger User" },
          { value: "2", label: "User Profile" }
        ];
      }
    },
    {
      category: "endDate",
      label: "End Date",
      urlLabel: "endDate",
      type: "date"
    },
    {
      category: "sessionId",
      label: "Session ID",
      urlLabel: "sessionId",
      type: "text"
    },
    {
      category: "startDate",
      label: "Start Date",
      urlLabel: "startDate",
      type: "date"
    },
    {
      category: "owner",
      label: "User",
      urlLabel: "user",
      type: "text"
    }
  ];

  return (
    <div className="wrap">
      {contentLoader ? (
        <Row>
          <Col sm={12} className="text-center">
            <div className="spinner-border mr-2" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </Col>
        </Row>
      ) : (
        <React.Fragment>
          <Row className="mb-2">
            <Col sm={12}>
              <div className="searchbox-border">
                <StructuredFilter
                  key="admin-log-search-filter"
                  placeholder="Search for your access logs..."
                  options={sortBy(searchFilterOptions, ["label"])}
                  onTokenAdd={updateSearchFilter}
                  onTokenRemove={updateSearchFilter}
                  defaultSelected={defaultSearchFilterParams}
                />
              </div>
            </Col>
          </Row>

          <AuditFilterEntries entries={entries} refreshTable={refreshTable} />

          <XATableLayout
            data={adminListingData}
            columns={columns}
            fetchData={fetchAdminLogsInfo}
            totalCount={entries && entries.totalCount}
            pageCount={pageCount}
            loading={loader}
            columnSort={true}
            defaultSort={getDefaultSort}
            getRowProps={(row) => ({
              onClick: () => rowModal(row)
            })}
          />

          <AdminModal
            show={showmodal}
            data={sessionId}
            onHide={handleClose}
            updateSessionId={updateSessionId}
          ></AdminModal>

          <OperationAdminModal
            show={showrowmodal}
            data={rowdata}
            onHide={handleClosed}
          ></OperationAdminModal>
        </React.Fragment>
      )}
    </div>
  );
}

export default Admin;
