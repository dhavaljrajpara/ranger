import React, { Component, useState, useEffect } from "react";
import { Badge } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";
import { AuthStatus } from "../../utils/XAEnums";
import { AuthType } from "../../utils/XAEnums";

function Login_Sessions() {
  const [loginSessionListingData, setLoginSessionLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    fetchLoginSessionLogsInfo();
  }, []);

  const fetchLoginSessionLogsInfo = async () => {
    let logs = [];
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      const logsResp = await fetchApi({
        url: "xusers/authSessions",
      });
      logs = logsResp.data.vXAuthSessions;
    } catch (error) {
      console.error(
        `Error occurred while fetching Login Session logs! ${error}`
      );
    }
    setLoginSessionLogs(logs);
    setLoader(false);
  };

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
      },
      {
        Header: "Login Time ( India Standard Time )",
        accessor: "authTime", // accessor is the "key" in the data
      },
    ],
    []
  );
  return loader ? (
    <Loader />
  ) : (
    <XATableLayout data={loginSessionListingData} columns={columns} />
  );
}

export default Login_Sessions;
