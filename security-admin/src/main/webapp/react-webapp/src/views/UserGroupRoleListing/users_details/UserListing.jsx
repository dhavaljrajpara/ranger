import React, { Component, useState, useCallback, useRef } from "react";
import { Badge, Button, Row, Col } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { UserRoles } from "Utils/XAEnums";
import { UserSource } from "Utils/XAEnums";
import { UserTypes } from "Utils/XAEnums";
import { VisibilityStatus } from "Utils/XAEnums";
import { Loader } from "Components/CommonComponents";
import { useHistory } from "react-router-dom";

function Users() {
  let history = useHistory();
  const [userListingData, setUserData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0)

  const fetchUserInfo = useCallback(async ({ pageSize, pageIndex }) => {
    let userData = [];
    let totalCount= 0;
    const fetchId = ++fetchIdRef.current
    if (fetchId === fetchIdRef.current) {
      try {
        const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
        const userResp = await fetchApi({
          url: "xusers/users",
          params:{
            pageSize: pageSize,
            startIndex: pageIndex * pageSize,
          }
        });
        userData = userResp.data.vXUsers;
        totalCount = userResp.data.totalCount;
      } catch (error) {
        console.error(`Error occurred while fetching User list! ${error}`);
      }
      setUserData(userData);
      setPageCount(Math.ceil(totalCount / pageSize));
      setLoader(false);
    }
  }, []);


  const columns = React.useMemo(
    () => [
      {
        Header: "Select",
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
          if (rawValue.value && rawValue.value.length > 0) {
            let role = rawValue.value[0];
            return <Badge variant="info">{UserRoles[role].label} </Badge>;
          }
          return "--";
        },
      },
      {
        Header: "User Source",
        accessor: "userSource", // accessor is the "key" in the data
        Cell: (rawValue) => {
          if (rawValue.value !== null && rawValue.value !== undefined) {
            if (rawValue.value == UserSource.XA_PORTAL_USER.value)
              return (
                <Badge variant="success">
                  {UserTypes.USER_INTERNAL.label}{" "}
                </Badge>
              );
            else
              return (
                <Badge className="externalbadge">
                  {UserTypes.USER_EXTERNAL.label}{" "}
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
            return <Badge variant="success">{rawValue.value} </Badge>;
          } else return "--";
        },
      },
      {
        Header: "Groups",
        accessor: "groupNameList", // accessor is the "key" in the data
        /*Cell:(rawValue, model) => {
          if(rawValue.value && rawValue.value.length > 0){
            Object.keys(model).map((rawValue, name)=>{

            })
          }
          else {
            return "--";
          }
        },*/
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
                <Badge variant="info">
                  {VisibilityStatus.STATUS_HIDDEN.label}{" "}
                </Badge>
              );
          } else return "--";
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
  const addUser = () => {
    history.push("/userCreate");
  }
  return loader ? (
    <Loader />
  ) : (
    <div>
      <h1>User List</h1>
      <Row className='mb-4'>
        <Col md={9}></Col>
        <Col md={3}><Button onClick={addUser}>Add User</Button></Col>
      </Row>
      <div>
        <XATableLayout data={userListingData} columns={columns} fetchData={fetchUserInfo} pageCount={pageCount}/>
      </div>
    </div>
  );
}

export default Users;
