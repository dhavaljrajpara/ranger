import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Accordion, Badge, Card, Col, Row } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { fetchApi } from "Utils/fetchAPI";

function SearchPolicyTable(props) {
  const [searchPoliciesData, setSearchPolicies] = useState([]);
  const fetchIdRef = useRef(0);
  const [loader, setLoader] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = React.useState(0);

  const fetchSearchPolicies = useCallback(
    async ({ pageSize, pageIndex }) => {
      const fetchId = ++fetchIdRef.current;
      let searchPoliciesResp;
      let searchPolicies = [];
      let totalPoliciesCount = 0;
      let params = { ...props.searchParams };

      if (fetchId === fetchIdRef.current) {
        params["serviceType"] = props.serviceDef.name;
        params["pageSize"] = pageSize;
        params["startIndex"] = pageIndex * pageSize;
        try {
          searchPoliciesResp = await fetchApi({
            url: `plugins/policies`,
            params: params
          });
          searchPolicies = searchPoliciesResp.data.policies;
          totalPoliciesCount = searchPoliciesResp.data.totalCount;
        } catch (error) {
          `Error occurred while fetching Service Policies ! ${error}`;
        }

        setSearchPolicies(searchPolicies);
        setTotalCount(totalPoliciesCount);
        setPageCount(Math.ceil(totalPoliciesCount / pageSize));
        setLoader(false);
      }
    },
    [props.searchParamsUrl]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Policy ID",
        accessor: "id",
        Cell: (rawValue) => {
          return (
            <Link
              title="Edit"
              to={`/service/${props.serviceDef.id}/policies/${rawValue.value}/edit`}
            >
              {rawValue.value}
            </Link>
          );
        }
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
          else {
            let policyLabels = rawValue.value.map((label, index) => (
              <h6 className="d-inline mr-1" key={index}>
                <Badge variant="primary" key={label}>
                  {label}
                </Badge>
              </h6>
            ));
            return policyLabels;
          }
        }
      },
      {
        Header: "Resources",
        accessor: "resources",
        Cell: (rawValue) => {
          if (rawValue.value) {
            let keyName = Object.keys(rawValue.value);
            return keyName.map((key, index) => {
              let val = rawValue.value[key].values;
              return (
                <div key={index} className="text-center">
                  <b>{key}: </b>
                  {val.join()}
                </div>
              );
            });
          }
        }
      },
      {
        Header: "Policy Type",
        accessor: "policyType",
        Cell: (rawValue) => {
          if (rawValue.value == 1) {
            return (
              <h6 className="text-center">
                <Badge variant="primary">Masking</Badge>
              </h6>
            );
          } else if (rawValue.value == 2) {
            return (
              <h6 className="text-center">
                <Badge variant="primary">Row Level Filter</Badge>
              </h6>
            );
          } else
            return (
              <h6 className="text-center">
                <Badge variant="primary">Access</Badge>
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
              <h6 className="text-center">
                <Badge variant="success">Enabled</Badge>
              </h6>
            );
          else
            return (
              <h6 className="text-center">
                <Badge variant="danger">Disabled</Badge>
              </h6>
            );
        }
      },
      {
        Header: "Zone Name",
        accessor: "zoneName",
        Cell: (rawValue) => {
          if (rawValue.value == "") return "--";
          else {
            return (
              <h6 className="text-center">
                <Badge variant="dark">{rawValue.value}</Badge>
              </h6>
            );
          }
        }
      },
      {
        Header: "Allow Conditions",
        Cell: () => {
          return (
            <div className="text-center">
              <i className="fa-fw fa fa-plus"></i>
            </div>
          );
        }
      },
      {
        Header: "Allow Exclude",
        Cell: () => {
          return (
            <div className="text-center">
              <i className="fa-fw fa fa-plus"></i>
            </div>
          );
        }
      },
      {
        Header: "Deny Conditions",
        Cell: () => {
          return (
            <div className="text-center">
              <i className="fa-fw fa fa-plus"></i>
            </div>
          );
        }
      },
      {
        Header: "Deny Exclude",
        Cell: () => {
          return (
            <div className="text-center">
              <i className="fa-fw fa fa-plus"></i>
            </div>
          );
        }
      }
    ],
    []
  );

  return (
    <Row>
      <Col sm={12} className="mt-3">
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle
              className="border-top-0 border-right-0 border-right-0"
              as={Card.Header}
              eventKey="0"
            >
              <div className="clearfix">
                <span className="bold float-left text-uppercase">
                  {props.serviceDef.name}
                </span>
                <span className="float-right"></span>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <XATableLayout
                  loading={loader}
                  data={searchPoliciesData}
                  columns={columns}
                  fetchData={fetchSearchPolicies}
                  pagination
                  pageCount={pageCount}
                  totalCount={totalCount}
                />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Col>
    </Row>
  );
}

export default SearchPolicyTable;
