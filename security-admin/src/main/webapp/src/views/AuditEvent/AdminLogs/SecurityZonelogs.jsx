import React from "react";
import { Table } from "react-bootstrap";
import dateFormat from "dateformat";
import { ClassTypes } from "../../../utils/XAEnums";

export const SecurityZonelogs = ({ data, reportdata }) => {
  const { objectName, objectClassType, createDate, owner, action } = data;
  return (
    <div>
      {/* CREATE  */}
      {action == "create" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_SECURITY_ZONE.value && (
          <div>
            <div className="font-weight-bolder">Name : {objectName}</div>
            <div className="font-weight-bolder">
              Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
              India Standard Time
            </div>
            <div className="font-weight-bolder">Created By: {owner}</div>
            <br />
            <h5 className="bold wrap-header m-t-sm">Zone Details:</h5>

            <Table className="table table-striped table-bordered w-50">
              <thead>
                <tr>
                  <th>Fields</th>

                  <th>New Value</th>
                </tr>
              </thead>
              {reportdata
                .filter((c) => {
                  return c.attributeName != "Zone Services";
                })
                .map((obj) => {
                  return (
                    <tbody>
                      <tr>
                        <td className="table-warning">{obj.attributeName}</td>
                        <td className="table-warning">
                          {obj.newValue || "--"}
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
            </Table>
            <br />
            <h5 className="bold wrap-header m-t-sm">Zone Service Details:</h5>
            <Table className="table table-striped table-bordered w-75">
              <thead>
                <tr>
                  <th className="p-3 mb-2 bg-white text-dark  align-middle text-center">
                    Service Name
                  </th>

                  <th className="p-3 mb-2 bg-white text-dark align-middle text-center">
                    Zone Service Resources
                  </th>
                </tr>
              </thead>

              {reportdata
                .filter((obj) => obj.attributeName == "Zone Services")
                .map((key) => {
                  return Object.keys(JSON.parse(key.newValue)).map((c) => {
                    return (
                      <tbody>
                        <tr>
                          <td className="table-warning">
                            <strong> {c}</strong>
                          </td>
                          <td className="table-warning">
                            {Object.values(
                              JSON.parse(key.newValue)[c].resources
                            ).map((resource) => (
                              <div className="zone-resource">
                                {Object.keys(resource).map((policy) => {
                                  return (
                                    <>
                                      <strong>{`${policy} : `}</strong>
                                      {resource[policy].join(", ")}
                                      <br />
                                    </>
                                  );
                                })}
                              </div>
                            ))}
                          </td>
                        </tr>
                      </tbody>
                    );
                  });
                })}
            </Table>
          </div>
        )}

      {/* UPDATE */}

      {action == "update" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_SECURITY_ZONE.value && (
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
            <h5 className="bold wrap-header m-t-sm">Zone Details:</h5>

            <Table className="table  table-bordered table-striped table-responsive w-auto">
              <thead>
                <tr>
                  <th>Fields</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                </tr>
              </thead>
              {reportdata.map((obj) => (
                <tbody>
                  <tr key={obj.id}>
                    <td className="table-warning overflow-auto text-nowrap">
                      {obj.attributeName}
                    </td>

                    <td className="table-warning overflow-auto text-nowrap">
                      {obj.previousValue || "--"}
                    </td>
                    <td className="table-warning overflow-auto text-nowrap">
                      {obj.newValue}
                    </td>
                  </tr>
                </tbody>
              ))}
            </Table>
          </div>
        )}

      {/* DELETE  */}

      {action == "delete" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_SECURITY_ZONE.value && (
          <div>
            <div className="font-weight-bolder">Name : {objectName}</div>
            <div className="font-weight-bolder">
              Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
              India Standard Time
            </div>
            <div className="font-weight-bolder">Deleted By: {owner}</div>
            <br />
            <h5 className="bold wrap-header m-t-sm">Zone Details:</h5>
            <Table className="table table-striped table-bordered w-auto">
              <thead>
                <tr>
                  <th>Fields</th>
                  <th>Old Value</th>
                </tr>
              </thead>
              {reportdata
                .filter((obj) => {
                  return obj.attributeName != "Zone Services";
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
            <h5 className="bold wrap-header m-t-sm">Zone Service Details:</h5>
            <Table className="table table-striped table-bordered w-75">
              <thead>
                <tr>
                  <th className="p-3 mb-2 bg-white text-dark  align-middle text-center">
                    Service Name
                  </th>

                  <th className="p-3 mb-2 bg-white text-dark align-middle text-center">
                    Zone Service Resources
                  </th>
                </tr>
              </thead>

              {reportdata
                .filter((obj) => obj.attributeName == "Zone Services")
                .map((key) => {
                  return Object.keys(JSON.parse(key.previousValue)).map((c) => {
                    return (
                      <tbody>
                        <tr>
                          <td className="table-warning">
                            <strong> {c}</strong>
                          </td>
                          <td className="table-warning">
                            {Object.values(
                              JSON.parse(key.previousValue)[c].resources
                            ).map((resource) => (
                              <div className="zone-resource">
                                {Object.keys(resource).map((policy) => {
                                  return (
                                    <>
                                      <strong>{`${policy} : `}</strong>
                                      {resource[policy].join(", ")}
                                      <br />
                                    </>
                                  );
                                })}
                              </div>
                            ))}
                          </td>
                        </tr>
                      </tbody>
                    );
                  });
                })}
            </Table>
          </div>
        )}
    </div>
  );
};

export default SecurityZonelogs;
