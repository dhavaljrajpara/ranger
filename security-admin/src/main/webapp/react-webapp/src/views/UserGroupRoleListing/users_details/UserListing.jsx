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
import { MoreLess } from "Components/CommonComponents";
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
import { isEmpty, map } from "lodash";
import { getUserAccessRoleList } from "Utils/XAUtils";
import StructuredFilter from "../../../components/structured-filter/react-typeahead/tokenizer";

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
  const [searchFilterParams, setSearchFilter] = useState({});

  const fetchUserInfo = useCallback(
    async ({ pageSize, pageIndex }) => {
      // setLoader(true);
      let userData = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      let params = { ...searchFilterParams };
      const userRoleListData = getUserAccessRoleList().map((m) => {
        return m.value;
      });
      if (fetchId === fetchIdRef.current) {
        params["pageSize"] = pageSize;
        params["startIndex"] = pageIndex * pageSize;
        params["userRoleList"] = userRoleListData;
        try {
          const userResp = await fetchApi({
            url: "xusers/users",
            params: params,
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
    [updateTable, searchFilterParams]
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
          } else return <div className="text-center">--</div>;
        },
        width: 220
      },
      {
        Header: "Role",
        accessor: "userRoleList",
        Cell: (rawValue) => {
          if (rawValue.value && rawValue.value.length > 0) {
            let role = rawValue.value[0];
            return (
              <h6 className="text-center">
                <Badge variant="info">{UserRoles[role].label} </Badge>
              </h6>
            );
          }
          return <div className="textt-center">--</div>;
        },
        width: 100
      },
      {
        Header: "User Source",
        accessor: "userSource", // accessor is the "key" in the data
        Cell: (rawValue) => {
          if (rawValue.value !== null && rawValue.value !== undefined) {
            if (rawValue.value == UserSource.XA_PORTAL_USER.value)
              return (
                <h6 className="text-center">
                  <Badge variant="success">
                    {UserTypes.USER_INTERNAL.label}
                  </Badge>
                </h6>
              );
            else
              return (
                <h6 className="text-center">
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
          return rawValue.value ? (
            <h6 className="text-center">
              <Badge variant="success">{rawValue.value} </Badge>
            </h6>
          ) : (
            <div className="text-center">--</div>
          );
        }
      },
      {
        Header: "Groups",
        accessor: "groupNameList",
        Cell: (rawValue) => {
          if (rawValue.value !== undefined) {
            const Groups = rawValue.value.map((group) => {
              return group;
            });

            return (
              <div className="overflow-auto">
                {!isEmpty(Groups) ? (
                  <h6>
                    <MoreLess data={Groups} />
                  </h6>
                ) : (
                  <div className="text-center">--</div>
                )}
              </div>
            );
          } else {
            return "--";
          }
        },
        width: 200
      },
      {
        Header: "Visibility",
        accessor: "isVisible",
        Cell: (rawValue) => {
          if (rawValue) {
            if (rawValue.value == VisibilityStatus.STATUS_VISIBLE.value)
              return (
                <h6 className="text-center">
                  <Badge variant="success">
                    {VisibilityStatus.STATUS_VISIBLE.label}
                  </Badge>
                </h6>
              );
            else
              return (
                <h6 className="text-center">
                  <Badge variant="info">
                    {VisibilityStatus.STATUS_HIDDEN.label}
                  </Badge>
                </h6>
              );
          } else return <div className="text-center">--</div>;
        }
      },
      {
        Header: "Sync Details",
        accessor: "otherAttributes",
        Cell: (rawValue, model) => {
          if (rawValue.value) {
            return (
              <div className="text-center">
                <button
                  className="btn btn-outline-dark btn-sm "
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
      <h4 className="wrap-header font-weight-bold">User List</h4>
      <Row className="mb-4">
        <Col sm={9}>
          <StructuredFilter
            options={[
              {
                category: "emailAddress",
                label: "Email Address",
                type: "text"
              },
              {
                category: "userRole",
                label: "Role",
                type: "textoptions",
                options: () => {
                  return [
                    { value: "ROLE_USER", label: "User" },
                    { value: "ROLE_SYS_ADMIN", label: "Admin" },
                    { value: "ROLE_ADMIN_AUDITOR", label: "Auditor" }
                  ];
                }
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
                category: "name",
                label: "User Name",
                type: "text"
              },
              {
                category: "userSource",
                label: "User Source",
                options: () => {
                  return [
                    { value: "0", label: "Internal" },
                    { value: "1", label: "External" }
                  ];
                }
              },
              {
                category: "status",
                label: "User Status",
                options: () => {
                  return [
                    { value: "0", label: "Disabled" },
                    { value: "1", label: "Enabled" }
                  ];
                }
              },
              {
                category: "isVisible",
                label: "Visibility",
                options: () => {
                  return [
                    { value: "0", label: "Hidden" },
                    { value: "1", label: "Visible" }
                  ];
                }
              }
            ]}
            onTokenAdd={updateSearchFilter}
            onTokenRemove={updateSearchFilter}
          />
        </Col>
        {(isSystemAdmin() || isKeyAdmin()) && (
          <Col sm={3} className="text-right">
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
