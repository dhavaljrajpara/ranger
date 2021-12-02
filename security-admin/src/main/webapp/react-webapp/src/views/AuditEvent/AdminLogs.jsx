import React, { Component, useState, useCallback, useRef } from "react";
import { Badge, Spinner } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";
import { ClassTypes } from "../../utils/XAEnums";
import dateFormat from "dateformat";

function Admin() {
  const [adminListingData, setAdminLogs] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);

  const fetchAdminLogsInfo = useCallback(async ({ pageSize, pageIndex }) => {
    let adminlogs = [];
    let totalCount= 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
        const logsResp = await fetchApi({
          url: "assets/report",
          params:{
            pageSize: pageSize,
            startIndex: pageIndex * pageSize,
          },
        });
        adminlogs = logsResp.data.vXTrxLogs;
        totalCount = logsResp.data.totalCount;
      } catch (error) {
        console.error(`Error occurred while fetching Admin logs! ${error}`);
      }
      setAdminLogs(adminlogs);
      setPageCount(Math.ceil(totalCount / pageSize));
      setLoader(false);
    }
  },[]);
  const columns = React.useMemo(
    () => [
      {
        Header: "Operation",
        accessor: "operation", // accessor is the "key" in the data
      },
      {
        Header: "Audit Type",
        accessor: "objectClassType", // accessor is the "key" in the data
        Cell: (rawValue) => {
          var label = "";
          if (rawValue.value == 1057) {
            return (label = ClassTypes.CLASS_TYPE_RANGER_ROLE.label);
          } else if (rawValue.value == 1020) {
            return (label = ClassTypes.CLASS_TYPE_RANGER_POLICY.label);
          } else if (rawValue.value == 1003) {
            return (label = ClassTypes.CLASS_TYPE_XA_USER.label);
          } else if (rawValue.value == 1030) {
            return (label = ClassTypes.CLASS_TYPE_RANGER_SERVICE.label);
          } else if (rawValue.value == 7) {
            return (label = ClassTypes.CLASS_TYPE_PASSWORD_CHANGE.label);
          }
          return label;
        },
      },
      {
        Header: "User",
        accessor: "owner", // accessor is the "key" in the data
      },
      {
        Header: "Date ( India Standard Time )",
        accessor: "createDate", // accessor is the "key" in the data
        Cell: (rawValue) => {
          const date = rawValue.value;
          const newdate = dateFormat(date, "mm/dd/yyyy hh:MM:ss TT");
          return newdate;
        },
      },
      {
        Header: "Actions",
        accessor: "action", // accessor is the "key" in the data
        Cell: (rawValue) => {
          var html = "";
          if (rawValue.value == "create") {
            html = (
              <Badge variant="success">
                {" "}
                {rawValue.value.charAt(0).toUpperCase() +
                  rawValue.value.slice(1)}{" "}
              </Badge>
            );
          } else if (rawValue.value == "update") {
            html = (
              <Badge variant="warning">
                {" "}
                {rawValue.value.charAt(0).toUpperCase() +
                  rawValue.value.slice(1)}{" "}
              </Badge>
            );
          } else if (rawValue.value == "delete") {
            html = (
              <Badge variant="danger">
                {" "}
                {rawValue.value.charAt(0).toUpperCase() +
                  rawValue.value.slice(1)}{" "}
              </Badge>
            );
          } else if (rawValue.value == "IMPORT START") {
            html = (
              <Badge variant="info">
                {" "}
                {rawValue.value.charAt(0).toUpperCase() +
                  rawValue.value.slice(1)}{" "}
              </Badge>
            );
          } else if (rawValue.value == "IMPORT END") {
            html = (
              <Badge variant="info">
                {" "}
                {rawValue.value.charAt(0).toUpperCase() +
                  rawValue.value.slice(1)}{" "}
              </Badge>
            );
          } else {
            html = <Badge variant="secondary"> {rawValue.value} </Badge>;
          }
          return html;
        },
      },
      {
        Header: "Session ID",
        accessor: "sessionId", // accessor is the "key" in the data
      },
    ],
    []
  );
  return loader ? (
    <Loader />
  ) : (
    <XATableLayout data={adminListingData} columns={columns} fetchData={fetchAdminLogsInfo} pageCount={pageCount}/>
  );
}

export default Admin;