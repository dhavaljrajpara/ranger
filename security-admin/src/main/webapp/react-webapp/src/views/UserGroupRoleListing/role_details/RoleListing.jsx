import React, { Component, useState, useEffect } from "react";
import { Badge, Spinner } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { UserRoles } from "Utils/XAEnums";
import { Loader } from "Components/CommonComponents";

function Roles() {
  const [roleListingData, setRoleData] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    fetchRoleInfo();
  }, []);

  const fetchRoleInfo = async () => {
    let roleData = [];
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      const roleResp = await fetchApi({
        url: "roles/lookup/roles",
      });
      roleData = roleResp.data.roles;
    } catch (error) {
      console.error(`Error occurred while fetching Role list! ${error}`);
    }
    setRoleData(roleData);
    setLoader(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Select",
        accessor: "select", // accessor is the "key" in the data
      },
      {
        Header: "Role Name",
        accessor: "name",
      },
      // {
      //   Header: "Users",
      //   accessor: "users",
      // },
      // {
      //   Header: "Groups",
      //   accessor: "groups",
      // },
      // {
      //   Header: "Roles",
      //   accessor: "roles",
      // },
    ],
    []
  );
  return null;
  return loader ? <Loader /> : <XATableLayout data={roleListingData} columns={columns} />;
}

export default Roles;