import React, { Component, useState, useCallback, useRef } from "react";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";

function Plugin_Status() {
  const [pluginStatusListingData, setPluginStatusLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);

  const fetchPluginStatusInfo = useCallback(async ({ pageSize, pageIndex }) => {
    let logs = [];
    let totalCount = 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
        const logsResp = await fetchApi({
          url: "plugins/plugins/info",
          params: {
            pageSize: pageSize,
            startIndex: pageIndex * pageSize
          }
        });
        logs = logsResp.data.pluginInfoList;
        totalCount = logsResp.data.totalCount;
      } catch (error) {
        console.error(
          `Error occurred while fetching Plugin Status logs! ${error}`
        );
      }
      setPluginStatusLogs(logs);
      setPageCount(Math.ceil(totalCount / pageSize));
      setLoader(false);
    }
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Export Date ( India Standard Time )",
        accessor: "serviceName" // accessor is the "key" in the data
      },
      {
        Header: "Service Name",
        accessor: "serviceType" // accessor is the "key" in the data
      },
      {
        Header: "Plugin ID",
        accessor: "appType" // accessor is the "key" in the data
      },
      {
        Header: "Plugin IP",
        accessor: "hostName" // accessor is the "key" in the data
      },
      {
        Header: "Cluster Name",
        accessor: "ipAddress" // accessor is the "key" in the data
      },
      {
        Header: "Policy Last Update",
        accessor: "lastPolicyUpdateTime" // accessor is the "key" in the data
      },
      {
        Header: "Policy Download",
        accessor: "policyDownloaded" // accessor is the "key" in the data
      },
      {
        Header: "Policy Active",
        accessor: "policyActive" // accessor is the "key" in the data
      },
      {
        Header: "Tag Last Update",
        accessor: "lastTagUpdateTime" // accessor is the "key" in the data
      },
      {
        Header: "Tag Download",
        accessor: "tagDownloaded" // accessor is the "key" in the data
      },
      {
        Header: "Tag Active",
        accessor: "tagActive" // accessor is the "key" in the data
      }
    ],
    []
  );
  return (
    <XATableLayout
      data={pluginStatusListingData}
      columns={columns}
      loading={loader}
      fetchData={fetchPluginStatusInfo}
      pageCount={pageCount}
    />
  );
}

export default Plugin_Status;
