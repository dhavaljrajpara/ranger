import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge, Button, Col, Row, Modal } from "react-bootstrap";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import { pick, indexOf, isUndefined, isEmpty, map } from "lodash";
import { fetchApi } from "Utils/fetchAPI";
import XATableLayout from "Components/XATableLayout";
import { showGroupsOrUsersOrRolesForPolicy } from "Utils/XAUtils";
import { MoreLess } from "Components/CommonComponents";
import PolicyViewDetails from "../AuditEvent/AdminLogs/PolicyViewDetails";
import StructuredFilter from "../../components/structured-filter/react-typeahead/tokenizer";

function PolicyListing() {
  const [policyListingData, setPolicyData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);
  const [deletePolicyModal, setConfirmModal] = useState({
    policyDetails: {},
    showSyncDetails: false
  });
  const [serviceDefs, setServiceDefs] = useState([]);
  const [policyviewmodal, setPolicyViewModal] = useState(false);
  const [policyParamsData, setPolicyParamsData] = useState(null);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilterParams, setSearchFilter] = useState({});

  let { serviceId, policyType } = useParams();

  useEffect(() => {
    fetchServiceDefs();
  }, []);

  const fetchPolicyInfo = useCallback(
    async ({ pageSize, pageIndex }) => {
      let policyData = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      let params = { ...searchFilterParams };
      if (fetchId === fetchIdRef.current) {
        params["pageSize"] = pageSize;
        params["startIndex"] = pageIndex * pageSize;
        params["policyType"] = policyType;
        try {
          const policyResp = await fetchApi({
            url: `plugins/policies/service/${serviceId}`,
            params: params
          });
          policyData = policyResp.data.policies;
          totalCount = policyResp.data.totalCount;
        } catch (error) {
          console.error(`Error occurred while fetching Policies ! ${error}`);
        }
        setPolicyData(policyData);
        setTotalCount(totalCount);
        setPageCount(Math.ceil(totalCount / pageSize));
        setLoader(false);
      }
    },
    [updateTable, searchFilterParams]
  );
  const fetchServiceDefs = async () => {
    let serviceDefsResp = [];
    try {
      serviceDefsResp = await fetchApi({
        url: "plugins/definitions"
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Service Definitions or CSRF headers! ${error}`
      );
    }

    setServiceDefs(serviceDefsResp.data.serviceDefs);
    setLoader(false);
  };
  const toggleConfirmModalForDelete = (policyID, policyName) => {
    setConfirmModal({
      policyDetails: { policyID: policyID, policyName: policyName },
      showPopup: true
    });
  };

  const toggleClose = () => {
    setConfirmModal({
      policyDetails: {},
      showPopup: false
    });
  };
  const handleClosePolicyId = () => setPolicyViewModal(false);
  const openModal = (policyDetails) => {
    let policyId = pick(policyDetails, ["id"]);
    setPolicyViewModal(true);
    setPolicyParamsData(policyDetails);
    fetchVersions(policyId.id);
  };
  const fetchVersions = async (policyId) => {
    let versionsResp = {};
    try {
      versionsResp = await fetchApi({
        url: `plugins/policy/${policyId}/versionList`
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Policy Version or CSRF headers! ${error}`
      );
    }
    setCurrentPage(
      versionsResp.data.value
        .split(",")
        .map(Number)
        .sort(function (a, b) {
          return a - b;
        })
    );
    setLoader(false);
  };

  const handleDeleteClick = async (policyID) => {
    try {
      await fetchApi({
        url: `plugins/policies/${policyID}`,
        method: "DELETE"
      });
      toast.success(" Success! Policy deleted successfully");
    } catch (error) {
      console.log(error.response);
      if (error.response.data.msgDesc) {
        errorMsg += error.response.data.msgDesc + "\n";
      } else {
        errorMsg += `Error occurred during deleting policy`;
      }
    }
    setUpdateTable(moment.now());
    toggleClose();
  };
  const previousVer = (e) => {
    if (e.currentTarget.classList.contains("active")) {
      let curr = policyParamsData && policyParamsData.version;
      let policyVersionList = currentPage;
      var previousVal =
        policyVersionList[
          (indexOf(policyVersionList, curr) - 1) % policyVersionList.length
        ];
    }
    let prevVal = {};
    prevVal.version = previousVal;
    prevVal.id = policyParamsData.id;
    prevVal.isChangeVersion = true;
    setPolicyParamsData(prevVal);
  };
  const nextVer = (e) => {
    if (e.currentTarget.classList.contains("active")) {
      let curr = policyParamsData && policyParamsData.version;
      let policyVersionList = currentPage;
      var nextValue =
        policyVersionList[
          (indexOf(policyVersionList, curr) + 1) % policyVersionList.length
        ];
    }
    let nextVal = {};
    nextVal.version = nextValue;
    nextVal.id = policyParamsData.id;
    nextVal.isChangeVersion = true;
    setPolicyParamsData(nextVal);
  };

  const revert = (e) => {
    e.preventDefault();
    let version = policyParamsData && policyParamsData.version;
    let revertVal = {};
    revertVal.version = version;
    revertVal.id = policyParamsData.id;
    revertVal.isRevert = true;
    setPolicyParamsData(revertVal);
    setPolicyViewModal(false);
  };
  const updateServices = () => {
    setUpdateTable(moment.now());
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "Policy ID",
        accessor: "id",
        Cell: (rawValue) => {
          return (
            <Link
              title="Edit"
              to={`/service/${serviceId}/policies/${rawValue.value}/edit`}
            >
              {rawValue.value}
            </Link>
          );
        },
        width: 70
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
        },
        width: 100
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
        },
        width: 100
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
        },
        width: 110
      },
      {
        Header: "Roles",
        accessor: "roles",
        Cell: (rawValue) => {
          let rolesData = showGroupsOrUsersOrRolesForPolicy(
            "roles",
            rawValue.row.original,
            policyType
          );
          return !isEmpty(rolesData) ? (
            <MoreLess data={rolesData} />
          ) : (
            <div className="text-center">--</div>
          );
        },
        minWidth: 190
      },
      {
        Header: "Groups",
        accessor: "groups",
        Cell: (rawValue) => {
          let groupsData = showGroupsOrUsersOrRolesForPolicy(
            "groups",
            rawValue.row.original,
            policyType
          );
          return !isEmpty(groupsData) ? (
            <MoreLess data={groupsData} />
          ) : (
            <div className="text-center">--</div>
          );
        },
        minWidth: 190
      },
      {
        Header: "Users",
        accessor: "users",
        Cell: (rawValue) => {
          let usersData = showGroupsOrUsersOrRolesForPolicy(
            "users",
            rawValue.row.original,
            policyType
          );
          return !isEmpty(usersData) ? (
            <MoreLess data={usersData} />
          ) : (
            <div className="text-center">--</div>
          );
        },
        minWidth: 190
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <Button
                variant="outline-dark"
                size="sm"
                className="m-r-5"
                title="View"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(original);
                }}
              >
                <i className="fa-fw fa fa-eye fa-fw fa fa-large"></i>
              </Button>
              <Link
                className="btn btn-outline-dark btn-sm m-r-5"
                title="Edit"
                to={`/service/${serviceId}/policies/${original.id}/edit`}
              >
                <i className="fa-fw fa fa-edit"></i>
              </Link>
              <Button
                variant="danger"
                size="sm"
                className="m-r-5"
                title="Delete"
                onClick={() =>
                  toggleConfirmModalForDelete(original.id, original.name)
                }
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

  const updateSearchFilter = (filter) => {
    console.log("PRINT Filter : ", filter);
    let searchFilter = {};

    map(filter, function (obj) {
      searchFilter[obj.category] = obj.value;
    });
    setSearchFilter(searchFilter);
  };

  return (
    <React.Fragment>
      <h4 className="wrap-header bold">List of Policies </h4>
      <div className="wrap policy-listing">
        <Row>
          <Col sm={10}>
            <StructuredFilter
              options={[
                {
                  category: "group",
                  label: "Group Name",
                  type: "text"
                },
                {
                  category: "policyLabelsPartial",
                  label: "Policy Label",
                  type: "text"
                },
                {
                  category: "policyNamePartial:",
                  label: "Policy Name",
                  type: "text"
                },
                {
                  category: "role",
                  label: "Role Name",
                  type: "text"
                },
                {
                  category: "isEnabled",
                  label: "Status",
                  type: "textoptions",
                  options: () => {
                    return [
                      { value: "true", label: "Enabled" },
                      { value: "false", label: "Disabled" }
                    ];
                  }
                },
                {
                  category: "user",
                  label: "User Name",
                  type: "text"
                }
              ]}
              onTokenAdd={updateSearchFilter}
              onTokenRemove={updateSearchFilter}
            />
          </Col>
          <Col sm={2}>
            <div className="pull-right mb-1">
              <Link
                role="button"
                to={`/service/${serviceId}/policies/create/${policyType}`}
                className="btn btn-sm btn-primary mb-2"
              >
                Add New Policy
              </Link>
            </div>
          </Col>
        </Row>
        <br />
        <>
          <XATableLayout
            data={policyListingData}
            columns={columns}
            fetchData={fetchPolicyInfo}
            pagination
            pageCount={pageCount}
            loading={loader}
          />
        </>
      </div>
      <Modal show={deletePolicyModal.showPopup} onHide={toggleClose}>
        <Modal.Body>Are you sure you want to delete</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={toggleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              handleDeleteClick(deletePolicyModal.policyDetails.policyID)
            }
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={policyviewmodal} onHide={handleClosePolicyId} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Policy Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PolicyViewDetails
            paramsData={policyParamsData}
            serviceDefs={serviceDefs}
            policyInfo={fetchPolicyInfo}
            totalCount={totalCount}
            policyView={true}
            updateServices={updateServices}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="policy-version pull-left">
            <i
              className={
                policyParamsData && policyParamsData.version > 1
                  ? "fa-fw fa fa-chevron-left active"
                  : "fa-fw fa fa-chevron-left"
              }
              onClick={(e) =>
                e.currentTarget.classList.contains("active") && previousVer(e)
              }
            ></i>
            <span>{`Version ${
              policyParamsData && policyParamsData.version
            }`}</span>
            <i
              className={
                !isUndefined(
                  currentPage[
                    indexOf(
                      currentPage,
                      policyParamsData && policyParamsData.version
                    ) + 1
                  ]
                )
                  ? "fa-fw fa fa-chevron-right active"
                  : "fa-fw fa fa-chevron-right"
              }
              onClick={(e) =>
                e.currentTarget.classList.contains("active") && nextVer(e)
              }
            ></i>
            {!isUndefined(
              currentPage[
                indexOf(
                  currentPage,
                  policyParamsData && policyParamsData.version
                ) + 1
              ]
            ) && (
              <Button variant="primary" onClick={(e) => revert(e)}>
                Revert
              </Button>
            )}
          </div>
          <Button variant="primary" onClick={handleClosePolicyId}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default PolicyListing;
