import React from "react";
import { Table, Badge } from "react-bootstrap";
import dateFormat from "dateformat";
import { ClassTypes } from "../../../utils/XAEnums";
import { isEmpty, isUndefined } from "lodash";

export const PolicyLogs = ({ data, reportdata }) => {
  const {
    objectName,
    objectClassType,
    parentObjectName,
    createDate,
    owner,
    action,
    objectId,
  } = data;

  const policydelete = reportdata.filter((obj) => {
    return obj.attributeName == "Policy Items";
  });
  const policycondition = reportdata.filter((obj) => {
    return obj.attributeName == "Policy Conditions" && obj.action == "update";
  });
  const policyConditionnewVal = policycondition.map(
    (obj) => obj.previousValue && obj.action == "update"
  );
  const policyConditionoldVal = policycondition.map(
    (obj) => obj.newValue && obj.action == "update"
  );
  const policydetails = reportdata.filter((c) => {
    return (
      c.attributeName != "Policy Resources" &&
      c.attributeName != "Policy Conditions" &&
      c.attributeName != "Policy Items" &&
      c.attributeName != "DenyPolicy Items" &&
      c.attributeName != "Allow Exceptions" &&
      c.attributeName != "Deny Exceptions" &&
      c.attributeName != "Masked Policy Items" &&
      c.attributeName != "Row level filter Policy Items" &&
      c.attributeName != "Validity Schedules"
    );
  });

  const policyItems = reportdata.filter(
    (obj) => obj.attributeName == "Policy Items"
  );
  const policyitems = reportdata.filter(
    (obj) => obj.attributeName == "Policy Items"
  );

  const policyitemoldVal = policyitems.map((obj) => obj.previousValue);

  const policyexception = reportdata.filter(
    (obj) => obj.attributeName == "Allow Exceptions"
  );
  const policyexceptionoldval = policyexception.map((obj) => obj.previousValue);

  const denyexceptions = reportdata.filter(
    (obj) => obj.attributeName == "Deny Exceptions"
  );

  const denyPolicyItem = reportdata.filter(
    (obj) => obj.attributeName == "DenyPolicy Items"
  );
  const denyPolicyItemoldval = denyPolicyItem.map((obj) => obj.previousValue);

  const maskPolicyItem = reportdata.filter(
    (obj) => obj.attributeName == "Masked Policy Items"
  );
  const maskpolicyoldVal = maskPolicyItem.map((obj) => obj.previousValue);

  const validityschedules = reportdata.filter(
    (obj) => obj.attributeName == "Validity Schedules"
  );
  const validityupdate = reportdata.filter(
    (obj) => obj.attributeName == "Validity Schedules" && obj.action == "update"
  );
  const validitynewVal = validityschedules.map((obj) => obj.newValue);
  const validityoldVal = validityschedules.map((obj) => obj.previousValue);
  const exportJson = reportdata.filter((obj) => obj.action == "EXPORT JSON");
  return (
    <div>
      {/* CREATE  */}
      {action == "create" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
          <div>
            <div className="font-weight-bolder">
              Policy ID : <Badge variant="info">{objectId}</Badge>
            </div>
            <div className="font-weight-bolder">Policy Name: {objectName}</div>
            <div className="font-weight-bolder">Service Name: {owner}</div>
            <div className="font-weight-bolder">
              Created Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
              India Standard Time
            </div>
            <div className="font-weight-bolder">Created By: {owner}</div>
            <h5 className="bold wrap-header m-t-sm">Policy Details:</h5>
            <Table className="table table-striped table-bordered w-auto">
              <thead>
                <tr>
                  <th>Fields</th>

                  <th>New Value</th>
                </tr>
              </thead>

              {policydetails.map((obj) => {
                return (
                  <tbody>
                    <tr>
                      <td className="table-warning">{obj.attributeName}</td>

                      <td className="table-warning">{obj.newValue || "--"}</td>
                    </tr>
                  </tbody>
                );
              })}
            </Table>

            {action == "create" && policycondition.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">Policy Conditions:</h5>
            )}
            {action == "create" && policycondition.length > 0 && (
              <Table className="table table-striped  table-bordered   w-25">
                <thead>
                  <tr>
                    <th>New Value</th>
                  </tr>
                </thead>

                {reportdata
                  .filter((obj) => {
                    return (
                      obj.attributeName == "Policy Conditions" &&
                      obj.action == "create"
                    );
                  })
                  .map((policyitem) => {
                    return JSON.parse(policyitem.newValue).map((policy) => (
                      <tbody>
                        <tr>
                          <td className="table-warning">{`${policy.type}:${policy.values}`}</td>
                        </tr>
                      </tbody>
                    ));
                  })}
              </Table>
            )}

            {action == "create" && policyItems.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">Allow PolicyItems:</h5>
            )}
            {action == "create" && policyItems.length > 0 && (
              <Table className="table table-striped  table-bordered  table-responsive w-auto">
                {policyItems.length > 0 && (
                  <thead>
                    <tr>
                      <th>New Value</th>
                    </tr>
                  </thead>
                )}

                {reportdata
                  .filter(
                    (obj) =>
                      obj.attributeName == "Policy Items" &&
                      obj.action == "create"
                  )
                  .map((policyitem) => {
                    return JSON.parse(policyitem.newValue).map((policy) => (
                      <tbody>
                        <tr>
                          <td className="table-warning">
                            {`Roles:${
                              policy.roles.length == 0
                                ? "<empty>"
                                : policy.roles
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Groups:${
                              policy.groups.length == 0
                                ? "<empty>"
                                : policy.groups
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Users:${
                              policy.users.length == 0
                                ? "<empty>"
                                : policy.users
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Permissions: ${policy.accesses.map(
                              (obj) => obj.type
                            )}`}
                          </td>
                        </tr>
                        <tr>
                          {policy.conditions.length > 0 && (
                            <td className="table-warning">
                              {`Conditions:${policy.conditions.map(
                                (type) => `${type.type} : ${type.values}`
                              )} `}
                            </td>
                          )}
                        </tr>
                        <tr>
                          <td className="table-warning">{`Delegate Admin: ${
                            policy.delegateAdmin == true
                              ? "enabled"
                              : "disabled"
                          }`}</td>
                        </tr>
                      </tbody>
                    ));
                  })}
              </Table>
            )}

            {action == "create" &&
              validitynewVal !== undefined &&
              validitynewVal.length > 0 &&
              validitynewVal != "[]" && (
                <h5 className="bold wrap-header m-t-sm">Validity Period:</h5>
              )}

            {action == "create" &&
              validitynewVal !== undefined &&
              validitynewVal.length > 0 &&
              validitynewVal != "[]" && (
                <Table className="table table-striped  table-bordered   w-auto">
                  <thead>
                    <tr>
                      <th>New Value</th>
                    </tr>
                  </thead>
                  {reportdata
                    .filter(
                      (obj) =>
                        obj.attributeName == "Validity Schedules" &&
                        obj.action == "create"
                    )
                    .map((policyitem) => {
                      return JSON.parse(policyitem.newValue).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              {`Start Date:${
                                policy.startTime.length == 0
                                  ? "<empty>"
                                  : policy.startTime
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              {`End Date:${
                                policy.endTime.length == 0
                                  ? "<empty>"
                                  : policy.endTime
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              {`Time Zone:${
                                policy.timeZone.length == 0
                                  ? "<empty>"
                                  : policy.timeZone
                              } `}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                </Table>
              )}

            {action == "create" && policyexception.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">
                Allow Exception PolicyItems:
              </h5>
            )}
            {action == "create" && policyexception.length > 0 && (
              <Table className="table table-striped  table-bordered   w-auto">
                <thead>
                  <tr>
                    <th>New Value</th>
                  </tr>
                </thead>

                {reportdata
                  .filter(
                    (obj) =>
                      obj.attributeName == "Allow Exceptions" &&
                      obj.action == "create"
                  )
                  .map((policyitem) => {
                    return JSON.parse(policyitem.newValue).map((policy) => (
                      <tbody>
                        <tr>
                          <td className="table-warning">
                            {`Roles:${
                              policy.roles.length == 0
                                ? "<empty>"
                                : policy.roles
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Groups:${
                              policy.groups.length == 0
                                ? "<empty>"
                                : policy.groups
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Users:${
                              policy.users.length == 0
                                ? "<empty>"
                                : policy.users
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Permissions: ${policy.accesses.map(
                              (obj) => obj.type
                            )}`}
                          </td>
                        </tr>
                        <tr>
                          {policy.conditions.length > 0 && (
                            <td className="table-warning">
                              {`Conditions:${policy.conditions.map(
                                (type) => `${type.type} : ${type.values}`
                              )} `}
                            </td>
                          )}
                        </tr>
                        <tr>
                          <td className="table-warning">{`Delegate Admin: ${
                            policy.delegateAdmin == true
                              ? "enabled"
                              : "disabled"
                          }`}</td>
                        </tr>
                      </tbody>
                    ));
                  })}
              </Table>
            )}

            {action == "create" && denyPolicyItem.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">Deny PolicyItems:</h5>
            )}
            {action == "create" && denyPolicyItem.length > 0 && (
              <Table className="table table-striped  table-bordered   w-auto">
                {denyPolicyItem.length > 0 && (
                  <thead>
                    <tr>
                      <th>New Value</th>
                    </tr>
                  </thead>
                )}

                {reportdata
                  .filter(
                    (obj) =>
                      obj.attributeName == "DenyPolicy Items" &&
                      obj.action == "create"
                  )
                  .map((policyitem) => {
                    return JSON.parse(policyitem.newValue).map((policy) => (
                      <tbody>
                        <tr>
                          <td className="table-warning">
                            {`Roles:${
                              policy.roles.length == 0
                                ? "<empty>"
                                : policy.roles
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Groups:${
                              policy.groups.length == 0
                                ? "<empty>"
                                : policy.groups
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Users:${
                              policy.users.length == 0
                                ? "<empty>"
                                : policy.users
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Permissions: ${policy.accesses.map(
                              (obj) => obj.type
                            )}`}
                          </td>
                        </tr>
                        <tr>
                          {policy.conditions.length > 0 && (
                            <td className="table-warning">
                              {`Conditions:${policy.conditions.map(
                                (type) => `${type.type} : ${type.values}`
                              )} `}
                            </td>
                          )}
                        </tr>
                        <tr>
                          <td className="table-warning">{`Delegate Admin: ${
                            policy.delegateAdmin == true
                              ? "enabled"
                              : "disabled"
                          }`}</td>
                        </tr>
                      </tbody>
                    ));
                  })}
              </Table>
            )}

            {action == "create" && denyexceptions.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">
                Deny Exception PolicyItems:
              </h5>
            )}
            {action == "create" && denyexceptions.length > 0 && (
              <Table className="table table-striped  table-bordered table-responsive  w-auto">
                {denyPolicyItem.length > 0 && (
                  <thead>
                    <tr>
                      <th>New Value</th>
                    </tr>
                  </thead>
                )}

                {reportdata
                  .filter(
                    (obj) =>
                      obj.attributeName == "Deny Exceptions" &&
                      obj.action == "create"
                  )
                  .map((policyitem) => {
                    return JSON.parse(policyitem.newValue).map((policy) => (
                      <tbody>
                        <tr>
                          <td className="table-warning">
                            {`Roles:${
                              policy.roles.length == 0
                                ? "<empty>"
                                : policy.roles
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Groups:${
                              policy.groups.length == 0
                                ? "<empty>"
                                : policy.groups
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Users:${
                              policy.users.length == 0
                                ? "<empty>"
                                : policy.users
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Permissions: ${policy.accesses.map(
                              (obj) => obj.type
                            )}`}
                          </td>
                        </tr>
                        <tr>
                          {policy.conditions.length > 0 && (
                            <td className="table-warning">
                              {`Conditions:${policy.conditions.map(
                                (type) => `${type.type} : ${type.values}`
                              )} `}
                            </td>
                          )}
                        </tr>
                        <tr>
                          <td className="table-warning">{`Delegate Admin: ${
                            policy.delegateAdmin == true
                              ? "enabled"
                              : "disabled"
                          }`}</td>
                        </tr>
                        <br />
                      </tbody>
                    ));
                  })}
              </Table>
            )}

            {action == "create" && maskPolicyItem.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">Masking Policy Items:</h5>
            )}
            {action == "create" && maskPolicyItem.length > 0 && (
              <Table className="table table-striped  table-bordered   w-auto">
                <thead>
                  <tr>
                    <th>New Value</th>
                  </tr>
                </thead>

                {reportdata
                  .filter(
                    (obj) =>
                      obj.attributeName == "Masked Policy Items" &&
                      obj.action == "create"
                  )
                  .map((policyitem) => {
                    return JSON.parse(policyitem.newValue).map((policy) => (
                      <tbody>
                        <tr>
                          <td className="table-warning">
                            {`Roles:${
                              policy.roles.length == 0
                                ? "<empty>"
                                : policy.roles
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Groups:${
                              policy.groups.length == 0
                                ? "<empty>"
                                : policy.groups
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Users:${
                              policy.users.length == 0
                                ? "<empty>"
                                : policy.users
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Accesses:: ${policy.accesses.map(
                              (obj) => obj.type
                            )}`}
                          </td>
                        </tr>

                        <tr>
                          {policy.delegateAdmin == true && (
                            <td className="table-warning">{`Delegate Admin: ${
                              policy.delegateAdmin == true
                                ? "enabled"
                                : "disabled"
                            }`}</td>
                          )}
                        </tr>
                        <tr>
                          {policy.DataMasklabel.length > 0 && (
                            <td className="table-warning">{`Data Mask Types: ${policy.DataMasklabel}`}</td>
                          )}
                        </tr>
                        <br />
                      </tbody>
                    ));
                  })}
              </Table>
            )}
          </div>
        )}
      {/* UPDATE */}

      {action == "update" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
          <div>
            <div className="row">
              <div className="col-md-6">
                <div className="font-weight-bolder">
                  Policy ID: <Badge variant="info">{objectId}</Badge>
                </div>
                <div className="font-weight-bolder">
                  Policy Name : {objectName}
                </div>
                <div className="font-weight-bolder">
                  Service Name : {parentObjectName}
                </div>
                <div className="font-weight-bolder">
                  Updated Date:
                  {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")} India
                  Standard Time
                </div>
                <div className="font-weight-bolder">Updated By: {owner} </div>
              </div>
              <div className="col-md-6 text-right">
                <div className="add-text legend"></div> {" Added "}
                <div className="delete-text legend"></div> {" Deleted "}
              </div>
            </div>
            <br />
            {policydetails.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">Policy details</h5>
            )}
            {policydetails.length > 0 && (
              <Table className="table table-striped table-bordered  w-auto">
                <div>
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Old Value</th>
                      <th>New Value</th>
                    </tr>
                  </thead>
                  {reportdata
                    .filter((c) => {
                      return (
                        c.action == "update" &&
                        c.attributeName != "Policy Resources" &&
                        c.attributeName != "Policy Conditions" &&
                        c.attributeName != "Policy Items" &&
                        c.attributeName != "DenyPolicy Items" &&
                        c.attributeName != "Allow Exceptions" &&
                        c.attributeName != "Deny Exceptions" &&
                        c.attributeName != "Deny Exception" &&
                        c.attributeName != "Masked Policy Items" &&
                        c.attributeName != "Row level filter Policy Items" &&
                        c.attributeName != "Validity Schedules"
                      );
                    })
                    .map((obj) => {
                      return (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              {obj.attributeName}
                            </td>
                            <td className="table-warning">
                              {obj.previousValue || "--"}
                            </td>
                            <td className="table-warning">
                              {obj.newValue || "--"}
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                </div>
              </Table>
            )}

            {action == "update" &&
              validitynewVal !== undefined &&
              validitynewVal.length > 0 &&
              validitynewVal != "[]" && (
                <h5 className="bold wrap-header m-t-sm">Validity Period:</h5>
              )}

            {action == "update" &&
              validitynewVal !== undefined &&
              validitynewVal.length > 0 &&
              validitynewVal != "[]" && (
                <Table className="table table-striped  table-bordered   w-auto">
                  <thead>
                    <tr>
                      <th>Old Value</th>
                      <th>New Value</th>
                    </tr>
                  </thead>

                  {validityupdate.map((policyitem) => {
                    return (
                      <tbody>
                        <tr>
                          <td>
                            {JSON.parse(policyitem.previousValue) != 0 ? (
                              JSON.parse(policyitem.previousValue).map(
                                (period) =>
                                  Object.keys(period).map((obj) => (
                                    <tr>
                                      <td className="table-warning">{`${obj} : ${
                                        period[obj].length != 0
                                          ? period[obj]
                                          : "--"
                                      }`}</td>
                                    </tr>
                                  ))
                              )
                            ) : (
                              <span className="text-center align-middle">
                                <strong>{"<empty>"}</strong>
                              </span>
                            )}
                          </td>
                          <td>
                            {JSON.parse(policyitem.newValue) != 0 ? (
                              JSON.parse(policyitem.newValue).map((period) =>
                                Object.keys(period).map((obj) => (
                                  <tr>
                                    <td className="table-warning">{`${obj} : ${
                                      period[obj].length != 0
                                        ? period[obj]
                                        : "--"
                                    } `}</td>
                                  </tr>
                                ))
                              )
                            ) : (
                              <span className="text-center align-middle">
                                <strong>{"<empty>"}</strong>
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
                </Table>
              )}
            {action == "update" &&
              !isEmpty(policyConditionnewVal) &&
              !isUndefined(policyConditionnewVal) &&
              policyConditionnewVal != 0 &&
              !isEmpty(policyConditionoldVal) &&
              !isUndefined(policyConditionoldVal) &&
              policyConditionoldVal != 0 && (
                <div>
                  <h5 className="bold wrap-header m-t-sm">
                    Policy Conditions:
                  </h5>
                  {
                    <Table className="table table-striped  table-bordered   w-50">
                      <thead>
                        <tr>
                          <th>Old Value</th>
                          <th>New Value</th>
                        </tr>
                      </thead>

                      {reportdata
                        .filter((obj) => {
                          return (
                            obj.attributeName == "Policy Conditions" &&
                            obj.action == "update"
                          );
                        })
                        .map((policyitem) => {
                          return (
                            <tbody>
                              <tr>
                                {policyitem.previousValue.length != 0 ? (
                                  JSON.parse(policyitem.previousValue).map(
                                    (policy) => (
                                      <td className="table-warning">{`${policy.type}:${policy.values}`}</td>
                                    )
                                  )
                                ) : (
                                  <td className="text-center">
                                    <strong>{"<empty>"}</strong>
                                  </td>
                                )}
                                {policyitem.newValue.length != 0 ? (
                                  JSON.parse(policyitem.newValue).map(
                                    (policy) => (
                                      <td className="table-warning">{`${policy.type}:${policy.values}`}</td>
                                    )
                                  )
                                ) : (
                                  <td className="text-center">
                                    <strong>{"<empty>"}</strong>
                                  </td>
                                )}
                              </tr>
                            </tbody>
                          );
                        })}
                    </Table>
                  }
                </div>
              )}
            {action == "update" && maskPolicyItem.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">Mask Policy Items:</h5>
            )}

            {action == "update" && maskPolicyItem.length > 0 && (
              <Table className="table table-striped  table-bordered table-responsive">
                <thead>
                  <tr>
                    <th>Old Value</th>
                    <th>New Value</th>
                  </tr>
                </thead>

                {reportdata
                  .filter(
                    (obj) =>
                      obj.attributeName == "Masked Policy Items" &&
                      obj.action == "update"
                  )
                  .map((policy) => {
                    return (
                      <tbody>
                        <tr>
                          <td className="table-warning">
                            {policy.previousValue.length == 0 ? (
                              <span className="text-center align-middle">
                                <strong>{"<empty>"}</strong>
                              </span>
                            ) : (
                              JSON.parse(policy.previousValue).map((policy) => (
                                <tr>
                                  <tr>
                                    <td className="table-warning">
                                      {
                                        <>
                                          Roles:
                                          {policy.roles.length == 0 ? (
                                            "<empty>"
                                          ) : (
                                            <span className="delete-text">
                                              {policy.roles}
                                            </span>
                                          )}
                                        </>
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Groups:
                                      {policy.groups.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="delete-text">
                                          {policy.groups}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Users:
                                      {policy.users.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="delete-text">
                                          {policy.users}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning overflow-auto text-nowrap">
                                      Permissions:
                                      {policy.accesses.map((obj) => (
                                        <span className="delete-text">
                                          {obj.type}
                                        </span>
                                      ))}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="table-warning">
                                      Delegate Admin:{" "}
                                      {policy.delegateAdmin == true
                                        ? " enabled"
                                        : "disabled"}
                                    </td>
                                  </tr>
                                </tr>
                              ))
                            )}
                          </td>
                          {policy.newValue.length == 0 ? (
                            <td className="text-center align-middle">
                              <strong>{"<empty>"}</strong>
                            </td>
                          ) : (
                            JSON.parse(policy.newValue).map((policy) => (
                              <tbody>
                                <tr>
                                  <tr>
                                    <td className="table-warning">
                                      {
                                        <>
                                          Roles:
                                          {policy.roles.length == 0 ? (
                                            "<empty>"
                                          ) : (
                                            <span className="add-text">
                                              {policy.roles}
                                            </span>
                                          )}
                                        </>
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Groups:
                                      {policy.groups.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="add-text">
                                          {policy.groups}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Users:
                                      {policy.users.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="add-text">
                                          {policy.users}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Permissions:
                                      {policy.accesses.map((obj) => (
                                        <span className="add-text">
                                          {obj.type}
                                        </span>
                                      ))}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="table-warning">
                                      Delegate Admin:{" "}
                                      {policy.delegateAdmin == true
                                        ? " enabled"
                                        : "disabled"}
                                    </td>
                                  </tr>
                                </tr>
                              </tbody>
                            ))
                          )}
                        </tr>
                      </tbody>
                    );
                  })}
              </Table>
            )}
            {action == "update" && policyItems.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">Allow PolicyItems:</h5>
            )}

            {action == "update" && policyItems.length > 0 && (
              <Table className="table table-striped  table-bordered table-responsive">
                <thead>
                  <tr>
                    <th>Old Value</th>
                    <th>New Value</th>
                  </tr>
                </thead>

                {reportdata
                  .filter(
                    (obj) =>
                      obj.attributeName == "Policy Items" &&
                      obj.action == "update"
                  )
                  .map((policy) => {
                    return (
                      <tbody>
                        <tr>
                          <td className="table-warning">
                            {policy.previousValue.length == 0 ? (
                              <span className="text-center align-middle">
                                <strong>{"<empty>"}</strong>
                              </span>
                            ) : (
                              JSON.parse(policy.previousValue).map((policy) => (
                                <tr>
                                  <tr>
                                    <td className="table-warning">
                                      {
                                        <>
                                          Roles:
                                          {policy.roles.length == 0 ? (
                                            "<empty>"
                                          ) : (
                                            <span className="delete-text">
                                              {policy.roles}
                                            </span>
                                          )}
                                        </>
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Groups:
                                      {policy.groups.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="delete-text">
                                          {policy.groups}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Users:
                                      {policy.users.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="delete-text">
                                          {policy.users}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning overflow-auto text-nowrap">
                                      Permissions:
                                      {policy.accesses.map((obj) => (
                                        <span className="delete-text">
                                          {obj.type}
                                        </span>
                                      ))}
                                    </td>
                                  </tr>
                                  <tr className="table-warning">
                                    {policy.conditions.length > 0 && (
                                      <td>
                                        Conditions:
                                        {policy.conditions.map((type) => (
                                          <span className="delete-text">
                                            {`${type.type} : ${type.values}`}
                                          </span>
                                        ))}
                                      </td>
                                    )}
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Delegate Admin:{" "}
                                      {policy.delegateAdmin == true
                                        ? " enabled"
                                        : "disabled"}
                                    </td>
                                  </tr>
                                </tr>
                              ))
                            )}
                          </td>
                          {policy.newValue.length == 0 ? (
                            <td className="text-center align-middle">
                              <strong>{"<empty>"}</strong>
                            </td>
                          ) : (
                            JSON.parse(policy.newValue).map((policy) => (
                              <tbody>
                                <tr>
                                  <tr>
                                    <td className="table-warning">
                                      {
                                        <>
                                          Roles:
                                          {policy.roles.length == 0 ? (
                                            "<empty>"
                                          ) : (
                                            <span className="add-text">
                                              {policy.roles}
                                            </span>
                                          )}
                                        </>
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Groups:
                                      {policy.groups.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="add-text">
                                          {policy.groups}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Users:
                                      {policy.users.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="add-text">
                                          {policy.users}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Permissions:
                                      {policy.accesses.map((obj) => (
                                        <span className="add-text">
                                          {obj.type}
                                        </span>
                                      ))}
                                    </td>
                                  </tr>
                                  <tr>
                                    {policy.conditions.length > 0 && (
                                      <td className="table-warning">
                                        Conditions:
                                        {policy.conditions.map(
                                          (type) =>
                                            `${type.type} : ${type.values}`
                                        )}
                                      </td>
                                    )}
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Delegate Admin:{" "}
                                      {policy.delegateAdmin == true
                                        ? " enabled"
                                        : "disabled"}
                                    </td>
                                  </tr>
                                </tr>
                              </tbody>
                            ))
                          )}
                        </tr>
                      </tbody>
                    );
                  })}
              </Table>
            )}

            {action == "update" && policyexception.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">
                Allow Exception PolicyItems:
              </h5>
            )}

            {action == "update" && policyexception.length > 0 && (
              <Table className="table table-striped  table-bordered  w-auto ">
                <thead>
                  <tr>
                    <th>Old Value</th>
                    <th>New Value</th>
                  </tr>
                </thead>
                <tbody>
                  {reportdata
                    .filter(
                      (obj) =>
                        obj.attributeName == "Allow Exceptions" &&
                        obj.action == "update"
                    )
                    .map((policy) => {
                      return (
                        <tr>
                          <td>
                            {policy.previousValue.length == 0 ? (
                              <span className="text-center">{"<empty>"}</span>
                            ) : (
                              JSON.parse(policy.previousValue).map((policy) => (
                                <tbody>
                                  <tr>
                                    <tr>
                                      <td className="table-warning">
                                        {
                                          <>
                                            Roles:
                                            {policy.roles.length == 0 ? (
                                              "<empty>"
                                            ) : (
                                              <span className="add-text">
                                                {policy.roles}
                                              </span>
                                            )}
                                          </>
                                        }
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-warning">
                                        Groups:
                                        {policy.groups.length == 0 ? (
                                          "<empty>"
                                        ) : (
                                          <span className="add-text">
                                            {policy.groups}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-warning">
                                        Users:
                                        {policy.users.length == 0 ? (
                                          "<empty>"
                                        ) : (
                                          <span className="add-text">
                                            {policy.users}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-warning">
                                        Permissions:
                                        {policy.accesses.map((obj) => (
                                          <span className="add-text">
                                            {obj.type}
                                          </span>
                                        ))}
                                      </td>
                                    </tr>
                                    <tr>
                                      {policy.conditions.length > 0 && (
                                        <td className="table-warning">
                                          {`Conditions:${policy.conditions.map(
                                            (type) =>
                                              `${type.type} : ${type.values}`
                                          )} `}
                                        </td>
                                      )}
                                    </tr>
                                    <tr>
                                      <td className="table-warning">
                                        Delegate Admin:{" "}
                                        {policy.delegateAdmin == true
                                          ? "enabled"
                                          : "disabled"}
                                      </td>
                                    </tr>
                                  </tr>
                                </tbody>
                              ))
                            )}
                          </td>

                          {policy.newValue.length == 0 ? (
                            <span className="text-center">{"<empty>"}</span>
                          ) : (
                            JSON.parse(policy.newValue).map((policy) => (
                              <tbody>
                                <tr>
                                  <tr>
                                    <td className="table-warning">
                                      <>
                                        Roles:
                                        {policy.roles.length == 0 ? (
                                          "<empty>"
                                        ) : (
                                          <span className="add-text">
                                            {policy.roles}
                                          </span>
                                        )}
                                      </>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Groups:
                                      {policy.groups.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="add-text">
                                          {policy.groups}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Users:
                                      {policy.users.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="add-text">
                                          {policy.users}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Permissions:
                                      {policy.accesses.map((obj) => (
                                        <span className="add-text">
                                          {obj.type}
                                        </span>
                                      ))}
                                    </td>
                                  </tr>
                                  <tr>
                                    {policy.conditions.length > 0 && (
                                      <td className="table-warning">
                                        {`Conditions:${policy.conditions.map(
                                          (type) =>
                                            `${type.type} : ${type.values}`
                                        )} `}
                                      </td>
                                    )}
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Delegate Admin:{" "}
                                      {policy.delegateAdmin == true
                                        ? "enabled"
                                        : "disabled"}
                                    </td>
                                  </tr>
                                </tr>
                              </tbody>
                            ))
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            )}

            {action == "update" && denyPolicyItem.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">Deny PolicyItems:</h5>
            )}

            {action == "update" && denyPolicyItem.length > 0 && (
              <Table className="table table-striped  table-bordered  w-auto ">
                <thead>
                  <tr>
                    <th>Old Value</th>
                    <th>New Value</th>
                  </tr>
                </thead>
                <tbody>
                  {reportdata
                    .filter(
                      (obj) =>
                        obj.attributeName == "DenyPolicy Items" &&
                        obj.action == "update"
                    )
                    .map((policy) => {
                      return (
                        <tr>
                          <td>
                            {policy.previousValue.length == 0 ? (
                              <span className="text-center align-middle">
                                <strong>{"<empty>"}</strong>
                              </span>
                            ) : (
                              JSON.parse(policy.previousValue).map((policy) => (
                                <tbody>
                                  <tr>
                                    <tr>
                                      <td className="table-warning">
                                        Roles:
                                        {policy.roles.length == 0 ? (
                                          "<empty>"
                                        ) : (
                                          <span className="delete-text">
                                            {policy.roles}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-warning">
                                        Groups:
                                        {policy.groups.length == 0 ? (
                                          "<empty>"
                                        ) : (
                                          <span className="delete-text">
                                            {policy.groups}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-warning">
                                        Users:
                                        {policy.users.length == 0 ? (
                                          "<empty>"
                                        ) : (
                                          <span className="delete-text">
                                            {policy.users}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-warning">
                                        Permissions:
                                        {policy.accesses.map((obj) => (
                                          <span className="delete-text">
                                            {obj.type}
                                          </span>
                                        ))}
                                      </td>
                                    </tr>
                                    <tr>
                                      {policy.conditions.length > 0 && (
                                        <td className="table-warning">
                                          {`Conditions:${policy.conditions.map(
                                            (type) =>
                                              `${type.type} : ${type.values}`
                                          )} `}
                                        </td>
                                      )}
                                    </tr>
                                    <tr>
                                      <td className="table-warning">
                                        Delegate Admin:
                                        {policy.delegateAdmin == true
                                          ? "enabled"
                                          : "disabled"}
                                      </td>
                                    </tr>
                                  </tr>
                                </tbody>
                              ))
                            )}
                          </td>

                          {policy.newValue.length == 0 ? (
                            <span className="text-center align-middle">
                              <strong>{"<empty>"}</strong>
                            </span>
                          ) : (
                            JSON.parse(policy.newValue).map((policy) => (
                              <tbody>
                                <tr>
                                  <tr>
                                    <td className="table-warning">
                                      Roles:
                                      {policy.roles.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="add-text">
                                          {policy.roles}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Groups:
                                      {policy.groups.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="add-text">
                                          {policy.groups}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Users:
                                      {policy.users.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="add-text">
                                          {policy.users}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Permissions:
                                      {policy.accesses.map((obj) => (
                                        <span className="add-text">
                                          {obj.type}
                                        </span>
                                      ))}
                                    </td>
                                  </tr>
                                  <tr>
                                    {policy.conditions.length > 0 && (
                                      <td className="table-warning">
                                        {`Conditions:${policy.conditions.map(
                                          (type) =>
                                            `${type.type} : ${type.values}`
                                        )} `}
                                      </td>
                                    )}
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Delegate Admin:{" "}
                                      {policy.delegateAdmin == true
                                        ? "enabled"
                                        : "disabled"}
                                    </td>
                                  </tr>
                                </tr>
                              </tbody>
                            ))
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            )}

            {action == "update" && denyexceptions.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">
                Deny Exception PolicyItems:
              </h5>
            )}

            {action == "update" && denyexceptions.length > 0 && (
              <Table className="table table-striped  table-bordered  w-auto ">
                <thead>
                  <tr>
                    <th>Old Value</th>
                    <th>New Value</th>
                  </tr>
                </thead>
                <tbody>
                  {denyexceptions.map((policy) => {
                    return (
                      <tr>
                        <td>
                          {policy.previousValue.length == 0 ? (
                            <span className="text-center">
                              <strong>{"<empty>"}</strong>
                            </span>
                          ) : (
                            JSON.parse(policy.previousValue).map((policy) => (
                              <tbody>
                                <tr>
                                  <tr>
                                    <td className="table-warning">
                                      Roles:
                                      {policy.roles.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="add-text">
                                          {policy.roles}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Groups:
                                      {policy.groups.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="add-text">
                                          {policy.groups}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Users:
                                      {policy.users.length == 0 ? (
                                        "<empty>"
                                      ) : (
                                        <span className="add-text">
                                          {policy.users}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Permissions:
                                      {policy.accesses.map((obj) => (
                                        <span className="add-text">
                                          {obj.type}
                                        </span>
                                      ))}
                                    </td>
                                  </tr>
                                  <tr>
                                    {policy.conditions.length > 0 && (
                                      <td className="table-warning">
                                        {`Conditions:${policy.conditions.map(
                                          (type) =>
                                            `${type.type} : ${type.values}`
                                        )} `}
                                      </td>
                                    )}
                                  </tr>
                                  <tr>
                                    <td className="table-warning">
                                      Delegate Admin:{" "}
                                      {policy.delegateAdmin == true
                                        ? "enabled"
                                        : "disabled"}
                                    </td>
                                  </tr>
                                </tr>
                              </tbody>
                            ))
                          )}
                        </td>

                        {policy.newValue.length == 0 ? (
                          <span className="text-center">
                            <strong>{"<empty>"}</strong>
                          </span>
                        ) : (
                          JSON.parse(policy.newValue).map((policy) => (
                            <tbody>
                              <tr>
                                <tr>
                                  <td className="table-warning">
                                    Roles:
                                    {policy.roles.length == 0 ? (
                                      "<empty>"
                                    ) : (
                                      <span className="add-text">
                                        {policy.roles}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="table-warning">
                                    Groups:
                                    {policy.groups.length == 0 ? (
                                      "<empty>"
                                    ) : (
                                      <span className="add-text">
                                        {policy.groups}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="table-warning">
                                    Users:
                                    {policy.users.length == 0
                                      ? "<empty>"
                                      : policy.users
                                          .map((u) => {
                                            return u;
                                          })
                                          .join(",")}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="table-warning">
                                    Permissions:
                                    {policy.accesses.map((obj) => (
                                      <span className="add-text">
                                        {obj.type}
                                      </span>
                                    ))}
                                  </td>
                                </tr>
                                <tr>
                                  {policy.conditions.length > 0 && (
                                    <td className="table-warning">
                                      {`Conditions:${policy.conditions.map(
                                        (type) =>
                                          `${type.type} : ${type.values}`
                                      )} `}
                                    </td>
                                  )}
                                </tr>
                                <tr>
                                  <td className="table-warning">
                                    Delegate Admin:{" "}
                                    {policy.delegateAdmin == true
                                      ? "enabled"
                                      : "disabled"}
                                  </td>
                                </tr>
                              </tr>
                            </tbody>
                          ))
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </div>
        )}
      {/* DELETE  */}
      {action == "delete" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
          <div>
            <div className="font-weight-bolder">
              Policy ID: <Badge variant="info">{objectId}</Badge>
            </div>
            <div className="font-weight-bolder">Policy Name: {objectName}</div>
            <div className="font-weight-bolder">
              Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")} India
              Standard Time
            </div>
            <div className="font-weight-bolder">Created By: {owner} </div>
            <div className="font-weight-bolder">Deleted By: {owner} </div>

            <h5 className="bold wrap-header m-t-sm">Policy Details:</h5>

            {/* {maskPolicyItem.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">Masking Policy Items:</h5>
            )} */}
            <Table className="table table-striped table-bordered w-auto">
              <tbody>
                <tr>
                  <th>Fields</th>
                  <th>Old Value</th>
                </tr>
                {reportdata
                  .filter((c) => {
                    return (
                      c.attributeName != "Policy Resources" &&
                      c.attributeName != "Policy Conditions" &&
                      c.attributeName != "Policy Items" &&
                      c.attributeName != "DenyPolicy Items" &&
                      c.attributeName != "Allow Exceptions" &&
                      c.attributeName != "Deny Exceptions" &&
                      c.attributeName != "Zone Name" &&
                      c.attributeName != "Masked Policy Items" &&
                      c.attributeName != "Row level filter Policy Items" &&
                      c.attributeName != "Validity Schedules"
                    );
                  })
                  .map((obj) => {
                    return (
                      <tr>
                        <td className="table-warning">
                          {obj.attributeName || "--"}
                        </td>
                        <td className="table-warning">
                          {obj.previousValue || "--"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>

            {action == "delete" &&
              !isEmpty(validityoldVal) &&
              !isUndefined(validityoldVal) &&
              validityoldVal > 0 && (
                <h5 className="bold wrap-header m-t-sm">Validity Period:</h5>
              )}

            {action == "delete" &&
              !isEmpty(validityoldVal) &&
              !isUndefined(validityoldVal) &&
              validityoldVal > 0 && (
                <Table className="table table-striped  table-bordered   w-auto">
                  <thead>
                    <tr>
                      <th>old Value</th>
                    </tr>
                  </thead>
                  {reportdata
                    .filter(
                      (obj) =>
                        obj.attributeName == "Validity Schedules" &&
                        obj.action == "delete"
                    )
                    .map((policyitem) => {
                      return JSON.parse(policyitem.previousValue).map(
                        (policy) => (
                          <tbody>
                            <tr>
                              <td className="table-warning">
                                {`Start Date:${
                                  policy.startTime.length == 0
                                    ? "<empty>"
                                    : policy.startTime
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`End Date:${
                                  policy.endTime.length == 0
                                    ? "<empty>"
                                    : policy.endTime
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Time Zone:${
                                  policy.timeZone.length == 0
                                    ? "<empty>"
                                    : policy.timeZone
                                } `}
                              </td>
                            </tr>
                          </tbody>
                        )
                      );
                    })}
                </Table>
              )}

            {action == "delete" &&
              !isEmpty(maskpolicyoldVal) &&
              !isUndefined(maskpolicyoldVal) &&
              maskpolicyoldVal != 0 && (
                <h5 className="bold wrap-header m-t-sm">
                  Masking Policy Items:
                </h5>
              )}
            {action == "delete" &&
              !isEmpty(maskpolicyoldVal) &&
              !isUndefined(maskpolicyoldVal) &&
              maskpolicyoldVal != 0 && (
                <h5 className="bold wrap-header m-t-sm">
                  Masking Policy Items:
                </h5>
              ) && (
                <Table className="table table-striped  table-bordered   w-auto">
                  <thead>
                    <tr>
                      <th>Old Value</th>
                    </tr>
                  </thead>

                  {reportdata
                    .filter(
                      (obj) =>
                        obj.attributeName == "Masked Policy Items" &&
                        obj.action == "delete"
                    )
                    .map((policyitem) => {
                      return JSON.parse(policyitem.previousValue).map(
                        (policy) => (
                          <tbody>
                            <tr>
                              <td className="table-warning">
                                {`Roles:${
                                  policy.roles.length == 0
                                    ? "<empty>"
                                    : policy.roles
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Groups:${
                                  policy.groups.length == 0
                                    ? "<empty>"
                                    : policy.groups
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Users:${
                                  policy.users.length == 0
                                    ? "<empty>"
                                    : policy.users
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Accesses:: ${policy.accesses.map(
                                  (obj) => obj.type
                                )}`}
                              </td>
                            </tr>

                            <tr>
                              {policy.delegateAdmin == true && (
                                <td className="table-warning">{`Delegate Admin: ${
                                  policy.delegateAdmin == true
                                    ? "enabled"
                                    : "disabled"
                                }`}</td>
                              )}
                            </tr>
                            <tr>
                              {policy.DataMasklabel.length > 0 && (
                                <td className="table-warning">{`Data Mask Types: ${policy.DataMasklabel}`}</td>
                              )}
                            </tr>
                            <br />
                          </tbody>
                        )
                      );
                    })}
                </Table>
              )}

            {action == "delete" &&
              !isEmpty(policyitemoldVal) &&
              !isUndefined(policyitemoldVal) &&
              policyitemoldVal != 0 && (
                <h5 className="bold wrap-header m-t-sm">Allow PolicyItems:</h5>
              )}
            {action == "delete" &&
              !isEmpty(policyitemoldVal) &&
              !isUndefined(policyitemoldVal) &&
              policyitemoldVal != 0 && (
                <Table className="table table-striped  table-bordered  table-responsive w-auto">
                  {policyItems.length > 0 && (
                    <thead>
                      <tr>
                        <th>Old Value</th>
                      </tr>
                    </thead>
                  )}

                  {reportdata
                    .filter(
                      (obj) =>
                        obj.attributeName == "Policy Items" &&
                        obj.action == "delete"
                    )
                    .map((policyitem) => {
                      return JSON.parse(policyitem.previousValue).map(
                        (policy) => (
                          <tbody>
                            <tr>
                              <td className="table-warning">
                                {`Roles:${
                                  policy.roles.length == 0
                                    ? "<empty>"
                                    : policy.roles
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Groups:${
                                  policy.groups.length == 0
                                    ? "<empty>"
                                    : policy.groups
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Users:${
                                  policy.users.length == 0
                                    ? "<empty>"
                                    : policy.users
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Permissions: ${policy.accesses.map(
                                  (obj) => obj.type
                                )}`}
                              </td>
                            </tr>
                            <tr>
                              {policy.conditions.length > 0 && (
                                <td className="table-warning">
                                  {`Conditions:${policy.conditions.map(
                                    (type) => `${type.type} : ${type.values}`
                                  )} `}
                                </td>
                              )}
                            </tr>
                            <tr>
                              <td className="table-warning">{`Delegate Admin: ${
                                policy.delegateAdmin == true
                                  ? "enabled"
                                  : "disabled"
                              }`}</td>
                            </tr>
                          </tbody>
                        )
                      );
                    })}
                </Table>
              )}

            {action == "delete" &&
              !isEmpty(policyexceptionoldval) &&
              !isUndefined(policyexceptionoldval) &&
              policyexceptionoldval != 0 && (
                <h5 className="bold wrap-header m-t-sm">
                  Allow Exception PolicyItems:
                </h5>
              )}
            {action == "delete" &&
              !isEmpty(policyexceptionoldval) &&
              !isUndefined(policyexceptionoldval) &&
              policyexceptionoldval != 0 && (
                <Table className="table table-striped  table-bordered   w-auto">
                  <thead>
                    <tr>
                      <th>Old Value</th>
                    </tr>
                  </thead>

                  {reportdata
                    .filter(
                      (obj) =>
                        obj.attributeName == "Allow Exceptions" &&
                        obj.action == "delete"
                    )
                    .map((policyitem) => {
                      return JSON.parse(policyitem.previousValue).map(
                        (policy) => (
                          <tbody>
                            <tr>
                              <td className="table-warning">
                                {`Roles:${
                                  policy.roles.length == 0
                                    ? "<empty>"
                                    : policy.roles
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Groups:${
                                  policy.groups.length == 0
                                    ? "<empty>"
                                    : policy.groups
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Users:${
                                  policy.users.length == 0
                                    ? "<empty>"
                                    : policy.users
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Permissions: ${policy.accesses.map(
                                  (obj) => obj.type
                                )}`}
                              </td>
                            </tr>
                            <tr>
                              {policy.conditions.length > 0 && (
                                <td className="table-warning">
                                  {`Conditions:${policy.conditions.map(
                                    (type) => `${type.type} : ${type.values}`
                                  )} `}
                                </td>
                              )}
                            </tr>
                            <tr>
                              <td className="table-warning">{`Delegate Admin: ${
                                policy.delegateAdmin == true
                                  ? "enabled"
                                  : "disabled"
                              }`}</td>
                            </tr>
                          </tbody>
                        )
                      );
                    })}
                </Table>
              )}

            {action == "delete" &&
              !isEmpty(denyPolicyItemoldval) &&
              !isUndefined(denyPolicyItemoldval) &&
              denyPolicyItemoldval != 0 && (
                <h5 className="bold wrap-header m-t-sm">Deny PolicyItems:</h5>
              )}
            {action == "delete" &&
              !isEmpty(denyPolicyItemoldval) &&
              !isUndefined(denyPolicyItemoldval) &&
              denyPolicyItemoldval != 0 && (
                <Table className="table table-striped  table-bordered   w-auto">
                  {denyPolicyItem.length > 0 && (
                    <thead>
                      <tr>
                        <th>Old Value</th>
                      </tr>
                    </thead>
                  )}

                  {reportdata
                    .filter(
                      (obj) =>
                        obj.attributeName == "DenyPolicy Items" &&
                        obj.action == "delete"
                    )
                    .map((policyitem) => {
                      return JSON.parse(policyitem.previousValue).map(
                        (policy) => (
                          <tbody>
                            <tr>
                              <td className="table-warning">
                                {`Roles:${
                                  policy.roles.length == 0
                                    ? "<empty>"
                                    : policy.roles
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Groups:${
                                  policy.groups.length == 0
                                    ? "<empty>"
                                    : policy.groups
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Users:${
                                  policy.users.length == 0
                                    ? "<empty>"
                                    : policy.users
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Permissions: ${policy.accesses.map(
                                  (obj) => obj.type
                                )}`}
                              </td>
                            </tr>
                            <tr>
                              {policy.conditions.length > 0 && (
                                <td className="table-warning">
                                  {`Conditions:${policy.conditions.map(
                                    (type) => `${type.type} : ${type.values}`
                                  )} `}
                                </td>
                              )}
                            </tr>
                            <tr>
                              <td className="table-warning">{`Delegate Admin: ${
                                policy.delegateAdmin == true
                                  ? "enabled"
                                  : "disabled"
                              }`}</td>
                            </tr>
                          </tbody>
                        )
                      );
                    })}
                </Table>
              )}

            {action == "delete" &&
              !isEmpty(denyPolicyItemoldval) &&
              !isUndefined(denyPolicyItemoldval) &&
              denyPolicyItemoldval != 0 && (
                <h5 className="bold wrap-header m-t-sm">
                  Deny Exception PolicyItems:
                </h5>
              )}
            {action == "delete" &&
              !isEmpty(denyPolicyItemoldval) &&
              !isUndefined(denyPolicyItemoldval) &&
              denyPolicyItemoldval != 0 && (
                <Table className="table table-striped  table-bordered   w-auto">
                  {denyPolicyItem.length > 0 && (
                    <thead>
                      <tr>
                        <th>Old Value</th>
                      </tr>
                    </thead>
                  )}

                  {reportdata
                    .filter(
                      (obj) =>
                        obj.attributeName == "Deny Exceptions" &&
                        obj.action == "delete"
                    )
                    .map((policyitem) => {
                      return JSON.parse(policyitem.previousValue).map(
                        (policy) => (
                          <tbody>
                            <tr>
                              <td className="table-warning">
                                {`Roles:${
                                  policy.roles.length == 0
                                    ? "<empty>"
                                    : policy.roles
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Groups:${
                                  policy.groups.length == 0
                                    ? "<empty>"
                                    : policy.groups
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Users:${
                                  policy.users.length == 0
                                    ? "<empty>"
                                    : policy.users
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning">
                                {`Permissions: ${policy.accesses.map(
                                  (obj) => obj.type
                                )}`}
                              </td>
                            </tr>
                            <tr>
                              {policy.conditions.length > 0 && (
                                <td className="table-warning">
                                  {`Conditions:${policy.conditions.map(
                                    (type) => `${type.type} : ${type.values}`
                                  )} `}
                                </td>
                              )}
                            </tr>
                            <tr>
                              <td className="table-warning">{`Delegate Admin: ${
                                policy.delegateAdmin == true
                                  ? "enabled"
                                  : "disabled"
                              }`}</td>
                            </tr>
                            <br />
                          </tbody>
                        )
                      );
                    })}
                </Table>
              )}
          </div>
        )}

      {/* IMPORT END */}
      {action == "IMPORT END" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
          <div>
            <h5 className="bold wrap-header m-t-sm">Details:</h5>
            <Table className="table table-striped table-bordered w-50">
              {reportdata.map((c) => {
                return JSON.parse(c.previousValue).map((s) => {
                  return (
                    <tbody>
                      <tr>
                        <td className="table-warning">{s}</td>
                        <td className="table-warning">
                          {JSON.parse(c.previousValue)[s]}
                        </td>
                      </tr>
                    </tbody>
                  );
                });
              })}
            </Table>
          </div>
        )}

      {/* IMPORT START */}
      {action == "IMPORT START" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
          <div>
            <p className="text-center">
              Importing policies from file is started...
            </p>
          </div>
        )}
      {/* Export JSON */}
      {action == "EXPORT JSON" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
          <>
            <h5 className="bold wrap-header m-t-sm">Details:</h5>
            <Table className="table table-striped table-bordered w-50">
              {exportJson.map((c) =>
                Object.keys(JSON.parse(c.previousValue)).map((s, index) => (
                  <tbody key={index}>
                    <tr>
                      <td className="table-warning">{s}</td>
                      <td className="table-warning">
                        {JSON.parse(c.previousValue)[s]}
                      </td>
                    </tr>
                  </tbody>
                ))
              )}
            </Table>
          </>
        )}
      {action == "Import Delete" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
          <div>
            <div className="font-weight-bolder">
              Policy ID : <Badge variant="info">{objectId}</Badge>
            </div>
            <div className="font-weight-bolder">Policy Name: {objectName}</div>
            <div className="font-weight-bolder">
              Deleted Date:
              {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")} India Standard
              Time
            </div>
            <div className="font-weight-bolder">Deleted By: {owner} </div>
            <h5 className="bold wrap-header m-t-sm">Policy Details:</h5>
            <Table className="table table-striped table-bordered w-auto">
              <thead>
                <tr>
                  <th>Fields</th>
                  <th>Old Value</th>
                </tr>
              </thead>
              {reportdata
                .filter(
                  (c) =>
                    c.attributeName != "Zone Name" &&
                    c.attributeName != "Policy Conditions" &&
                    c.attributeName != "Policy Items" &&
                    c.attributeName != "DenyPolicy Items" &&
                    c.attributeName != "Allow Exceptions" &&
                    c.attributeName != "Deny Exceptions" &&
                    c.attributeName != "Masked Policy Items" &&
                    c.attributeName != "Row level filter Policy Items" &&
                    c.attributeName != "Validity Schedules"
                )
                .map((obj) => {
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
            <br />
            <h5 className="bold wrap-header m-t-sm"> Allow PolicyItems:</h5>
            <Table className="table table-striped table-bordered w-auto">
              {policydelete.map((policyitem) =>
                JSON.parse(policyitem.previousValue).map((policy) => {
                  return (
                    <>
                      <thead>
                        <tr>
                          <td>Old Value</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="table-warning">
                            {`Roles:${
                              policy.roles.length == 0
                                ? "<empty>"
                                : policy.roles
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Groups:${
                              policy.groups.length == 0
                                ? "<empty>"
                                : policy.groups
                            } `}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">{`Users: ${policy.users}`}</td>
                        </tr>
                        <tr>
                          <td className="table-warning">
                            {`Permissions: ${policy.accesses.map(
                              (obj) => obj.type
                            )}`}
                          </td>
                        </tr>
                        <tr>
                          <td className="table-warning">{`Delegate Admin: ${
                            policy.delegateAdmin == false
                              ? "enabled"
                              : "disabled"
                          }`}</td>
                        </tr>
                      </tbody>
                    </>
                  );
                })
              )}
            </Table>
          </div>
        )}
    </div>
  );
};

export default PolicyLogs;
