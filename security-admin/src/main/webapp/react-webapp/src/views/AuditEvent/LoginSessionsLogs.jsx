import React, { Component, useState, useCallback, useRef } from "react";
import { Badge } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";
import { AuthStatus } from "../../utils/XAEnums";
import { AuthType } from "../../utils/XAEnums";
import dateFormat from "dateformat";

function Login_Sessions() {
  const [loginSessionListingData, setLoginSessionLogs] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);

  const fetchLoginSessionLogsInfo = useCallback(async ({ pageSize, pageIndex }) => {
    let logs = [];
    let totalCount= 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
        const logsResp = await fetchApi({
          url: "xusers/authSessions",
          params:{
            pageSize: pageSize,
            startIndex: pageIndex * pageSize,
          },
        });
        logs = logsResp.data.vXAuthSessions;
        totalCount = logsResp.data.totalCount;
      } catch (error) {
        console.error(
          `Error occurred while fetching Login Session logs! ${error}`
        );
      }
      setLoginSessionLogs(logs);
      setPageCount(Math.ceil(totalCount / pageSize));
      setLoader(false);
    }
  },[]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Session ID",
        accessor: "id", // accessor is the "key" in the data
      },
      {
        Header: "Login ID",
        accessor: "loginId", // accessor is the "key" in the data
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
                html = <Badge variant="success">{label}</Badge>;
              } else if (AuthStatus[item].value == 2) {
                html = <Badge variant="danger">{label}</Badge>;
              } else {
                html = <Badge>{label}</Badge>;
              }
            }
          });
          return html;
        },
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
        },
      },
      {
        Header: "IP",
        accessor: "requestIP", // accessor is the "key" in the data
      },
      {
        Header: "User Agent",
        accessor: "requestUserAgent", // accessor is the "key" in the data
        Cell: (rawValue, model) => {
          var label = "";
          if (rawValue.value) {
            return (label = rawValue.value);
          } else {
            return "--";
          }
        },
      },
      {
        Header: "Login Time ( India Standard Time )",
        accessor: "authTime", // accessor is the "key" in the data
        Cell: (rawValue) => {
          const date = rawValue.value;
          const newdate = dateFormat(date, "mm/dd/yyyy h:MM:ss TT");
          return newdate;
        },
      },
    ],
    []
  );
  return loader ? (
    <Loader />
  ) : (
    <XATableLayout data={loginSessionListingData} columns={columns} fetchData={fetchLoginSessionLogsInfo} pageCount={pageCount}/>
  );
}

export default Login_Sessions;
