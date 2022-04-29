import React, { useState, useCallback, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge, Button, Col, Row, Tab, Tabs, Modal } from "react-bootstrap";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import { uniq, map, flatMap } from "lodash";
import { fetchApi } from "Utils/fetchAPI";
import XATableLayout from "Components/XATableLayout";

function PolicyListing() {
  const [policyListingData, setPolicyData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);
  const [deletePolicyModal, setConfirmModal] = useState({
    policyDetails: {},
    showSyncDetails: false
  });
  const [updateTable, setUpdateTable] = useState(moment.now());

  let { serviceId, policyType } = useParams();

  const fetchPolicyInfo = useCallback(
    async ({ pageSize, pageIndex }) => {
      let policyData = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      if (fetchId === fetchIdRef.current) {
        try {
          const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
          const policyResp = await fetchApi({
            url: `plugins/policies/service/${serviceId}`,
            params: {
              pageSize: pageSize,
              startIndex: pageIndex * pageSize,
              policyType: policyType
            }
          });
          policyData = policyResp.data.policies;
          totalCount = policyResp.data.totalCount;
        } catch (error) {
          console.error(`Error occurred while fetching Policies ! ${error}`);
        }
        console.log(policyData);
        setPolicyData(policyData);
        setPageCount(Math.ceil(totalCount / pageSize));
        setLoader(false);
      }
    },
    [updateTable]
  );

  const toggleConfirmModalForDelete = (policyID, policyName) => {
    setConfirmModal({
      policyDetails: { policyID: policyID, policyName: policyName },
      showPopup: true
    });
  };

  const toggleClose = () => {
    setConfirmModal({
      policyDetails: {},
      showPopup: false
    });
  };

  const handleDeleteClick = async (policyID) => {
    try {
      await fetchApi({
        url: `plugins/policies/${policyID}`,
        method: "DELETE"
      });
      toast.success(" Success! Policy deleted successfully");
    } catch (error) {
      console.log(error.response);
      if (error.response.data.msgDesc) {
        errorMsg += error.response.data.msgDesc + "\n";
      } else {
        errorMsg += `Error occurred during deleting policy`;
      }
    }
    setUpdateTable(moment.now());
    toggleClose();
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Policy ID",
        accessor: "id",
        Cell: (rawValue) => {
          return (
            <Link
              title="Edit"
              to={`/service/${serviceId}/policies/${rawValue.value}/edit`}
            >
              {rawValue.value}
            </Link>
          );
        }
      },
      {
        Header: "Policy Name",
        accessor: "name"
      },
      {
        Header: "Policy Label",
        accessor: "policyLabels",
        Cell: (rawValue) => {
          if (rawValue.value == "") return "--";
          else {
            let policyLabels = rawValue.value.map((label) => (
              <h6 className="d-inline mr-1">
                <Badge variant="primary" key={label}>
                  {label}
                </Badge>
              </h6>
            ));
            return policyLabels;
          }
        }
      },
      {
        Header: "Status",
        accessor: "isEnabled",
        Cell: (rawValue) => {
          if (rawValue.value)
            return (
              <h6>
                <Badge variant="success">Enabled</Badge>
              </h6>
            );
          else
            return (
              <h6>
                <Badge variant="danger">Disabled</Badge>
              </h6>
            );
        }
      },
      {
        Header: "Audit Logging",
        accessor: "isAuditEnabled",
        Cell: (rawValue) => {
          if (rawValue.value) {
            return (
              <h6>
                <Badge variant="success">Enabled</Badge>
              </h6>
            );
          } else
            return (
              <h6>
                <Badge variant="danger">Disabled</Badge>
              </h6>
            );
        }
      },
      {
        Header: "Roles",
        accessor: "roles",
        Cell: (rawValue) => {
          if (rawValue) {
            let getRoles = uniq(
              flatMap(map(rawValue.row.original.policyItems, "roles"))
            );
            let roles = getRoles.map((a) => (
              <h6 className="d-inline mr-1">
                <Badge variant="primary" key={a}>
                  {a}
                </Badge>
              </h6>
            ));
            return roles.length > 0 ? roles : "--";
          } else {
            return "--";
          }
        }
      },
      {
        Header: "Groups",
        accessor: "groups",
        Cell: (rawValue) => {
          if (rawValue) {
            let getGroups = uniq(
              flatMap(map(rawValue.row.original.policyItems, "groups"))
            );
            let groups = getGroups.map((a) => (
              <h6 className="d-inline mr-1">
                <Badge variant="primary" key={a}>
                  {a}
                </Badge>
              </h6>
            ));
            return groups.length > 0 ? groups : "--";
          } else {
            return "--";
          }
        }
      },
      {
        Header: "Users",
        accessor: "users",
        Cell: (rawValue) => {
          if (rawValue) {
            let getUsers = uniq(
              flatMap(map(rawValue.row.original.policyItems, "users"))
            );
            let users = getUsers.map((a) => (
              <h6 className="d-inline mr-1">
                <Badge variant="primary" key={a}>
                  {a}
                </Badge>
              </h6>
            ));
            return users.length > 0 ? users : "--";
          } else {
            return "--";
          }
        }
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <Button
                variant="outline-dark"
                size="sm"
                className="m-r-5"
                title="View"
              >
                <i className="fa-fw fa fa-eye fa-fw fa fa-large"></i>
              </Button>
              <Link
                className="btn btn-outline-dark btn-sm m-r-5"
                title="Edit"
                to={`/service/${serviceId}/policies/${original.id}/edit`}
              >
                <i className="fa-fw fa fa-edit"></i>
              </Link>
              <Button
                variant="danger"
                size="sm"
                className="m-r-5"
                title="Delete"
                onClick={() =>
                  toggleConfirmModalForDelete(original.id, original.name)
                }
              >
                <i className="fa-fw fa fa-trash fa-fw fa fa-large"></i>
              </Button>
            </div>
          );
        }
      }
    ],
    []
  );
  return (
    <React.Fragment>
      <h4 className="wrap-header bold">List of Policies </h4>
      <div className="wrap policy-listing">
        <Row>
          <Col sm={12}>
            <div className="pull-right">
              <Link
                to={`/service/${serviceId}/policies/create/${policyType}`}
                className="btn btn-sm btn-primary mb-2"
              >
                Add New Policy
              </Link>
            </div>
          </Col>
          <Col sm={12}>
            <XATableLayout
              data={policyListingData}
              columns={columns}
              fetchData={fetchPolicyInfo}
              pageCount={pageCount}
              loading={loader}
            />
          </Col>
        </Row>
      </div>
      <Modal show={deletePolicyModal.showPopup} onHide={toggleClose}>
        <Modal.Body>Are you sure you want to delete</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={toggleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              handleDeleteClick(deletePolicyModal.policyDetails.policyID)
            }
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default PolicyListing;
