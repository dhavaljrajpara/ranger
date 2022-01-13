import React, { Component, useState, useCallback, useRef } from "react";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";

export function Services() {
  const [serviceData, setServices] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);

  const fetchService = useCallback(async ({ pageSize, pageIndex }) => {
    let service = [];
    let totalCount = 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
        const serviceResp = await fetchApi({
          url: "plugins/services",
          params: {
            pageSize: pageSize,
            startIndex: pageIndex * pageSize
          }
        });
        service = serviceResp.data.services;
        totalCount = serviceResp.data.totalCount;
      } catch (error) {
        console.error(`Error occurred while fetching Plugins logs! ${error}`);
      }
      setServices(service);
      setPageCount(Math.ceil(totalCount / pageSize));
      setLoader(false);
    }
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Service Name",
        accessor: "name" // accessor is the "key" in the data
      },
      {
        Header: "Service Type",
        accessor: "type" // accessor is the "key" in the data
      },
      {
        Header: "Resource",
        accessor: "Resource",
        accessor: () => {
          return (
            <a
              href="javascript:;"
              className="btn btn-mini pull-left"
              id="btnplus"
              title="add"
            >
              <i className="fa-fw fa fa-plus" id="plusicon"></i>
            </a>
          );
        }
      }
    ],
    []
  );
  return loader ? (
    <Loader />
  ) : (
    <XATableLayout
      data={serviceData}
      columns={columns}
      fetchData={fetchService}
      pageCount={pageCount}
    />
  );
}

export default Services;
