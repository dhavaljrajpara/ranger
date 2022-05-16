import React, { useState, useCallback, useRef } from "react";
import {
  Badge,
  Button,
  Row,
  Col,
  Modal,
  DropdownButton,
  Dropdown
} from "react-bootstrap";
import moment from "moment-timezone";

import XATableLayout from "Components/XATableLayout";
import {
  UserRoles,
  UserSource,
  UserTypes,
  VisibilityStatus
} from "Utils/XAEnums";
import { Loader } from "Components/CommonComponents";
import { useHistory, Link } from "react-router-dom";
import qs from "qs";

import { fetchApi } from "Utils/fetchAPI";
import { toast } from "react-toastify";
import { SyncSourceDetails } from "../SyncSourceDetails";
import {
  isUser,
  isSystemAdmin,
  isKeyAdmin,
  isAuditor,
  isKMSAuditor
} from "Utils/XAUtils";
import { getUserAccessRoleList } from "Utils/XAUtils";

function Users() {
  let history = useHistory();
  const [loader, setLoader] = useState(true);
  const [userListingData, setUserData] = useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);
  const selectedRows = useRef([]);
  const [showModal, setConfirmModal] = useState(false);
  const [showUserSyncDetails, setUserSyncdetails] = useState({
    syncDteails: {},
    showSyncDetails: false
  });
  const [totalCount, setTotalCount] = useState(0);
  const [updateTable, setUpdateTable] = useState(moment.now());

  const fetchUserInfo = useCallback(
    async ({ pageSize, pageIndex }) => {
      // setLoader(true);
      let userData = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      const userRoleListData = getUserAccessRoleList().map((m) => {
        return m.value;
      });
      if (fetchId === fetchIdRef.current) {
        try {
          const userResp = await fetchApi({
            url: "xusers/users",
            params: {
              pageSize: pageSize,
              startIndex: pageIndex * pageSize,
              userRoleList: userRoleListData
            },
            paramsSerializer: function (params) {
              return qs.stringify(params, { arrayFormat: "repeat" });
            }
          });
          userData = userResp.data.vXUsers;
          totalCount = userResp.data.totalCount;
        } catch (error) {
          console.error(`Error occurred while fetching User list! ${error}`);
        }
        setUserData(userData);
        setTotalCount(totalCount);
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
      toast.warning("Please select atleast one user!!");
    }
  };

  const handleSetVisibility = async (e) => {
    if (selectedRows.current.length > 0) {
      let selectedRowData = selectedRows.current;
      for (const { original } of selectedRowData) {
        if (original.isVisible == e) {
          toast.warning(
            e == VisibilityStatus.STATUS_VISIBLE.value
              ? "Selected user is already visible"
              : "Selected user is already hidden"
          );
        } else {
          let obj = {};
          obj[original.id] = e;
          try {
            await fetchApi({
              url: "xusers/secure/users/visibility",
              method: "PUT",
              data: obj
            });
            toast.success("Sucessfully updated Users visibility!!");
            setUpdateTable(moment.now());
          } catch (error) {
            if (error) {
              if (error && error.response) {
                toast.error(error.response);
              } else {
                toast.error("Error occurred during set Users visibility");
              }
            }
          }
        }
      }
    } else {
      toast.warning("Please select atleast one user!!");
    }
  };

  const handleDeleteClick = async () => {
    const selectedData = selectedRows.current;
    let errorMsg = "";
    if (selectedData.length > 0) {
      for (const { original } of selectedData) {
        try {
          await fetchApi({
            url: `xusers/secure/users/id/${original.id}`,
            method: "DELETE",
            params: {
              forceDelete: true
            }
          });
        } catch (error) {
          console.log(error.response);
          if (error.response.data.msgDesc) {
            errorMsg += error.response.data.msgDesc + "\n";
          } else {
            errorMsg +=
              `Error occurred during deleting Users: ${original.name}` + "\n";
          }
        }
      }
      if (errorMsg) {
        toast.error(errorMsg);
      } else {
        toast.success("User deleted successfully!");
      }
      setUpdateTable(moment.now());
      toggleConfirmModal();
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "User Name",
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
                to={"/user/" + rawValue.row.original.id}
              >
                {rawValue.value}
              </Link>
            );
          }
          return "--";
        }
      },
      {
        Header: "Email Address",
        accessor: "emailAddress", // accessor is the "key" in the data
        Cell: (rawValue) => {
          if (rawValue.value) {
            return rawValue.value;
          } else return "--";
        }
      },
      {
        Header: "Role",
        accessor: "userRoleList",
        Cell: (rawValue) => {
          if (rawValue.value && rawValue.value.length > 0) {
            let role = rawValue.value[0];
            return (
              <h6>
                <Badge variant="info">{UserRoles[role].label} </Badge>
              </h6>
            );
          }
          return "--";
        }
      },
      {
        Header: "User Source",
        accessor: "userSource", // accessor is the "key" in the data
        Cell: (rawValue) => {
          if (rawValue.value !== null && rawValue.value !== undefined) {
            if (rawValue.value == UserSource.XA_PORTAL_USER.value)
              return (
                <h6>
                  <Badge variant="success">
                    {UserTypes.USER_INTERNAL.label}
                  </Badge>
                </h6>
              );
            else
              return (
                <h6>
                  <Badge variant="warning">
                    {UserTypes.USER_EXTERNAL.label}
                  </Badge>
                </h6>
              );
          } else return "--";
        }
      },
      {
        Header: "Sync Source",
        accessor: "syncSource",
        Cell: (rawValue) => {
          if (rawValue.value) {
            return (
              <h6>
                <Badge variant="success">{rawValue.value} </Badge>
              </h6>
            );
          } else return "--";
        }
      },
      {
        Header: "Groups",
        accessor: "groupNameList",
        Cell: (rawValue) => {
          if (rawValue.value && rawValue.value.length > 0) {
            return rawValue.value.map((name, index) => {
              return (
                <h6 className="d-inline mr-1" key={index}>
                  <Badge variant="info">{name}</Badge>
                </h6>
              );
            });
          } else return "--";
        }
      },
      {
        Header: "Visibility",
        accessor: "isVisible",
        Cell: (rawValue) => {
          if (rawValue) {
            if (rawValue.value == VisibilityStatus.STATUS_VISIBLE.value)
              return (
                <h6>
                  <Badge variant="success">
                    {VisibilityStatus.STATUS_VISIBLE.label}
                  </Badge>
                </h6>
              );
            else
              return (
                <h6>
                  <Badge variant="info">
                    {VisibilityStatus.STATUS_HIDDEN.label}
                  </Badge>
                </h6>
              );
          } else return "--";
        }
      },
      {
        Header: "Sync Details",
        accessor: "otherAttributes",
        Cell: (rawValue, model) => {
          if (rawValue.value) {
            return (
              <button
                className="btn btn-outline-dark btn-sm"
                data-id="syncDetailes"
                data-for="users"
                title="Sync Details"
                id={model.id}
                onClick={() => {
                  toggleUserSyncModal(rawValue.value);
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
  const addUser = () => {
    history.push({
      pathname: "/user/create",
      state: history
    });
  };
  const toggleConfirmModal = () => {
    setConfirmModal((state) => !state);
  };
  const toggleUserSyncModal = (raw) => {
    setUserSyncdetails({
      syncDteails: JSON.parse(raw),
      showSyncDetails: true
    });
  };
  const toggleUserSyncModalClose = () => {
    setUserSyncdetails({
      syncDteails: {},
      showSyncDetails: false
    });
  };
  const handleConfirmClick = () => {
    handleDeleteClick();
  };
  return (
    <>
      <h4 className="wrap-header font-weight-bold">User List</h4>
      <Row className="mb-4 text-right">
        <Col md={7}></Col>
        {(isSystemAdmin() || isKeyAdmin()) && (
          <Col md={5}>
            <Button variant="primary" size="sm" onClick={addUser}>
              Add User
            </Button>
            <DropdownButton
              title="Set Visibility"
              size="sm"
              style={{ display: "inline-block" }}
              className="ml-2"
              onSelect={handleSetVisibility}
            >
              <Dropdown.Item eventKey="1">Visible</Dropdown.Item>
              <Dropdown.Item eventKey="0">Hidden</Dropdown.Item>
            </DropdownButton>
            <Button
              variant="danger"
              size="sm"
              title="Delete"
              onClick={handleDeleteBtnClick}
              className="ml-2"
            >
              <i className="fa-fw fa fa-trash"></i>
            </Button>
          </Col>
        )}
      </Row>
      <br />
      <div>
        <XATableLayout
          data={userListingData}
          columns={columns}
          fetchData={fetchUserInfo}
          totalCount={totalCount}
          pageCount={pageCount}
          pagination
          loading={loader}
          rowSelectOp={
            (isSystemAdmin() || isKeyAdmin()) && {
              position: "first",
              selectedRows
            }
          }
          getRowProps={(row) => ({
            className: row.values.isVisible == 0 && "row-inactive"
          })}
        />
      </div>
      <Modal show={showModal} onHide={toggleConfirmModal}>
        <Modal.Body>
          Are you sure you want to delete{" "}
          {selectedRows.current.length === 1
            ? selectedRows.current[0].original.name + " user"
            : selectedRows.current.length + " users"}
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
      <Modal
        show={showUserSyncDetails && showUserSyncDetails.showSyncDetails}
        onHide={toggleUserSyncModalClose}
        size="xl"
      >
        <Modal.Header>
          <Modal.Title>Sync Source Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SyncSourceDetails
            syncDetails={showUserSyncDetails.syncDteails}
          ></SyncSourceDetails>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            size="sm"
            onClick={toggleUserSyncModalClose}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Users;
