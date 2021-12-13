import React, { Component, useState, useCallback, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge, Button, Col, Row } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";

function PolicyListing() {
  const [policyListingData, setPolicyData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);
  let { serviceId, policyType } = useParams();

  const fetchPolicyInfo = useCallback(async ({ pageSize, pageIndex }) => {
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
            startIndex: pageIndex * pageSize
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
  }, []);

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
        Cell: (rawValue) => {
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
              <Button
                variant="outline-dark"
                size="sm"
                className="m-r-5"
                title="Edit"
              >
                <i className="fa-fw fa fa-edit fa-fw fa fa-large"></i>
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="m-r-5"
                title="Delete"
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
  return loader ? (
    <Loader />
  ) : (
    <div>
      <h4 class="wrap-header bold">List of Policies </h4>
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
            />
          </div>
        </Row>
      </div>
    </div>
  );
}

export default PolicyListing;
