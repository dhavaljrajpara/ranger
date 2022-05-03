import React, { useState, useEffect } from "react";
import AccessLogsTable from "./AccessLogsTable";
import { fetchApi } from "Utils/fetchAPI";
import { toast } from "react-toastify";
import { isEmpty } from "lodash";
import { Loader } from "Components/CommonComponents";

function AccessLogDetail(props) {
  const [access, setAccess] = useState([]);
  const [loader, SetLoader] = useState(true);

  useEffect(() => {
    fetchAcessLogs();
  }, []);

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
    setAccess(accessData);
    SetLoader(false);
  };

  return loader ? (
    <Loader />
  ) : (
    <>
      <h4 class="modal-title">
        {props.match.params.eventId !== undefined
          ? "Ranger – audit log"
          : "Audit Access Log Detail"}
      </h4>
      <div className="wrap">
        <AccessLogsTable data={access}></AccessLogsTable>
      </div>{" "}
    </>
  );
}

export default AccessLogDetail;
