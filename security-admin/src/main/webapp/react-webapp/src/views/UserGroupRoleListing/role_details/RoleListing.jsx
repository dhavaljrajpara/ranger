import React, { useState, useCallback, useRef } from "react";
import { Badge, Button, Row, Col, Modal } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { MoreLess } from "Components/CommonComponents";
import { useNavigate, Link } from "react-router-dom";
import moment from "moment-timezone";
import { isEmpty } from "lodash";
import { fetchApi } from "Utils/fetchAPI";
import { toast } from "react-toastify";
import {
  isUser,
  isSystemAdmin,
  isKeyAdmin,
  isAuditor,
  isKMSAuditor
} from "Utils/XAUtils";
import { map } from "lodash";
import StructuredFilter from "../../../components/structured-filter/react-typeahead/tokenizer";

function Roles() {
  const navigate = useNavigate();
  const [roleListingData, setRoleData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const fetchIdRef = useRef(0);
  const selectedRows = useRef([]);
  const [showModal, setConfirmModal] = useState(false);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const [searchFilterParams, setSearchFilter] = useState({});

  const fetchRoleInfo = useCallback(
    async ({ pageSize, pageIndex }) => {
      let roleData = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      let params = { ...searchFilterParams };
      if (fetchId === fetchIdRef.current) {
        params["pageSize"] = pageSize;
        params["startIndex"] = pageIndex * pageSize;
        try {
          const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
          const roleResp = await fetchApi({
            url: "roles/lookup/roles",
            params: params
          });
          roleData = roleResp.data.roles;
          totalCount = roleResp.data.totalCount;
        } catch (error) {
          console.error(`Error occurred while fetching Role list! ${error}`);
        }
        setRoleData(roleData);
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
        },
        width: 100
      },

      {
        Header: "Users",
        accessor: "users",
        accessor: (raw) => {
          let usersList = _.map(raw.users, "name");
          return !isEmpty(usersList) ? (
            <MoreLess data={usersList} />
          ) : (
            <div className="text-center">--</div>
          );
        }
      },
      {
        Header: "Groups",
        accessor: "groups",
        accessor: (raw) => {
          let groupsList = _.map(raw.groups, "name");
          return !isEmpty(groupsList) ? (
            <MoreLess data={groupsList} />
          ) : (
            <div className="text-center">--</div>
          );
        }
      },
      {
        Header: "Roles",
        accessor: "roles",
        accessor: (raw) => {
          let rolesList = _.map(raw.roles, "name");

          return !isEmpty(rolesList) ? (
            <MoreLess data={rolesList} />
          ) : (
            <div className="text-center">--</div>
          );
        }
      }
    ],
    []
  );
  const addRole = () => {
    navigate("/roles/create");
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
    <div>
      <h4 className="wrap-header font-weight-bold">Role List</h4>
      <Row className="mb-4">
        <Col md={9}>
          <StructuredFilter
            key="role-listing-search-filter"
            placeholder="Search for your roles..."
            options={[
              {
                category: "groupNamePartial",
                label: "Group Name",
                type: "text"
              },
              {
                category: "roleNamePartial",
                label: "Role Name",
                type: "text"
              },
              {
                category: "userNamePartial",
                label: "User Name",
                type: "text"
              }
            ]}
            onTokenAdd={updateSearchFilter}
            onTokenRemove={updateSearchFilter}
            defaultSelected={[]}
          />
        </Col>
        {(isSystemAdmin() || isKeyAdmin()) && (
          <Col md={3} className="text-right">
            <Button variant="primary" size="sm" onClick={addRole}>
              Add New Role
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
