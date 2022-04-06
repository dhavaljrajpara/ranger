import React, { Component, useState, useCallback, useRef } from "react";
import { Badge, Modal, Button } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { SyncSourceDetails } from "../UserGroupRoleListing/SyncSourceDetails";

function User_Sync() {
  const [userSyncListingData, setUserSyncLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);
  const [showTableSyncDetails, setTableSyncdetails] = useState({
    syncDteails: {},
    showSyncDetails: false
  });

  const fetchUserSyncInfo = useCallback(async ({ pageSize, pageIndex }) => {
    let logs = [];
    let totalCount = 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
        const logsResp = await fetchApi({
          url: "assets/ugsyncAudits",
          params: {
            pageSize: pageSize,
            startIndex: pageIndex * pageSize
          }
        });
        logs = logsResp.data.vxUgsyncAuditInfoList;
        totalCount = logsResp.data.totalCount;
      } catch (error) {
        console.error(`Error occurred while fetching User Sync logs! ${error}`);
      }
      setUserSyncLogs(logs);
      setPageCount(Math.ceil(totalCount / pageSize));
      setLoader(false);
    }
  }, []);

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
            <h6>
              <Badge variant="success">{rawValue.value}</Badge>
            </h6>
          );
        }
      },
      {
        Header: "Users",
        accessor: "noOfNewUsers"
      },
      {
        Header: "Groups",
        accessor: "noOfNewGroups"
      },
      {
        Header: "Users",
        accessor: "noOfModifiedUsers"
      },
      {
        Header: "Groups",
        accessor: "noOfModifiedGroups"
      },
      {
        Header: "Event Time",
        accessor: "eventTime"
      },
      {
        Header: "Sync Details",
        accessor: "syncSourceInfo",
        Cell: (rawValue, model) => {
          if (rawValue.value) {
            return (
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
            );
          } else {
            return " -- ";
          }
        }
      }
    ],
    []
  );
  return (
    <>
      <XATableLayout
        data={userSyncListingData}
        columns={columns}
        loading={loader}
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
      ;
    </>
  );
}

export default User_Sync;
