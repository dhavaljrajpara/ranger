import React, { Component, useState, useCallback, useRef } from "react";
import { Badge, Button, Row, Col } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { GroupSource } from "../../../utils/XAEnums";
import { GroupTypes } from "../../../utils/XAEnums";
import { VisibilityStatus } from "Utils/XAEnums";
import { Loader } from "Components/CommonComponents";
import { useHistory, Link } from "react-router-dom";

function Groups() {
  let history = useHistory();
  const [groupListingData, setGroupData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);
  const selectedRows = useRef([]);

  const fetchGroupInfo = useCallback(async ({ pageSize, pageIndex }) => {
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
        console.error(`Error occurred while fetching Group list! ${error}`);
      }
      setGroupData(groupData);
      setPageCount(Math.ceil(totalCount / pageSize));
      setLoader(false);
    }
  }, []);

  const handleDeleteBtnClick = () => {
    if (selectedRows.current.length > 0) {
      toggleConfirmModal();
    } else {
      toast.info("Please select atleast one group!!");
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
              <Link to={"/group/" + rawValue.row.original.id}>
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
                    {GroupTypes.GROUP_INTERNAL.label}{" "}
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
          if (rawValue.value) {
            if (rawValue)
              return (
                <h6>
                  <Badge variant="success">
                    {VisibilityStatus.STATUS_VISIBLE.label}{" "}
                  </Badge>
                </h6>
              );
            else
              return (
                <h6>
                  <Badge className="hiddenbadge">
                    {VisibilityStatus.STATUS_HIDDEN.label}{" "}
                  </Badge>
                </h6>
              );
          } else return "--";
        }
      },
      {
        Header: "Users",
        accessor: "member",
        Cell: (model) => {
          return (
            <button
              className="btn btn-outline-dark btn-sm"
              title="View Users"
              data-js="showUserList"
              data-name={model.name}
              data-id={model.id}
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
  const addGroup = () => {
    history.push("/groupCreate");
  };
  return loader ? (
    <Loader />
  ) : (
    <div>
      <h4 className="wrap-header font-weight-bold">Group List</h4>
      <Row className="mb-4 text-right">
        <Col md={7}></Col>
        <Col md={5}>
          <Button variant="primary" size="sm" onClick={addGroup}>
            Add Group
          </Button>
          <Button
            variant="primary"
            className="ml-2"
            size="sm"
            onClick={addGroup}
          >
            Set Visibility
          </Button>
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
        />
      </div>
    </div>
  );
}

export default Groups;
