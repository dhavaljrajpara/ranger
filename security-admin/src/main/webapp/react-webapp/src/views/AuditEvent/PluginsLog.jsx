import React, { Component, useState, useCallback, useRef } from "react";
import { Badge } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { AuditFilterEntries } from "Components/CommonComponents";
import moment from "moment-timezone";

function Plugins() {
  const [pluginsListingData, setPluginsLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const [entries, setEntries] = useState([]);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const fetchIdRef = useRef(0);

  const fetchPluginsInfo = useCallback(
    async ({ pageSize, pageIndex }) => {
      let logsResp = [];
      let logs = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      if (fetchId === fetchIdRef.current) {
        try {
          const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
          logsResp = await fetchApi({
            url: "assets/exportAudit",
            params: {
              pageSize: pageSize,
              startIndex: pageIndex * pageSize
            }
          });
          logs = logsResp.data.vXPolicyExportAudits;
          totalCount = logsResp.data.totalCount;
        } catch (error) {
          console.error(`Error occurred while fetching Plugins logs! ${error}`);
        }
        setPluginsLogs(logs);
        setEntries(logsResp.data);
        setPageCount(Math.ceil(totalCount / pageSize));
        setLoader(false);
      }
    },
    [updateTable]
  );
  const refreshTable = () => {
    setPluginsLogs([]);
    setLoader(true);
    setUpdateTable(moment.now());
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "Export Date ( India Standard Time )",
        accessor: "createDate" // accessor is the "key" in the data
      },
      {
        Header: "Service Name",
        accessor: "repositoryName" // accessor is the "key" in the data
      },
      {
        Header: "Plugin ID",
        accessor: "agentId" // accessor is the "key" in the data
      },
      {
        Header: "Plugin IP",
        accessor: "clientIP" // accessor is the "key" in the data
      },
      {
        Header: "Cluster Name",
        accessor: "clusterName" // accessor is the "key" in the data
      },
      {
        Header: "Http Response Code",
        accessor: "httpRetCode",
        Cell: (rawValue) => {
          return (
            <h6>
              <Badge variant="success">{rawValue.value}</Badge>
            </h6>
          );
        }
      },
      {
        Header: "Status",
        accessor: "syncStatus" // accessor is the "key" in the data
      }
    ],
    []
  );
  return (
    <>
      <AuditFilterEntries entries={entries} refreshTable={refreshTable} />
      <br />
      <XATableLayout
        data={pluginsListingData}
        columns={columns}
        loading={loader}
        fetchData={fetchPluginsInfo}
        pageCount={pageCount}
      />
    </>
  );
}

export default Plugins;
