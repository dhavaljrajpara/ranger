import React, { useState, useCallback, useRef, useEffect } from "react";
import { Badge, Row, Col } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { AuditFilterEntries } from "Components/CommonComponents";
import moment from "moment-timezone";
import StructuredFilter from "../../components/structured-filter/react-typeahead/tokenizer";
import { fetchApi } from "Utils/fetchAPI";
import { map } from "lodash";

function Plugins() {
  const [pluginsListingData, setPluginsLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const [entries, setEntries] = useState([]);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const fetchIdRef = useRef(0);
  const [searchFilterParams, setSearchFilter] = useState({});
  const [services, setServices] = useState([]);

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
    async ({ pageSize, pageIndex }) => {
      let logsResp = [];
      let logs = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      let params = { ...searchFilterParams };
      if (fetchId === fetchIdRef.current) {
        params["pageSize"] = pageSize;
        params["startIndex"] = pageIndex * pageSize;
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
        accessor: "repositoryName"
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
        }
      },
      {
        Header: "Plugin IP",
        accessor: "clientIP"
      },
      {
        Header: "Cluster Name",
        accessor: "clusterName",
        width: 100
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
        }
      },
      {
        Header: "Status",
        accessor: "syncStatus"
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

  const getServices = () => {
    let servicesName = [];

    servicesName = map(services, function (service) {
      return { label: service.name, value: service.name };
    });

    return servicesName;
  };

  return (
    <>
      <Row className="mb-2">
        <Col sm={12}>
          <StructuredFilter
            options={[
              {
                category: "cluster",
                label: "Cluster Name",
                type: "text"
              },
              {
                category: "endDate",
                label: "End Date",
                type: "date"
              },
              {
                category: "httpRetCode",
                label: "Http Response Code",
                type: "text"
              },
              {
                category: "agentId",
                label: "Plugin ID",
                type: "text"
              },
              {
                category: "clientIP",
                label: "Plugin IP",
                type: "text"
              },
              {
                category: "repositoryName",
                label: "Service Name",
                type: "textoptions",
                options: getServices
              },
              {
                category: "startDate",
                label: "Start Date",
                type: "date"
              }
            ]}
            onTokenAdd={updateSearchFilter}
            onTokenRemove={updateSearchFilter}
          />
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
      />
    </>
  );
}

export default Plugins;
