import React, { Component, useState, useCallback, useRef } from "react";
import { Badge, Button, Row, Col, Modal } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { UserRoles } from "Utils/XAEnums";
import { UserSource } from "Utils/XAEnums";
import { UserTypes } from "Utils/XAEnums";
import { VisibilityStatus } from "Utils/XAEnums";
import { Loader } from "Components/CommonComponents";
import { useHistory, Link } from "react-router-dom";

import { fetchApi } from "Utils/fetchAPI";
import { toast } from "react-toastify";

function Users() {
  let history = useHistory();
  const [userListingData, setUserData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);
  const selectedRows = useRef([]);
  const [showModal, setConfirmModal] = useState(false);

  const fetchUserInfo = useCallback(async ({ pageSize, pageIndex }) => {
    let userData = [];
    let totalCount = 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        const userResp = await fetchApi({
          url: "xusers/users",
          params: {
            pageSize: pageSize,
            startIndex: pageIndex * pageSize
          }
        });
        userData = userResp.data.vXUsers;
        totalCount = userResp.data.totalCount;
      } catch (error) {
        console.error(`Error occurred while fetching User list! ${error}`);
      }
      setUserData(userData);
      setPageCount(Math.ceil(totalCount / pageSize));
      setLoader(false);
    }
  }, []);

  const handleDeleteBtnClick = () => {
    if (selectedRows.current.length > 0) {
      toggleConfirmModal();
    } else {
      toast.info("Please select atleast one user!!");
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
              <Link to={"/user/" + rawValue.row.original.id}>
                {rawValue.value}
              </Link>
            );
          }
          return "--";
        }
      },
      {
        Header: "Email Address",
        accessor: "emailAddress" // accessor is the "key" in the data
      },
      {
        Header: "Role",
        accessor: "userRoleList",
        Cell: (rawValue) => {
          if (rawValue.value && rawValue.value.length > 0) {
            let role = rawValue.value[0];
            return <Badge variant="info">{UserRoles[role].label} </Badge>;
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
                <Badge variant="success">
                  {UserTypes.USER_INTERNAL.label}{" "}
                </Badge>
              );
            else
              return (
                <Badge className="externalbadge">
                  {UserTypes.USER_EXTERNAL.label}{" "}
                </Badge>
              );
          } else return "--";
        }
      },
      {
        Header: "Sync Source",
        accessor: "syncSource",
        Cell: (rawValue) => {
          if (rawValue.value) {
            return <Badge variant="success">{rawValue.value} </Badge>;
          } else return "--";
        }
      },
      {
        Header: "Groups",
        accessor: "groupNameList",
        Cell: (rawValue) => {
          if (rawValue.value.length != 0) {
            return <Badge variant="info">{rawValue.value} </Badge>;
          } else return "--";
        }
      },
      {
        Header: "Visibility",
        accessor: "isVisible",
        Cell: (rawValue) => {
          if (rawValue.value) {
            if (rawValue)
              return (
                <Badge variant="success">
                  {VisibilityStatus.STATUS_VISIBLE.label}{" "}
                </Badge>
              );
            else
              return (
                <Badge variant="info">
                  {VisibilityStatus.STATUS_HIDDEN.label}{" "}
                </Badge>
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
                data-id="syncDetailes"
                data-for="users"
                title="Sync Details"
                id={model.id}
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
    history.push("/userCreate");
  };
  const toggleConfirmModal = () => {
    setConfirmModal((state) => !state);
  };
  const handleConfirmClick = () => {
    handleDeleteClick();
  };
  return loader ? (
    <Loader />
  ) : (
    <div>
      <h1>User List</h1>
      <Row className="mb-4">
        <Col md={9}></Col>
        <Col md={3}>
          <Button onClick={addUser}>Add User</Button>
          <Button onClick={handleDeleteBtnClick}>Delete User</Button>
        </Col>
      </Row>
      <div>
        <XATableLayout
          data={userListingData}
          columns={columns}
          fetchData={fetchUserInfo}
          pageCount={pageCount}
          rowSelectOp={{ position: "first", selectedRows }}
        />
      </div>
      <Modal show={showModal} onHide={toggleConfirmModal}>
        <Modal.Body>{`Are you sure you want to delete ${selectedRows.current.length} users`}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleConfirmModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirmClick}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Users;
