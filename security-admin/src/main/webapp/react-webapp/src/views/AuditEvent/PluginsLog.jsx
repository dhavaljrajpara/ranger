import React, { Component, useState, useEffect } from "react";
import XATableLayout from "Components/XATableLayout";
import {Loader} from "Components/CommonComponents";


function Plugins() {
  const [pluginsListingData, setPluginsLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    fetchPluginsInfo();
  }, []);

  const fetchPluginsInfo = async () => {
    let logs = [];
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      const logsResp = await fetchApi({
        url: "assets/exportAudit",
      });
      logs = logsResp.data.vXPolicyExportAudits
    } catch (error) {
      console.error(
        `Error occurred while fetching Plugins logs! ${error}`
      );
    }
    setPluginsLogs(logs);
    setLoader(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Export Date ( India Standard Time )",
        accessor: "createDate", // accessor is the "key" in the data
      },
      {
        Header: "Service Name",
        accessor: "repositoryName", // accessor is the "key" in the data
      },
      {
        Header: "Plugin ID",
        accessor: "agentId", // accessor is the "key" in the data
      },
      {
        Header: "Plugin IP",
        accessor: "clientIP", // accessor is the "key" in the data
      },
      {
        Header: "Cluster Name",
        accessor: "clusterName", // accessor is the "key" in the data
      },
      {
        Header: "Http Response Code",
        accessor: "httpRetCode", // accessor is the "key" in the data
      },
      {
        Header: "Status",
        accessor: "syncStatus", // accessor is the "key" in the data
      },
    ],
    []
  );
  return loader ? <Loader /> : <XATableLayout data={pluginsListingData} columns={columns} />;
}

export default Plugins;