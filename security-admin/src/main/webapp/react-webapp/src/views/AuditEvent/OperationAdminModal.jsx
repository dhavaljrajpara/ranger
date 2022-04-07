import React, { useEffect, useState } from "react";
import { ClassTypes } from "../../utils/XAEnums";
import { Modal, Button } from "react-bootstrap";
import { Loader } from "Components/CommonComponents";
import { fetchApi } from "Utils/fetchAPI";
import SecurityZonelogs from "./AdminLogs/SecurityZonelogs";
import UserLogs from "./AdminLogs/UserLogs";
import GroupLogs from "./AdminLogs/GroupLogs";
import RoleLogs from "./AdminLogs/RoleLogs";
import ServiceLogs from "./AdminLogs/ServiceLogs";
import PolicyLogs from "./AdminLogs/PolicyLogs";
import PasswordLogs from "./AdminLogs/PasswordLogs";
import UserprofileLogs from "./AdminLogs/UserprofileLogs";

export const OperationAdminModal = ({ onHide, show, data = {} }) => {
  const [reportdata, setReportData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showview, setShowview] = useState(null);
  const { objectClassType, action, objectId, transactionId } = data;

  useEffect(() => {
    show && rowModal();
  }, [show]);

  // const reload = () => window.location.reload();

  const rowModal = async () => {
    setLoader(true);
    try {
      const authResp = await fetchApi({
        url: `assets/report/${transactionId}`
      });
      let authlogs = authResp.data.vXTrxLogs;
      setShowview(objectId);
      setReportData(authlogs);
      setLoader(false);
    } catch (error) {
      console.error(`Error occurred while fetching Admin logs! ${error}`);
    }
  };

  return loader ? (
    <Loader />
  ) : (
    <Modal show={show} size="lg" onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Operation :{action || ""}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="overflow-auto p-3 mb-3 mb-md-0 mr-md-3">
        <div>
          {/* SERVICE */}

          {objectClassType == ClassTypes.CLASS_TYPE_RANGER_SERVICE.value && (
            <ServiceLogs reportdata={reportdata} data={data} />
          )}

          {/* POLICY */}

          {objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
            <PolicyLogs reportdata={reportdata} data={data} />
          )}

          {objectClassType == ClassTypes.CLASS_TYPE_USER_PROFILE.value && (
            <UserprofileLogs reportdata={reportdata} data={data} />
          )}
          {/* SECURITY ZONE */}

          {objectClassType ==
            ClassTypes.CLASS_TYPE_RANGER_SECURITY_ZONE.value && (
            <SecurityZonelogs reportdata={reportdata} data={data} />
          )}

          {/* USER */}

          {objectClassType == ClassTypes.CLASS_TYPE_XA_USER.value && (
            <UserLogs reportdata={reportdata} data={data} />
          )}

          {/* GROUP */}

          {objectClassType == ClassTypes.CLASS_TYPE_XA_GROUP.value && (
            <GroupLogs reportdata={reportdata} data={data} />
          )}
          {/* ROLE */}

          {objectClassType == ClassTypes.CLASS_TYPE_RANGER_ROLE.value && (
            <RoleLogs reportdata={reportdata} data={data} />
          )}

          {/* PASSWORD CHANGE */}

          {objectClassType == ClassTypes.CLASS_TYPE_PASSWORD_CHANGE.value && (
            <PasswordLogs reportdata={reportdata} data={data} />
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default OperationAdminModal;
