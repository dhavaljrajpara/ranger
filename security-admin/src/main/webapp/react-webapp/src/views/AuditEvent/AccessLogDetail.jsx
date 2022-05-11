import React, { useState, useEffect } from "react";
import AccessLogsTable from "./AccessLogsTable";
import { PolicyViewDetails } from "./AdminLogs/PolicyViewDetails";
import { fetchApi } from "Utils/fetchAPI";
import { toast } from "react-toastify";
import { isEmpty, pick } from "lodash";
import { Loader } from "Components/CommonComponents";

function AccessLogDetail(props) {
  const [access, setAccess] = useState([]);
  const [serviceDefs, setServiceDefs] = useState([]);
  const [policyParamsData, setPolicyParamsData] = useState(null);
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
    let accessData = {};

    try {
      accessResp = await fetchApi({
        url: `assets/accessAudit`,
        params: {
          eventId: props.match.params.eventId
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
    let policyParams = pick(accessData, [
      "eventTime",
      "policyId",
      "policyVersion"
    ]);
    setAccess(accessData);
    setPolicyParamsData(policyParams);
    setLoader(false);
  };

  return loader ? (
    <Loader />
  ) : (
    <>
      <h4>
        {props.match.params.eventId !== undefined
          ? "Ranger – audit log"
          : "Audit Access Log Detail"}
      </h4>
      <div className="wrap">
        <AccessLogsTable data={access}></AccessLogsTable>
      </div>

      {policyParamsData.policyId != -1 && (
        <>
          <h4>Policy Details</h4>
          <div className="wrap">
            <PolicyViewDetails
              paramsData={policyParamsData}
              serviceDefs={serviceDefs}
              policyView={false}
            />
          </div>
        </>
      )}
    </>
  );
}

export default AccessLogDetail;
