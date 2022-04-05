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
  const importdeleteresources = reportdata.filter((c) => {
    return c.attributeName == "Policy Resources" && c.action == "Import Delete";
  });
  const policydetails = reportdata.filter((c) => {
    return (
      c.action == "create" &&
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
  const policyresources = reportdata.filter((c) => {
    return c.attributeName == "Policy Resources" && c.action == "create";
  });
  const policyDetails = (details, resources) => {
    let tablerow = [];

    details.map((o) => {
      return tablerow.push(
        <tr>
          <td className="table-warning">{o.attributeName}</td>
          <td className="table-warning">{o.newValue}</td>
        </tr>
      );
    });

    let keynew = {};
    resources.map((obj) => {
      keynew = JSON.parse(obj.newValue);
    });

    Object.keys(keynew).map((key, index) => {
      return tablerow.push(
        <>
          <tr>
            <td className="table-warning">{key}</td>
            <td className="table-warning"> {keynew[key].values}</td>
          </tr>
          <tr>
            <td className="table-warning">{key + " " + "exclude"}</td>
            <td className="table-warning">
              {keynew[key].isExcludes == false ? "false" : "true"}
            </td>
          </tr>
          <tr>
            <td className="table-warning">{key + " " + "recursive"}</td>
            <td className="table-warning">
              {keynew[key].isRecursive == false ? "false" : "true"}
            </td>
          </tr>
        </>
      );
    });
    return tablerow;
  };

  const policydetailsUpdate = reportdata.filter((c) => {
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
  });

  const policyresourcesUpdate = reportdata.filter((c) => {
    return c.attributeName == "Policy Resources" && c.action == "update";
  });

  const policyDetailsUpdate = (details, resources) => {
    let tablerow = [];
    details.map((o) => {
      return tablerow.push(
        <tr>
          <td className="table-warning">{o.attributeName}</td>
          <td className="table-warning">{o.previousValue}</td>
          <td className="table-warning">{o.newValue}</td>
        </tr>
      );
    });
    let keyname = {};
    let keynew = {};
    resources.map((obj) => {
      keyname = JSON.parse(obj.previousValue);
      keynew = JSON.parse(obj.newValue);
    });

    Object.keys(keyname).map((key) => {
      return tablerow.push(
        <>
          <tr>
            <td className="table-warning">{key}</td>
            <td className="table-warning"> {keyname[key].values}</td>
            <td className="table-warning">{keynew[key].values}</td>
          </tr>
        </>
      );
    });
    return tablerow;
  };

  const policydetailsDelete = reportdata.filter((c) => {
    return (
      c.action == "delete" &&
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
  });
  const policyresourcesDelete = reportdata.filter((c) => {
    return c.attributeName == "Policy Resources" && c.action == "delete";
  });
  const policyDetailsDelete = (details, resources) => {
    let tablerow = [];

    details.map((o) => {
      return tablerow.push(
        <tr>
          <td className="table-warning">{o.attributeName}</td>
          <td className="table-warning">{o.previousValue}</td>
        </tr>
      );
    });

    let keynew = {};
    resources.map((obj) => {
      keynew = JSON.parse(obj.previousValue);
    });

    Object.keys(keynew).map((key, index) => {
      return tablerow.push(
        <>
          <tr>
            <td className="table-warning">{key}</td>
            <td className="table-warning"> {keynew[key].values}</td>
          </tr>
          <tr>
            <td className="table-warning">{key + " " + "exclude"}</td>
            <td className="table-warning">
              {keynew[key].isExcludes == false ? "false" : "true"}
            </td>
          </tr>
          <tr>
            <td className="table-warning">{key + " " + "recursive"}</td>
            <td className="table-warning">
              {keynew[key].isRecursive == false ? "false" : "true"}
            </td>
          </tr>
        </>
      );
    });
    return tablerow;
  };

  const policyItems = reportdata.filter(
    (obj) => obj.attributeName == "Policy Items"
  );

  const allowpolicyUpdate = (policy) => {
    let tablerow = [];
    let oldval = {};
    let newval = {};

    policy.previousValue &&
      JSON.parse(policy.previousValue).map((obj) => (oldval = obj));
    policy.newValue && JSON.parse(policy.newValue).map((obj) => (newval = obj));
    let filteredval = Object.keys(oldval).concat(Object.keys(newval));
    filteredval = filteredval.filter((item, index) => {
      return filteredval.indexOf(item) == index;
    });

    const diffold = (c) => {};

    const getfilteredoldval = (val, oldval) => {
      let b = oldval[0];
      let c = b[val];
      if (val == "accesses") {
        return (
          <>
            <i>Permissions</i> : {c.map((obj) => obj.type).join(", ")}
          </>
        );
      }
      if (val == "delegateAdmin") {
        return `${val.charAt(0).toUpperCase() + val.slice(1)}: ${
          c == false ? "disabled" : "enabled"
        }`;
      }

      return `${val.charAt(0).toUpperCase() + val.slice(1)}:  ${
        c.length > 0 ? c : "<empty>"
      }`;
    };

    const getfilterednewval = (val, newval) => {
      let b = newval[0];
      let c = b[val];
      if (val == "accesses") {
        return (
          <>
            <i>Permissions</i> : {c.map((obj) => obj.type).join(", ")}
          </>
        );
      }
      if (val == "delegateAdmin") {
        return `${val.charAt(0).toUpperCase() + val.slice(1)}: ${
          c == false ? "disabled" : "enabled"
        }`;
      }

      return `${val.charAt(0).toUpperCase() + val.slice(1)}:  ${
        c.length > 0 ? c : "<empty>"
      }`;
    };

    filteredval.map((val) => {
      return tablerow.push(
        <>
          <tr>
            {(policy.previousValue && (
              <td className="table-warning">
                {getfilteredoldval(val, JSON.parse(policy.previousValue))}
              </td>
            )) || <span>empty</span>}

            {(policy.newValue && (
              <td className="table-warning">
                {getfilterednewval(val, JSON.parse(policy.newValue))}
              </td>
            )) || <span>empty</span>}
          </tr>
        </>
      );
    });

    return tablerow;
  };

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
  const importJson = reportdata.filter((obj) => obj.action == "IMPORT END");

  const rowmask = reportdata.filter(
    (obj) => obj.attributeName == "Row level filter Policy Items"
  );
  const rowmasknewval = rowmask.map((newval) => newval.newValue);
  const rowmaskoldval = rowmask.map((oldval) => oldval.previousValue);
  /*IMPORT DELETE */
  const importDeleteDetails = reportdata.filter((c) => {
    return (
      c.action == "Import Delete" &&
      c.attributeName != "Policy Resources" &&
      c.attributeName != "Policy Conditions" &&
      c.attributeName != "Policy Items" &&
      c.attributeName != "DenyPolicy Items" &&
      c.attributeName != "Zone Name" &&
      c.attributeName != "Allow Exceptions" &&
      c.attributeName != "Deny Exceptions" &&
      c.attributeName != "Masked Policy Items" &&
      c.attributeName != "Row level filter Policy Items" &&
      c.attributeName != "Validity Schedules"
    );
  });

  const ImportDeleteDetails = (details, resources) => {
    let tablerow = [];

    details.map((o) => {
      return tablerow.push(
        <tr>
          <td className="table-warning">{o.attributeName}</td>
          <td className="table-warning">{o.previousValue}</td>
        </tr>
      );
    });

    let keynew = {};
    resources.map((obj) => {
      keynew = JSON.parse(obj.previousValue);
    });

    Object.keys(keynew).map((key, index) => {
      return tablerow.push(
        <>
          <tr>
            <td className="table-warning">{key}</td>
            <td className="table-warning"> {keynew[key].values}</td>
          </tr>
          <tr>
            <td className="table-warning">{key + " " + "exclude"}</td>
            <td className="table-warning">
              {keynew[key].isExcludes == false ? "false" : "true"}
            </td>
          </tr>
          <tr>
            <td className="table-warning">{key + " " + "recursive"}</td>
            <td className="table-warning">
              {keynew[key].isRecursive == false ? "false" : "true"}
            </td>
          </tr>
        </>
      );
    });
    return tablerow;
  };

  const importDeleteItems = reportdata.filter((obj) => {
    return obj.attributeName == "Policy Items";
  });
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
            <h5 className="bold wrap-header mt-3">Policy Details:</h5>

            <Table className="table table-striped table-bordered w-auto">
              <thead>
                <tr>
                  <th>Fields</th>

                  <th>New Value</th>
                </tr>
              </thead>
              <tbody>{policyDetails(policydetails, policyresources)}</tbody>
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

            {action == "create" && rowmasknewval.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">
                Row Level Filter Policy Items:
              </h5>
            )}
            {action == "create" && rowmasknewval.length > 0 && (
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
                      obj.attributeName == "Row level filter Policy Items" &&
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
                            {`Accesses: ${policy.accesses.map(
                              (obj) => obj.type
                            )}`}
                          </td>
                        </tr>

                        <tr>
                          <td className="table-warning">{`Row Level Filter: ${policy.rowFilterInfo.filterExpr}`}</td>
                        </tr>
                      </tbody>
                    ));
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
                    <th>New Value</th>
                  </tr>
                </thead>

                {reportdata
                  .filter(
                    (obj) =>
                      obj.attributeName == "Allow Exceptions" &&
                      obj.action == "update"
                  )
                  .map((policy) => {
                    return <tbody>{allowpolicyUpdate(policy)}</tbody>;
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
            {(policydetailsUpdate.length > 0 ||
              policyresourcesUpdate.length > 0) && (
              <h5 className="bold wrap-header m-t-sm">Policy details</h5>
            )}
            {(policydetailsUpdate.length > 0 ||
              policyresourcesUpdate.length > 0) && (
              <Table className="table table-striped table-bordered w-auto">
                <thead>
                  <tr>
                    <th>Fields</th>
                    <th>Old Value</th>
                    <th>New Value</th>
                  </tr>
                </thead>
                <tbody>
                  {policyDetailsUpdate(
                    policydetailsUpdate,
                    policyresourcesUpdate
                  )}
                </tbody>
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

            {action == "update" && rowmask.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">
                Row Level Filter Policy Items:
              </h5>
            )}

            {action == "update" && rowmask.length > 0 && (
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
                      obj.attributeName == "Row level filter Policy Items" &&
                      obj.action == "update"
                  )
                  .map((policy) => {
                    return <tbody>{allowpolicyUpdate(policy)}</tbody>;
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
                    return <tbody>{allowpolicyUpdate(policy)}</tbody>;
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

                {reportdata
                  .filter(
                    (obj) =>
                      obj.attributeName == "Allow Exceptions" &&
                      obj.action == "update"
                  )
                  .map((policy) => {
                    return <tbody>{allowpolicyUpdate(policy)}</tbody>;
                  })}
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
              <thead>
                <tr>
                  <th>Fields</th>

                  <th>New Value</th>
                </tr>
              </thead>
              <tbody>
                {policyDetailsDelete(
                  policydetailsDelete,
                  policyresourcesDelete
                )}
              </tbody>
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

            {action == "delete" &&
              !isEmpty(validityoldVal) &&
              !isUndefined(validityoldVal) &&
              validityoldVal != "[]" &&
              validityoldVal.length > 0 && (
                <h5 className="bold wrap-header m-t-sm">Validity Period:</h5>
              )}

            {action == "delete" &&
              !isEmpty(validityoldVal) &&
              !isUndefined(validityoldVal) &&
              validityoldVal != "[]" &&
              validityoldVal.length > 0 && (
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
              !isEmpty(rowmaskoldval) &&
              !isUndefined(rowmaskoldval) &&
              rowmaskoldval != 0 &&
              rowmaskoldval.length > 0 && (
                <h5 className="bold wrap-header m-t-sm">
                  Row Level Filter Policy Items:
                </h5>
              )}
            {action == "delete" &&
              !isEmpty(rowmaskoldval) &&
              !isUndefined(rowmaskoldval) &&
              rowmaskoldval != 0 &&
              rowmaskoldval.length > 0 && (
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
                        obj.attributeName == "Row level filter Policy Items" &&
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
                                {`Accesses: ${policy.accesses.map(
                                  (obj) => obj.type
                                )}`}
                              </td>
                            </tr>

                            <tr>
                              <td className="table-warning">{`Row Level Filter: ${policy.rowFilterInfo.filterExpr}`}</td>
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
            <br />
            {action == "Import Delete" &&
              !isEmpty(policyexceptionoldval) &&
              !isUndefined(policyexceptionoldval) &&
              policyexceptionoldval != 0 && (
                <h5 className="bold wrap-header m-t-sm">
                  Allow Exception PolicyItems:
                </h5>
              )}
            {action == "Import Delete" &&
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
              {importJson.map((c) =>
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
              <tbody>
                {ImportDeleteDetails(
                  importDeleteDetails,
                  importdeleteresources
                )}
              </tbody>
            </Table>
            <br />
            <h5 className="bold wrap-header m-t-sm"> Allow PolicyItems:</h5>
            <Table className="table table-striped table-bordered w-auto">
              {importDeleteItems.map((policyitem) =>
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
