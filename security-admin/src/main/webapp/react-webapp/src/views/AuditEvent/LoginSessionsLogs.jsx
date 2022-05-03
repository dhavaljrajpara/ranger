import React, { Component, useState, useCallback, useRef } from "react";
import { Badge } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { AuthStatus } from "../../utils/XAEnums";
import { AuthType } from "../../utils/XAEnums";
import AdminModal from "./AdminModal";
import dateFormat from "dateformat";
import { AuditFilterEntries } from "Components/CommonComponents";
import moment from "moment-timezone";
import { truncate } from "lodash";

function Login_Sessions() {
  const [loginSessionListingData, setLoginSessionLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  const [sessionId, setSessionId] = useState([]);
  const [showmodal, setShowModal] = useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const [entries, setEntries] = useState([]);
  const [updateTable, setUpdateTable] = useState(moment.now());

  const fetchIdRef = useRef(0);

  const handleClose = () => setShowModal(false);
  const fetchLoginSessionLogsInfo = useCallback(
    async ({ pageSize, pageIndex }) => {
      let logsResp = [];
      let logs = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      if (fetchId === fetchIdRef.current) {
        try {
          const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
          logsResp = await fetchApi({
            url: "xusers/authSessions",
            params: {
              pageSize: pageSize,
              startIndex: pageIndex * pageSize
            }
          });
          logs = logsResp.data.vXAuthSessions;
          totalCount = logsResp.data.totalCount;
        } catch (error) {
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
    [updateTable]
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
        accessor: "id", // accessor is the "key" in the data
        Cell: (rawValue) => {
          var id = rawValue.value;
          if (id != undefined) {
            return (
              <a
                className="text-primary"
                onClick={() => {
                  openModal(id);
                }}
              >
                {id}
              </a>
            );
          } else {
            return "";
          }
        }
      },
      {
        Header: "Login ID",
        accessor: "loginId", // accessor is the "key" in the data
        Cell: (rawValue) => {
          if (rawValue.value) {
            return rawValue.value;
          } else {
            return "--";
          }
        }
      },
      {
        Header: "Result",
        accessor: "authStatus", // accessor is the "key" in the data
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
                    <Badge>{label}</Badge>
                  </h6>
                );
              }
            }
          });
          return html;
        }
      },
      {
        Header: "Login Type",
        accessor: "authType", // accessor is the "key" in the data
        Cell: (rawValue) => {
          var label = "";
          Object.keys(AuthType).map((item) => {
            if (rawValue.value == AuthType[item].value) {
              label = AuthType[item].label;
            }
          });
          return label;
        }
      },
      {
        Header: "IP",
        accessor: "requestIP" // accessor is the "key" in the data
      },
      {
        Header: "User Agent",
        accessor: "requestUserAgent", // accessor is the "key" in the data
        Cell: (rawValue) => {
          if (rawValue.value) {
            return <div className="resource-text">{rawValue.value}</div>;
          } else {
            return "--";
          }
        }
      },
      {
        Header: "Login Time ( India Standard Time )",
        accessor: "authTime", // accessor is the "key" in the data
        Cell: (rawValue) => {
          const date = rawValue.value;
          const newdate = dateFormat(date, "mm/dd/yyyy h:MM:ss TT");
          return newdate;
        }
      }
    ],
    []
  );
  return (
    <>
      <AuditFilterEntries entries={entries} refreshTable={refreshTable} />
      <br />
      <br />
      <XATableLayout
        data={loginSessionListingData}
        columns={columns}
        fetchData={fetchLoginSessionLogsInfo}
        loading={loader}
        pageCount={pageCount}
      />
      <AdminModal
        show={showmodal}
        data={sessionId}
        onHide={handleClose}
      ></AdminModal>
    </>
  );
}

export default Login_Sessions;
