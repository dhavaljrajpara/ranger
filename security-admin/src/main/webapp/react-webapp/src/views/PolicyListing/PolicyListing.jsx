import React, { Component, useState, useCallback, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge, Button, Col, Row, Tab, Tabs, Modal } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import { fetchApi } from "Utils/fetchAPI";

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
        accessor: "id"
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
          else
            return (
              <h6>
                <Badge variant="primary">{rawValue.value}</Badge>
              </h6>
            );
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
            let roles = rawValue.row.original.policyItems.map((a) => (
              <h6>
                <Badge variant="primary" key={a.roles}>
                  {a.roles}
                </Badge>
              </h6>
            ));
            return roles;
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
            let groups = rawValue.row.original.policyItems.map((a) => (
              <h6>
                <Badge variant="primary" key={a.groups}>
                  {a.groups}
                </Badge>
              </h6>
            ));
            return groups;
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
            let users = rawValue.row.original.policyItems.map((a) => (
              <h6>
                <Badge variant="primary" key={a.users}>
                  {a.users}
                </Badge>
              </h6>
            ));
            return users;
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
    <>
      <h4 className="wrap-header bold">List of Policies </h4>
      <div className="wrap policy-manager">
        <Row>
          <Col md={12}>
            <div className="pull-right">
              <Link
                to={`/service/${serviceId}/policies/create/${policyType}`}
                className="btn btn-sm btn-primary mb-2"
              >
                Add New Policy
              </Link>
            </div>
          </Col>
          <div className="col-sm-12">
            <XATableLayout
              data={policyListingData}
              columns={columns}
              fetchData={fetchPolicyInfo}
              pageCount={pageCount}
              loading={loader}
            />
          </div>
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
    </>
  );
}

export default PolicyListing;
