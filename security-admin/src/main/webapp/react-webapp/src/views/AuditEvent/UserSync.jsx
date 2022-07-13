import React, { Component, useState, useCallback, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Badge, Modal, Button, Row, Col } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { AuditFilterEntries } from "Components/CommonComponents";
import { SyncSourceDetails } from "../UserGroupRoleListing/SyncSourceDetails";
import moment from "moment-timezone";
import StructuredFilter from "../../components/structured-filter/react-typeahead/tokenizer";
import { find, map, sortBy } from "lodash";
import { getTableSortBy, getTableSortType } from "../../utils/XAUtils";
import { useQuery } from "../../components/CommonComponents";

function User_Sync() {
  const [userSyncListingData, setUserSyncLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);
  const [entries, setEntries] = useState([]);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const [showTableSyncDetails, setTableSyncdetails] = useState({
    syncDteails: {},
    showSyncDetails: false
  });
  const [searchFilterParams, setSearchFilter] = useState({});
  const history = useHistory();
  const searchParams = useQuery();

  const fetchUserSyncInfo = useCallback(
    async ({ pageSize, pageIndex, sortBy }) => {
      let logsResp = [];
      let logs = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      let params = { ...searchFilterParams };
      if (fetchId === fetchIdRef.current) {
        params["pageSize"] = pageSize;
        params["startIndex"] = pageIndex * pageSize;
        if (sortBy.length > 0) {
          params["sortBy"] = getTableSortBy(sortBy);
          params["sortType"] = getTableSortType(sortBy);
        }
        try {
          const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
          logsResp = await fetchApi({
            url: "assets/ugsyncAudits",
            params: params
          });
          logs = logsResp.data.vxUgsyncAuditInfoList;
          totalCount = logsResp.data.totalCount;
        } catch (error) {
          console.error(
            `Error occurred while fetching User Sync logs! ${error}`
          );
        }
        setUserSyncLogs(logs);
        setEntries(logsResp.data);
        setPageCount(Math.ceil(totalCount / pageSize));
        setLoader(false);
      }
    },
    [updateTable, searchFilterParams]
  );
  const refreshTable = () => {
    setUserSyncLogs([]);
    setLoader(true);
    setUpdateTable(moment.now());
  };
  const toggleTableSyncModal = (raw) => {
    setTableSyncdetails({
      syncDteails: raw,
      showSyncDetails: true
    });
  };
  const toggleTableSyncModalClose = () => {
    setTableSyncdetails({
      syncDteails: {},
      showSyncDetails: false
    });
  };
  const getDefaultSort = React.useMemo(
    () => [
      {
        id: "eventTime",
        desc: true
      }
    ],
    []
  );
  const columns = React.useMemo(
    () => [
      {
        Header: "User Name",
        accessor: "userName",
        disableSortBy: true
      },
      {
        Header: "Sync Source",
        accessor: "syncSource",
        Cell: (rawValue) => {
          return (
            <div className="text-center">
              <h6>
                <Badge variant="success">{rawValue.value}</Badge>
              </h6>
            </div>
          );
        },
        disableSortBy: true
      },
      {
        Header: "Number Of New",
        id: "new",
        columns: [
          {
            Header: "Users",

            accessor: "noOfNewUsers",
            width: 100,
            disableSortBy: true
          },
          {
            Header: "Groups",

            accessor: "noOfNewGroups",
            width: 100,
            disableSortBy: true
          }
        ]
      },
      {
        Header: "Number Of Modified",
        id: "modified",
        columns: [
          {
            Header: "Users",
            accessor: "noOfModifiedUsers",
            width: 100,
            disableSortBy: true
          },
          {
            Header: "Groups",
            accessor: "noOfModifiedGroups",
            width: 100,
            disableSortBy: true
          }
        ]
      },

      {
        Header: "Event Time",
        accessor: "eventTime",
        Cell: (rawValue) => {
          const date = rawValue.value;
          const newdate = moment
            .tz(date, "Asia/Kolkata")
            .format("MM/DD/YYYY HH:mm:ss A");
          return newdate;
        },
        minWidth: 170,
        sortable: true
      },
      {
        Header: "Sync Details",
        accessor: "syncSourceInfo",
        Cell: (rawValue, model) => {
          if (rawValue.value) {
            return (
              <div className="text-center">
                <button
                  className="btn btn-outline-dark btn-sm"
                  data-id="syncDetailes"
                  title="Sync Details"
                  id={model.id}
                  onClick={() => {
                    toggleTableSyncModal(rawValue.value);
                  }}
                >
                  <i className="fa-fw fa fa-eye"> </i>
                </button>
              </div>
            );
          } else {
            return " -- ";
          }
        },
        disableSortBy: true
      }
    ],
    []
  );

  const updateSearchFilter = (filter) => {
    console.log("PRINT Filter : ", filter);
    let searchFilter = {};
    let searchFilterUrlParam = {};

    map(filter, function (obj) {
      searchFilter[obj.category] = obj.value;
      let searchFilterObj = find(searchFilterOption, {
        category: obj.category
      });
      searchFilterUrlParam[searchFilterObj.urlLabel] = obj.value;
      if (searchFilterObj.type == "textoptions") {
        let textOptionObj = find(searchFilterObj.options(), {
          value: obj.value
        });
        searchParams.set(searchFilterObj.urlLabel, textOptionObj.label);
      } else {
        searchParams.set(searchFilterObj.urlLabel, obj.value);
      }
    });
    setSearchFilter(searchFilter);

    for (const searchParam of searchParams.entries()) {
      const [param, value] = searchParam;
      if (searchFilterUrlParam[param] !== undefined) {
        searchParams.set(param, value);
      } else {
        searchParams.delete(param);
      }
    }

    history.replace({
      pathname: "/reports/audit/userSync",
      search: searchParams.toString()
    });
  };

  const searchFilterOption = [
    {
      category: "endDate",
      label: "End Date",
      urlLabel: "endDate",
      type: "text"
    },
    {
      category: "startDate",
      label: "Start Date",
      urlLabel: "startDate",
      type: "text"
    },
    {
      category: "syncSource",
      label: "Sync Source",
      urlLabel: "syncSource",
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
      category: "userName",
      label: "User Name",
      urlLabel: "userName",
      type: "text"
    }
  ];

  return (
    <div className="wrap">
      <Row className="mb-2">
        <Col sm={12}>
          <div className="searchbox-border">
            <StructuredFilter
              key="usersync-audit-search-filter"
              placeholder="Search for your user sync audits..."
              options={sortBy(searchFilterOption, ["label"])}
              onTokenAdd={updateSearchFilter}
              onTokenRemove={updateSearchFilter}
              defaultSelected={[]}
            />
          </div>
        </Col>
      </Row>
      <AuditFilterEntries entries={entries} refreshTable={refreshTable} />
      <XATableLayout
        data={userSyncListingData}
        columns={columns}
        loading={loader}
        totalCount={entries && entries.totalCount}
        fetchData={fetchUserSyncInfo}
        pageCount={pageCount}
        columnSort={true}
        defaultSort={getDefaultSort}
      />
      <Modal
        show={showTableSyncDetails && showTableSyncDetails.showSyncDetails}
        onHide={toggleTableSyncModalClose}
        size="xl"
      >
        <Modal.Header>
          <Modal.Title>Sync Source Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SyncSourceDetails
            syncDetails={showTableSyncDetails.syncDteails}
          ></SyncSourceDetails>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            size="sm"
            onClick={toggleTableSyncModalClose}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default User_Sync;
