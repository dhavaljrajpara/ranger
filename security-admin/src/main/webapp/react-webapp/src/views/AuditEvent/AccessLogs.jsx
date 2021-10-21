import React, { Component, useState, useCallback, useRef } from "react";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";

function Access() {
  const [accessListingData, setAccessLogs] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);

  const fetchAccessLogsInfo = useCallback(async ({ pageSize, pageIndex }) => {
    let logs = [];
    let totalCount= 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
        const logsResp = await fetchApi({
          url: "assets/accessAudit",
          params:{
            pageSize: pageSize,
            startIndex: pageIndex * pageSize,
          },
        });
        logs = logsResp.data.vXAccessAudits;
        totalCount = logsResp.data.totalCount;
      } catch (error) {
        console.error(`Error occurred while fetching Access logs! ${error}`);
      }
      setAccessLogs(logs);
      setPageCount(Math.ceil(totalCount / pageSize));
      setLoader(false);
    }
  },[]);

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
  return loader ? (
    <Loader />
  ) : (
    <XATableLayout data={accessListingData} columns={columns} fetchData={fetchAccessLogsInfo} pageCount={pageCount}/>
  );
}

export default Access;