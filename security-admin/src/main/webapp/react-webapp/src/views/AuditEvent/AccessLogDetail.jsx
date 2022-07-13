import React, { useState, useEffect } from "react";
import AccessLogsTable from "./AccessLogsTable";
import { PolicyViewDetails } from "./AdminLogs/PolicyViewDetails";
import { fetchApi } from "Utils/fetchAPI";
import { toast } from "react-toastify";
import { isEmpty, pick } from "lodash";
import { Loader } from "Components/CommonComponents";
import { useParams } from "react-router-dom";

function AccessLogDetail(props) {
  const params = useParams();
  const [access, setAccess] = useState([]);
  const [serviceDefs, setServiceDefs] = useState([]);
  // const [policyParamsData, setPolicyParamsData] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    fetchServiceDefs();
    fetchAcessLogs();
  }, []);
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
  const fetchAcessLogs = async () => {
    let accessResp;
    let accessData;

    try {
      accessResp = await fetchApi({
        url: `assets/accessAudit`,
        params: {
          eventId: params.eventId
        }
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Access or CSRF headers! ${error}`
      );
      toast.error(error.response.data.msgDesc);
    }
    if (!isEmpty(accessResp)) {
      accessResp.data.vXAccessAudits.map((obj) => {
        accessData = obj;
      });
    }
    setAccess(accessData);
    setLoader(false);
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          <h4>
            {params.eventId !== undefined
              ? "Ranger – audit log"
              : "Audit Access Log Detail"}
          </h4>
          <div className="wrap">
            <AccessLogsTable data={access}></AccessLogsTable>
          </div>
          {access.policyId != -1 && (
            <>
              <h4>Policy Details</h4>
              <div className="wrap">
                <PolicyViewDetails
                  paramsData={access}
                  serviceDefs={serviceDefs}
                  policyView={false}
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default AccessLogDetail;
