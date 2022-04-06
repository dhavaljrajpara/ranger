import React, { Component, useState, useCallback, useRef } from "react";
import { Badge } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import dateFormat from "dateformat";

function Access() {
  const [accessListingData, setAccessLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);

  const fetchAccessLogsInfo = useCallback(async ({ pageSize, pageIndex }) => {
    let logs = [];
    let totalCount = 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
        const logsResp = await fetchApi({
          url: "assets/accessAudit",
          params: {
            pageSize: pageSize,
            startIndex: pageIndex * pageSize
          }
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
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Policy ID",
        accessor: "policyId",
        Cell: (rawValue) => {
          return rawValue.value == -1 ? (
            "--"
          ) : (
            <a className="text-primary">{rawValue.value}</a>
          );
        }
      },
      {
        Header: "Policy Version",
        accessor: "policyVersion",
        Cell: (rawValue) => {
          return rawValue.value !== undefined ? rawValue.value : "--";
        }
      },
      {
        Header: "Event Time",
        accessor: "eventTime",
        Cell: (rawValue) => {
          return dateFormat(rawValue.value, "mm/dd/yyyy h:MM:ss TT");
        }
      },
      {
        Header: "Application",
        accessor: "agentId" // accessor is the "key" in the data
      },
      {
        Header: "User",
        accessor: "requestUser" // accessor is the "key" in the data
      },
      {
        Header: "Service (Name / Type)",
        accessor: (s) => (
          <div>
            <div>{s.repoName}</div>
            <div className="bt-1"> {s.serviceType}</div>
          </div>
        )
      },
      {
        Header: "Resource (Name / Type)",
        accessor: (r) => (
          <div>
            <div className="resource-text">{r.resourcePath}</div>
            <div className="bt-1"> {r.resourceType}</div>
          </div>
        )
      },
      {
        Header: "Access Type",
        accessor: "accessType" // accessor is the "key" in the data
      },
      {
        Header: "Permission",
        accessor: "action",
        Cell: (rawValue) => {
          return (
            <h6>
              <Badge variant="info">{rawValue.value}</Badge>
            </h6>
          );
        }
      },
      {
        Header: "Result",
        accessor: "accessResult",
        Cell: (rawValue) => {
          if (rawValue.value == 1) {
            return (
              <h6>
                <Badge variant="success">Allowed</Badge>
              </h6>
            );
          } else
            return (
              <h6>
                <Badge variant="danger">Denied</Badge>
              </h6>
            );
        }
      },
      {
        Header: "Access Enforcer",
        accessor: "aclEnforcer" // accessor is the "key" in the data
      },
      {
        Header: "Agent Host Name",
        accessor: "agentHost" // accessor is the "key" in the data
      },
      {
        Header: "Client IP",
        accessor: "clientIP" // accessor is the "key" in the data
      },
      {
        Header: "Cluster Name",
        accessor: "clusterName" // accessor is the "key" in the data
      },
      {
        Header: "Zone Name",
        accessor: "zoneName" // accessor is the "key" in the data
      },
      {
        Header: "Event Count",
        accessor: "eventCount" // accessor is the "key" in the data
      },
      {
        Header: "Tags",
        accessor: "tags",
        Cell: (rawValue) => {
          return rawValue.value !== undefined ? rawValue.value : "--";
        }
      }
    ],
    []
  );
  return (
    <XATableLayout
      data={accessListingData}
      columns={columns}
      fetchData={fetchAccessLogsInfo}
      loading={loader}
      pageCount={pageCount}
    />
  );
}

export default Access;
