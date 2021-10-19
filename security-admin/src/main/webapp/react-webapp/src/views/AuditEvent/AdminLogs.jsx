import React, { Component, useState, useEffect } from "react";
import XATableLayout from "Components/XATableLayout";
import {Loader} from "Components/CommonComponents";


function Admin() {
  const [adminListingData, setAdminLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    fetchAdminLogsInfo();
  }, []);

  const fetchAdminLogsInfo = async () => {
    let adminlogs = [];
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      const logsResp = await fetchApi({
        url: "assets/report",
      });
      adminlogs = logsResp.data.vXTrxLogs
    } catch (error) {
      console.error(
        `Error occurred while fetching Admin logs! ${error}`
      );
    }
    setAdminLogs(adminlogs);
    setLoader(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Operation",
        accessor: "operation", // accessor is the "key" in the data
      },
      {
        Header: "Audit Type",
        accessor: "objectClassType", // accessor is the "key" in the data
      },
      {
        Header: "User",
        accessor: "owner", // accessor is the "key" in the data
      },
      {
        Header: "Date ( India Standard Time )",
        accessor: "createDate", // accessor is the "key" in the data
      },
      {
        Header: "Actions",
        accessor: "action", // accessor is the "key" in the data
      },
      {
        Header: "Session ID",
        accessor: "sessionId", // accessor is the "key" in the data
      },
    ],
    []
  );
  return loader ? <Loader /> : <XATableLayout data={adminListingData} columns={columns} />;
}

export default Admin;