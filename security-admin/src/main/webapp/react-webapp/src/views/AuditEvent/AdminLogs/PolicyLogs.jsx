import React from "react";
import { Table, Badge, Row, Col } from "react-bootstrap";
import dateFormat from "dateformat";
import { ClassTypes } from "../../../utils/XAEnums";
import _, {
  isEmpty,
  startCase,
  isEqual,
  isUndefined,
  unionBy,
  difference,
  differenceWith,
  without
} from "lodash";

export const PolicyLogs = ({ data, reportdata }) => {
  const {
    objectName,
    objectClassType,
    parentObjectName,
    createDate,
    owner,
    action,
    objectId
  } = data;

  /* CREATE LOGS VARIABLES */
  const createPolicyDetails = reportdata.filter((policy) => {
    return (
      policy.action == "create" &&
      policy.attributeName != "Policy Resources" &&
      policy.attributeName != "Policy Conditions" &&
      policy.attributeName != "Policy Items" &&
      policy.attributeName != "DenyPolicy Items" &&
      policy.attributeName != "Allow Exceptions" &&
      policy.attributeName != "Deny Exceptions" &&
      policy.attributeName != "Masked Policy Items" &&
      policy.attributeName != "Row level filter Policy Items" &&
      policy.attributeName != "Validity Schedules"
    );
  });

  const createPolicyResources = reportdata.filter((resources) => {
    return (
      resources.attributeName == "Policy Resources" &&
      resources.action == "create"
    );
  });
  const createPolicyItems = reportdata.filter(
    (obj) => obj.attributeName == "Policy Items" && obj.action == "create"
  );
  const policyDetails = (details, resources) => {
    let tablerow = [];

    const createDetailsPolicy = (val, newVal) => {
      if (val == "Policy Labels") {
        return (newVal = !isEmpty(JSON.parse(newVal))
          ? JSON.parse(newVal).join(", ")
          : "--");
      }
      if (val == "Policy Status") {
        return (newVal = newVal === "false" ? "disabled" : "enabled");
      }
      return !isEmpty(newVal) ? newVal : "--";
    };

    details.map((policy) => {
      return tablerow.push(
        <tr>
          <td className="table-warning">{policy.attributeName}</td>
          <td className="table-warning">
            {!isEmpty(policy.newValue)
              ? createDetailsPolicy(policy.attributeName, policy.newValue)
              : "--"}
          </td>
        </tr>
      );
    });

    let newVal = {};
    resources.map((obj) => {
      newVal = JSON.parse(obj.newValue);
    });

    Object.keys(newVal).map((key, index) => {
      return tablerow.push(
        <>
          <tr key={index}>
            <td className="table-warning">{key}</td>
            <td className="table-warning"> {newVal[key].values.join(", ")}</td>
          </tr>
          <tr>
            <td className="table-warning">{key + " " + "exclude"}</td>
            <td className="table-warning">
              {newVal[key].isExcludes == false ? "false" : "true"}
            </td>
          </tr>
          <tr>
            <td className="table-warning">{key + " " + "recursive"}</td>
            <td className="table-warning">
              {newVal[key].isRecursive == false ? "false" : "true"}
            </td>
          </tr>
        </>
      );
    });
    return tablerow;
  };
  const createValidity = reportdata.filter(
    (obj) => obj.attributeName == "Validity Schedules" && obj.action == "create"
  );
  const createValidityNew = createValidity.map(
    (obj) => obj && obj.newValue && JSON.parse(obj.newValue)
  );
  const createCondition = reportdata.filter((obj) => {
    return obj.attributeName == "Policy Conditions" && obj.action == "create";
  });
  const createConditionNew = createCondition.map((obj) => obj.newValue);
  const createRowMask = reportdata.filter(
    (obj) =>
      obj.attributeName == "Row level filter Policy Items" &&
      obj.action == "create"
  );
  const createRowMaskNew = createRowMask.map((newval) => newval.newValue);

  const createException = reportdata.filter(
    (obj) => obj.attributeName == "Allow Exceptions" && obj.action == "create"
  );
  const createExceptionNew = createException.map((newval) => newval.newValue);
  const createDenyPolicy = reportdata.filter(
    (obj) => obj.attributeName == "DenyPolicy Items" && obj.action == "create"
  );
  const createDenyPolicyNew = createDenyPolicy.map((newval) => newval.newValue);

  const cerateDenyException = reportdata.filter(
    (obj) => obj.attributeName == "Deny Exceptions" && obj.action == "create"
  );
  const createDenyExceptionNew = cerateDenyException.map(
    (newval) => newval.newValue
  );
  const createMaskPolicy = reportdata.filter(
    (obj) => obj.attributeName == "Masked Policy Items"
  );
  const createMaskPolicyNew = createMaskPolicy.map((newval) => newval.newValue);

  /* CREATE END */

  /* UPDATE LOGS VARIABLES */

  const updatePolicyDetails = reportdata.filter((policy) => {
    return (
      policy.action == "update" &&
      policy.attributeName != "Policy Resources" &&
      policy.attributeName != "Policy Conditions" &&
      policy.attributeName != "Policy Items" &&
      policy.attributeName != "DenyPolicy Items" &&
      policy.attributeName != "Allow Exceptions" &&
      policy.attributeName != "Deny Exceptions" &&
      policy.attributeName != "Masked Policy Items" &&
      policy.attributeName != "Row level filter Policy Items" &&
      policy.attributeName != "Validity Schedules"
    );
  });
  const updatePolicyResources = reportdata.filter((obj) => {
    return obj.attributeName == "Policy Resources" && obj.action == "update";
  });
  const policyDetailsUpdate = (details, resources) => {
    let tablerow = [];
    const policyOldVal = (val, oldVal) => {
      if (val == "Policy Labels") {
        return (oldVal = !isEmpty(JSON.parse(oldVal))
          ? JSON.parse(oldVal).join(", ")
          : "--");
      }
      if (val == "Policy Status") {
        return (oldVal = oldVal === "false" ? "disabled" : "enabled");
      }
      // if (val == "Policy Resources") {
      //   return;
      // }

      return !isEmpty(oldVal) ? oldVal : "--";
    };
    const policyNewVal = (val, newVal) => {
      if (val == "Policy Labels") {
        return (newVal = !isEmpty(JSON.parse(newVal))
          ? JSON.parse(newVal).join(", ")
          : "--");
      }
      if (val == "Policy Status") {
        return (newVal = newVal === "false" ? "disabled" : "enabled");
      }
      return !isEmpty(newVal) ? newVal : "--";
    };

    details.map((o, index) => {
      return tablerow.push(
        <tr key={index}>
          <td className="table-warning">{o.attributeName}</td>
          <td className="table-warning">
            {!isEmpty(o.previousValue)
              ? policyOldVal(o.attributeName, o.previousValue)
              : "--"}
          </td>
          <td className="table-warning">
            {!isEmpty(o.newValue)
              ? policyNewVal(o.attributeName, o.newValue)
              : "--"}
          </td>
        </tr>
      );
    });

    let oldVal = {};
    let newVal = {};
    resources.map((obj) => {
      oldVal = JSON.parse(obj.previousValue);
      newVal = JSON.parse(obj.newValue);
    });

    const diffVal = (obj1, obj2) => {
      let diff = {};
      if (!isEmpty(obj1)) {
        _.forEach(obj2, function (value, key) {
          if (obj1[key] !== undefined) {
            diff[key] = differenceWith(
              value.values,
              obj1[key].values,
              _.isEqual
            );
          }
        });
      } else {
        return (diff = obj2);
      }
      return diff;
    };
    let removedUsers = diffVal(newVal, oldVal);
    let addUsers = diffVal(oldVal, newVal);

    const getfilteredoldval = (val, oldvals) => {
      let filterdiff = null;
      !isEmpty(removedUsers[val])
        ? (filterdiff = difference(oldvals.values, removedUsers[val]))
        : (filterdiff = oldvals.values);
      return (
        <>
          {!isEqual(oldvals, newVal[val])
            ? !isEmpty(removedUsers[val])
              ? unionBy(
                  filterdiff.map((obj) => {
                    return (
                      <>
                        <span>{obj}</span>
                        {`, `}
                      </>
                    );
                  }),
                  removedUsers[val].map((obj) => {
                    return (
                      <>
                        <Badge className="d-inline mr-1" variant="danger">
                          {obj}
                        </Badge>
                      </>
                    );
                  })
                )
              : !isEmpty(filterdiff)
              ? filterdiff.map((obj) => obj).join(", ")
              : "--"
            : !isEmpty(oldvals)
            ? oldvals.values.map((obj) => obj).join(", ")
            : "--"}
        </>
      );
    };
    const getfilterednewval = (val, newvals) => {
      let filterdiff = null;
      !isEmpty(addUsers[val])
        ? (filterdiff = difference(newvals.values, addUsers[val]))
        : (filterdiff = newvals.values);
      return (
        <>
          {!isEqual(newvals, oldVal[val])
            ? !isEmpty(addUsers[val])
              ? unionBy(
                  filterdiff.map((obj) => {
                    return (
                      <>
                        <span>{obj}</span>
                        {`, `}
                      </>
                    );
                  }),
                  addUsers[val].map((obj) => {
                    return (
                      <>
                        <Badge className="d-inline mr-1" variant="success">
                          {obj}
                        </Badge>
                      </>
                    );
                  })
                )
              : !isEmpty(filterdiff)
              ? filterdiff.map((obj) => obj).join(", ")
              : "--"
            : !isEmpty(newvals)
            ? newvals.values.map((obj) => obj).join(", ")
            : "--"}
        </>
      );
    };

    Object.keys(oldVal).map((key, index) => {
      return tablerow.push(
        <>
          {!isEqual(oldVal[key].values, newVal[key].values) && (
            <tr>
              <td className="table-warning">{key}</td>
              {oldVal[key] && !isEmpty(oldVal[key].values) && (
                <td className="table-warning">
                  {getfilteredoldval(key, oldVal[key])}
                </td>
              )}
              {newVal[key] && !isEmpty(newVal[key].values) && (
                <td className="table-warning">
                  {getfilterednewval(key, newVal[key])}
                </td>
              )}
            </tr>
          )}
          {(oldVal[key].isExcludes === true ||
            newVal[key].isExcludes === true) && (
            <tr>
              <td className="table-warning">{key + " " + "exclude"}</td>

              <td className="table-warning">
                <h6>
                  <Badge variant="danger">
                    {oldVal[key].isExcludes === false ? "false" : "true"}
                  </Badge>
                </h6>
              </td>

              <td className="table-warning">
                <h6>
                  {" "}
                  <Badge variant="success">
                    {newVal[key].isExcludes === false ? "false" : "true"}
                  </Badge>
                </h6>
              </td>
            </tr>
          )}
          {(oldVal[key].isRecursive === true ||
            newVal[key].isRecursive === true) && (
            <tr>
              <td className="table-warning">{key + " " + "recursive"}</td>

              <td className="table-warning">
                <h6>
                  <Badge variant="danger">
                    {oldVal[key].isRecursive === false ? "false" : "true"}
                  </Badge>
                </h6>
              </td>

              <td className="table-warning">
                <h6>
                  <Badge variant="success">
                    {newVal[key].isRecursive === false ? "false" : "true"}
                  </Badge>
                </h6>
              </td>
            </tr>
          )}
        </>
      );
    });
    return tablerow;
  };
  const updateValidity = reportdata.filter(
    (obj) => obj.attributeName == "Validity Schedules" && obj.action == "update"
  );
  const updateValidityOld = updateValidity.map((obj) => obj.previousValue);
  const updateValidityNew = updateValidity.map((obj) => obj.newValue);

  const updateValidityOldNew = (policy) => {
    var tablerow = [];
    let oldVal = {};
    let newVal = {};

    policy.previousValue &&
      JSON.parse(policy.previousValue).map((obj) => (oldVal = obj));
    policy.newValue && JSON.parse(policy.newValue).map((obj) => (newVal = obj));

    let filteredval = Object.keys(oldVal).concat(Object.keys(newVal));
    filteredval = filteredval.filter((item, index) => {
      return filteredval.indexOf(item) == index;
    });

    const diffVal = (obj1, obj2) => {
      let diff = null;
      if (!isEmpty(obj1)) {
        diff = difference(obj1, obj2);
      } else {
        return (diff = obj2);
      }
      return diff;
    };

    var removedUsers = diffVal(
      JSON.parse(policy.previousValue),
      JSON.parse(policy.newValue)
    );
    var addUsers = diffVal(
      JSON.parse(policy.newValue),
      JSON.parse(policy.previousValue)
    );

    let filterPolicys = without(filteredval, "recurrences");
    const getfilteredoldval = (val, oldvals) => {
      let oldValues = oldvals[0];
      let filteredOldVal = oldValues[val];
      let filterdiff = null;
      !isEmpty(removedUsers[val])
        ? (filterdiff = difference(filteredOldVal, removedUsers[val]))
        : (filterdiff = filteredOldVal);
      return (
        <>
          <i>{startCase(val)}</i>:{" "}
          {!isEqual(filteredOldVal, newVal[val]) ? (
            !isEmpty(removedUsers[0][val]) ? (
              <Badge className="d-inline mr-1" variant="danger">
                {removedUsers[0][val]}
              </Badge>
            ) : !isEmpty(filterdiff) ? (
              filterdiff
            ) : (
              "--"
            )
          ) : !isEmpty(filteredOldVal) ? (
            filteredOldVal
          ) : (
            "--"
          )}
        </>
      );
    };
    const getfilterednewval = (val, newvals) => {
      let newValues = newvals[0];
      let filteredNewVal = newValues[val];
      let filterdiff = null;
      !isEmpty(addUsers[val])
        ? (filterdiff = difference(filteredNewVal, addUsers[val]))
        : (filterdiff = filteredNewVal);
      return (
        <>
          <i>{startCase(val)}</i>:
          {!isEqual(filteredNewVal, oldVal[val]) ? (
            !isEmpty(addUsers[0][val]) ? (
              <Badge className="d-inline mr-1" variant="success">
                {addUsers[0][val]}
              </Badge>
            ) : !isEmpty(filterdiff) ? (
              filterdiff
            ) : (
              "--"
            )
          ) : !isEmpty(filteredNewVal) ? (
            filteredNewVal
          ) : (
            "--"
          )}
        </>
      );
    };

    filterPolicys.map((val, index) => {
      return tablerow.push(
        <>
          <tr key={index}>
            {policy &&
            policy.previousValue &&
            !isEmpty(JSON.parse(policy.previousValue)) ? (
              <td className="table-warning text-nowrap">
                {getfilteredoldval(val, JSON.parse(policy.previousValue))}
              </td>
            ) : (
              <td>{"<empty>"}</td>
            )}

            {policy &&
            policy.newValue &&
            !isEmpty(JSON.parse(policy.newValue)) ? (
              <td className="table-warning text-nowrap">
                {getfilterednewval(val, JSON.parse(policy.newValue))}
              </td>
            ) : (
              <td>{"<empty>"}</td>
            )}
          </tr>
        </>
      );
    });
    return tablerow;
  };

  const updateMaskPolicy = reportdata.filter(
    (obj) =>
      obj.attributeName == "Masked Policy Items" && obj.action == "update"
  );
  const updateRowMask = reportdata.filter(
    (obj) =>
      obj.attributeName == "Row level filter Policy Items" &&
      obj.action == "update"
  );
  const updateRowMaskOld = updateRowMask.map(
    (obj) => obj.previousValue && obj.action == "update"
  );
  const updateRowMaskNew = updateRowMask.map(
    (obj) => obj.newValue && obj.action == "update"
  );
  const updatePolicyItems = reportdata.filter(
    (obj) => obj.attributeName == "Policy Items" && obj.action == "update"
  );
  const updateException = reportdata.filter(
    (obj) => obj.attributeName == "Allow Exceptions" && obj.action == "update"
  );
  const updateDenyPolicy = reportdata.filter(
    (obj) => obj.attributeName == "DenyPolicy Items" && obj.action == "update"
  );
  const updateDenyException = reportdata.filter(
    (obj) => obj.attributeName == "Deny Exceptions" && obj.action == "update"
  );
  const updatePolicyCondition = reportdata.filter((obj) => {
    return obj.attributeName == "Policy Conditions" && obj.action == "update";
  });

  const updatePolicyConditionOld = updatePolicyCondition.map(
    (obj) => obj.previousValue
  );
  const updatePolicyConditionNew = updatePolicyCondition.map(
    (obj) => obj.newValue
  );
  const updateConditionOldNew = (policy) => {
    var tablerow = [];
    let oldVal = [];
    let newVal = [];

    oldVal =
      policy.previousValue &&
      JSON.parse(policy.previousValue).map(
        (obj) => `${obj.type}:${obj.values}`
      );

    newVal =
      policy.newValue &&
      JSON.parse(policy.newValue).map((obj) => `${obj.type}:${obj.values}`);
    tablerow.push(
      <Row>
        <Col xs={6}>
          <Table className="table table-bordered">
            <thead>
              <tr>
                <th>Old Value</th>
              </tr>
            </thead>

            <tbody>
              {!isEmpty(oldVal) ? (
                oldVal.map((val) => {
                  return (
                    <tr key={val.id}>
                      {policy &&
                      policy.previousValue &&
                      !isEmpty(JSON.parse(policy.previousValue)) ? (
                        <td className="table-warning text-nowrap">{val}</td>
                      ) : (
                        <td>
                          <strong>--</strong>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <td className="table-warning text-center">
                  <strong>{"<empty>"} </strong>
                </td>
              )}
            </tbody>
          </Table>
        </Col>
        <Col xs={6}>
          <Table className="table table-bordered">
            <thead>
              <tr>
                <th>New Value</th>
              </tr>
            </thead>
            <tbody>
              {!isEmpty(newVal) ? (
                newVal.map((val) => {
                  return policy &&
                    policy.newValue &&
                    !isEmpty(JSON.parse(policy.newValue)) ? (
                    <tr key={val.id}>
                      <td className="table-warning">{val}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td>--</td>
                    </tr>
                  );
                })
              ) : (
                <td className="table-warning  text-center">
                  <strong>{"<empty>"} </strong>
                </td>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    );
    return tablerow;
  };

  const updatePolicyOldNew = (policy) => {
    var tablerow = [];
    let oldVal = {};
    let newVal = {};

    policy.previousValue &&
      JSON.parse(policy.previousValue).map((obj) => (oldVal = obj));
    policy.newValue && JSON.parse(policy.newValue).map((obj) => (newVal = obj));

    let filteredval = Object.keys(oldVal).concat(Object.keys(newVal));
    filteredval = filteredval.filter((item, index) => {
      return filteredval.indexOf(item) == index;
    });

    let filterPolicys =
      policy.attributeName == "Masked Policy Items" ||
      policy.attributeName == "Row level filter Policy Items"
        ? without(filteredval, "conditions", "dataMaskInfo", "delegateAdmin")
        : filteredval;
    const diffVal = (obj1, obj2) => {
      let diff = {};
      if (!isEmpty(obj1)) {
        _.forEach(obj2, function (value, key) {
          if (obj1[key] !== undefined) {
            diff[key] = differenceWith(value, obj1[key], _.isEqual);
          }
        });
      } else {
        return (diff = obj2);
      }
      return diff;
    };
    var removedUsers = diffVal(newVal, oldVal);
    var addUsers = diffVal(oldVal, newVal);

    const getfilteredoldval = (val, oldvals) => {
      let oldValues = oldvals[0];
      let filterOldVal = oldValues[val];
      /* Permissions */

      if (val == "accesses") {
        let filterdiff = null;
        !isEmpty(removedUsers[val])
          ? (filterdiff = differenceWith(
              filterOldVal,
              removedUsers[val],
              isEqual
            ))
          : (filterdiff = filterOldVal);
        return (
          <>
            {objectName == "rowlevel" ||
            objectName == "policyhivemask" ||
            objectName == "rowpolicy" ? (
              <i>{`Accesses: `} </i>
            ) : (
              <i>{`Permissions: `}</i>
            )}

            {!isEqual(filterOldVal, newVal[val])
              ? !isEmpty(removedUsers[val])
                ? unionBy(
                    filterdiff.map((obj) => {
                      return (
                        <>
                          <span>{obj.type}</span>
                          {`, `}
                        </>
                      );
                    }),
                    removedUsers[val].map((obj) => {
                      return (
                        <>
                          <Badge className="d-inline mr-1" variant="danger">
                            {obj.type}
                          </Badge>
                        </>
                      );
                    })
                  )
                : !isEmpty(filterdiff)
                ? filterdiff.map((obj) => obj.type).join(", ")
                : "<empty>"
              : !isEmpty(filterOldVal)
              ? filterOldVal.map((obj) => obj.type).join(", ")
              : "<empty>"}
          </>
        );
      }

      /* GROUPS */

      if (val == "groups") {
        let filterdiff = null;
        !isEmpty(removedUsers[val])
          ? (filterdiff = difference(filterOldVal, removedUsers[val]))
          : (filterdiff = filterOldVal);
        return (
          <>
            <i>{`Groups`}</i>:{" "}
            {!isEqual(filterOldVal, newVal[val])
              ? !isEmpty(removedUsers[val])
                ? unionBy(
                    filterdiff.map((obj) => {
                      return (
                        <>
                          <span>{obj}</span>
                          {`, `}
                        </>
                      );
                    }),
                    removedUsers[val].map((obj) => {
                      return (
                        <>
                          <Badge className="d-inline mr-1" variant="danger">
                            {obj}
                          </Badge>
                        </>
                      );
                    })
                  )
                : !isEmpty(filterdiff)
                ? filterdiff.map((obj) => obj).join(", ")
                : "<empty>"
              : !isEmpty(filterOldVal)
              ? filterOldVal.map((obj) => obj).join(", ")
              : "<empty>"}
          </>
        );
      }

      /* ROLES */

      if (val == "roles") {
        let filterdiff = null;
        !isEmpty(removedUsers[val])
          ? (filterdiff = difference(filterOldVal, removedUsers[val]))
          : (filterdiff = filterOldVal);
        return (
          <>
            <i>{`Roles`}</i>:{" "}
            {!isEqual(filterOldVal, newVal[val])
              ? !isEmpty(removedUsers[val])
                ? unionBy(
                    filterdiff.map((obj) => {
                      return (
                        <>
                          <span>{obj}</span>
                          {`, `}
                        </>
                      );
                    }),
                    removedUsers[val].map((obj) => {
                      return (
                        <>
                          <Badge className="d-inline mr-1" variant="danger">
                            {obj}
                          </Badge>
                        </>
                      );
                    })
                  )
                : !isEmpty(filterdiff)
                ? filterdiff.map((obj) => obj).join(", ")
                : "<empty>"
              : !isEmpty(filterOldVal)
              ? filterOldVal.map((obj) => obj).join(", ")
              : "<empty>"}
          </>
        );
      }

      /* USERS */

      if (val == "users") {
        let filterdiff = null;
        !isEmpty(removedUsers[val])
          ? (filterdiff = difference(filterOldVal, removedUsers[val]))
          : (filterdiff = filterOldVal);
        return (
          <>
            <i>{`Users`}</i>:{" "}
            {!isEqual(filterOldVal, newVal[val])
              ? !isEmpty(removedUsers[val])
                ? unionBy(
                    filterdiff.map((obj) => {
                      return (
                        <>
                          <span>{obj}</span>
                          {`, `}
                        </>
                      );
                    }),
                    removedUsers[val].map((obj) => {
                      return (
                        <>
                          <Badge className="d-inline mr-1" variant="danger">
                            {obj}
                          </Badge>
                        </>
                      );
                    })
                  )
                : !isEmpty(filterdiff)
                ? filterdiff.map((obj) => obj).join(", ")
                : "<empty>"
              : !isEmpty(filterOldVal)
              ? filterOldVal.map((obj) => obj).join(", ")
              : "<empty>"}
          </>
        );
      }
      if (val == "conditions") {
        let filterdiff = null;
        !isEmpty(removedUsers[val])
          ? (filterdiff = difference(filterOldVal, removedUsers[val]))
          : (filterdiff = filterOldVal);
        return (
          <>
            <i>{`Conditions`}</i>:{" "}
            {!isEqual(filterOldVal, newVal[val])
              ? !isEmpty(removedUsers[val])
                ? unionBy(
                    filterdiff.map((obj) => {
                      return (
                        <>
                          <span> {`${obj.type}: ${obj.values}`}</span>
                        </>
                      );
                    }),
                    removedUsers[val].map((obj) => {
                      return (
                        <>
                          <Badge className="d-inline mr-1" variant="success">
                            {`${obj.type}: ${obj.values}`}
                          </Badge>
                        </>
                      );
                    })
                  )
                : !isEmpty(filterdiff)
                ? filterdiff.map((obj) => {
                    `${obj.type}: ${obj.values}`;
                  })
                : "<empty>"
              : !isEmpty(filterOldVal)
              ? filterOldVal.map((obj) => {
                  `${obj.type}: ${obj.values}`;
                })
              : "<empty>"}
          </>
        );
      }
      if (val == "rowFilterInfo") {
        return (
          <>
            <i>{`Row Level Filter`}</i>
            {`: `}
            {!isEmpty(filterOldVal.filterExpr) ? (
              <span>{filterOldVal.filterExpr}</span>
            ) : (
              "empty"
            )}
          </>
        );
      }
      if (val == "DataMasklabel") {
        return (
          <>
            <i>{`Data Mask Types`}</i>
            {`: ${!isEmpty(filterOldVal) ? filterOldVal : "<empty>"}`}
          </>
        );
      }

      if (val == "delegateAdmin") {
        return (
          <>
            <i>{`Delegate Admin`}</i>
            {`: ${filterOldVal === false ? "disabled" : "enabled"}`}
          </>
        );
      }

      return `${val.charAt(0).toUpperCase() + val.slice(1)}:  ${
        !isEmpty(filterOldVal) ? filterOldVal : "<empty>"
      }`;
    };

    const getfilterednewval = (val, newvals) => {
      let newValues = newvals[0];
      let filterNewVal = newValues[val];
      /* PERMISSIONS */

      if (val == "accesses") {
        let filterdiff = null;
        !isEmpty(addUsers[val])
          ? (filterdiff = differenceWith(filterNewVal, addUsers[val], isEqual))
          : (filterdiff = filterNewVal);
        return (
          <>
            {objectName == "rowlevel" ||
            objectName == "policyhivemask" ||
            objectName == "rowpolicy" ? (
              <i>{`Accesses: `} </i>
            ) : (
              <i>{`Permissions: `}</i>
            )}

            {!isEqual(filterNewVal, oldVal[val])
              ? !isEmpty(addUsers[val])
                ? unionBy(
                    filterdiff.map((obj) => {
                      return (
                        <>
                          <span>{obj.type}</span>
                          {`, `}
                        </>
                      );
                    }),
                    addUsers[val].map((obj) => {
                      return (
                        <>
                          <Badge className="d-inline mr-1" variant="success">
                            {obj.type}
                          </Badge>
                        </>
                      );
                    })
                  )
                : !isEmpty(filterdiff)
                ? filterdiff.map((obj) => obj.type).join(", ")
                : "<empty>"
              : !isEmpty(filterNewVal)
              ? filterNewVal.map((obj) => obj.type).join(", ")
              : "<empty>"}
          </>
        );
      }
      /* GROUPS */
      if (val == "groups") {
        let filterdiff = null;
        !isEmpty(addUsers[val])
          ? (filterdiff = difference(filterNewVal, addUsers[val]))
          : (filterdiff = filterNewVal);
        return (
          <>
            <i>{`Groups`}</i>:{" "}
            {!isEqual(filterNewVal, oldVal[val])
              ? !isEmpty(addUsers[val])
                ? unionBy(
                    filterdiff.map((obj) => {
                      return (
                        <>
                          <span>{obj}</span>
                          {`, `}
                        </>
                      );
                    }),
                    addUsers[val].map((obj) => {
                      return (
                        <>
                          <Badge className="d-inline mr-1" variant="success">
                            {obj}
                          </Badge>
                        </>
                      );
                    })
                  )
                : !isEmpty(filterdiff)
                ? filterdiff.map((obj) => obj).join(", ")
                : "<empty>"
              : !isEmpty(filterNewVal)
              ? filterNewVal.map((obj) => obj).join(", ")
              : "<empty>"}
          </>
        );
      }
      /* ROLES */
      if (val == "roles") {
        let filterdiff = null;
        !isEmpty(addUsers[val])
          ? (filterdiff = difference(filterNewVal, addUsers[val]))
          : (filterdiff = filterNewVal);
        return (
          <>
            <i>{`Roles`}</i>:{" "}
            {!isEqual(filterNewVal, oldVal[val])
              ? !isEmpty(addUsers[val])
                ? unionBy(
                    filterdiff.map((obj) => {
                      return (
                        <>
                          <span>{obj}</span>
                          {`, `}
                        </>
                      );
                    }),
                    addUsers[val].map((obj) => {
                      return (
                        <>
                          <Badge className="d-inline mr-1" variant="success">
                            {obj}
                          </Badge>
                        </>
                      );
                    })
                  )
                : !isEmpty(filterdiff)
                ? filterdiff.map((obj) => obj).join(", ")
                : "<empty>"
              : !isEmpty(filterNewVal)
              ? filterNewVal.map((obj) => obj).join(", ")
              : "<empty>"}
          </>
        );
      }
      /* USERS */
      if (val == "users") {
        let filterdiff = null;
        !isEmpty(addUsers[val])
          ? (filterdiff = difference(filterNewVal, addUsers[val]))
          : (filterdiff = filterNewVal);
        return (
          <>
            <i>{`Users`}</i>:{" "}
            {!isEqual(filterNewVal, oldVal[val])
              ? !isEmpty(addUsers[val])
                ? unionBy(
                    filterdiff.map((obj) => {
                      return (
                        <>
                          <span>{obj}</span>
                          {`, `}
                        </>
                      );
                    }),
                    addUsers[val].map((obj) => {
                      return (
                        <>
                          <Badge className="d-inline mr-1" variant="success">
                            {obj}
                          </Badge>
                        </>
                      );
                    })
                  )
                : !isEmpty(filterdiff)
                ? filterdiff.map((obj) => obj).join(", ")
                : "<empty>"
              : !isEmpty(filterNewVal)
              ? filterNewVal.map((obj) => obj).join(", ")
              : "<empty>"}
          </>
        );
      }

      if (val == "conditions") {
        let filterdiff = null;
        !isEmpty(addUsers[val])
          ? (filterdiff = differenceWith(filterNewVal, addUsers[val], isEqual))
          : (filterdiff = filterNewVal);
        return (
          <>
            <i>{`Conditions`}</i>:{" "}
            {!isEqual(filterNewVal, oldVal[val])
              ? !isEmpty(addUsers[val])
                ? unionBy(
                    filterdiff.map((obj) => {
                      return (
                        <>
                          <span> {`${obj.type}: ${obj.values}`}</span>
                        </>
                      );
                    }),
                    addUsers[val].map((obj) => {
                      return (
                        <>
                          <Badge className="d-inline mr-1" variant="success">
                            {`${obj.type}: ${obj.values}`}
                          </Badge>
                        </>
                      );
                    })
                  )
                : !isEmpty(filterdiff)
                ? filterdiff.map((obj) => {
                    `${obj.type}: ${obj.values}`;
                  })
                : "<empty>"
              : !isEmpty(filterNewVal)
              ? filterNewVal.map((obj) => {
                  `${obj.type}: ${obj.values}`;
                })
              : "<empty>"}
          </>
        );
      }

      if (val == "DataMasklabel") {
        return (
          <>
            <i>{`Data Mask Types`}</i>
            {`: ${!isEmpty(filterNewVal) ? filterNewVal : "<empty>"}`}
          </>
        );
      }

      if (val == "rowFilterInfo") {
        return (
          <>
            <i>{`Row Level Filter`}</i>
            {`: `}
            {!isEmpty(filterNewVal.filterExpr) ? (
              <span>{filterNewVal.filterExpr}</span>
            ) : (
              "empty"
            )}
          </>
        );
      }

      if (val == "delegateAdmin") {
        return (
          <>
            <i>{`Delegate Admin`}</i>
            {`: ${filterNewVal === false ? "disabled" : "enabled"}`}
          </>
        );
      }

      return `${val.charAt(0).toUpperCase() + val.slice(1)}:  ${
        isEmpty(filterNewVal) ? filterNewVal : "<empty>"
      }`;
    };

    filterPolicys.map((val) => {
      return tablerow.push(
        <>
          <tr>
            {policy &&
            policy.previousValue &&
            !isEmpty(JSON.parse(policy.previousValue)) ? (
              <td className="table-warning text-nowrap">
                {getfilteredoldval(val, JSON.parse(policy.previousValue))}
              </td>
            ) : (
              <td>{"<empty>"}</td>
            )}

            {policy &&
            policy.newValue &&
            !isEmpty(JSON.parse(policy.newValue)) ? (
              <td className="table-warning text-nowrap">
                {getfilterednewval(val, JSON.parse(policy.newValue))}
              </td>
            ) : (
              <td>{"<empty>"}</td>
            )}
          </tr>
        </>
      );
    });

    return tablerow;
  };

  /*UPDATE END */

  /* DELETE POLICY VARIABLES */

  const deletePolicyDetails = reportdata.filter((policy) => {
    return (
      policy.action == "delete" &&
      policy.attributeName != "Policy Resources" &&
      policy.attributeName != "Policy Conditions" &&
      policy.attributeName != "Policy Items" &&
      policy.attributeName != "DenyPolicy Items" &&
      policy.attributeName != "Allow Exceptions" &&
      policy.attributeName != "Deny Exceptions" &&
      policy.attributeName != "Zone Name" &&
      policy.attributeName != "Masked Policy Items" &&
      policy.attributeName != "Row level filter Policy Items" &&
      policy.attributeName != "Validity Schedules"
    );
  });
  const deletePolicyResources = reportdata.filter((obj) => {
    return obj.attributeName == "Policy Resources" && obj.action == "delete";
  });
  const deleteDetails = (details, resources) => {
    let tablerow = [];

    const policyOldVal = (val, oldVal) => {
      if (val == "Policy Labels") {
        return (oldVal = !isEmpty(JSON.parse(oldVal))
          ? JSON.parse(oldVal).join(", ")
          : "--");
      }
      if (val == "Policy Status") {
        return (oldVal = oldVal === "false" ? "disabled" : "enabled");
      }
      return !isEmpty(oldVal) ? oldVal : "--";
    };

    details.map((policy) => {
      return tablerow.push(
        <tr>
          <td className="table-warning">{policy.attributeName}</td>
          <td className="table-warning">
            {!isEmpty(policy.previousValue)
              ? policyOldVal(policy.attributeName, policy.previousValue)
              : "--"}
          </td>
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
          <tr key={index}>
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

  const deleteRowMask = reportdata.filter(
    (obj) =>
      obj.attributeName == "Row level filter Policy Items" &&
      obj.action == "delete"
  );

  const deleteRowMaskOld = deleteRowMask.map((obj) => obj.previousValue);
  const deleteValidity = reportdata.filter(
    (obj) => obj.attributeName == "Validity Schedules" && obj.action == "delete"
  );

  const deleteValidityOld = deleteValidity.map((obj) => obj.previousValue);

  const deleteCondition = reportdata.filter((obj) => {
    return obj.attributeName == "Policy Conditions" && obj.action == "delete";
  });

  const deleteConditionOld = deleteCondition.map((obj) => obj.previousValue);
  const deleteMaskPolicy = reportdata.filter(
    (obj) =>
      obj.attributeName == "Masked Policy Items" && obj.action == "delete"
  );
  const deletemaskPolicyOld = deleteMaskPolicy.map((obj) => obj.previousValue);
  const deletePolicyItems = reportdata.filter(
    (obj) => obj.attributeName == "Policy Items" && obj.action == "delete"
  );

  const deletePolicyItemsOld = deletePolicyItems.map(
    (obj) => obj.previousValue
  );

  const deleteException = reportdata.filter(
    (obj) => obj.attributeName == "Allow Exceptions" && obj.action == "delete"
  );
  const deleteExceptionOld = deleteException.map((obj) => obj.previousValue);

  const deleteDenyPolicy = reportdata.filter(
    (obj) => obj.attributeName == "DenyPolicy Items" && obj.action == "delete"
  );
  const deleteDenyPolicyOld = deleteDenyPolicy.map((obj) => obj.previousValue);

  const deleteDenyException = reportdata.filter(
    (obj) => obj.attributeName == "Deny Exceptions" && obj.action == "delete"
  );
  const deleteDenyExceptionOld = deleteDenyException.map(
    (obj) => obj.previousValue
  );

  /*DELETE END */

  /* IMPORT DELETE LOGS VARIABLES */

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
    const createDetailsPolicy = (val, newVal) => {
      if (val == "Policy Labels") {
        return (newVal = !isEmpty(JSON.parse(newVal))
          ? JSON.parse(newVal).join(", ")
          : "--");
      }
      if (val == "Policy Status") {
        return (newVal = newVal === "false" ? "disabled" : "enabled");
      }
      return !isEmpty(newVal) ? newVal : "--";
    };
    details.map((policy) => {
      return tablerow.push(
        <tr>
          <td className="table-warning">{policy.attributeName}</td>
          <td className="table-warning">
            {!isEmpty(policy.previousValue)
              ? createDetailsPolicy(policy.attributeName, policy.previousValue)
              : "--"}
          </td>
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

  const importDelItems = reportdata.filter((obj) => {
    return obj.attributeName == "Policy Items";
  });
  const importDeleteItemsOld = importDelItems.map((obj) => obj.previousValue);

  const importDelValidity = reportdata.filter(
    (obj) =>
      obj.attributeName == "Validity Schedules" && obj.action == "Import Delete"
  );
  const importDelValidityOld = importDelValidity.map(
    (obj) => obj.previousValue
  );

  const importDelPolicyCondition = reportdata.filter((obj) => {
    return (
      obj.attributeName == "Policy Conditions" && obj.action == "Import Delete"
    );
  });
  const importPolicyConditionOld = importDelPolicyCondition.map(
    (obj) => obj.previousValue
  );

  const importDelPolicyException = reportdata.filter(
    (obj) => obj.attributeName == "Allow Exceptions"
  );
  const importdelPolicyExceptionOld = importDelPolicyException.map(
    (obj) => obj.previousValue
  );

  const importdeldenyPolicy = reportdata.filter(
    (obj) =>
      obj.attributeName == "DenyPolicy Items" && obj.action == "Import Delete"
  );
  const importdeldenyPolicyold = importdeldenyPolicy.map(
    (obj) => obj.previousValue
  );

  const importDelDenyExceptions = reportdata.filter(
    (obj) =>
      obj.attributeName == "Deny Exceptions" && obj.action == "Import Delete"
  );
  const importDeldenyExceptionsold = importDelDenyExceptions.map(
    (obj) => obj.previousValue
  );

  const importdelmaskPolicyItem = reportdata.filter(
    (obj) =>
      obj.attributeName == "Masked Policy Items" &&
      obj.action == "Import Delete"
  );
  const importdelmaskpolicyold = importdelmaskPolicyItem.map(
    (obj) => obj.previousValue
  );

  /*IMPORT DELETE END*/

  /* IMPORT END LOGS*/

  const importEnd = reportdata.filter((obj) => obj.action == "IMPORT END");

  /* EXPORT JSON | CSV | EXCEL  LOGS */

  const exportVal = reportdata.filter(
    (obj) =>
      obj.action == "EXPORT JSON" ||
      obj.action == "EXPORT EXCEL" ||
      obj.action == "EXPORT CSV"
  );
  const exportOldVal = (val, oldVal) => {
    if (val == "Export time") {
      return (oldVal = dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT "));
    }
    return oldVal;
  };

  const policycondition = reportdata.filter((obj) => {
    return obj.attributeName == "Policy Conditions" && obj.action == "update";
  });

  const importdeleteresources = reportdata.filter((c) => {
    return c.attributeName == "Policy Resources" && c.action == "Import Delete";
  });

  const policyitems = reportdata.filter(
    (obj) => obj.attributeName == "Policy Items"
  );

  const policyexception = reportdata.filter(
    (obj) => obj.attributeName == "Allow Exceptions"
  );

  const denyPolicyItem = reportdata.filter(
    (obj) => obj.attributeName == "DenyPolicy Items"
  );

  const maskPolicyItem = reportdata.filter(
    (obj) => obj.attributeName == "Masked Policy Items"
  );

  const validityschedules = reportdata.filter(
    (obj) => obj.attributeName == "Validity Schedules"
  );

  return (
    <div>
      {/* CREATE LOGS */}

      {action == "create" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
          <div>
            <div className="font-weight-bolder">
              Policy ID : <Badge variant="info">{objectId}</Badge>
            </div>
            <div className="font-weight-bolder">Policy Name: {objectName}</div>
            <div className="font-weight-bolder">Service Name: {owner}</div>
            <div className="font-weight-bolder">
              Created Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
              India Standard Time
            </div>
            <div className="font-weight-bolder">Created By: {owner}</div>
            <h5 className="bold wrap-header mt-3">Policy Details:</h5>

            <Table className="table table-striped table-bordered w-auto">
              <thead className="thead-light">
                <tr>
                  <th>Fields</th>

                  <th>New Value</th>
                </tr>
              </thead>
              <tbody>
                {policyDetails(createPolicyDetails, createPolicyResources)}
              </tbody>
            </Table>
            <br />
            {action == "create" &&
              !isEmpty(createValidityNew) &&
              !isUndefined(createValidityNew) &&
              createValidityNew != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">Validity Period:</h5>
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>
                    {createValidityNew.map((policyitem) => {
                      return policyitem.map((policy, index) => (
                        <tbody>
                          <tr key={index}>
                            <td className="table-warning">
                              {`Start Date: ${
                                !isEmpty(policy.startTime)
                                  ? policy.startTime
                                  : "--"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              {`End Date: ${
                                !isEmpty(policy.endTime) ? policy.endTime : "--"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              {`Time Zone: ${
                                !isEmpty(policy.timeZone)
                                  ? policy.timeZone
                                  : "--"
                              } `}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "create" &&
              !isEmpty(createConditionNew) &&
              !isUndefined(createConditionNew) &&
              createConditionNew != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Policy Conditions:
                  </h5>
                  <Table className="table table-striped  table-bordered   w-25">
                    <thead className="thead-light">
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {createConditionNew.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy, index) => (
                        <tbody>
                          <tr key={index}>
                            <td className="table-warning">{`${policy.type}: ${policy.values}`}</td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "create" &&
              !isEmpty(createPolicyItems) &&
              !isUndefined(createPolicyItems) &&
              createPolicyItems != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Allow PolicyItems:
                  </h5>
                  <Table className="table table-striped  table-bordered w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {createPolicyItems.map((policyitem) => {
                      return JSON.parse(policyitem.newValue).map(
                        (policy, index) => (
                          <tbody>
                            <tr key={index}>
                              <td className="table-warning text-nowrap">
                                <i>{`Roles`}</i>
                                {`: ${
                                  !isEmpty(policy.roles)
                                    ? policy.roles.join(", ")
                                    : "<empty>"
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning text-nowrap">
                                <i>{`Groups`}</i>
                                {`: ${
                                  !isEmpty(policy.groups)
                                    ? policy.roles.join(", ")
                                    : "<empty>"
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning text-nowrap">
                                <i>{`Users`}</i>
                                {`: ${
                                  !isEmpty(policy.users)
                                    ? policy.users.join(", ")
                                    : "<empty>"
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-warning text-nowrap">
                                <i>{`Permissions`}</i>
                                {!isEmpty(policy.accesses)
                                  ? `: ${policy.accesses
                                      .map((obj) => obj.type)
                                      .join(", ")} `
                                  : "<empty>"}
                              </td>
                            </tr>
                            <tr>
                              {policy.conditions &&
                                policy.conditions.length > 0 && (
                                  <td className="table-warning text-nowrap">
                                    <i>{`Conditions`}</i>
                                    {`: ${policy.conditions.map(
                                      (type) => `${type.type} : ${type.values}`
                                    )}`}
                                  </td>
                                )}
                            </tr>
                            <tr>
                              <td className="table-warning text-nowrap">
                                <i>{`Delegate Admin`}</i>
                                {`: ${
                                  policy.delegateAdmin == true
                                    ? "enabled"
                                    : "disabled"
                                }`}
                              </td>
                            </tr>
                          </tbody>
                        )
                      );
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "create" &&
              !isEmpty(createRowMaskNew) &&
              !isUndefined(createRowMaskNew) &&
              createRowMaskNew != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Row Level Filter Policy Items:
                  </h5>
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {createRowMaskNew.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Roles`}</i>
                              {`: ${
                                !isEmpty(policy.roles)
                                  ? policy.roles.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Groups`}</i>
                              {`: ${
                                !isEmpty(policy.groups)
                                  ? policy.groups.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Users`}</i>
                              {`: ${
                                !isEmpty(policy.users)
                                  ? policy.users.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Accesses`}</i>
                              {!isEmpty(policy.accesses)
                                ? `: ${policy.accesses
                                    .map((obj) => obj.type)
                                    .join(", ")} `
                                : "<empty>"}
                            </td>
                          </tr>

                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Row Level Filter`}</i>
                              {!isEmpty(policy.rowFilterInfo.filterExpr)
                                ? `: ${policy.rowFilterInfo.filterExpr} `
                                : "<empty>"}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "create" &&
              !isEmpty(createExceptionNew) &&
              !isUndefined(createExceptionNew) &&
              createExceptionNew != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">Allow Exceptions:</h5>
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {createExceptionNew.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Roles`}</i>
                              {`: ${
                                !isEmpty(policy.roles)
                                  ? policy.roles.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Groups`}</i>
                              {`: ${
                                !isEmpty(policy.groups)
                                  ? policy.groups.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Users`}</i>
                              {`: ${
                                !isEmpty(policy.users)
                                  ? policy.users.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Permissions`}</i>
                              {!isEmpty(policy.accesses)
                                ? `: ${policy.accesses
                                    .map((obj) => obj.type)
                                    .join(", ")} `
                                : "<empty>"}
                            </td>
                          </tr>
                          <tr>
                            {policy.conditions && policy.conditions.length > 0 && (
                              <td className="table-warning text-nowrap">
                                <i>{`Conditions`}</i>
                                {`: ${policy.conditions
                                  .map(
                                    (type) => `${type.type} : ${type.values}`
                                  )
                                  .join(", ")}`}
                              </td>
                            )}
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Delegate Admin`}</i>
                              {`: ${
                                policy.delegateAdmin == true
                                  ? "enabled"
                                  : "disabled"
                              }`}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "create" &&
              !isEmpty(createDenyPolicyNew) &&
              !isUndefined(createDenyPolicyNew) &&
              createDenyPolicyNew != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">Deny PolicyItems:</h5>
                  <Table className="table table-striped  table-bordered  w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {createDenyPolicyNew.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Roles`}</i>
                              {`: ${
                                !isEmpty(policy.roles)
                                  ? policy.roles.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Groups`}</i>
                              {`: ${
                                !isEmpty(policy.groups)
                                  ? policy.groups.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Users`}</i>
                              {`: ${
                                !isEmpty(policy.users)
                                  ? policy.users.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Permissions`}</i>
                              {!isEmpty(policy.accesses)
                                ? `: ${policy.accesses
                                    .map((obj) => obj.type)
                                    .join(", ")} `
                                : "<empty>"}
                            </td>
                          </tr>
                          <tr>
                            {policy.conditions && policy.conditions.length > 0 && (
                              <td className="table-warning text-nowrap">
                                <i>{`Conditions`}</i>
                                {`: ${policy.conditions
                                  .map(
                                    (type) => `${type.type} : ${type.values}`
                                  )
                                  .join(", ")}`}
                              </td>
                            )}
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Delegate Admin`}</i>
                              {`: ${
                                policy.delegateAdmin == true
                                  ? "enabled"
                                  : "disabled"
                              }`}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "create" &&
              !isEmpty(createDenyExceptionNew) &&
              !isUndefined(createDenyExceptionNew) &&
              createDenyExceptionNew != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Deny Exception PolicyItems:
                  </h5>
                  <Table className="table table-striped  table-bordered  w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {createDenyExceptionNew.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Roles`}</i>
                              {`: ${
                                !isEmpty(policy.roles)
                                  ? policy.roles.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Groups`}</i>
                              {`: ${
                                !isEmpty(policy.groups)
                                  ? policy.groups.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Users`}</i>
                              {`: ${
                                !isEmpty(policy.users)
                                  ? policy.users.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Permissions`}</i>
                              {!isEmpty(policy.accesses)
                                ? `: ${policy.accesses
                                    .map((obj) => obj.type)
                                    .join(", ")} `
                                : "<empty>"}
                            </td>
                          </tr>
                          <tr>
                            {policy.conditions && policy.conditions.length > 0 && (
                              <td className="table-warning text-nowrap">
                                <i>{`Conditions`}</i>
                                {`: ${policy.conditions.map(
                                  (type) => `${type.type} : ${type.values}`
                                )}`}
                              </td>
                            )}
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Delegate Admin`}</i>
                              {`: ${
                                policy.delegateAdmin == true
                                  ? "enabled"
                                  : "disabled"
                              }`}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "create" &&
              !isEmpty(createMaskPolicyNew) &&
              !isUndefined(createMaskPolicyNew) &&
              createMaskPolicyNew != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Masking Policy Items:
                  </h5>
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {createMaskPolicyNew.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Roles`}</i>
                              {`: ${
                                !isEmpty(policy.roles)
                                  ? policy.roles.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Groups`}</i>
                              {`: ${
                                !isEmpty(policy.groups)
                                  ? policy.groups.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Users`}</i>
                              {`: ${
                                !isEmpty(policy.users)
                                  ? policy.users.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning text-nowrap">
                              <i>{`Accesses`}</i>
                              {!isEmpty(policy.accesses)
                                ? `: ${policy.accesses
                                    .map((obj) => obj.type)
                                    .join(", ")} `
                                : "<empty>"}
                            </td>
                          </tr>

                          <tr>
                            {policy.delegateAdmin == true && (
                              <td className="table-warning text-nowrap">
                                <i>{`Delegate Admin`}</i>
                                {`: ${
                                  policy.delegateAdmin == true
                                    ? "enabled"
                                    : "disabled"
                                }`}
                              </td>
                            )}
                          </tr>
                          <tr>
                            {!isEmpty(policy.DataMasklabel) && (
                              <td className="table-warning text-nowrap">
                                <i>{`Data Mask Types`}</i>
                                {!isEmpty(policy.DataMasklabel)
                                  ? `: ${policy.DataMasklabel} `
                                  : "<empty>"}
                              </td>
                            )}
                          </tr>
                          <br />
                        </tbody>
                      ));
                    })}
                  </Table>
                </>
              )}
          </div>
        )}

      {/* UPDATE Policy Logs*/}

      {action == "update" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
          <div>
            <div className="row">
              <div className="col-md-6">
                <div className="font-weight-bolder">
                  Policy ID : <Badge variant="info">{objectId}</Badge>
                </div>
                <div className="font-weight-bolder">
                  Policy Name: {objectName}
                </div>
                <div className="font-weight-bolder">
                  Service Name: {parentObjectName}
                </div>
                <div className="font-weight-bolder">
                  Updated Date:{" "}
                  {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")} India
                  Standard Time
                </div>
                <div className="font-weight-bolder">Updated By: {owner} </div>
              </div>
              <div className="col-md-6 text-right">
                <div className="bg-success legend"></div> {" Added "}
                <div className="bg-danger legend"></div> {" Deleted "}
              </div>
            </div>
            <br />

            {(!isEmpty(updatePolicyDetails) ||
              !isEmpty(updatePolicyResources)) && (
              <>
                <h5 className="bold wrap-header m-t-sm">Policy details</h5>
                <Table className="table table-striped table-bordered w-auto">
                  <thead className="thead-light">
                    <tr>
                      <th>Fields</th>
                      <th>Old Value</th>
                      <th>New Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policyDetailsUpdate(
                      updatePolicyDetails,
                      updatePolicyResources
                    )}
                  </tbody>
                </Table>
                <br />
              </>
            )}

            {action == "update" &&
              !isEqual(updateValidityOld, updateValidityNew) &&
              (!updateValidityOld.includes("") ||
                !updateValidityNew.includes("")) && (
                <>
                  <h5 className="bold wrap-header m-t-sm">Validity Period:</h5>
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                    </thead>
                    {updateValidity.map((policy) => (
                      <tbody>{updateValidityOldNew(policy)}</tbody>
                    ))}
                  </Table>
                  <br />
                </>
              )}

            {action == "update" &&
              !isEqual(updateRowMaskOld, updateRowMaskNew) &&
              (!updateRowMaskOld.includes("") ||
                !updateRowMaskNew.includes("")) && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Row Level Filter Policy Items:
                  </h5>
                  <Table className="table table-striped  table-bordered w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {updateRowMask.map((policy) => {
                      return <tbody>{updatePolicyOldNew(policy)}</tbody>;
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "update" &&
              !isEqual(updatePolicyConditionOld, updatePolicyConditionNew) &&
              (!updatePolicyConditionOld.includes("") ||
                !updatePolicyConditionNew.includes("")) && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Policy Conditions:
                  </h5>
                  {updatePolicyCondition.map((policyitem) => {
                    return updateConditionOldNew(policyitem);
                  })}
                </>
              )}

            {action == "update" &&
              !isEmpty(updateMaskPolicy) &&
              !isUndefined(updateMaskPolicy) &&
              updateMaskPolicy != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Mask Policy Items:
                  </h5>
                  <Table className="table table-striped  table-bordered w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {updateMaskPolicy.map((policy) => {
                      return <tbody>{updatePolicyOldNew(policy)}</tbody>;
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "update" &&
              !isEmpty(updatePolicyItems) &&
              !isUndefined(updatePolicyItems) &&
              updatePolicyItems != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Allow PolicyItems:
                  </h5>
                  <Table className="table table-striped  table-bordered w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {updatePolicyItems.map((policy) => {
                      return <tbody>{updatePolicyOldNew(policy)}</tbody>;
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "update" &&
              !isEmpty(updateException) &&
              !isUndefined(updateException) && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Allow Exception PolicyItems:
                  </h5>
                  <Table className="table table-striped  table-bordered  w-auto ">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {updateException.map((policy) => {
                      return <tbody>{updatePolicyOldNew(policy)}</tbody>;
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "update" &&
              !isEmpty(updateDenyPolicy) &&
              !isUndefined(updateDenyPolicy) && (
                <>
                  <h5 className="bold wrap-header m-t-sm">Deny PolicyItems:</h5>
                  <Table className="table table-striped  table-bordered  w-auto ">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {updateDenyPolicy.map((policy) => {
                      return <tbody>{updatePolicyOldNew(policy)}</tbody>;
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "update" &&
              !isEmpty(updateDenyException) &&
              !isUndefined(updateDenyException) && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Deny Exception PolicyItems:
                  </h5>
                  <Table className="table table-striped  table-bordered  w-auto ">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {updateDenyException.map((policy) => {
                      return <tbody>{updatePolicyOldNew(policy)}</tbody>;
                    })}
                  </Table>
                </>
              )}
          </div>
        )}

      {/* DELETE POLICY LOGS  */}

      {action == "delete" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
          <div>
            <div className="font-weight-bolder">
              Policy ID: <Badge variant="info">{objectId}</Badge>
            </div>
            <div className="font-weight-bolder">Policy Name: {objectName}</div>
            <div className="font-weight-bolder">
              Service Name: {parentObjectName}
            </div>
            <div className="font-weight-bolder">
              Deleted Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
              India Standard Time
            </div>
            <div className="font-weight-bolder">Deleted By: {owner} </div>
            <br />
            <h5 className="bold wrap-header m-t-sm">Policy Details:</h5>
            {/* {maskPolicyItem.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">Masking Policy Items:</h5>
            )} */}
            <Table className="table table-striped table-bordered w-auto">
              <thead className="thead-light">
                <tr>
                  <th>Fields</th>

                  <th>Old Value</th>
                </tr>
              </thead>
              <tbody>
                {deleteDetails(deletePolicyDetails, deletePolicyResources)}
              </tbody>
            </Table>
            <br />
            {action == "delete" &&
              !isEmpty(deleteValidityOld) &&
              !isUndefined(deleteValidityOld) &&
              deleteValidityOld != "[]" &&
              deleteValidityOld != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">Validity Period:</h5>
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>old Value</th>
                      </tr>
                    </thead>
                    {deleteValidityOld.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Start Date`}</i>
                              {`: ${
                                !isEmpty(policy.startTime)
                                  ? policy.startTime
                                  : "--"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`End Date`}</i>
                              {`: ${
                                !isEmpty(policy.endTime) ? policy.endTime : "--"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Time Zone`}</i>
                              {`: ${
                                !isEmpty(policy.timeZone)
                                  ? policy.timeZone
                                  : "--"
                              } `}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}
            {action == "delete" &&
              !isEmpty(deleteConditionOld) &&
              !isUndefined(deleteConditionOld) &&
              deleteConditionOld != "[]" &&
              deleteConditionOld != "" && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Policy Conditions:
                  </h5>
                  <Table className="table table-striped  table-bordered   w-25">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                      </tr>
                    </thead>

                    {deleteConditionOld.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              {`${policy.type}: ${policy.values.join(", ")}`}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}
            {action == "delete" &&
              !isEmpty(deleteRowMaskOld) &&
              !isUndefined(deleteRowMaskOld) &&
              deleteRowMaskOld != 0 &&
              deleteRowMaskOld.length > 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Row Level Filter Policy Items:
                  </h5>
                  <Table className="table table-striped  table-bordered  table-responsive w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                      </tr>
                    </thead>

                    {deleteRowMaskOld.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Roles`}</i>
                              {`: ${
                                !isEmpty(policy.roles)
                                  ? policy.roles.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                !isEmpty(policy.groups)
                                  ? policy.groups.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                !isEmpty(policy.suers)
                                  ? policy.suers.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Accesses`}</i>
                              {!isEmpty(policy.accesses)
                                ? `: ${policy.accesses
                                    .map((obj) => obj.type)
                                    .join(", ")} `
                                : "<empty>"}
                            </td>
                          </tr>

                          <tr>
                            <td className="table-warning">
                              <i>{`Row Level Filter`}</i>
                              {!isEmpty(policy.rowFilterInfo.filterExpr)
                                ? `: ${policy.rowFilterInfo.filterExpr}`
                                : "<empty>"}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                    <br />
                  </Table>
                </>
              )}
            {action == "delete" &&
              !isEmpty(deletemaskPolicyOld) &&
              !isUndefined(deletemaskPolicyOld) &&
              deletemaskPolicyOld != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Masking Policy Items:
                  </h5>
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                      </tr>
                    </thead>

                    {deletemaskPolicyOld.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Roles`}</i>
                              {`: ${
                                !isEmpty(policy.roles)
                                  ? policy.roles.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                !isEmpty(policy.groups)
                                  ? policy.groups.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                !isEmpty(policy.users)
                                  ? policy.users.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Accesses`}</i>
                              {!isEmpty(policy.accesses)
                                ? `: ${policy.accesses
                                    .map((obj) => obj.type)
                                    .join(", ")} `
                                : "<empty>"}
                            </td>
                          </tr>

                          <tr>
                            {policy.delegateAdmin == true && (
                              <td className="table-warning">
                                <i>{`Delegate Admin`}</i>
                                {`: ${
                                  policy.delegateAdmin == true
                                    ? "enabled"
                                    : "disabled"
                                } `}
                              </td>
                            )}
                          </tr>
                          <tr>
                            {policy.DataMasklabel &&
                              policy.DataMasklabel.length > 0 && (
                                <td className="table-warning">
                                  <i>{`Data Mask Types`}</i>
                                  {`: ${policy.DataMasklabel} `}
                                </td>
                              )}
                          </tr>
                          <br />
                        </tbody>
                      ));
                    })}
                  </Table>
                </>
              )}
            {action == "delete" &&
              !isEmpty(deletePolicyItemsOld) &&
              !isUndefined(deletePolicyItemsOld) &&
              deletePolicyItemsOld != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Allow PolicyItems:
                  </h5>
                  <Table className="table table-striped  table-bordered  w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                      </tr>
                    </thead>

                    {deletePolicyItemsOld.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Roles`}</i>
                              {`: ${
                                !isEmpty(policy.roles)
                                  ? policy.roles.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                !isEmpty(policy.groups)
                                  ? policy.groups.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                !isEmpty(policy.users)
                                  ? policy.users.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Permissions`}</i>
                              {!isEmpty(policy.accesses)
                                ? `: ${policy.accesses
                                    .map((obj) => obj.type)
                                    .join(", ")} `
                                : "<empty>"}
                            </td>
                          </tr>
                          <tr>
                            {policy.conditions && policy.conditions.length > 0 && (
                              <td className="table-warning">
                                <i>{`Conditions`}</i>
                                {`: ${policy.conditions.map(
                                  (type) =>
                                    `${type.type} : ${type.values.join(", ")}`
                                )} `}
                              </td>
                            )}
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Delegate Admin`}</i>
                              {`: ${
                                policy.delegateAdmin == true
                                  ? "enabled"
                                  : "disabled"
                              } `}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}
            {action == "delete" &&
              !isEmpty(deleteExceptionOld) &&
              !isUndefined(deleteExceptionOld) &&
              deleteExceptionOld != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Allow Exception PolicyItems:
                  </h5>
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                      </tr>
                    </thead>

                    {deleteExceptionOld.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Roles`}</i>
                              {`: ${
                                !isEmpty(policy.roles)
                                  ? policy.roles.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                !isEmpty(policy.groups)
                                  ? policy.groups.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                !isEmpty(policy.users)
                                  ? policy.users.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Permissions`}</i>
                              {!isEmpty(policy.accesses)
                                ? `: ${policy.accesses
                                    .map((obj) => obj.type)
                                    .join(", ")} `
                                : "<empty>"}
                            </td>
                          </tr>
                          <tr>
                            {policy.conditions && policy.conditions.length > 0 && (
                              <td className="table-warning">
                                <i>{`Conditions`}</i>
                                {`: ${policy.conditions.map(
                                  (type) =>
                                    `${type.type} : ${type.values.join(", ")}`
                                )} `}
                              </td>
                            )}
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Delegate Admin`}</i>
                              {`: ${
                                policy.delegateAdmin == true
                                  ? "enabled"
                                  : "disabled"
                              } `}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}
            {action == "delete" &&
              !isEmpty(deleteDenyPolicyOld) &&
              !isUndefined(deleteDenyPolicyOld) &&
              deleteDenyPolicyOld != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">Deny PolicyItems:</h5>
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                      </tr>
                    </thead>

                    {deleteDenyPolicyOld.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Roles`}</i>
                              {`: ${
                                !isEmpty(policy.roles)
                                  ? policy.roles.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                !isEmpty(policy.groups)
                                  ? policy.groups.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                !isEmpty(policy.users)
                                  ? policy.users.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Permissions`}</i>
                              {!isEmpty(policy.accesses)
                                ? `: ${policy.accesses
                                    .map((obj) => obj.type)
                                    .join(", ")} `
                                : "<empty>"}
                            </td>
                          </tr>
                          <tr>
                            {policy.conditions && policy.conditions.length > 0 && (
                              <td className="table-warning">
                                <i>{`Conditions`}</i>
                                {`: ${policy.conditions.map(
                                  (type) =>
                                    `${type.type} : ${type.values.join(", ")}`
                                )} `}
                              </td>
                            )}
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Delegate Admin`}</i>
                              {`: ${
                                policy.delegateAdmin == true
                                  ? "enabled"
                                  : "disabled"
                              } `}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "delete" &&
              !isEmpty(deleteDenyExceptionOld) &&
              !isUndefined(deleteDenyExceptionOld) &&
              deleteDenyExceptionOld != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Deny Exception PolicyItems:
                  </h5>
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                      </tr>
                    </thead>

                    {deleteDenyExceptionOld.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Roles`}</i>
                              {`: ${
                                !isEmpty(policy.roles)
                                  ? policy.roles.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                !isEmpty(policy.groups)
                                  ? policy.groups.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                !isEmpty(policy.users)
                                  ? policy.users.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Permissions`}</i>
                              {!isEmpty(policy.accesses)
                                ? `: ${policy.accesses
                                    .map((obj) => obj.type)
                                    .join(", ")} `
                                : "<empty>"}
                            </td>
                          </tr>
                          <tr>
                            {policy.conditions && policy.conditions.length > 0 && (
                              <td className="table-warning">
                                <i>{`Conditions`}</i>
                                {`: ${policy.conditions.map(
                                  (type) =>
                                    `${type.type} : ${type.values.join(", ")}`
                                )} `}
                              </td>
                            )}
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Delegate Admin`}</i>
                              {`: ${
                                policy.delegateAdmin == true
                                  ? "enabled"
                                  : "disabled"
                              } `}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}
          </div>
        )}

      {/* IMPORT END */}
      {action == "IMPORT END" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
          <div>
            <h5 className="bold wrap-header m-t-sm">Details:</h5>
            <Table className="table table-striped table-bordered w-50">
              {importEnd.map((c) =>
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
      {(action == "EXPORT JSON" ||
        action == "EXPORT CSV" ||
        action == "EXPORT EXCEL") &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
          <>
            <h5 className="bold wrap-header m-t-sm">Details:</h5>
            <Table className="table table-striped table-bordered w-50">
              {exportVal.map((c) =>
                Object.keys(JSON.parse(c.previousValue)).map((s, index) => (
                  <tbody key={index}>
                    <tr>
                      <td className="table-warning">{s}</td>
                      <td className="table-warning">
                        {c &&
                        c.previousValue &&
                        !isEmpty(JSON.parse(c.previousValue))
                          ? exportOldVal(s, JSON.parse(c.previousValue)[s])
                          : "--"}
                      </td>
                    </tr>
                  </tbody>
                ))
              )}
            </Table>
          </>
        )}

      {/* Import Delete */}

      {action == "Import Delete" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
          <div>
            <div className="font-weight-bolder">
              Policy ID : <Badge variant="info">{objectId}</Badge>
            </div>
            <div className="font-weight-bolder">Policy Name: {objectName}</div>
            <div className="font-weight-bolder">
              Deleted Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
              India Standard Time
            </div>
            <div className="font-weight-bolder">Deleted By: {owner} </div>
            <br />
            <h5 className="bold wrap-header m-t-sm">Policy Details:</h5>
            <Table className="table table-striped table-bordered w-auto">
              <thead className="thead-light">
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

            {action == "Import Delete" &&
              !isEmpty(importDelValidityOld) &&
              !isUndefined(importDelValidityOld) &&
              importDelValidityOld != "[]" &&
              importDelValidityOld != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">Validity Period:</h5>
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>old Value</th>
                      </tr>
                    </thead>
                    {importDelValidityOld.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Start Date`}</i>
                              {`: ${
                                !isEmpty(policy.startTime)
                                  ? policy.startTime
                                  : "--"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`End Date`}</i>
                              {`: ${
                                !isEmpty(policy.endTime) ? policy.endTime : "--"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Time Zone`}</i>
                              {`: ${
                                !isEmpty(policy.timeZone)
                                  ? policy.timeZone
                                  : "--"
                              } `}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "Import Delete" &&
              !isEmpty(importdelmaskpolicyold) &&
              !isUndefined(importdelmaskpolicyold) &&
              importdelmaskpolicyold != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Masking Policy Items:
                  </h5>

                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                      </tr>
                    </thead>

                    {importdelmaskpolicyold.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Roles`}</i>
                              {`: ${
                                !isEmpty(policy.roles)
                                  ? policy.roles.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                !isEmpty(policy.groups)
                                  ? policy.groups.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                !isEmpty(policy.users)
                                  ? policy.users.join(", ")
                                  : "<empty>"
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Accesses`}</i>
                              {!isEmpty(policy.accesses)
                                ? `: ${policy.accesses
                                    .map((obj) => obj.type)
                                    .join(", ")} `
                                : "<empty>"}
                            </td>
                          </tr>

                          <tr>
                            {policy.delegateAdmin == true && (
                              <td className="table-warning">
                                <i>{`Delegate Admin`}</i>
                                {`: ${
                                  policy.delegateAdmin == true
                                    ? "enabled"
                                    : "disabled"
                                } `}
                              </td>
                            )}
                          </tr>
                          <tr>
                            {policy.DataMasklabel &&
                              policy.DataMasklabel.length > 0 && (
                                <td className="table-warning">
                                  <i>{`Data Mask Types`}</i>
                                  {`: ${policy.DataMasklabel} `}
                                </td>
                              )}
                          </tr>
                          <br />
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}

            {action == "Import Delete" &&
              !isEmpty(importPolicyConditionOld) &&
              !isUndefined(importPolicyConditionOld) &&
              importPolicyConditionOld != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Policy Conditions:
                  </h5>
                  <Table className="table table-striped  table-bordered   w-25">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                      </tr>
                    </thead>

                    {importPolicyConditionOld.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">{`${policy.type}: ${policy.values}`}</td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}
            {action == "Import Delete" &&
              !isEmpty(importDeleteItemsOld) &&
              !isUndefined(importDeleteItemsOld) &&
              importDeleteItemsOld != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Allow PolicyItems:
                  </h5>
                  <Table className="table table-striped table-bordered w-auto">
                    <thead className="thead-light">
                      <tr>
                        <th>Old Value</th>
                      </tr>
                    </thead>
                    {importDeleteItemsOld.map((policyitem) =>
                      JSON.parse(policyitem).map((policy) => {
                        return (
                          <>
                            <tbody>
                              <tr>
                                <td className="table-warning">
                                  <i>{`Roles`}</i>
                                  {`: ${
                                    !isEmpty(policy.roles)
                                      ? policy.roles.join(", ")
                                      : "<empty>"
                                  } `}
                                </td>
                              </tr>
                              <tr>
                                <td className="table-warning">
                                  <i>{`Groups`}</i>
                                  {`: ${
                                    !isEmpty(policy.groups)
                                      ? policy.groups.join(", ")
                                      : "<empty>"
                                  } `}
                                </td>
                              </tr>
                              <tr>
                                <td className="table-warning">
                                  <i>{`Users`}</i>
                                  {`: ${
                                    !isEmpty(policy.users)
                                      ? policy.users.join(", ")
                                      : "<empty>"
                                  } `}
                                </td>
                              </tr>
                              <tr>
                                <td className="table-warning">
                                  <i>{`Permissions`}</i>
                                  {!isEmpty(policy.accesses)
                                    ? `: ${policy.accesses
                                        .map((obj) => obj.type)
                                        .join(", ")} `
                                    : "<empty>"}
                                </td>
                              </tr>
                              <tr>
                                {policy.conditions &&
                                  policy.conditions.length > 0 && (
                                    <td className="table-warning">
                                      <i>{`Conditions`}</i>
                                      {`: ${policy.conditions.map(
                                        (type) =>
                                          `${type.type} : ${type.values}`
                                      )} `}
                                    </td>
                                  )}
                              </tr>
                              <tr>
                                <td className="table-warning">
                                  <i>{`Delegate Admin`}</i>
                                  {`: ${
                                    policy.delegateAdmin == false
                                      ? "enabled"
                                      : "disabled"
                                  } `}
                                </td>
                              </tr>
                            </tbody>
                          </>
                        );
                      })
                    )}
                  </Table>
                  <br />
                </>
              )}
          </div>
        )}

      {action == "Import Delete" &&
        !isEmpty(importdelPolicyExceptionOld) &&
        !isUndefined(importdelPolicyExceptionOld) &&
        importdelPolicyExceptionOld != 0 && (
          <>
            <h5 className="bold wrap-header m-t-sm">
              Allow Exception PolicyItems:
            </h5>
            <Table className="table table-striped  table-bordered   w-auto">
              <thead className="thead-light">
                <tr>
                  <th>Old Value</th>
                </tr>
              </thead>

              {importdelPolicyExceptionOld.map((policyitem) => {
                return JSON.parse(policyitem).map((policy) => (
                  <tbody>
                    <tr>
                      <td className="table-warning">
                        <i>{`Roles`}</i>
                        {`: ${
                          !isEmpty(policy.roles)
                            ? policy.roles.join(", ")
                            : "<empty>"
                        } `}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Groups`}</i>
                        {`: ${
                          !isEmpty(policy.groups)
                            ? policy.groups.join(", ")
                            : "<empty>"
                        } `}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Users`}</i>
                        {`: ${
                          !isEmpty(policy.users)
                            ? policy.users.join(", ")
                            : "<empty>"
                        } `}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Permissions`}</i>
                        {!isEmpty(policy.accesses)
                          ? `: ${policy.accesses
                              .map((obj) => obj.type)
                              .join(", ")} `
                          : "<empty>"}
                      </td>
                    </tr>
                    <tr>
                      {policy.conditions && policy.conditions.length > 0 && (
                        <td className="table-warning">
                          <i>{`Conditions`}</i>
                          {`: ${policy.conditions.map(
                            (type) => `${type.type} : ${type.values}`
                          )} `}
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Delegate Admin`}</i>
                        {`: ${
                          policy.delegateAdmin == true ? "enabled" : "disabled"
                        } `}
                      </td>
                    </tr>
                  </tbody>
                ));
              })}
            </Table>
            <br />
          </>
        )}

      {action == "Import Delete" &&
        !isEmpty(importdeldenyPolicyold) &&
        !isUndefined(importdeldenyPolicyold) &&
        importdeldenyPolicyold != 0 && (
          <>
            <h5 className="bold wrap-header m-t-sm">Deny PolicyItems:</h5>
            <Table className="table table-striped  table-bordered  w-auto">
              <thead className="thead-light">
                <tr>
                  <th>Old Value</th>
                </tr>
              </thead>

              {importdeldenyPolicyold.map((policyitem) => {
                return JSON.parse(policyitem).map((policy) => (
                  <tbody>
                    <tr>
                      <td className="table-warning">
                        <i>{`Roles`}</i>
                        {`: ${
                          !isEmpty(policy.roles)
                            ? policy.roles.join(", ")
                            : "<empty>"
                        } `}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Groups`}</i>
                        {`: ${
                          !isEmpty(policy.groups)
                            ? policy.groups.join(", ")
                            : "<empty>"
                        } `}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Users`}</i>
                        {`: ${
                          !isEmpty(policy.users)
                            ? policy.users.join(", ")
                            : "<empty>"
                        } `}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Permissions`}</i>
                        {!isEmpty(policy.accesses)
                          ? `: ${policy.accesses
                              .map((obj) => obj.type)
                              .join(", ")} `
                          : "<empty>"}
                      </td>
                    </tr>
                    <tr>
                      {policy.conditions && policy.conditions.length > 0 && (
                        <td className="table-warning">
                          <i>{`Conditions`}</i>
                          {`: ${policy.conditions.map(
                            (type) => `${type.type} : ${type.values}`
                          )}`}
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Delegate Admin`}</i>
                        {`: ${
                          policy.delegateAdmin == true ? "enabled" : "disabled"
                        }`}
                      </td>
                    </tr>
                  </tbody>
                ));
              })}
            </Table>
            <br />
          </>
        )}

      {action == "Import Delete" &&
        !isEmpty(importDeldenyExceptionsold) &&
        !isUndefined(importDeldenyExceptionsold) &&
        importDeldenyExceptionsold != 0 && (
          <>
            <h5 className="bold wrap-header m-t-sm">
              Deny Exception PolicyItems:
            </h5>
            <Table className="table table-striped  table-bordered w-auto">
              <thead className="thead-light">
                <tr>
                  <th>Old Value</th>
                </tr>
              </thead>

              {importDeldenyExceptionsold.map((policyitem) => {
                return JSON.parse(policyitem).map((policy) => (
                  <tbody>
                    <tr>
                      <td className="table-warning">
                        <i>{`Roles`}</i>
                        {`: ${
                          !isEmpty(policy.roles)
                            ? policy.roles.join(", ")
                            : "<empty>"
                        } `}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Groups`}</i>
                        {`: ${
                          !isEmpty(policy.groups)
                            ? policy.groups.join(", ")
                            : "<empty>"
                        } `}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Users`}</i>
                        {`: ${
                          !isEmpty(policy.users)
                            ? policy.users.join(", ")
                            : "<empty>"
                        } `}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Permissions`}</i>
                        {`: ${policy.accesses
                          .map((obj) => obj.type)
                          .join(", ")}`}
                      </td>
                    </tr>
                    <tr>
                      {policy.conditions && policy.conditions.length > 0 && (
                        <td className="table-warning">
                          <i>{`Conditions:`}</i>
                          {`: ${policy.conditions.map(
                            (type) => `${type.type} : ${type.values}`
                          )}`}
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Delegate Admin`}</i>
                        {`: ${
                          policy.delegateAdmin == true ? "enabled" : "disabled"
                        }`}
                      </td>
                    </tr>
                    <br />
                  </tbody>
                ));
              })}
            </Table>
          </>
        )}
    </div>
  );
};

export default PolicyLogs;
