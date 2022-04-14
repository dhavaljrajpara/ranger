import React from "react";
import { Badge, Table } from "react-bootstrap";
import dateFormat from "dateformat";
import { ClassTypes } from "../../../utils/XAEnums";
import { isEmpty, isUndefined } from "lodash";

export const ServiceLogs = ({ data, reportdata }) => {
  const { objectName, objectClassType, createDate, owner, action } = data;
  const serviceCreate = reportdata.filter((obj) => {
    return (
      obj.attributeName != "Connection Configurations" && obj.action == "create"
    );
  });
  const serviceUpdate = reportdata.filter((obj) => {
    return (
      obj.attributeName != "Connection Configurations" && obj.action == "update"
    );
  });
  const serviceDelete = reportdata.filter((obj) => {
    return (
      obj.attributeName != "Connection Configurations" && obj.action == "delete"
    );
  });

  const connectionCreate = reportdata.filter((obj) => {
    return (
      obj.attributeName == "Connection Configurations" && obj.action == "create"
    );
  });
  const connectionUpdate = reportdata.filter((obj) => {
    return (
      obj.attributeName == "Connection Configurations" && obj.action == "update"
    );
  });
  const connectionDelete = reportdata.filter((obj) => {
    return (
      obj.attributeName == "Connection Configurations" && obj.action == "delete"
    );
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
            <br />
            {action == "create" &&
              !isEmpty(serviceCreate) &&
              !isUndefined(serviceCreate) && (
                <>
                  <h5 className="bold wrap-header m-t-sm">Service Details:</h5>
                  <Table className="table  table-bordered  w-50">
                    <thead>
                      <tr>
                        <th>Fields</th>
                        <th>New Value</th>
                      </tr>
                    </thead>
                    {serviceCreate.map((obj, index) => {
                      return (
                        <tbody>
                          <tr key={index}>
                            <td className="table-warning">
                              {obj.attributeName}
                            </td>

                            <td className="table-warning">
                              {!isEmpty(obj.newValue) ? obj.newValue : "--"}
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "create" &&
              !isEmpty(connectionCreate) &&
              !isUndefined(connectionCreate) && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Connection Configurations :
                  </h5>
                  <Table className="table  table-bordered w-auto">
                    {connectionCreate.map((obj) => {
                      return (
                        <>
                          <thead>
                            <tr>
                              <th>Fields</th>
                              <th>New Value</th>
                            </tr>
                          </thead>
                          {obj &&
                            obj.newValue &&
                            Object.keys(JSON.parse(obj.newValue)).map(
                              (obj, index) => (
                                <tbody>
                                  <tr key={index}>
                                    <td className="overflow-auto text-nowrap table-warning">
                                      {obj}
                                    </td>
                                    <td className="overflow-auto text-nowrap table-warning ">
                                      {obj &&
                                      obj.newValue &&
                                      !isEmpty(JSON.parse(obj.newValue))
                                        ? JSON.parse(obj.newValue)[obj]
                                        : "--"}
                                    </td>
                                  </tr>
                                </tbody>
                              )
                            )}
                        </>
                      );
                    })}
                  </Table>
                </>
              )}
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
                <div className="bg-success legend"></div> {" Added "}
                <div className="bg-danger legend"></div> {" Deleted "}
              </div>
            </div>
            <br />
            {action == "update" &&
              !isEmpty(serviceUpdate) &&
              !isUndefined(serviceUpdate) && (
                <>
                  <h5 className="bold wrap-header m-t-sm">Service Details:</h5>
                  <Table className="table  table-bordered  table-striped  w-auto">
                    <tbody>
                      <tr>
                        <th>Fields</th>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                      {serviceUpdate.map((obj, index) => {
                        return (
                          <tr key={index}>
                            <td className="table-warning">
                              {obj.attributeName}
                            </td>
                            <td className="table-warning">
                              {!isEmpty(obj.previousValue) ? (
                                <Badge
                                  className="d-inline mr-1"
                                  variant="danger"
                                >
                                  {obj.previousValue}
                                </Badge>
                              ) : (
                                "--"
                              )}
                            </td>
                            <td className="table-warning">
                              {!isEmpty(obj.newValue) ? (
                                <Badge
                                  className="d-inline mr-1"
                                  variant="success"
                                >
                                  {obj.newValue}
                                </Badge>
                              ) : (
                                "--"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <br />
                </>
              )}

            {action == "update" &&
              !isEmpty(connectionUpdate) &&
              !isUndefined(connectionUpdate) && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Connection Configurations :
                  </h5>
                  <Table className="table  table-bordered  table-striped  w-auto">
                    {connectionUpdate.map((config) => {
                      return (
                        <>
                          <thead>
                            <tr>
                              <th>Fields</th>
                              <th>Old Value</th>
                              <th>New Value</th>
                            </tr>
                          </thead>
                          {config &&
                            config.newValue &&
                            Object.keys(JSON.parse(config.newValue)).map(
                              (obj, index) => (
                                <tbody>
                                  <tr key={index}>
                                    <td className="table-warning">{obj}</td>
                                    <td className="table-warning text-nowrap">
                                      {config &&
                                      config.previousValue &&
                                      !isEmpty(
                                        JSON.parse(config.previousValue)
                                      ) ? (
                                        isEmpty(
                                          JSON.parse(config.newValue)[obj]
                                        ) ? (
                                          <Badge
                                            className="d-inline mr-1"
                                            variant="success"
                                          >
                                            {
                                              JSON.parse(config.previousValue)[
                                                obj
                                              ]
                                            }
                                          </Badge>
                                        ) : (
                                          JSON.parse(config.previousValue)[obj]
                                        )
                                      ) : (
                                        "--"
                                      )}
                                    </td>
                                    <td className="table-warning text-nowrap">
                                      {config &&
                                      config.newValue &&
                                      !isEmpty(JSON.parse(config.newValue)) ? (
                                        isEmpty(
                                          JSON.parse(config.previousValue)[obj]
                                        ) ? (
                                          <Badge
                                            className="d-inline mr-1"
                                            variant="success"
                                          >
                                            {JSON.parse(config.newValue)[obj]}
                                          </Badge>
                                        ) : (
                                          JSON.parse(config.newValue)[obj]
                                        )
                                      ) : (
                                        "--"
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              )
                            )}
                        </>
                      );
                    })}
                  </Table>
                </>
              )}
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
            <div className="font-weight-bolder">Deleted By: {owner}</div>
            <br />
            {action == "delete" &&
              !isEmpty(serviceDelete) &&
              !isUndefined(serviceDelete) && (
                <>
                  <h5 className="bold wrap-header m-t-sm">Service Details:</h5>
                  <Table className="table  table-bordered table-striped  w-auto">
                    <thead>
                      <tr>
                        <th>Fields</th>
                        <th>Old Value</th>
                      </tr>
                    </thead>
                    {serviceDelete.map((obj) => {
                      return (
                        <tbody>
                          <tr key={obj.id}>
                            <td className="table-warning">
                              {obj.attributeName}
                            </td>

                            <td className="table-warning">
                              {!isEmpty(obj.previousValue)
                                ? obj.previousValue
                                : "--"}
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "delete" &&
              !isEmpty(connectionDelete) &&
              !isUndefined(connectionDelete) && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Connection Configurations :
                  </h5>
                  <Table className="table  table-bordered table-striped w-auto">
                    {connectionDelete.map((config) => {
                      return (
                        <>
                          <thead>
                            <tr>
                              <th>Fields</th>
                              <th>Old Value</th>
                            </tr>
                          </thead>
                          {config &&
                            config.previousValue &&
                            Object.keys(JSON.parse(config.previousValue)).map(
                              (obj, index) => (
                                <tbody>
                                  <tr key={index}>
                                    <td className="overflow-auto text-nowrap table-warning">
                                      {obj}
                                    </td>
                                    <td className="overflow-auto text-nowrap table-warning ">
                                      {JSON.parse(config.previousValue)[obj]}
                                    </td>
                                  </tr>
                                </tbody>
                              )
                            )}
                        </>
                      );
                    })}
                  </Table>
                </>
              )}
          </div>
        )}
    </div>
  );
};

export default ServiceLogs;
