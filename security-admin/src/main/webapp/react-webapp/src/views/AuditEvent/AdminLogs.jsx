import React, { useState, useCallback, useRef, useEffect } from "react";
import { Badge } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { fetchApi } from "Utils/fetchAPI";
import { ClassTypes, enumValueToLabel } from "../../utils/XAEnums";
import dateFormat from "dateformat";
import AdminModal from "./AdminModal";
import { AuditFilterEntries } from "Components/CommonComponents";
import OperationAdminModal from "./OperationAdminModal";
import moment from "moment-timezone";
import { capitalize, startCase, toLower } from "lodash";

function Admin() {
  const [adminListingData, setAdminLogs] = useState([]);

  const [sessionId, setSessionId] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [showmodal, setShowModal] = useState(false);
  const [entries, setEntries] = useState([]);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const [showrowmodal, setShowRowModal] = useState(false);
  // const [showview, setShowView] = useState(null);
  const [rowdata, setRowData] = useState([]);
  const fetchIdRef = useRef(0);

  const handleClose = () => setShowModal(false);
  const handleClosed = () => setShowRowModal(false);

  const rowModal = async (row) => {
    const { original = {} } = row;
    // setShowView(original.objectId);
    original.objectId;
    setShowRowModal(true);
    setRowData(original);
  };

  const fetchAdminLogsInfo = useCallback(
    async ({ pageSize, pageIndex }) => {
      let logsResp = [];
      let adminlogs = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      if (fetchId === fetchIdRef.current) {
        try {
          logsResp = await fetchApi({
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
        setEntries(logsResp.data);
        setPageCount(Math.ceil(totalCount / pageSize));
        setLoader(false);
      }
    },
    [updateTable]
  );

  const refreshTable = () => {
    setAdminLogs([]);
    setLoader(true);
    setUpdateTable(moment.now());
  };

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
              operation = (
                <span>
                  Service {action}d <strong>{objectname}</strong>
                </span>
              );
            else if (
              classtype == ClassTypes.CLASS_TYPE_XA_RESOURCE.value ||
              classtype == ClassTypes.CLASS_TYPE_RANGER_POLICY.value
            )
              operation = (
                <span>
                  Policy {action}d <strong>{objectname}</strong>
                </span>
              );
            else if (classtype == ClassTypes.CLASS_TYPE_XA_USER.value)
              operation = (
                <span>
                  User {action}d <strong>{objectname}</strong>
                </span>
              );
            else if (classtype == ClassTypes.CLASS_TYPE_XA_GROUP.value)
              operation = (
                <span>
                  Group {action}d <strong>{objectname}</strong>
                </span>
              );
            else if (classtype == ClassTypes.CLASS_TYPE_USER_PROFILE.value)
              operation = (
                <span>
                  User profile {action}d <strong>{objectname}</strong>
                </span>
              );
            else if (classtype == ClassTypes.CLASS_TYPE_PASSWORD_CHANGE.value)
              operation = (
                <span>
                  User profile {action}d <strong>{objectname}</strong>
                </span>
              );
            else if (
              classtype == ClassTypes.CLASS_TYPE_RANGER_SECURITY_ZONE.value
            )
              operation = (
                <span>
                  Security Zone {action}d <strong>{objectname}</strong>
                </span>
              );
            else if (classtype == ClassTypes.CLASS_TYPE_RANGER_ROLE.value)
              operation = (
                <span>
                  Role {action}d <strong>{objectname}</strong>
                </span>
              );
            return <div className="operation-text">{operation}</div>;
          }
        },
        className: "w-25"
      },
      {
        Header: "Audit Type",
        accessor: "objectClassType",
        Cell: (rawValue) => {
          let classtype = rawValue.row.original.objectClassType;
          var audittype = enumValueToLabel(ClassTypes, classtype);
          return Object.values(audittype.label);
        }
      },
      {
        Header: "User",
        accessor: "owner"
      },
      {
        Header: "Date ( India Standard Time )",
        accessor: "createDate",
        Cell: (rawValue) => {
          const date = rawValue.value;
          const newdate = dateFormat(date, "mm/dd/yyyy hh:MM:ss TT");
          return newdate;
        }
      },
      {
        Header: "Actions",
        accessor: "action",
        Cell: (rawValue) => {
          var operation = "";
          if (rawValue.value == "create") {
            operation = (
              <h6>
                <Badge variant="success">{capitalize(rawValue.value)}</Badge>
              </h6>
            );
          } else if (rawValue.value == "update") {
            operation = (
              <h6>
                <Badge variant="warning">{capitalize(rawValue.value)}</Badge>
              </h6>
            );
          } else if (rawValue.value == "delete") {
            operation = (
              <h6>
                <Badge variant="danger">{capitalize(rawValue.value)}</Badge>
              </h6>
            );
          } else if (rawValue.value == "IMPORT START") {
            operation = (
              <h6>
                <Badge variant="info">{capitalize(rawValue.value)}</Badge>
              </h6>
            );
          } else if (rawValue.value == "IMPORT END") {
            operation = (
              <h6>
                <Badge variant="info">{capitalize(rawValue.value)}</Badge>
              </h6>
            );
          } else {
            operation = (
              <h6>
                <Badge variant="secondary">
                  {startCase(toLower(rawValue.value))}
                </Badge>{" "}
              </h6>
            );
          }
          return operation;
        }
      },
      {
        Header: "Session ID",
        accessor: "sessionId",
        Cell: (rawValue) => {
          var sessionId = rawValue.value;
          if (sessionId != undefined) {
            return (
              <div className="text-center">
                <a
                  role="button"
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(sessionId);
                  }}
                >
                  {sessionId}
                </a>
              </div>
            );
          } else {
            return <div className="text-center">--</div>;
          }
        }
      }
    ],
    []
  );

  return (
    <>
      <AuditFilterEntries entries={entries} refreshTable={refreshTable} />
      <br />
      <br />
      <XATableLayout
        data={adminListingData}
        columns={columns}
        fetchData={fetchAdminLogsInfo}
        totalCount={entries.totalCount}
        pageCount={pageCount}
        loading={loader}
        getRowProps={(row) => ({
          onClick: () => rowModal(row)
        })}
      />

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
    </>
  );
}

export default Admin;
