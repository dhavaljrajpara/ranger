import React, { useState, useCallback, useRef } from "react";
import { Badge } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";
import { fetchApi } from "Utils/fetchAPI";
import { ClassTypes, enumValueToLabel } from "../../utils/XAEnums";
import dateFormat from "dateformat";
import AdminModal from "./AdminModal";

function Admin() {
  const [adminListingData, setAdminLogs] = useState([]);
  const [sessionId, setSessionId] = useState([]);
  // const [authSession, setAuthSession] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [showmodal, setShowModal] = useState(false);
  const fetchIdRef = useRef(0);

  const handleClose = () => setShowModal(false);

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
              <Badge variant="success">
                {" "}
                {rawValue.value.charAt(0).toUpperCase() +
                  rawValue.value.slice(1)}{" "}
              </Badge>
            );
          } else if (rawValue.value == "update") {
            operation = (
              <Badge variant="warning">
                {" "}
                {rawValue.value.charAt(0).toUpperCase() +
                  rawValue.value.slice(1)}{" "}
              </Badge>
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
              <Badge variant="info">
                {" "}
                {rawValue.value.charAt(0).toUpperCase() +
                  rawValue.value.slice(1)}{" "}
              </Badge>
            );
          } else if (rawValue.value == "IMPORT END") {
            operation = (
              <Badge variant="info">
                {" "}
                {rawValue.value.charAt(0).toUpperCase() +
                  rawValue.value.slice(1)}{" "}
              </Badge>
            );
          } else {
            operation = <Badge variant="secondary"> {rawValue.value} </Badge>;
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
                onClick={() => {
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

  return loader ? (
    <Loader />
  ) : (
    <div>
      <div>
        <XATableLayout
          data={adminListingData}
          columns={columns}
          fetchData={fetchAdminLogsInfo}
          pageCount={pageCount}
        />
      </div>
      <AdminModal
        show={showmodal}
        data={sessionId}
        onHide={handleClose}
      ></AdminModal>
      )
    </div>
  );
}

export default Admin;
