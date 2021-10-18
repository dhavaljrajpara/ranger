import React, { Component, useState, useEffect } from "react";
import { Badge, Spinner } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import {UserRoles} from 'Utils/XAEnums';
import {Loader} from "Components/CommonComponents";


function Groups() {
  const [groupListingData, setGroupData] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    fetchGroupInfo();
  }, []);

  const fetchGroupInfo = async () => {
    let groupData = [];
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      const groupResp = await fetchApi({
        url: "xusers/groups",
      });
      groupData = groupResp.data.vXGroups
    } catch (error) {
      console.error(
        `Error occurred while fetching Group list! ${error}`
      );
    }
    setGroupData(groupData);
    setLoader(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Select",
        accessor: "select", // accessor is the "key" in the data
      },
      {
        Header: "Group Name",
        accessor: "name",
      },
      {
        Header: "Group Source",
        accessor: "groupSource", // accessor is the "key" in the data
      },
      {
        Header: "Sync Source",
        accessor: "syncSource",
      },
      {
        Header: "Groups",
        accessor: "groupNameList", // accessor is the "key" in the data
      },
      {
        Header: "Visibility",
        accessor: "isVisible",
      },
      {
        Header: "Users",
        accessor: "member",
      },
      {
        Header: "Sync Details",
        accessor: "otherAttributes",
      },
    ],
    []
  );
  return loader ? <Loader /> : <XATableLayout data={groupListingData} columns={columns} />;
}

export default Groups;