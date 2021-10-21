import React, { Component, useState, useEffect } from "react";
import { Badge, Spinner } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";

function Admin() {
  const [adminListingData, setAdminLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    fetchAdminLogsInfo();
  }, []);

  const fetchAdminLogsInfo = async () => {
    let adminlogs = [];
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      const logsResp = await fetchApi({
        url: "assets/report",
      });
      adminlogs = logsResp.data.vXTrxLogs;
    } catch (error) {
      console.error(`Error occurred while fetching Admin logs! ${error}`);
    }
    setAdminLogs(adminlogs);
    setLoader(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Operation",
        accessor: "operation", // accessor is the "key" in the data
      },
      {
        Header: "Audit Type",
        accessor: "objectClassType", // accessor is the "key" in the data
      },
      {
        Header: "User",
        accessor: "owner", // accessor is the "key" in the data
      },
      {
        Header: "Date ( India Standard Time )",
        accessor: "createDate", // accessor is the "key" in the data
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
    <XATableLayout data={adminListingData} columns={columns} />
  );
}

export default Admin;
