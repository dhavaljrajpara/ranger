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
        accessor: "createDate"
      },
      {
        Header: "Service Name",
        accessor: "repositoryName"
      },
      {
        Header: "Plugin ID",
        accessor: "agentId"
      },
      {
        Header: "Plugin IP",
        accessor: "clientIP"
      },
      {
        Header: "Cluster Name",
        accessor: "clusterName"
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
        accessor: "syncStatus"
      }
    ],
    []
  );
  return (
    <>
      <AuditFilterEntries entries={entries} refreshTable={refreshTable} />
      <br />
      <br />
      <XATableLayout
        data={pluginsListingData}
        columns={columns}
        loading={loader}
        totalCount={entries.totalCount}
        fetchData={fetchPluginsInfo}
        pageCount={pageCount}
      />
    </>
  );
}

export default Plugins;
