import React, { useState, useRef, useCallback, useEffect } from "react";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";
import Select from "react-select";
import { Row, Col, Button } from "react-bootstrap";
import { fetchApi } from "Utils/fetchAPI";
import { useHistory } from "react-router-dom";
import dateFormat from "dateformat";

const KeyManager = () => {
  const history = useHistory();
  const [serviceslistData, setServices] = useState([]);
  const [selservicesData, setSelServices] = useState([]);
  const [selcval, setSelval] = useState();
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    fetchServices();
    selectServices();
  }, []);

  const addKey = async () => {
    try {
      await fetchApi({
        url: "plugins/services/name/kms",
      });
      history.push("/kms/keys/cm_kms/create");
    } catch (error) {
      console.error(`Error occurred while fetching Services! ${error}`);
    }

    try {
      await fetchApi({
        url: "plugins/definitions/name/kms",
      });
    } catch (error) {
      console.error(`Error occurred while fetching Definitions! ${error}`);
    }
  };
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);

  const fetchServices = useCallback(async ({ pageSize, pageIndex }) => {
    let servicesdata = [];
    let totalCount = 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        const servicesResp = await fetchApi({
          url: "plugins/services",
          params: {
            pageSize: pageSize,
            startIndex: pageIndex * pageSize,
          },
        });
        servicesdata = servicesResp.data.services;
        totalCount = servicesResp.data.totalCount;
      } catch (error) {
        console.error(`Error occurred while fetching Services! ${error}`);
      }
      setServices(servicesdata);
      setPageCount(Math.ceil(totalCount / pageSize));
      setLoader(false);
    }
  }, []);

  const selectServices = useCallback(async ({ pageSize, pageIndex }, e) => {
    let selcservicesdata = [];
    let totalCount = 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        if (e !== undefined) {
          const selservicesResp = await fetchApi({
            url: "/keys/keys",
            params: {
              pageSize: pageSize,
              startIndex: pageIndex * pageSize,
              provider: e.label,
            },
          });
          selcservicesdata = selservicesResp.data.vXKeys;
          totalCount = selservicesResp.data.totalCount;
        }
      } catch (error) {
        console.error(`Error occurred while fetching Services! ${error}`);
      }
      setSelServices(selcservicesdata);
      setPageCount(Math.ceil(totalCount / pageSize));
      setSelval(e);
      setLoader(false);
    }
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Key Name",
        accessor: "name",
      },
      {
        Header: "Cipher",
        accessor: "cipher",
      },
      {
        Header: "Version",
        accessor: "version",
      },
      {
        Header: "Attributes",
        accessor: "attributes",
      },
      {
        Header: "Length",
        accessor: "length",
      },
      {
        Header: "Created Date",
        accessor: "createDate", // accessor is the "key" in the data
        Cell: (rawValue) => {
          const date = rawValue.value;
          const newdate = dateFormat(date, "mm/dd/yyyy hh:MM:ss TT");
          return newdate;
        },
      },
      {
        Header: "Action",
        accessor: "action",
      },
    ],
    []
  );

  return loader ? (
    <Loader />
  ) : (
    <div>
      <h5 className="font-weight-bold">Key Management</h5>

      <div className="wrap">
        <fieldset>
          <div className="formHeader" style={{ padding: "12px 4px" }}>
            Select Service:
            <Select
              className="w-25 p-1"
              isClearable
              onChange={selectServices}
              components={{
                IndicatorSeparator: () => null,
              }}
              options={serviceslistData.map((service) => {
                return {
                  value: service.id,
                  label: service.name,
                };
              })}
              name="colors"
              placeholder="Please select KMS service"
            />
          </div>
          <br />
        </fieldset>
        <Row className="mb-2">
          <Col md={10}></Col>
          <Col md={2}>
            <Button
              className={selcval !== undefined ? "" : "button-disabled"}
              disabled={selcval != undefined ? false : true}
              onClick={addKey}
            >
              Add New Key
            </Button>
          </Col>
        </Row>
        <div>
          <XATableLayout
            data={selservicesData}
            columns={columns}
            fetchData={fetchServices}
            pageCount={pageCount}
          />
        </div>
      </div>
    </div>
  );
};

export default KeyManager;
