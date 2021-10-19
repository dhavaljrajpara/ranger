import React, { Component, useState, useEffect } from "react";
import XATableLayout from "Components/XATableLayout";
import {Loader} from "Components/CommonComponents";


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
        url: "assets/authSessions",
      });
      logs = logsResp.data.vXAuthSessions
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
      },
      {
        Header: "Login Type",
        accessor: "authType", // accessor is the "key" in the data
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
  return loader ? <Loader /> : <XATableLayout data={loginSessionListingData} columns={columns} />;
}

export default Login_Sessions;