import React from "react";
import { Table } from "react-bootstrap";
import dateFormat from "dateformat";
import { ClassTypes } from "../../../utils/XAEnums";

export const PasswordLogs = ({ data, reportdata }) => {
  const { objectName, objectClassType, createDate, owner, action } = data;

  return (
    <div>
      {/* PASSWORD CHANGE  */}

      {action == "password change" &&
        objectClassType == ClassTypes.CLASS_TYPE_PASSWORD_CHANGE.value && (
          <div>
            <div className="font-weight-bolder">Name : {objectName}</div>
            <div className="font-weight-bolder">
              Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
              India Standard Time
            </div>
            <div className="font-weight-bolder">Updated By: {owner}</div>
            <h5 className="bold wrap-header m-t-sm">User Details:</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Fields</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                </tr>
              </thead>
              {reportdata.map((obj) => (
                <tbody>
                  <tr>
                    <td className="table-warning">{obj.attributeName}</td>
                    <td className="table-warning">{obj.previousValue}</td>
                    <td className="table-warning">{obj.newValue}</td>
                  </tr>
                </tbody>
              ))}
            </Table>
          </div>
        )}
    </div>
  );
};

export default PasswordLogs;
