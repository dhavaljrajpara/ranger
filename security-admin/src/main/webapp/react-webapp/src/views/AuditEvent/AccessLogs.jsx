import React, { Component, useState, useEffect } from "react";
import XATableLayout from "Components/XATableLayout";
import {Loader} from "Components/CommonComponents";


function Access() {
  const [accessListingData, setAccessLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    fetchAccessLogsInfo();
  }, []);

  const fetchAccessLogsInfo = async () => {
    let logs = [];
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      const logsResp = await fetchApi({
        url: "assets/accessAudit",
      });
      logs = logsResp.data.vXAccessAudits
    } catch (error) {
      console.error(
        `Error occurred while fetching Access logs! ${error}`
      );
    }
    setAccessLogs(logs);
    setLoader(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Policy ID",
        accessor: "policyId", // accessor is the "key" in the data
      },
      {
        Header: "Policy Version",
        accessor: "policyVersion", // accessor is the "key" in the data
      },
      {
        Header: "Event Time",
        accessor: "eventTime", // accessor is the "key" in the data
      },
      {
        Header: "Application",
        accessor: "agentId", // accessor is the "key" in the data
      },
      {
        Header: "User",
        accessor: "requestUser", // accessor is the "key" in the data
      },
      {
        Header: "Service Name",
        accessor: "repoName", // accessor is the "key" in the data
      },
      {
        Header: "Resource Name",
        accessor: "resourceType", // accessor is the "key" in the data
      },
      {
        Header: "Access Type",
        accessor: "accessType", // accessor is the "key" in the data
      },
      {
        Header: "Permission",
        accessor: "action", // accessor is the "key" in the data
      },
      {
        Header: "Result",
        accessor: "accessResult", // accessor is the "key" in the data
      },
      {
        Header: "Access Enforcer",
        accessor: "aclEnforcer", // accessor is the "key" in the data
      },
      {
        Header: "Agent Host Name",
        accessor: "agentHost", // accessor is the "key" in the data
      },
      {
        Header: "Client IP",
        accessor: "clientIP", // accessor is the "key" in the data
      },
      {
        Header: "Cluster Name",
        accessor: "clusterName", // accessor is the "key" in the data
      },
      {
        Header: "Zone Name",
        accessor: "zoneName", // accessor is the "key" in the data
      },
      {
        Header: "Event Count",
        accessor: "eventCount", // accessor is the "key" in the data
      },
      {
        Header: "Tags",
        accessor: "tags", // accessor is the "key" in the data
      },
    ],
    []
  );
  return loader ? <Loader /> : <XATableLayout data={accessListingData} columns={columns} />;
}

export default Access;