import React, { useState, useCallback, useRef, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Badge, Row, Col } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { AuditFilterEntries } from "Components/CommonComponents";
import moment from "moment-timezone";
import { find, map, sortBy } from "lodash";
import StructuredFilter from "../../components/structured-filter/react-typeahead/tokenizer";
import { fetchApi } from "Utils/fetchAPI";
import { getTableSortBy, getTableSortType } from "../../utils/XAUtils";
import { useQuery } from "../../components/CommonComponents";

function Plugins() {
  const [pluginsListingData, setPluginsLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const [entries, setEntries] = useState([]);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const fetchIdRef = useRef(0);
  const [searchFilterParams, setSearchFilter] = useState({});
  const [services, setServices] = useState([]);
  const history = useHistory();
  const searchParams = useQuery();

  useEffect(() => {
    fetchServices();
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
          const date = rawValue.value;
          const newdate = moment
            .tz(date, "Asia/Kolkata")
            .format("MM/DD/YYYY HH:mm:ss A");
          return newdate;
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
      pathname: "/reports/audit/agent",
      search: searchParams.toString()
    });
  };

  const getServices = () => {
    let servicesName = [];

    servicesName = map(services, function (service) {
      return { label: service.name, value: service.name };
    });

    return servicesName;
  };

  const searchFilterOption = [
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
      <Row className="mb-2">
        <Col sm={12}>
          <div className="searchbox-border">
            <StructuredFilter
              key="plugin-log-search-filter"
              placeholder="Search for your plugins..."
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
        data={pluginsListingData}
        columns={columns}
        loading={loader}
        totalCount={entries && entries.totalCount}
        fetchData={fetchPluginsInfo}
        pageCount={pageCount}
        columnSort={true}
        defaultSort={getDefaultSort}
      />
    </div>
  );
}

export default Plugins;
