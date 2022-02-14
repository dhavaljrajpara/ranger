import React from "react";
import { Table } from "react-bootstrap";
import dateFormat from "dateformat";
import { ClassTypes } from "../../../utils/XAEnums";

export const UserLogs = ({ data, reportdata }) => {
  const { objectName, objectClassType, createDate, owner, action } = data;
  const userGrp = reportdata.filter((obj) => {
    return obj.attributeName == "Group Name";
  });
  return (
    <div>
      {/* CREATE  */}
      {action == "create" &&
        objectClassType == ClassTypes.CLASS_TYPE_XA_USER.value && (
          <div>
            <div className="font-weight-bolder">Name : {objectName}</div>
            <div className="font-weight-bolder">
              Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")} India
              Standard Time
            </div>
            <div className="font-weight-bolder">Created By: {owner} </div>
            <br />
            <h5 className="bold wrap-header m-t-sm">User Details:</h5>

            <Table className="table table-striped table-bordered w-50">
              <thead>
                <tr>
                  <th>Fields</th>

                  <th>New Value</th>
                </tr>
              </thead>
              {reportdata
                .filter((obj) => {
                  return obj.attributeName != "Group Name";
                })
                .map((u) => {
                  return (
                    <tbody>
                      <tr key={u.id}>
                        <td className="table-warning">{u.attributeName}</td>

                        <td className="table-warning">{u.newValue}</td>
                      </tr>
                    </tbody>
                  );
                })}
            </Table>
            <br />
            {userGrp.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">Group: </h5>
            )}

            {userGrp.length > 0 && (
              <Table className="table table-striped table-bordered w-50">
                <thead>
                  <tr>
                    <th>Fields</th>

                    <th>New Value</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="table-warning">Group Name</td>
                    <td className="table-warning">
                      {userGrp
                        .map((u) => {
                          return u.newValue;
                        })
                        .join(",")}
                    </td>
                  </tr>
                </tbody>
              </Table>
            )}
          </div>
        )}

      {/* UPDATE */}

      {action == "update" &&
        objectClassType == ClassTypes.CLASS_TYPE_XA_USER.value && (
          <div>
            <div className="row">
              <div className="col-md-6">
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Updated By: {owner}</div>
              </div>
              <div className="col-md-6 text-right">
                <div className="add-text legend"></div> {" Added "}
                <div className="delete-text legend"></div> {" Deleted "}
              </div>
            </div>
            <br />
            <h5 className="bold wrap-header m-t-sm">User Details:</h5>

            <Table className="table table-striped table-bordered w-50">
              <thead>
                <tr>
                  <th>Fields</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                </tr>
              </thead>
              {reportdata
                .filter((obj) => {
                  return obj.attributeName != "Group Name";
                })
                .map((u) => {
                  return (
                    <tbody>
                      <tr key={u.id}>
                        <td className="table-warning">{u.attributeName}</td>
                        <td className="table-warning">{u.previousValue}</td>
                        <td className="table-warning">{u.newValue}</td>
                      </tr>
                    </tbody>
                  );
                })}
            </Table>
            {userGrp.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">Group: </h5>
            )}

            {userGrp.length > 0 && (
              <Table className="table table-striped table-bordered w-50">
                <thead>
                  <tr>
                    <th>Fields</th>
                    <th>Old Value</th>
                    <th>New Value</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="table-warning">Group Name</td>
                    <td className="table-warning">
                      {userGrp
                        .map((u) => {
                          return u.previousValue;
                        })
                        .join(",")}
                    </td>
                    <td className="table-warning">
                      {userGrp.map((u) => {
                        return u.newValue;
                      })}
                    </td>
                  </tr>
                </tbody>
              </Table>
            )}
          </div>
        )}

      {/* DELETE  */}

      {action == "delete" &&
        objectClassType == ClassTypes.CLASS_TYPE_XA_USER.value && (
          <div>
            <div className="font-weight-bolder">Name : {objectName}</div>
            <div className="font-weight-bolder">
              Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")} India
              Standard Time
            </div>
            <div className="font-weight-bolder">Created By: {owner} </div>
            <div className="font-weight-bolder">Deleted By: {owner} </div>

            <h5 className="bold wrap-header m-t-sm">User Details:</h5>

            <Table className="table table-striped table-bordered w-50">
              <thead>
                <tr>
                  <th>Fields</th>
                  <th>Old Value</th>
                </tr>
              </thead>
              {reportdata.map((obj) => {
                return (
                  <tbody>
                    <tr>
                      <td className="table-warning">{obj.attributeName}</td>
                      <td className="table-warning">
                        {obj.previousValue || "--"}
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </Table>
          </div>
        )}
    </div>
  );
};

export default UserLogs;
