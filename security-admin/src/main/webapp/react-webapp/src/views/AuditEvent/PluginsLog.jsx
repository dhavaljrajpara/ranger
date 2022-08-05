import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge, Row, Col } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { AuditFilterEntries } from "Components/CommonComponents";
import moment from "moment-timezone";
import dateFormat from "dateformat";
import { find, map, sortBy } from "lodash";
import StructuredFilter from "../../components/structured-filter/react-typeahead/tokenizer";
import { fetchApi } from "Utils/fetchAPI";
import {
  getTableSortBy,
  getTableSortType,
  fetchSearchFilterParams
} from "../../utils/XAUtils";

function Plugins() {
  const [pluginsListingData, setPluginsLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const [entries, setEntries] = useState([]);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const fetchIdRef = useRef(0);
  const [services, setServices] = useState([]);
  const [contentLoader, setContentLoader] = useState(true);
  const [searchFilterParams, setSearchFilterParams] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [defaultSearchFilterParams, setDefaultSearchFilterParams] = useState(
    []
  );

  useEffect(() => {
    fetchServices();

    let { searchFilterParam, defaultSearchFilterParam, searchParam } =
      fetchSearchFilterParams("agent", searchParams, searchFilterOptions);

    // Updating the states for search params, search filter, default search filter and localStorage
    setSearchParams(searchParam);
    setSearchFilterParams(searchFilterParam);
    setDefaultSearchFilterParams(defaultSearchFilterParam);
    localStorage.setItem("agent", JSON.stringify(searchParam));
    setContentLoader(false);
  }, []);

  const fetchServices = async () => {
    let servicesResp = [];
    try {
      servicesResp = await fetchApi({
        url: "plugins/services"
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Services or CSRF headers! ${error}`
      );
    }

    setServices(servicesResp.data.services);
    setLoader(false);
  };

  const fetchPluginsInfo = useCallback(
    async ({ pageSize, pageIndex, sortBy }) => {
      setLoader(true);
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
          logsResp = await fetchApi({
            url: "assets/exportAudit",
            params: params
          });
          logs = logsResp.data.vXPolicyExportAudits;
          totalCount = logsResp.data.totalCount;
        } catch (error) {
          console.error(`Error occurred while fetching Plugins logs! ${error}`);
        }
        setPluginsLogs(logs);
        setEntries(logsResp.data);
        setPageCount(Math.ceil(totalCount / pageSize));
        setLoader(false);
      }
    },
    [updateTable, searchFilterParams]
  );

  const refreshTable = () => {
    setPluginsLogs([]);
    setLoader(true);
    setUpdateTable(moment.now());
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Export Date ( India Standard Time )",
        accessor: "createDate",
        Cell: (rawValue) => {
          const formatDateTime = dateFormat(
            rawValue.value,
            "mm/dd/yyyy hh:MM:ss TT"
          );
          return <div className="text-center">{formatDateTime}</div>;
        },
        width: 240
      },
      {
        Header: "Service Name",
        accessor: "repositoryName",
        disableSortBy: true
      },
      {
        Header: "Plugin ID",
        accessor: "agentId",
        Cell: (rawValue) => {
          return (
            <div className="overflow-text">
              <span title={rawValue.value}>{rawValue.value}</span>
            </div>
          );
        },
        disableSortBy: true
      },
      {
        Header: "Plugin IP",
        accessor: "clientIP",
        disableSortBy: true
      },
      {
        Header: "Cluster Name",
        accessor: "clusterName",
        width: 100,
        disableSortBy: true
      },
      {
        Header: "Http Response Code",
        accessor: "httpRetCode",
        Cell: (rawValue) => {
          return (
            <h6>
              <Badge variant="success">{rawValue.value}</Badge>
            </h6>
          );
        },
        disableSortBy: true
      },
      {
        Header: "Status",
        accessor: "syncStatus",
        disableSortBy: true
      }
    ],
    []
  );

  const getDefaultSort = React.useMemo(
    () => [
      {
        id: "createDate",
        desc: true
      }
    ],
    []
  );

  const updateSearchFilter = (filter) => {
    console.log("PRINT Filter from tokenizer : ", filter);

    let searchFilterParam = {};
    let searchParam = {};

    map(filter, function (obj) {
      searchFilterParam[obj.category] = obj.value;

      let searchFilterObj = find(searchFilterOptions, {
        category: obj.category
      });

      let urlLabelParam = searchFilterObj.urlLabel;

      if (searchFilterObj.type == "textoptions") {
        let textOptionObj = find(searchFilterObj.options(), {
          value: obj.value
        });
        searchParam[urlLabelParam] = textOptionObj.label;
      } else {
        searchParam[urlLabelParam] = obj.value;
      }
    });

    setSearchFilterParams(searchFilterParam);
    setSearchParams(searchParam);
    localStorage.setItem("agent", JSON.stringify(searchParam));
  };

  const getServices = () => {
    let servicesName = [];

    servicesName = map(services, function (service) {
      return { label: service.name, value: service.name };
    });

    return servicesName;
  };

  const searchFilterOptions = [
    {
      category: "cluster",
      label: "Cluster Name",
      urlLabel: "clusterName",
      type: "text"
    },
    {
      category: "endDate",
      label: "End Date",
      urlLabel: "endDate",
      type: "date"
    },
    {
      category: "httpRetCode",
      label: "Http Response Code",
      urlLabel: "httpResponseCode",
      type: "text"
    },
    {
      category: "agentId",
      label: "Plugin ID",
      urlLabel: "pluginID",
      type: "text"
    },
    {
      category: "clientIP",
      label: "Plugin IP",
      urlLabel: "pluginIP",
      type: "text"
    },
    {
      category: "repositoryName",
      label: "Service Name",
      urlLabel: "serviceName",
      type: "textoptions",
      options: getServices
    },
    {
      category: "startDate",
      label: "Start Date",
      urlLabel: "startDate",
      type: "date"
    }
  ];

  return (
    <div className="wrap">
      {contentLoader ? (
        <Row>
          <Col sm={12} className="text-center">
            <div className="spinner-border mr-2" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </Col>
        </Row>
      ) : (
        <React.Fragment>
          <Row className="mb-2">
            <Col sm={12}>
              <div className="searchbox-border">
                <StructuredFilter
                  key="plugin-log-search-filter"
                  placeholder="Search for your plugins..."
                  options={sortBy(searchFilterOptions, ["label"])}
                  onTokenAdd={updateSearchFilter}
                  onTokenRemove={updateSearchFilter}
                  defaultSelected={defaultSearchFilterParams}
                />
              </div>
            </Col>
          </Row>
          <AuditFilterEntries entries={entries} refreshTable={refreshTable} />
          <XATableLayout
            data={pluginsListingData}
            columns={columns}
            loading={loader}
            totalCount={entries && entries.totalCount}
            fetchData={fetchPluginsInfo}
            pageCount={pageCount}
            columnSort={true}
            defaultSort={getDefaultSort}
          />
        </React.Fragment>
      )}
    </div>
  );
}

export default Plugins;
