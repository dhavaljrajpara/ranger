import React, { Component, useState, useCallback, useRef } from "react";
import { Badge, Button, Row, Col, Table, Modal } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import dateFormat from "dateformat";
import {
  AuditFilterEntries,
  CustomPopoverOnClick,
  CustomPopoverTagOnClick
} from "Components/CommonComponents";
import moment from "moment-timezone";
import AccessLogsTable from "./AccessLogsTable";
import { isEmpty, isUndefined } from "lodash";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { AccessMoreLess } from "Components/CommonComponents";

function Access() {
  const [accessListingData, setAccessLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const [entries, setEntries] = useState([]);
  const [showrowmodal, setShowRowModal] = useState(false);
  const [rowdata, setRowData] = useState([]);
  const [checked, setChecked] = useState(false);
  const fetchIdRef = useRef(0);

  const fetchAccessLogsInfo = useCallback(
    async ({ pageSize, pageIndex }) => {
      let logsResp = [];
      let logs = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      if (fetchId === fetchIdRef.current) {
        try {
          const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
          logsResp = await fetchApi({
            url: "assets/accessAudit",
            params: {
              pageSize: pageSize,
              startIndex: pageIndex * pageSize,
              policyId: 9
            }
          });
          logs = logsResp.data.vXAccessAudits;
          totalCount = logsResp.data.totalCount;
        } catch (error) {
          console.error(`Error occurred while fetching Access logs! ${error}`);
        }
        setAccessLogs(logs);
        setEntries(logsResp.data);
        setPageCount(Math.ceil(totalCount / pageSize));
        setLoader(false);
      }
    },
    [updateTable]
  );

  const toggleChange = () => {
    setChecked(!checked);
    setAccessLogs([]);
    setLoader(true);
    setUpdateTable(moment.now());
  };

  const handleClose = () => setShowRowModal(false);
  const rowModal = (row) => {
    setShowRowModal(true);
    setRowData(row.original);
  };
  const refreshTable = () => {
    setAccessLogs([]);
    setLoader(true);
    setUpdateTable(moment.now());
  };

  const rsrcContent = (requestData) => {
    const copyText = (val) => {
      !isEmpty(val) && toast.success("User list copied succesfully!!");
      return val;
    };
    return (
      <Row>
        <Col sm={9} className="popoverspan">
          <span>{requestData}</span>
        </Col>
        <Col sm={3} className="pull-right">
          <button
            className="pull-right link-tag query-icon btn btn-sm"
            size="sm"
            variant="link"
            title="Copied!"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(copyText(requestData));
            }}
          >
            <i className="fa-fw fa fa-copy"> </i>
          </button>
        </Col>
      </Row>
    );
  };

  const rsrcTagContent = (requestData) => {
    return (
      <>
        <Table bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(requestData).map((obj, idx) => {
              return (
                <tr key={idx}>
                  <td>{obj}</td>
                  <td>{requestData[obj]}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    );
  };

  const rsrctitle = (title) => {
    let filterTitle = "";
    if (title == "hive") {
      filterTitle = `Hive Query`;
    }
    if (title == "hbase") {
      filterTitle = `HBase Audit Data`;
    }
    if (title == "hdfs") {
      filterTitle = `HDFS Operation Name`;
    }
    return filterTitle;
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Policy ID",
        accessor: "policyId",
        Cell: (rawValue) => {
          return rawValue.value == -1 ? (
            "--"
          ) : (
            <a className="text-primary">{rawValue.value}</a>
          );
        }
      },
      {
        Header: "Policy Version",
        accessor: "policyVersion",
        Cell: (rawValue) => {
          return rawValue.value !== undefined ? rawValue.value : "--";
        }
      },
      {
        Header: "Event Time",
        accessor: "eventTime",
        Cell: (rawValue) => {
          return dateFormat(rawValue.value, "mm/dd/yyyy h:MM:ss TT");
        }
      },
      {
        Header: "Application",
        accessor: "agentId"
      },
      {
        Header: "User",
        accessor: "requestUser"
      },
      {
        Header: "Service (Name / Type)",
        accessor: (s) => (
          <div>
            <div className="text-center" title={s.repoDisplayName}>
              {s.repoDisplayName}
            </div>
            <div className="bt-1 text-center" title={s.serviceTypeDisplayName}>
              {" "}
              {s.serviceTypeDisplayName}
            </div>
          </div>
        )
      },
      {
        Header: "Resource (Name / Type)",
        accessor: (r) => (
          <>
            <div style={{ display: "flex", flexWrap: "nowrap", margin: "0" }}>
              <div className="pull-left resource-text" title={r.resourcePath}>
                {r.resourcePath}
              </div>

              <div>
                {!isEmpty(r.requestData) && (
                  <CustomPopoverOnClick
                    icon="fa-fw fa fa-table "
                    title={rsrctitle(r.serviceType)}
                    content={rsrcContent(r.requestData)}
                    placement="left"
                    trigger={["click", "focus"]}
                  ></CustomPopoverOnClick>
                )}
              </div>
            </div>
            {!isEmpty(r.resourcePath) ? (
              <div className="bt-1 text-center" title={r.resourceType}>
                {r.resourceType}
              </div>
            ) : (
              <div className="text-center">--</div>
            )}
          </>
        )
      },
      {
        Header: "Access Type",
        accessor: "accessType"
      },
      {
        Header: "Permission",
        accessor: "action",
        Cell: (rawValue) => {
          return (
            <h6>
              <Badge variant="info">{rawValue.value}</Badge>
            </h6>
          );
        }
      },
      {
        Header: "Result",
        accessor: "accessResult",
        Cell: (rawValue) => {
          if (rawValue.value == 1) {
            return (
              <h6>
                <Badge variant="success">Allowed</Badge>
              </h6>
            );
          } else
            return (
              <h6>
                <Badge variant="danger">Denied</Badge>
              </h6>
            );
        }
      },
      {
        Header: "Access Enforcer",
        accessor: "aclEnforcer"
      },
      {
        Header: "Agent Host Name",
        accessor: "agentHost"
      },
      {
        Header: "Client IP",
        accessor: "clientIP"
      },
      {
        Header: "Cluster Name",
        accessor: "clusterName"
      },
      {
        Header: "Zone Name",
        accessor: "zoneName",
        Cell: (rawValue) => {
          if (!isUndefined(rawValue.value) || !isEmpty(rawValue.value)) {
            return (
              <h6>
                <Badge bg="dark">{rawValue.value}</Badge>
              </h6>
            );
          } else return "--";
        }
      },
      {
        Header: "Event Count",
        accessor: "eventCount"
      },
      {
        Header: "Tags",
        accessor: "tags",
        Cell: (rawValue) => {
          let Tags = [];
          if (!isEmpty(rawValue.value)) {
            Tags = JSON.parse(rawValue.value).map((tag) => {
              if (tag.attributes && !isEmpty(tag.attributes)) {
                return (
                  <CustomPopoverTagOnClick
                    icon="text-info"
                    data={tag.type}
                    title={"Atrribute Details"}
                    content={rsrcTagContent(tag.attributes)}
                    placement="left"
                    trigger={["click", "focus"]}
                  ></CustomPopoverTagOnClick>
                );
              }

              return tag.type;
            });
          } else {
            return "--";
          }
          return (
            <>
              <h6>
                <AccessMoreLess data={Tags} />
              </h6>
            </>
          );
        }
      }
    ],
    []
  );
  return (
    <>
      <Row>
        <Col sm={2}>
          <span>Exclude Service Users: </span>
          <input
            type="checkbox"
            className="align-middle"
            defaultChecked={checked}
            onChange={() => {
              toggleChange();
            }}
          />
        </Col>
        <Col sm={9}>
          <AuditFilterEntries entries={entries} refreshTable={refreshTable} />
          <br />
        </Col>
      </Row>
      <XATableLayout
        data={accessListingData}
        columns={columns}
        fetchData={fetchAccessLogsInfo}
        loading={loader}
        pageCount={pageCount}
        getRowProps={(row) => ({
          onClick: (e) => {
            e.stopPropagation();
            rowModal(row);
          }
        })}
        columnHide={true}
      />
      <Modal show={showrowmodal} size="lg" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 class="modal-title">
              Audit Access Log Detail
              <Link
                className="text-info"
                target="_blank"
                title="Show log details in next tab"
                to={{
                  pathname: `/reports/audit/eventlog/${rowdata.eventId}`
                }}
              >
                <i class="fa-fw fa fa-external-link pull-right text-info"></i>
              </Link>
            </h4>
          </Modal.Title>{" "}
        </Modal.Header>
        <Modal.Body className="overflow-auto p-3 mb-3 mb-md-0 mr-md-3">
          <AccessLogsTable data={rowdata}></AccessLogsTable>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Access;
