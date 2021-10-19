import React, { Component, useState, useEffect } from "react";
import XATableLayout from "Components/XATableLayout";
import {Loader} from "Components/CommonComponents";


function User_Sync() {
  const [userSyncListingData, setUserSyncLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    fetchUserSyncInfo();
  }, []);

  const fetchUserSyncInfo = async () => {
    let logs = [];
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      const logsResp = await fetchApi({
        url: "assets/ugsyncAudits",
      });
      logs = logsResp.data.vxUgsyncAuditInfoList
    } catch (error) {
      console.error(
        `Error occurred while fetching User Sync logs! ${error}`
      );
    }
    setUserSyncLogs(logs);
    setLoader(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "User Name",
        accessor: "userName", // accessor is the "key" in the data
      },
      {
        Header: "Sync Source",
        accessor: "syncSource", // accessor is the "key" in the data
      },
      {
        Header: "Users",
        accessor: "noOfNewUsers", // accessor is the "key" in the data
      },
      {
        Header: "Groups",
        accessor: "noOfNewGroups", // accessor is the "key" in the data
      },
      {
        Header: "Users",
        accessor: "noOfModifiedUsers", // accessor is the "key" in the data
      },
      {
        Header: "Groups",
        accessor: "noOfModifiedGroups", // accessor is the "key" in the data
      },
      {
        Header: "Event Time",
        accessor: "eventTime", // accessor is the "key" in the data
      },
      {
        Header: "Sync Details",
        accessor: "syncSourceDetail", // accessor is the "key" in the data
      },
    ],
    []
  );
  return loader ? <Loader /> : <XATableLayout data={userSyncListingData} columns={columns} />;
}

export default User_Sync;