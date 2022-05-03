import React from "react";
import { Button, Table } from "react-bootstrap";

import dateFormat from "dateformat";
import { isEmpty } from "lodash";
import { toast } from "react-toastify";

export const AccessLogsTable = ({ data = {} }) => {
  const {
    eventTime,
    eventId,
    accessResult,
    clientIP,
    clusterName,
    action,
    policyId,
    requestUser,
    repoName,
    serviceType,
    serviceTypeDisplayName,
    resourcePath,
    resourceType,
    aclEnforcer,
    policyVersion,
    accessType,
    agentId,
    agentHost,
    eventCount,
    zoneName,
    requestData,
    tags
  } = data;

  const copyText = (val) => {
    !isEmpty(val) && toast.success("User list copied succesfully!!");
    return val;
  };

  return (
    <Table striped bordered hover>
      <tbody>
        <tr>
          <td>Audit ID</td>
          <td>{!isEmpty(eventId) ? eventId : "--"}</td>
        </tr>
        <tr>
          <td>Policy ID</td>
          <td>{policyId > 0 ? policyId : "--"}</td>
        </tr>
        <tr>
          <td>Policy Version</td>
          <td>{!isEmpty(policyVersion) ? policyVersion : "--"}</td>
        </tr>
        <tr>
          <td>Event Time</td>
          <td>
            {!isEmpty(eventTime)
              ? dateFormat(eventTime, "mm/dd/yyyy hh:MM:ss TT ")
              : "--"}
          </td>
        </tr>
        <tr>
          <td>Application</td>
          <td>{!isEmpty(agentId) ? agentId : "--"}</td>
        </tr>
        <tr>
          <td>User</td>
          <td>{!isEmpty(requestUser) ? requestUser : "--"}</td>
        </tr>
        <tr>
          <td>Service Name </td>
          <td>{!isEmpty(repoName) ? repoName : "--"}</td>
        </tr>
        <tr>
          <td>Service Type </td>
          <td>
            {!isEmpty(serviceTypeDisplayName) ? serviceTypeDisplayName : "--"}
          </td>
        </tr>
        <tr>
          <td>Resource Path</td>
          <td>{!isEmpty(resourcePath) ? resourcePath : "--"}</td>
        </tr>
        <tr>
          <td>Resource Type</td>
          <td>{!isEmpty(resourceType) ? resourceType : "--"}</td>
        </tr>
        {requestData && (
          <tr>
            <td>{serviceType} Query</td>
            <td>
              {!isEmpty(requestData) ? (
                <>
                  <Button
                    className="pull-right link-tag query-icon btn btn-sm"
                    size="sm"
                    variant="link"
                    title="Copied!"
                    onClick={() =>
                      navigator.clipboard.writeText(copyText(requestData))
                    }
                  >
                    <i className="fa-fw fa fa-copy"> </i>
                  </Button>
                  <span>{requestData}</span>
                </>
              ) : (
                "--"
              )}
            </td>
          </tr>
        )}
        <tr>
          <td>Access Type</td>
          <td>{!isEmpty(accessType) ? accessType : "--"}</td>
        </tr>
        <tr>
          <td>Permission</td>
          <td>{!isEmpty(action) ? action : "--"}</td>
        </tr>
        <tr>
          <td>Result</td>
          <td>{accessResult == 1 ? "Allowed" : "Denied"}</td>
        </tr>
        <tr>
          <td>Access Enforcer</td>
          <td>{!isEmpty(aclEnforcer) ? aclEnforcer : "--"}</td>
        </tr>
        <tr>
          <td>Agent Host Name </td>
          <td>{!isEmpty(agentHost) ? agentHost : "--"}</td>
        </tr>
        <tr>
          <td>Client IP </td>
          <td>{!isEmpty(clientIP) ? clientIP : "--"}</td>
        </tr>
        <tr>
          <td>Cluster Name</td>
          <td>{!isEmpty(clusterName) ? clusterName : "--"}</td>
        </tr>
        <tr>
          <td>Zone Name</td>
          <td>{!isEmpty(zoneName) ? zoneName : "--"}</td>
        </tr>
        <tr>
          <td>Event Count</td>
          <td>{eventCount > 0 ? eventCount : "--"}</td>
        </tr>
        <tr>
          <td>Tags</td>
          <td>
            {!isEmpty(tags)
              ? JSON.parse(tags)
                  .map((val) => {
                    return val.type;
                  })
                  .sort()
                  .join(", ")
              : "--"}
          </td>
        </tr>
      </tbody>
    </Table>
  );
};
export default AccessLogsTable;
