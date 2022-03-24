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
                <Badge variant="success">
                  {GroupTypes.GROUP_INTERNAL.label}{" "}
                </Badge>
              );
            else
              return (
                <Badge className="externalbadge">
                  {GroupTypes.GROUP_EXTERNAL.label}{" "}
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
                <Badge className="hiddenbadge">
                  {VisibilityStatus.STATUS_HIDDEN.label}{" "}
                </Badge>
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
              className="userViewicon"
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
      <h1>Group List</h1>
      <Row className="mb-4">
        <Col md={9}></Col>
        <Col md={1}>
          <Button onClick={addGroup}>Add Group</Button>
        </Col>
        <Col md={1}>
          <Button onClick={addGroup}>Set Visibility</Button>
        </Col>
        <Col md={1}>
          <Button
            variant="danger"
            size="sm"
            title="Delete"
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
