import React, { Component, useState, useEffect } from "react";
import XATableLayout from "Components/XATableLayout";
import {Loader} from "Components/CommonComponents";


function Plugin_Status() {
  const [pluginStatusListingData, setPluginStatusLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    fetchPluginStatusInfo();
  }, []);

  const fetchPluginStatusInfo = async () => {
    let logs = [];
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      const logsResp = await fetchApi({
        url: "plugins/plugins/info",
      });
      logs = logsResp.data.pluginInfoList
    } catch (error) {
      console.error(
        `Error occurred while fetching Plugin Status logs! ${error}`
      );
    }
    setPluginStatusLogs(logs);
    setLoader(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Export Date ( India Standard Time )",
        accessor: "serviceName", // accessor is the "key" in the data
      },
      {
        Header: "Service Name",
        accessor: "serviceType", // accessor is the "key" in the data
      },
      {
        Header: "Plugin ID",
        accessor: "appType", // accessor is the "key" in the data
      },
      {
        Header: "Plugin IP",
        accessor: "hostName", // accessor is the "key" in the data
      },
      {
        Header: "Cluster Name",
        accessor: "ipAddress", // accessor is the "key" in the data
      },
      {
        Header: "Policy Last Update",
        accessor: "lastPolicyUpdateTime", // accessor is the "key" in the data
      },
      {
        Header: "Policy Download",
        accessor: "policyDownloaded", // accessor is the "key" in the data
      },
      {
        Header: "Policy Active",
        accessor: "policyActive", // accessor is the "key" in the data
      },
      {
        Header: "Tag Last Update",
        accessor: "lastTagUpdateTime", // accessor is the "key" in the data
      },
      {
        Header: "Tag Download",
        accessor: "tagDownloaded", // accessor is the "key" in the data
      },
      {
        Header: "Tag Active",
        accessor: "tagActive", // accessor is the "key" in the data
      },
    ],
    []
  );
  return loader ? <Loader /> : <XATableLayout data={pluginStatusListingData} columns={columns} />;
}

export default Plugin_Status;