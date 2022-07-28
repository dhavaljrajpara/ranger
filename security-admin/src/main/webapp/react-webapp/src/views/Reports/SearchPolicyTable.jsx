import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  Badge,
  Button,
  Card,
  Col,
  Modal,
  Row,
  Table
} from "react-bootstrap";
import { isEmpty } from "lodash";
import { MoreLess } from "Components/CommonComponents";
import XATableLayout from "Components/XATableLayout";
import { fetchApi } from "Utils/fetchAPI";

function SearchPolicyTable(props) {
  const [searchPoliciesData, setSearchPolicies] = useState([]);
  const fetchIdRef = useRef(0);
  const [loader, setLoader] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = React.useState(0);
  const [policyData, setPolicyData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const showPolicyConditionModal = (policyData) => {
    setShowModal(true);
    setPolicyData(policyData);
  };

  const hidePolicyConditionModal = () => setShowModal(false);

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
        },
        width: 65
      },
      {
        Header: "Policy Name",
        accessor: "name",
        Cell: (val) => {
          return (
            <span
              className="text-truncate"
              style={{ maxWidth: "120px", display: "inline-block" }}
            >
              {val.value}
            </span>
          );
        }
      },
      {
        Header: "Policy Label",
        accessor: "policyLabels",
        Cell: (rawValue) => {
          let policyLabels = rawValue.value.map((label, index) => (
            <h6 className="d-inline mr-1" key={index}>
              {label}
            </h6>
          ));
          return !isEmpty(policyLabels) ? (
            <MoreLess data={policyLabels} key={rawValue.row.original.id} />
          ) : (
            <div className="text-center">--</div>
          );
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
                <div key={index} className="text-center overflow-text">
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
          return !isEmpty(rawValue.value) ? (
            <MoreLess data={rawValue.value} key={rawValue.row.original.id} />
          ) : (
            <div className="text-center">--</div>
          );
        }
      },
      {
        Header: "Policy Conditions",
        Cell: ({ row: { original } }) => {
          return (
            <div className="text-center">
              <Button
                variant="outline-dark"
                size="sm"
                title="View"
                onClick={(e) => {
                  e.stopPropagation();
                  showPolicyConditionModal(original);
                }}
              >
                <div className="text-center">
                  <i className="fa-fw fa fa-plus"></i>
                </div>
              </Button>
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
                  columnHide={false}
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
        <Modal show={showModal} onHide={hidePolicyConditionModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Policy Condition Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PolicyConditionData policyData={policyData} />
          </Modal.Body>
        </Modal>
      </Col>
    </Row>
  );
}

export default SearchPolicyTable;

function PolicyConditionData(props) {
  const getPolicyData = (policyItem) => {
    let tableRow = [];

    if (!isEmpty(policyItem)) {
      tableRow = policyItem.map((items, index) => {
        return (
          <tr key={index}>
            <td className="text-center report-table-modal">
              {!isEmpty(items.roles) ? (
                <MoreLess data={items.roles} />
              ) : (
                <div className="text-center">--</div>
              )}
            </td>
            <td className="text-center report-table-modal">
              {!isEmpty(items.groups) ? (
                <MoreLess data={items.groups} />
              ) : (
                <div className="text-center">--</div>
              )}
            </td>
            <td className="text-center report-table-modal">
              {!isEmpty(items.users) ? (
                <MoreLess data={items.users} />
              ) : (
                <div className="text-center">--</div>
              )}
            </td>
            <td className="text-center">
              {!isEmpty(items.accesses)
                ? items.accesses.map((obj) => (
                    <h6 className="d-inline mr-1">
                      <Badge variant="info" className="mr-1" key={obj.type}>
                        {obj.type}
                      </Badge>
                    </h6>
                  ))
                : "--"}
            </td>
          </tr>
        );
      });
    } else {
      tableRow.push(
        <tr key="no-data">
          <td className="text-center" colSpan="4">
            <span className="text-muted">"No data to show!!"</span>
          </td>
        </tr>
      );
    }
    return tableRow;
  };

  return (
    <React.Fragment>
      <p className="form-header">Allow Condition</p>
      <Table bordered size="sm" className="mb-3 table-audit-filter-ready-only">
        <thead>
          <tr>
            <th>Roles</th>
            <th>Groups</th>
            <th>Users</th>
            <th>Accesses</th>
          </tr>
        </thead>
        <tbody>{getPolicyData(props.policyData.policyItems)}</tbody>
      </Table>

      <p className="form-header">Allow Exclude</p>
      <Table bordered size="sm" className="mb-3 table-audit-filter-ready-only">
        <thead>
          <tr>
            <th>Roles</th>
            <th>Groups</th>
            <th>Users</th>
            <th>Accesses</th>
          </tr>
        </thead>
        <tbody>{getPolicyData(props.policyData.allowExceptions)}</tbody>
      </Table>

      <p className="form-header">Deny Conditions</p>
      <Table bordered size="sm" className="mb-3 table-audit-filter-ready-only">
        <thead>
          <tr>
            <th>Roles</th>
            <th>Groups</th>
            <th>Users</th>
            <th>Accesses</th>
          </tr>
        </thead>
        <tbody>{getPolicyData(props.policyData.denyPolicyItems)}</tbody>
      </Table>

      <p className="form-header">Deny Exclude </p>
      <Table bordered size="sm" className="mb-3 table-audit-filter-ready-only">
        <thead>
          <tr>
            <th>Roles</th>
            <th>Groups</th>
            <th>Users</th>
            <th>Accesses</th>
          </tr>
        </thead>
        <tbody>{getPolicyData(props.policyData.denyExceptions)}</tbody>
      </Table>
    </React.Fragment>
  );
}
