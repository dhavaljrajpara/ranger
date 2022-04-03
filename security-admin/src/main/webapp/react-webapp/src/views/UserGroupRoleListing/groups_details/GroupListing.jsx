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
import XATableLayout from "Components/XATableLayout";
import { GroupSource } from "../../../utils/XAEnums";
import { GroupTypes } from "../../../utils/XAEnums";
import { VisibilityStatus } from "Utils/XAEnums";
import { Loader } from "Components/CommonComponents";
import { useHistory, Link } from "react-router-dom";
import moment from "moment-timezone";
import { fetchApi } from "Utils/fetchAPI";
import { toast } from "react-toastify";
import { SyncSourceDetails } from "../SyncSourceDetails";
import { GroupAssociateUserDetails } from "../GroupAssociateUserDetails";

function Groups() {
  let history = useHistory();
  const [groupListingData, setGroupData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);
  const selectedRows = useRef([]);
  const [showModal, setConfirmModal] = useState(false);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const [showGroupSyncDetails, setGroupSyncdetails] = useState({
    syncDteails: {},
    showSyncDetails: false
  });
  const [showAssociateUserModal, setAssociateUserModal] = useState(false);

  const fetchGroupInfo = useCallback(
    async ({ pageSize, pageIndex }) => {
      let groupData = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      if (fetchId === fetchIdRef.current) {
        try {
          const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
          const groupResp = await fetchApi({
            url: "xusers/groups",
            params: {
              pageSize: pageSize,
              startIndex: pageIndex * pageSize
            }
          });
          groupData = groupResp.data.vXGroups;
          totalCount = groupResp.data.totalCount;
        } catch (error) {
          toast.error(`Error occurred while fetching Group list! ${error}`);
        }
        setGroupData(groupData);
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
      toast.warning("Please select atleast one group!!");
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
            url: `xusers/secure/groups/id/${original.id}`,
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
              `Error occurred during deleting Groups: ${original.name}` + "\n";
          }
        }
      }
      if (errorMsg) {
        toast.error(errorMsg);
      } else {
        toast.success("Group deleted successfully!");
      }
      setUpdateTable(moment.now());
      toggleConfirmModal();
    }
  };

  const handleSetVisibility = async (e) => {
    if (selectedRows.current.length > 0) {
      let selectedRowData = selectedRows.current;
      for (const { original } of selectedRowData) {
        if (original.isVisible == e) {
          toast.warning(
            e == VisibilityStatus.STATUS_VISIBLE.value
              ? "Selected group is already visible"
              : "Selected group is already hidden"
          );
        } else {
          let obj = {};
          obj[original.id] = e;
          try {
            await fetchApi({
              url: "xusers/secure/groups/visibility",
              method: "PUT",
              data: obj
            });
            toast.success("Sucessfully updated Group visibility!!");
            setUpdateTable(moment.now());
          } catch (error) {
            if (error) {
              if (error && error.response) {
                toast.error(error.response);
              } else {
                toast.error("Error occurred during set Group visibility");
              }
            }
          }
        }
      }
    } else {
      toast.warning("Please select atleast one group!!");
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Group Name",
        accessor: "name",
        Cell: (rawValue) => {
          if (rawValue.value) {
            return (
              <Link
                className="text-info"
                to={"/group/" + rawValue.row.original.id}
              >
                {rawValue.value}
              </Link>
            );
          }
          return "--";
        }
      },
      {
        Header: "Group Source",
        accessor: "groupSource", // accessor is the "key" in the data
        Cell: (rawValue) => {
          if (rawValue.value !== null && rawValue.value !== undefined) {
            if (rawValue.value == GroupSource.XA_PORTAL_GROUP.value)
              return (
                <h6>
                  <Badge variant="success">
                    {GroupTypes.GROUP_INTERNAL.label}
                  </Badge>
                </h6>
              );
            else
              return (
                <h6>
                  <Badge variant="warning">
                    {GroupTypes.GROUP_EXTERNAL.label}
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
        Header: "Users",
        accessor: "member",
        Cell: (rawValue) => {
          return (
            <button
              className="btn btn-outline-dark btn-sm"
              title="View Users"
              data-js="showUserList"
              onClick={() => {
                showGroupAssociateUser(rawValue.row.original.id);
              }}
            >
              <i className="fa-fw fa fa-group"> </i>
            </button>
          );
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
                data-for="group"
                title="Sync Details"
                id={model.id}
                onClick={() => {
                  toggleGroupSyncModal(rawValue.value);
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
  const addGroup = () => {
    history.push("/groupCreate");
  };
  const toggleGroupSyncModal = (raw) => {
    setGroupSyncdetails({
      syncDteails: JSON.parse(raw),
      showSyncDetails: true
    });
  };
  const toggleGroupSyncModalClose = () => {
    setGroupSyncdetails({
      syncDteails: {},
      showSyncDetails: false
    });
  };
  const showGroupAssociateUser = (raw) => {
    setAssociateUserModal({
      groupID: raw,
      showAssociateUserDetails: true
    });
  };
  const toggleAssociateUserClose = () => {
    setAssociateUserModal({
      groupID: "",
      showAssociateUserDetails: false
    });
  };
  return loader ? (
    <Loader />
  ) : (
    <>
      <h4 className="wrap-header font-weight-bold">Group List</h4>
      <Row className="mb-4 text-right">
        <Col md={7}></Col>
        <Col md={5}>
          <Button variant="primary" size="sm" onClick={addGroup}>
            Add Group
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
            className="ml-2"
            onClick={handleDeleteBtnClick}
          >
            <i className="fa-fw fa fa-trash"></i>
          </Button>
        </Col>
      </Row>
      <div>
        <XATableLayout
          data={groupListingData}
          columns={columns}
          fetchData={fetchGroupInfo}
          pageCount={pageCount}
          rowSelectOp={{ position: "first", selectedRows }}
          getRowProps={(row) => ({
            className: row.values.isVisible == 0 && "row-inactive"
          })}
        />
      </div>
      <Modal show={showModal} onHide={toggleConfirmModal}>
        <Modal.Body>
          Are you sure you want to delete{" "}
          {selectedRows.current.length === 1
            ? selectedRows.current[0].original.name + " group"
            : selectedRows.current.length + " groups"}
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
        show={showGroupSyncDetails && showGroupSyncDetails.showSyncDetails}
        onHide={toggleGroupSyncModalClose}
        size="xl"
      >
        <Modal.Header>
          <Modal.Title>Sync Source Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SyncSourceDetails
            syncDetails={showGroupSyncDetails.syncDteails}
          ></SyncSourceDetails>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            size="sm"
            onClick={toggleGroupSyncModalClose}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={
          showAssociateUserModal &&
          showAssociateUserModal.showAssociateUserDetails
        }
        onHide={toggleAssociateUserClose}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>User's List: </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GroupAssociateUserDetails
            groupID={showAssociateUserModal.groupID}
          ></GroupAssociateUserDetails>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            size="sm"
            onClick={toggleAssociateUserClose}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Groups;
