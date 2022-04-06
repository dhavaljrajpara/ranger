import React, { useState, useCallback, useRef } from "react";
import { Badge, Button, Row, Col, Modal } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";
import { useHistory, Link } from "react-router-dom";
import moment from "moment-timezone";
import { fetchApi } from "Utils/fetchAPI";
import { toast } from "react-toastify";
import {
  isUser,
  isSystemAdmin,
  isKeyAdmin,
  isAuditor,
  isKMSAuditor
} from "Utils/XAUtils";

function Roles() {
  let history = useHistory();
  const [roleListingData, setRoleData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);
  const selectedRows = useRef([]);
  const [showModal, setConfirmModal] = useState(false);
  const [updateTable, setUpdateTable] = useState(moment.now());

  const fetchRoleInfo = useCallback(
    async ({ pageSize, pageIndex }) => {
      let roleData = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      if (fetchId === fetchIdRef.current) {
        try {
          const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
          const roleResp = await fetchApi({
            url: "roles/lookup/roles",
            params: {
              pageSize: pageSize,
              startIndex: pageIndex * pageSize
            }
          });
          roleData = roleResp.data.roles;
          totalCount = roleResp.data.totalCount;
        } catch (error) {
          console.error(`Error occurred while fetching Role list! ${error}`);
        }
        setRoleData(roleData);
        setPageCount(Math.ceil(totalCount / pageSize));
        setLoader(false);
      }
    },
    [updateTable]
  );
  const handleDeleteBtnClick = () => {
    if (selectedRows.current.length > 0) {
      toggleConfirmModal();
    } else {
      toast.info("Please select atleast one role!!");
    }
  };
  const toggleConfirmModal = () => {
    setConfirmModal((state) => !state);
  };

  const handleConfirmClick = () => {
    handleDeleteClick();
  };

  const handleDeleteClick = async () => {
    const selectedData = selectedRows.current;
    let errorMsg = "";
    if (selectedData.length > 0) {
      for (const { original } of selectedData) {
        try {
          await fetchApi({
            url: `roles/roles/${original.id}`,
            method: "DELETE"
          });
        } catch (error) {
          if (error.response.data.msgDesc) {
            errorMsg += error.response.data.msgDesc + "\n";
          } else {
            errorMsg +=
              `Error occurred during deleting Role: ${original.name}` + "\n";
          }
        }
      }
      if (errorMsg) {
        toast.error(errorMsg);
      } else {
        toast.success("Role deleted successfully!");
      }
      setUpdateTable(moment.now());
      toggleConfirmModal();
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Role Name",
        accessor: "name",
        Cell: (rawValue) => {
          if (rawValue.value) {
            return (
              <Link
                className={`${
                  isAuditor() || isKMSAuditor()
                    ? "disabled-link text-secondary"
                    : "text-info"
                }`}
                to={"/role/" + rawValue.row.original.id}
              >
                {rawValue.value}
              </Link>
            );
          }
          return "--";
        }
      },

      {
        Header: "Users",
        accessor: "users",
        accessor: (raw) => {
          if (raw.users && raw.users.length > 0) {
            let usersList = _.map(raw.users, "name");
            return usersList.map((u, index) => {
              return (
                <h6 className="d-inline mr-1" key={index}>
                  <Badge variant="info">{u}</Badge>
                </h6>
              );
            });
          } else {
            return "--";
          }
        }
      },
      {
        Header: "Groups",
        accessor: "groups",
        accessor: (raw) => {
          if (raw.groups && raw.groups.length > 0) {
            let groupsList = _.map(raw.groups, "name");
            return groupsList.map((g, index) => {
              return (
                <h6 className="d-inline mr-1" key={index}>
                  <Badge variant="info">{g}</Badge>
                </h6>
              );
            });
          } else {
            return "--";
          }
        }
      },
      {
        Header: "Roles",
        accessor: "roles",
        accessor: (raw) => {
          if (raw.roles && raw.roles.length > 0) {
            let rolesList = _.map(raw.roles, "name");
            return rolesList.map((r, index) => {
              return (
                <h6 className="d-inline mr-1" key={index}>
                  <Badge variant="info">{r}</Badge>
                </h6>
              );
            });
          } else {
            return "--";
          }
        }
      }
    ],
    []
  );
  const addRole = () => {
    history.push("/roleCreate");
  };
  return (
    <div>
      <h4 className="wrap-header font-weight-bold">Role List</h4>
      <Row className="mb-4">
        <Col md={7}></Col>
        {(isSystemAdmin() || isKeyAdmin()) && (
          <Col md={5} className="text-right">
            <Button variant="primary" size="sm" onClick={addRole}>
              Add Role
            </Button>
            <Button
              className="ml-2"
              variant="danger"
              size="sm"
              title="Delete"
              onClick={handleDeleteBtnClick}
            >
              <i className="fa-fw fa fa-trash"></i>
            </Button>
          </Col>
        )}
      </Row>
      <div>
        <XATableLayout
          data={roleListingData}
          columns={columns}
          fetchData={fetchRoleInfo}
          pageCount={pageCount}
          loading={loader}
          rowSelectOp={
            (isSystemAdmin() || isKeyAdmin()) && {
              position: "first",
              selectedRows
            }
          }
        />
      </div>
      <Modal show={showModal} onHide={toggleConfirmModal}>
        <Modal.Body>
          Are you sure you want to delete{" "}
          {selectedRows.current.length === 1
            ? selectedRows.current[0].original.name + " role"
            : selectedRows.current.length + " roles"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={toggleConfirmModal}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleConfirmClick}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Roles;
