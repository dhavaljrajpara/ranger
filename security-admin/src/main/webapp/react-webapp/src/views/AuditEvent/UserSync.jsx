import React, { Component, useState, useCallback, useRef } from "react";
import { Badge } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";

function User_Sync() {
  const [userSyncListingData, setUserSyncLogs] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);

  const fetchUserSyncInfo = useCallback(async ({ pageSize, pageIndex }) => {
    let logs = [];
    let totalCount = 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
        const logsResp = await fetchApi({
          url: "assets/ugsyncAudits",
          params: {
            pageSize: pageSize,
            startIndex: pageIndex * pageSize
          }
        });
        logs = logsResp.data.vxUgsyncAuditInfoList;
        totalCount = logsResp.data.totalCount;
      } catch (error) {
        console.error(`Error occurred while fetching User Sync logs! ${error}`);
      }
      setUserSyncLogs(logs);
      setPageCount(Math.ceil(totalCount / pageSize));
      setLoader(false);
    }
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "User Name",
        accessor: "userName" // accessor is the "key" in the data
      },
      {
        Header: "Sync Source",
        accessor: "syncSource",
        Cell: (rawValue) => {
          return (
            <h6>
              <Badge variant="success">{rawValue.value}</Badge>
            </h6>
          );
        }
      },
      {
        Header: "Users",
        accessor: "noOfNewUsers" // accessor is the "key" in the data
      },
      {
        Header: "Groups",
        accessor: "noOfNewGroups" // accessor is the "key" in the data
      },
      {
        Header: "Users",
        accessor: "noOfModifiedUsers" // accessor is the "key" in the data
      },
      {
        Header: "Groups",
        accessor: "noOfModifiedGroups" // accessor is the "key" in the data
      },
      {
        Header: "Event Time",
        accessor: "eventTime" // accessor is the "key" in the data
      },
      {
        Header: "Sync Details",
        accessor: "syncSourceDetail" // accessor is the "key" in the data
      }
    ],
    []
  );
  return loader ? (
    <Loader />
  ) : (
    <XATableLayout
      data={userSyncListingData}
      columns={columns}
      fetchData={fetchUserSyncInfo}
      pageCount={pageCount}
    />
  );
}

export default User_Sync;
