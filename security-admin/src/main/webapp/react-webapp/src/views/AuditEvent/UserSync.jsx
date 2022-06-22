import React, { Component, useState, useCallback, useRef } from "react";
import { Badge, Modal, Button, Row, Col } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { AuditFilterEntries } from "Components/CommonComponents";
import { SyncSourceDetails } from "../UserGroupRoleListing/SyncSourceDetails";
import moment from "moment-timezone";
import StructuredFilter from "../../components/structured-filter/react-typeahead/tokenizer";
import { map } from "lodash";

function User_Sync() {
  const [userSyncListingData, setUserSyncLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);
  const [entries, setEntries] = useState([]);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const [showTableSyncDetails, setTableSyncdetails] = useState({
    syncDteails: {},
    showSyncDetails: false
  });
  const [searchFilterParams, setSearchFilter] = useState({});

  const fetchUserSyncInfo = useCallback(
    async ({ pageSize, pageIndex }) => {
      let logsResp = [];
      let logs = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      let params = { ...searchFilterParams };
      if (fetchId === fetchIdRef.current) {
        params["pageSize"] = pageSize;
        params["startIndex"] = pageIndex * pageSize;
        try {
          const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
          logsResp = await fetchApi({
            url: "assets/ugsyncAudits",
            params: params
          });
          logs = logsResp.data.vxUgsyncAuditInfoList;
          totalCount = logsResp.data.totalCount;
        } catch (error) {
          console.error(
            `Error occurred while fetching User Sync logs! ${error}`
          );
        }
        setUserSyncLogs(logs);
        setEntries(logsResp.data);
        setPageCount(Math.ceil(totalCount / pageSize));
        setLoader(false);
      }
    },
    [updateTable, searchFilterParams]
  );
  const refreshTable = () => {
    setUserSyncLogs([]);
    setLoader(true);
    setUpdateTable(moment.now());
  };
  const toggleTableSyncModal = (raw) => {
    setTableSyncdetails({
      syncDteails: raw,
      showSyncDetails: true
    });
  };
  const toggleTableSyncModalClose = () => {
    setTableSyncdetails({
      syncDteails: {},
      showSyncDetails: false
    });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "User Name",
        accessor: "userName"
      },
      {
        Header: "Sync Source",
        accessor: "syncSource",
        Cell: (rawValue) => {
          return (
            <div className="text-center">
              <h6>
                <Badge variant="success">{rawValue.value}</Badge>
              </h6>
            </div>
          );
        }
      },
      {
        Header: "Number Of New",
        id: "new",
        columns: [
          {
            Header: "Users",
            accessor: "noOfNewUsers",
            width: 100
          },
          {
            Header: "Groups",
            accessor: "noOfNewGroups",
            width: 100
          }
        ]
      },
      {
        Header: "Number Of Modified",
        id: "modified",
        columns: [
          {
            Header: "Users",
            accessor: "noOfModifiedUsers",
            width: 100
          },
          {
            Header: "Groups",
            accessor: "noOfModifiedGroups",
            width: 100
          }
        ]
      },

      {
        Header: "Event Time",
        accessor: "eventTime",
        Cell: (rawValue) => {
          const date = rawValue.value;
          const newdate = moment
            .tz(date, "Asia/Kolkata")
            .format("MM/DD/YYYY HH:mm:ss A");
          return newdate;
        },
        minWidth: 170
      },
      {
        Header: "Sync Details",
        accessor: "syncSourceInfo",
        Cell: (rawValue, model) => {
          if (rawValue.value) {
            return (
              <div className="text-center">
                <button
                  className="btn btn-outline-dark btn-sm"
                  data-id="syncDetailes"
                  title="Sync Details"
                  id={model.id}
                  onClick={() => {
                    toggleTableSyncModal(rawValue.value);
                  }}
                >
                  <i className="fa-fw fa fa-eye"> </i>
                </button>
              </div>
            );
          } else {
            return " -- ";
          }
        }
      }
    ],
    []
  );

  const updateSearchFilter = (filter) => {
    console.log("PRINT Filter : ", filter);
    let searchFilter = {};

    map(filter, function (obj) {
      searchFilter[obj.category] = obj.value;
    });
    setSearchFilter(searchFilter);
  };
  return (
    <>
      <Row className="mb-2">
        <Col sm={12}>
          <StructuredFilter
            options={[
              {
                category: "endDate",
                label: "End Date",
                type: "date"
              },
              {
                category: "startDate",
                label: "Start Date",
                type: "date"
              },
              {
                category: "syncSource",
                label: "Sync Source",
                type: "textoptions",
                options: () => {
                  return [
                    { value: "File", label: "File" },
                    { value: "LDAP/AD", label: "LDAP/AD" },
                    { value: "Unix", label: "Unix" }
                  ];
                }
              },
              {
                category: "userName",
                label: "User Name",
                type: "text"
              }
            ]}
            onTokenAdd={updateSearchFilter}
            onTokenRemove={updateSearchFilter}
          />
        </Col>
      </Row>
      <AuditFilterEntries entries={entries} refreshTable={refreshTable} />
      <XATableLayout
        data={userSyncListingData}
        columns={columns}
        loading={loader}
        totalCount={entries && entries.totalCount}
        fetchData={fetchUserSyncInfo}
        pageCount={pageCount}
      />
      <Modal
        show={showTableSyncDetails && showTableSyncDetails.showSyncDetails}
        onHide={toggleTableSyncModalClose}
        size="xl"
      >
        <Modal.Header>
          <Modal.Title>Sync Source Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SyncSourceDetails
            syncDetails={showTableSyncDetails.syncDteails}
          ></SyncSourceDetails>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            size="sm"
            onClick={toggleTableSyncModalClose}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default User_Sync;
