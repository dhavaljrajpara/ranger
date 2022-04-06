import React, { useState, useCallback, useRef, useEffect } from "react";
import { Badge } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { fetchApi } from "Utils/fetchAPI";
import { ClassTypes, enumValueToLabel } from "../../utils/XAEnums";
import dateFormat from "dateformat";
import AdminModal from "./AdminModal";
import OperationAdminModal from "./OperationAdminModal";

function Admin() {
  const [adminListingData, setAdminLogs] = useState([]);

  const [sessionId, setSessionId] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [showmodal, setShowModal] = useState(false);
  const [showrowmodal, setShowRowModal] = useState(false);
  const [showview, setShowView] = useState(null);
  const [rowdata, setRowData] = useState([]);
  const fetchIdRef = useRef(0);

  const handleClose = () => setShowModal(false);
  const handleClosed = () => setShowRowModal(false);

  const rowModal = async (row) => {
    const { original = {} } = row;
    setShowView(original.objectId);
    setShowRowModal(true);
    setRowData(original);
  };

  const fetchAdminLogsInfo = useCallback(async ({ pageSize, pageIndex }) => {
    let adminlogs = [];
    let totalCount = 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        const logsResp = await fetchApi({
          url: "assets/report",
          params: {
            pageSize: pageSize,
            startIndex: pageIndex * pageSize
          }
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
  }, []);

  // const handleShow = async (sessionId) => {
  //   let authlogs = [];
  //   try {
  //     const authResp = await fetchApi({
  //       url: "xusers/authSessions",
  //       params: {
  //         id: sessionId
  //       }
  //     });
  //     authlogs = authResp.data.vXAuthSessions;
  //   } catch (error) {
  //     console.error(`Error occurred while fetching Admin logs! ${error}`);
  //   }
  //   setShowModal(true);
  //   setAuthSession(authlogs);
  //   setLoader(false);
  // };
  const openModal = (sessionId) => {
    setShowModal(true);
    setSessionId(sessionId);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Operation",
        accessor: "operation",
        Cell: (rawValue) => {
          let classtype = rawValue.row.original.objectClassType;
          let action = rawValue.row.original.action;
          let objectname = rawValue.row.original.objectName;
          // let label = enumValueToLabel(ClassTypes, classtype);
          let operation = "";
          let hasAction = [
            "EXPORT JSON",
            "EXPORT EXCEL",
            "EXPORT CSV",
            "IMPORT START",
            "IMPORT END"
          ];
          if (hasAction.includes(action)) {
            if (
              action == "EXPORT JSON" ||
              action == "EXPORT EXCEL" ||
              action == "EXPORT CSV"
            )
              return "Exported policies";
            else return action;
          } else {
            if (
              classtype == ClassTypes.CLASS_TYPE_XA_ASSET.value ||
              classtype == ClassTypes.CLASS_TYPE_RANGER_SERVICE.value
            )
              operation = "Service " + action + "d " + objectname;
            // "Service " + action + "d " + "<b>" + objectname + "</b>";
            else if (
              classtype == ClassTypes.CLASS_TYPE_XA_RESOURCE.value ||
              classtype == ClassTypes.CLASS_TYPE_RANGER_POLICY.value
            )
              operation = "Policy " + action + "d " + objectname;
            else if (classtype == ClassTypes.CLASS_TYPE_XA_USER.value)
              operation = "User " + action + "d " + objectname;
            else if (classtype == ClassTypes.CLASS_TYPE_XA_GROUP.value)
              operation = "Group " + action + "d " + objectname;
            else if (classtype == ClassTypes.CLASS_TYPE_USER_PROFILE.value)
              operation = "User profile " + action + "d " + objectname;
            else if (classtype == ClassTypes.CLASS_TYPE_PASSWORD_CHANGE.value)
              operation = "User profile " + action + "d " + objectname;
            else if (
              classtype == ClassTypes.CLASS_TYPE_RANGER_SECURITY_ZONE.value
            )
              operation = "Security Zone " + action + "d " + objectname;
            else if (classtype == ClassTypes.CLASS_TYPE_RANGER_ROLE.value)
              operation = "Role " + action + "d " + objectname;
            return operation;
          }
        }
      },
      {
        Header: "Audit Type",
        accessor: "objectClassType", // accessor is the "key" in the data
        Cell: (rawValue) => {
          let classtype = rawValue.row.original.objectClassType;
          var audittype = enumValueToLabel(ClassTypes, classtype);
          return Object.values(audittype.label);
        }
      },
      {
        Header: "User",
        accessor: "owner" // accessor is the "key" in the data
      },
      {
        Header: "Date ( India Standard Time )",
        accessor: "createDate", // accessor is the "key" in the data
        Cell: (rawValue) => {
          const date = rawValue.value;
          const newdate = dateFormat(date, "mm/dd/yyyy hh:MM:ss TT");
          return newdate;
        }
      },
      {
        Header: "Actions",
        accessor: "action", // accessor is the "key" in the data
        Cell: (rawValue) => {
          var operation = "";
          if (rawValue.value == "create") {
            operation = (
              <h6>
                <Badge variant="success">
                  {" "}
                  {rawValue.value.charAt(0).toUpperCase() +
                    rawValue.value.slice(1)}{" "}
                </Badge>
              </h6>
            );
          } else if (rawValue.value == "update") {
            operation = (
              <h6>
                <Badge variant="warning">
                  {" "}
                  {rawValue.value.charAt(0).toUpperCase() +
                    rawValue.value.slice(1)}{" "}
                </Badge>
              </h6>
            );
          } else if (rawValue.value == "delete") {
            operation = (
              <Badge variant="danger">
                {" "}
                {rawValue.value.charAt(0).toUpperCase() +
                  rawValue.value.slice(1)}{" "}
              </Badge>
            );
          } else if (rawValue.value == "IMPORT START") {
            operation = (
              <h6>
                <Badge variant="info">
                  {" "}
                  {rawValue.value.charAt(0).toUpperCase() +
                    rawValue.value.slice(1)}{" "}
                </Badge>
              </h6>
            );
          } else if (rawValue.value == "IMPORT END") {
            operation = (
              <h6>
                <Badge variant="info">
                  {" "}
                  {rawValue.value.charAt(0).toUpperCase() +
                    rawValue.value.slice(1)}{" "}
                </Badge>
              </h6>
            );
          } else {
            operation = (
              <h6>
                <Badge variant="secondary"> {rawValue.value} </Badge>
              </h6>
            );
          }
          return operation;
        }
      },
      {
        Header: "Session ID",
        accessor: "sessionId", // accessor is the "key" in the data
        Cell: (rawValue) => {
          var sessionId = rawValue.value;
          if (sessionId != undefined) {
            return (
              <a
                className="text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(sessionId);
                }}
              >
                {sessionId}
              </a>
            );
          } else {
            return "";
          }
        }
      }
    ],
    []
  );

  return (
    <div>
      <div>
        <XATableLayout
          data={adminListingData}
          columns={columns}
          fetchData={fetchAdminLogsInfo}
          pageCount={pageCount}
          loading={loader}
          getRowProps={(row) => ({
            onClick: () => rowModal(row)
          })}
        />
      </div>
      <AdminModal
        show={showmodal}
        data={sessionId}
        onHide={handleClose}
      ></AdminModal>
      {
        <OperationAdminModal
          show={showrowmodal}
          data={rowdata}
          onHide={handleClosed}
        ></OperationAdminModal>
      }
    </div>
  );
}

export default Admin;
