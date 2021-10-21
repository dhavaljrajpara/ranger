import React, { Component, useState, useEffect } from "react";
import { Badge, Spinner } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { GroupSource } from "../../../utils/XAEnums";
import { GroupTypes } from "../../../utils/XAEnums";
import { VisibilityStatus } from "Utils/XAEnums";
import { Loader } from "Components/CommonComponents";

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
      groupData = groupResp.data.vXGroups;
    } catch (error) {
      console.error(`Error occurred while fetching Group list! ${error}`);
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
        Cell: (rawValue) => {
          if (rawValue.value !== null && rawValue.value !== undefined) {
            if (rawValue.value == GroupSource.XA_PORTAL_GROUP.value)
              return (
                <Badge variant="success">
                  {GroupTypes.GROUP_INTERNAL.label}{" "}
                </Badge>
              );
            else
              return (
                <Badge className="externalbadge">
                  {GroupTypes.GROUP_EXTERNAL.label}{" "}
                </Badge>
              );
          } else return "--";
        },
      },
      {
        Header: "Sync Source",
        accessor: "syncSource",
        Cell: (rawValue) => {
          if (rawValue.value) {
            return <Badge variant="success">{rawValue} </Badge>;
          } else return "--";
        },
      },
      {
        Header: "Visibility",
        accessor: "isVisible",
        Cell: (rawValue) => {
          if (rawValue.value) {
            if (rawValue)
              return (
                <Badge variant="success">
                  {VisibilityStatus.STATUS_VISIBLE.label}{" "}
                </Badge>
              );
            else
              return (
                <Badge className="hiddenbadge">
                  {VisibilityStatus.STATUS_HIDDEN.label}{" "}
                </Badge>
              );
          } else return "--";
        },
      },
      {
        Header: "Users",
        accessor: "member",
        Cell: (model) => {
          return (
            <button
              className="userViewicon"
              title="View Users"
              data-js="showUserList"
              data-name={model.name}
              data-id={model.id}
            >
              <i className="fa-fw fa fa-group"> </i>
            </button>
          );
        },
      },
      {
        Header: "Sync Details",
        accessor: "otherAttributes",
        Cell: (rawValue, model) => {
          if (rawValue.value) {
            return (
              <button
                data-id="syncDetailes"
                data-for="users"
                title="Sync Details"
                id={model.id}
              >
                <i className="fa-fw fa fa-eye"> </i>
              </button>
            );
          } else {
            return " -- ";
          }
        },
      },
    ],
    []
  );
  return loader ? (
    <Loader />
  ) : (
    <XATableLayout data={groupListingData} columns={columns} />
  );
}

export default Groups;
