import React from "react";
import { Table } from "react-bootstrap";
import dateFormat from "dateformat";
import { ClassTypes } from "../../../utils/XAEnums";

export const ServiceLogs = ({ data, reportdata }) => {
  const { objectName, objectClassType, createDate, owner, action } = data;
  const service = reportdata.filter((c) => {
    return c.attributeName != "Connection Configurations";
  });
  const tagServiceName = reportdata.filter((c) => {
    return c.attributeName == "Tag Service Name";
  });
  return (
    <div>
      {/* CREATE  */}
      {action == "create" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_SERVICE.value && (
          <div>
            <div className="font-weight-bolder">Name: {objectName || ""}</div>
            <div className="font-weight-bolder">
              Date:
              {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
              India Standard Time
            </div>
            <div className="font-weight-bolder">Created By: {owner}</div>
            {service && (
              <h5 className="bold wrap-header m-t-sm">Service Details:</h5>
            )}
            <Table className="table  table-bordered  w-50">
              <thead>
                <tr>
                  <th>Fields</th>
                  <th>New Value</th>
                </tr>
              </thead>
              {reportdata
                .filter((obj) => {
                  return obj.attributeName != "Connection Configurations";
                })
                .map((c, index) => {
                  return (
                    <tbody>
                      <tr key={index}>
                        <td className=" table-warning">{c.attributeName}</td>

                        <td className="overflow-auto text-nowrap  table-warning">
                          {c.newValue || "--"}
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
            </Table>
            <br />
            <h5 className="bold wrap-header m-t-sm">
              Connection Configurations :
            </h5>
            <div>
              <Table className="table  table-bordered table-responsive w-75">
                {reportdata
                  .filter((obj) => {
                    return obj.attributeName == "Connection Configurations";
                  })
                  .map((c) => {
                    return (
                      <>
                        <thead>
                          <tr>
                            <th>Fields</th>
                            <th>New Value</th>
                          </tr>
                        </thead>
                        {Object.keys(JSON.parse(c.newValue)).map(
                          (obj, index) => (
                            <tbody>
                              <tr key={index}>
                                <td className="overflow-auto text-nowrap table-warning">
                                  {obj}
                                </td>
                                <td className="overflow-auto text-nowrap table-warning ">
                                  {JSON.parse(c.newValue)[obj]}
                                </td>
                              </tr>
                            </tbody>
                          )
                        )}
                      </>
                    );
                  })}
              </Table>
            </div>
          </div>
        )}

      {/* UPDATE */}

      {action == "update" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_SERVICE.value && (
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
            {tagServiceName.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">Service Details:</h5>
            )}
            {tagServiceName.length > 0 && (
              <Table className="table  table-bordered  table-striped  w-auto">
                <tbody>
                  <tr>
                    <th>Fields</th>
                    <th>Old Value</th>
                    <th>New Value</th>
                  </tr>
                  {reportdata
                    .filter((obj) => {
                      return (
                        obj.attributeName != "Connection Configurations" &&
                        obj.action == "update"
                      );
                    })
                    .map((c, index) => {
                      return (
                        <tr key={index}>
                          <td className="table-warning">{c.attributeName}</td>
                          <td className="table-warning">
                            {c.previousValue || "--"}
                          </td>
                          <td className="table-warning">
                            {c.newValue !== undefined ? (
                              <span className="add-text">{c.newValue}</span>
                            ) : (
                              "--"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            )}
            <br />

            <h5 className="bold wrap-header m-t-sm">
              Connection Configurations :
            </h5>
            <Table className="table  table-bordered table-responsive w-75">
              {reportdata
                .filter((obj) => {
                  return (
                    obj.attributeName == "Connection Configurations" &&
                    obj.action == "update"
                  );
                })
                .map((c) => {
                  return (
                    <>
                      <thead>
                        <tr>
                          <th>Fields</th>
                          <th>Old Value</th>
                          <th>New Value</th>
                        </tr>
                      </thead>
                      {Object.keys(JSON.parse(c.newValue)).map((obj, index) => (
                        <tbody>
                          <tr key={index}>
                            <td className="overflow-auto text-nowrap table-warning">
                              {obj}
                            </td>
                            <td className="overflow-auto text-nowrap table-warning">
                              {JSON.parse(c.previousValue)[obj]}
                            </td>
                            <td className="overflow-auto text-nowrap table-warning">
                              {JSON.parse(c.newValue)[obj]}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </>
                  );
                })}
            </Table>
          </div>
        )}
      {/* DELETE  */}

      {action == "delete" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_SERVICE.value && (
          <div>
            <div className="font-weight-bolder">Name: {objectName || ""}</div>
            <div className="font-weight-bolder">
              Date:
              {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
              India Standard Time
            </div>
            <div className="font-weight-bolder">Created By: {owner}</div>
            <h5 className="bold wrap-header m-t-sm">Service Details:</h5>
            <Table className="table  table-bordered table-striped  w-50">
              <thead>
                <tr>
                  <th>Fields</th>
                  <th>Old Value</th>
                </tr>
              </thead>
              {reportdata
                .filter((obj) => {
                  return (
                    obj.attributeName != "Connection Configurations" &&
                    obj.action == "delete"
                  );
                })
                .map((c) => {
                  return (
                    <tbody>
                      <tr key={c.id}>
                        <td className="table-warning">{c.attributeName}</td>

                        <td className="table-warning">
                          {c.previousValue || "--"}
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
            </Table>
            <br />
            <h5 className="bold wrap-header m-t-sm">
              Connection Configurations :
            </h5>
            <Table className="table  table-bordered table-striped table-responsive w-auto">
              <thead>
                <tr>
                  <th>Fields</th>
                  <th>Old Value</th>
                </tr>
              </thead>
              {reportdata
                .filter((obj) => {
                  return obj.attributeName == "Connection Configurations";
                })
                .map((c) => {
                  return (
                    <>
                      <tbody>
                        <tr>
                          {Object.keys(JSON.parse(c.previousValue)).map(
                            (obj) => (
                              <tr>
                                <td className="table-warning">{obj}</td>
                              </tr>
                            )
                          )}
                          <td>
                            {Object.values(JSON.parse(c.previousValue)).map(
                              (obj) => (
                                <tr>
                                  <td className="overflow-auto text-nowrap table-warning">
                                    {obj}
                                  </td>
                                </tr>
                              )
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </>
                  );
                })}
            </Table>
          </div>
        )}
    </div>
  );
};

export default ServiceLogs;
