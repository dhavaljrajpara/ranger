import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Badge, Row, Col } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { AuthStatus, AuthType } from "../../utils/XAEnums";
import AdminModal from "./AdminModal";
import dateFormat from "dateformat";
import { AuditFilterEntries } from "Components/CommonComponents";
import moment from "moment-timezone";
import { find, map, sortBy } from "lodash";
import StructuredFilter from "../../components/structured-filter/react-typeahead/tokenizer";
import {
  getTableSortBy,
  getTableSortType,
  fetchSearchFilterParams,
  serverError
} from "../../utils/XAUtils";

function Login_Sessions() {
  const [loginSessionListingData, setLoginSessionLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  const [sessionId, setSessionId] = useState([]);
  const [showmodal, setShowModal] = useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const [entries, setEntries] = useState([]);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const fetchIdRef = useRef(0);
  const [contentLoader, setContentLoader] = useState(true);
  const [searchFilterParams, setSearchFilterParams] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [defaultSearchFilterParams, setDefaultSearchFilterParams] = useState(
    []
  );

  const handleClose = () => setShowModal(false);
  const navigate = useNavigate();

  const updateSessionId = (id) => {
    navigate(`/reports/audit/admin?sessionId=${id}`);
  };

  useEffect(() => {
    let { searchFilterParam, defaultSearchFilterParam, searchParam } =
      fetchSearchFilterParams(
        "loginSession",
        searchParams,
        searchFilterOptions
      );

    // Updating the states for search params, search filter, default search filter and localStorage
    setSearchParams(searchParam);
    setSearchFilterParams(searchFilterParam);
    setDefaultSearchFilterParams(defaultSearchFilterParam);
    localStorage.setItem("loginSession", JSON.stringify(searchParam));
    setContentLoader(false);
  }, []);

  const fetchLoginSessionLogsInfo = useCallback(
    async ({ pageSize, pageIndex, sortBy }) => {
      setLoader(true);
      let logsResp = [];
      let logs = [];
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
          const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
          logsResp = await fetchApi({
            url: "xusers/authSessions",
            params: params
          });
          logs = logsResp.data.vXAuthSessions;
          totalCount = logsResp.data.totalCount;
        } catch (error) {
          serverError(error);
          console.error(
            `Error occurred while fetching Login Session logs! ${error}`
          );
        }
        setLoginSessionLogs(logs);
        setEntries(logsResp.data);
        setPageCount(Math.ceil(totalCount / pageSize));
        setLoader(false);
      }
    },
    [updateTable, searchFilterParams]
  );

  const getDefaultSort = React.useMemo(
    () => [
      {
        id: "id",
        desc: true
      }
    ],
    []
  );

  const refreshTable = () => {
    setLoginSessionLogs([]);
    setLoader(true);
    setUpdateTable(moment.now());
  };

  const openModal = (id) => {
    setShowModal(true);
    setSessionId(id);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Session ID",
        accessor: "id",
        Cell: (rawValue) => {
          var id = rawValue.value;
          if (id != undefined) {
            return (
              <div className="text-center">
                <a
                  role="button"
                  className="text-primary"
                  onClick={() => {
                    openModal(id);
                  }}
                >
                  <span className="text-center">{id}</span>
                </a>
              </div>
            );
          } else {
            return <div className="text-center">--</div>;
          }
        },
        width: 90
      },
      {
        Header: "Login ID",
        accessor: "loginId",
        Cell: (rawValue) => {
          if (rawValue.value) {
            return rawValue.value;
          } else {
            return "--";
          }
        },
        width: 100,
        disableSortBy: true
      },
      {
        Header: "Result",
        accessor: "authStatus",
        Cell: (rawValue) => {
          var label = "";
          var html = "";
          Object.keys(AuthStatus).map((item) => {
            if (rawValue.value == AuthStatus[item].value) {
              label = AuthStatus[item].label;
              if (AuthStatus[item].value == 1) {
                html = (
                  <h6>
                    <Badge variant="success">{label}</Badge>
                  </h6>
                );
              } else if (AuthStatus[item].value == 2) {
                html = (
                  <h6>
                    <Badge variant="danger">{label}</Badge>
                  </h6>
                );
              } else {
                html = (
                  <h6>
                    <Badge variant="secondary">{label}</Badge>
                  </h6>
                );
              }
            }
          });
          return html;
        },
        width: 100,
        disableSortBy: true
      },
      {
        Header: "Login Type",
        accessor: "authType",
        Cell: (rawValue) => {
          var label = "";
          Object.keys(AuthType).map((item) => {
            if (rawValue.value == AuthType[item].value) {
              label = AuthType[item].label;
            }
          });
          return label;
        },
        disableSortBy: true
      },
      {
        Header: "IP",
        accessor: "requestIP",
        disableSortBy: true
      },
      {
        Header: "User Agent",
        accessor: "requestUserAgent",
        Cell: (rawValue) => {
          if (rawValue.value) {
            return (
              <div className="overflow-text" title={rawValue.value}>
                {rawValue.value}
              </div>
            );
          } else {
            return <div className="text-center">--</div>;
          }
        },
        disableSortBy: true
      },
      {
        Header: "Login Time ( India Standard Time )",
        accessor: "authTime",
        Cell: (rawValue) => {
          let formatDateTime = dateFormat(
            rawValue.value,
            "mm/dd/yyyy hh:MM:ss TT"
          );
          return <div className="text-center">{formatDateTime}</div>;
        },
        width: 180,
        disableSortBy: true
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
    localStorage.setItem("loginSession", JSON.stringify(searchParam));
  };

  const searchFilterOptions = [
    {
      category: "endDate",
      label: "End Date",
      urlLabel: "endDate",
      type: "date"
    },
    {
      category: "requestIP",
      label: "IP",
      urlLabel: "requestIP",
      type: "text"
    },
    {
      category: "loginId",
      label: "Login ID  ",
      urlLabel: "loginID",
      type: "text"
    },
    {
      category: "authType",
      label: "Login Type",
      urlLabel: "loginType",
      type: "textoptions",
      options: () => {
        return [
          { value: "1", label: "Username/Password" },
          { value: "2", label: "Kerberos" },
          { value: "3", label: "SingleSignOn" },
          { value: "4", label: "Trusted Proxy" }
        ];
      }
    },
    {
      category: "authStatus",
      label: "Result",
      urlLabel: "result",
      type: "textoptions",
      options: () => {
        return [
          { value: "1", label: "Success" },
          { value: "2", label: "Wrong Password" },
          { value: "3", label: "Account Disabled" },
          { value: "4", label: "Locked" },
          { value: "5", label: "Password Expired" },
          { value: "6", label: "User not found" }
        ];
      }
    },
    {
      category: "sessionId",
      label: "Session ID",
      urlLabel: "sessionID",
      type: "text"
    },
    {
      category: "startDate",
      label: "Start Date",
      urlLabel: "startDate",
      type: "date"
    },
    {
      category: "requestUserAgent",
      label: "User Agent",
      urlLabel: "userAgent",
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
                  key="login-session-search-filter"
                  placeholder="Search for your login sessions..."
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
            data={loginSessionListingData}
            columns={columns}
            fetchData={fetchLoginSessionLogsInfo}
            totalCount={entries && entries.totalCount}
            loading={loader}
            pageCount={pageCount}
            columnSort={true}
            defaultSort={getDefaultSort}
          />
          <AdminModal
            show={showmodal}
            data={sessionId}
            onHide={handleClose}
            updateSessionId={updateSessionId}
          ></AdminModal>
        </React.Fragment>
      )}
    </div>
  );
}

export default Login_Sessions;
