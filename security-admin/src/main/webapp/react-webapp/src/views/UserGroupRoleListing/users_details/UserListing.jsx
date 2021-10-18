import React, { Component, useState, useEffect } from "react";
import { Badge, Spinner } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import {UserRoles} from 'Utils/XAEnums';
import {Loader} from "Components/CommonComponents";


function Users() {
  const [userListingData, setUserData] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    let userData = [];
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      const userResp = await fetchApi({
        url: "xusers/users",
      });
      userData = userResp.data.vXUsers
    } catch (error) {
      console.error(
        `Error occurred while fetching User list! ${error}`
      );
    }
    setUserData(userData);
    setLoader(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Column 1",
        accessor: "select", // accessor is the "key" in the data
      },
      {
        Header: "User Name",
        accessor: "name",
      },
      {
        Header: "Email Address",
        accessor: "emailAddress", // accessor is the "key" in the data
      },
      {
        Header: "Role",
        accessor: "userRoleList",
        Cell: (rawValue) => {
            if(rawValue.value && rawValue.value.length > 0){
                let role = rawValue.value[0];
                return <Badge variant="info">{UserRoles[role].label} </Badge>
            }
            return '--';
        }
      },
      {
        Header: "User Source",
        accessor: "userSource", // accessor is the "key" in the data
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
        Header: "Sync Details",
        accessor: "otherAttributes",
      },
    ],
    []
  );
  return loader ? <Loader /> : <XATableLayout data={userListingData} columns={columns} />;
}

export default Users;