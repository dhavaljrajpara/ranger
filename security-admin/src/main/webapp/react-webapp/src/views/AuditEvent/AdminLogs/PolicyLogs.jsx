import React from "react";
import { Table, Badge } from "react-bootstrap";
import dateFormat from "dateformat";
import { ClassTypes } from "../../../utils/XAEnums";
import _, { isEmpty, isEqual, isUndefined } from "lodash";

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
  const createPolicyDetails = reportdata.filter((c) => {
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

  const createPolicyResources = reportdata.filter((c) => {
    return c.attributeName == "Policy Resources" && c.action == "create";
  });
  const createPolicyItems = reportdata.filter(
    (obj) => obj.attributeName == "Policy Items" && obj.action == "create"
  );
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
  const createValidity = reportdata.filter(
    (obj) => obj.attributeName == "Validity Schedules" && obj.action == "create"
  );
  const createValidityNew = createValidity.map((obj) =>
    obj.newValue != "" ? JSON.parse(obj.newValue) : []
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

  const updatePolicyDetails = reportdata.filter((c) => {
    return (
      c.action == "update" &&
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
  const updatePolicyResources = reportdata.filter((c) => {
    return c.attributeName == "Policy Resources" && c.action == "update";
  });
  const policyDetailsUpdate = (details, resources) => {
    let tablerow = [];
    details.map((o) => {
      return tablerow.push(
        <tr>
          <td className="table-warning">{o.attributeName}</td>
          <td className="table-warning">
            {!isEmpty(o.previousValue)
              ? o.attributeName == "Policy Labels"
                ? JSON.parse(o.previousValue).join(", ") || "--"
                : o.previousValue || "--"
              : "--"}
          </td>
          <td className="table-warning">
            {!isEmpty(o.newValue)
              ? o.attributeName == "Policy Labels"
                ? JSON.parse(o.newValue).join(", ")
                : o.newValue
              : "--"}
          </td>
        </tr>
      );
    });

    let keyOld = {};
    let keynew = {};
    resources.map((obj) => {
      keyOld = JSON.parse(obj.previousValue);
      keynew = JSON.parse(obj.newValue);
    });

    const diffVal = (obj1, obj2) => {
      let diff = {};
      if (!isEmpty(obj1)) {
        _.forEach(obj2, function (value, key) {
          if (obj1[key] !== undefined) {
            diff[key] = _.differenceWith(
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
    var removedUsers = diffVal(keynew, keyOld);
    var addUsers = diffVal(keyOld, keynew);

    const getfilteredoldval = (val, oldvals) => {
      let c = oldvals;
      let filterdiff = null;
      !isEmpty(removedUsers[val])
        ? (filterdiff = _.difference(c.values, removedUsers[val]))
        : (filterdiff = c.values);
      return (
        <>
          {!isEqual(c, keynew[val])
            ? !isEmpty(removedUsers[val])
              ? _.unionBy(
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
            : !isEmpty(c)
            ? c.values.map((obj) => obj).join(", ")
            : "<empty>"}
        </>
      );
    };
    const getfilterednewval = (val, newvals) => {
      let c = newvals;
      let filterdiff = null;
      !isEmpty(addUsers[val])
        ? (filterdiff = _.difference(c.values, addUsers[val]))
        : (filterdiff = c.values);
      return (
        <>
          {!isEqual(c, keyOld[val])
            ? !isEmpty(addUsers[val])
              ? _.unionBy(
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
            : !isEmpty(c)
            ? c.values.map((obj) => obj).join(", ")
            : "<empty>"}
        </>
      );
    };
    Object.keys(keyOld).map((key) => {
      return tablerow.push(
        <>
          <tr>
            <td className="table-warning">{key}</td>
            {keyOld[key].values.length > 0 && (
              <td className="table-warning">
                {getfilteredoldval(key, keyOld[key])}
              </td>
            )}
            {keynew[key] && keynew[key].values.length > 0 && (
              <td className="table-warning">
                {getfilterednewval(key, keynew[key])}
              </td>
            )}
          </tr>
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
  const updateMaskPolicy = reportdata.filter(
    (obj) =>
      obj.attributeName == "Masked Policy Items" && obj.action == "update"
  );
  const updateRowMask = reportdata.filter(
    (obj) =>
      obj.attributeName == "Row level filter Policy Items" &&
      obj.action == "update"
  );
  const updateRowMaskOld = updateRowMask.map((obj) => obj.previousValue);
  const updateRowMaskNew = updateRowMask.map((obj) => obj.newValue);
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
    let oldval = {};
    let newval = {};

    policy.previousValue &&
      JSON.parse(policy.previousValue).map((obj) => (oldval = obj));
    policy.newValue && JSON.parse(policy.newValue).map((obj) => (newval = obj));

    let policyConditions = _.difference(
      !isEmpty(policy.previousValue) && JSON.parse(policy.previousValue),
      !isEmpty(policy.newValue) && JSON.parse(policy.newValue)
    );
    policyConditions.map((obj) =>
      tablerow.push(
        <tr>
          {policy &&
          policy.previousValue &&
          !isEmpty(JSON.parse(policy.previousValue)) ? (
            <td className="table-warning text-nowrap">
              {`${obj.type}: ${obj.values}`}
            </td>
          ) : (
            <td>
              <strong>{"<empty>"}</strong>
            </td>
          )}

          {policy &&
          policy.newValue &&
          !isEmpty(JSON.parse(policy.newValue)) ? (
            <td className="table-warning text-nowrap">
              {`${obj.type}: ${obj.values}`}
            </td>
          ) : (
            <td>
              <strong>{"<empty>"}</strong>
            </td>
          )}
        </tr>
      )
    );
    return tablerow;
  };

  const updatePolicyOldNew = (policy) => {
    var tablerow = [];
    let oldval = {};
    let newval = {};

    policy.previousValue &&
      JSON.parse(policy.previousValue).map((obj) => (oldval = obj));
    policy.newValue && JSON.parse(policy.newValue).map((obj) => (newval = obj));

    let filteredval = Object.keys(oldval).concat(Object.keys(newval));
    filteredval = filteredval.filter((item, index) => {
      return filteredval.indexOf(item) == index;
    });

    let filterPolicys =
      policy.attributeName == "Masked Policy Items" ||
      policy.attributeName == "Row level filter Policy Items"
        ? _.without(filteredval, "conditions", "dataMaskInfo", "delegateAdmin")
        : filteredval;
    const diffVal = (obj1, obj2) => {
      let diff = {};
      if (!isEmpty(obj1)) {
        _.forEach(obj2, function (value, key) {
          if (obj1[key] !== undefined) {
            diff[key] = _.differenceWith(value, obj1[key], _.isEqual);
          }
        });
      } else {
        return (diff = obj2);
      }
      return diff;
    };
    var removedUsers = diffVal(newval, oldval);
    var addUsers = diffVal(oldval, newval);

    let b = [];
    let c = [];

    const getfilteredoldval = (val, oldvals) => {
      b = oldvals[0];
      c = b[val];
      /* Permissions */

      if (val == "accesses") {
        let filterdiff = null;
        !isEmpty(removedUsers[val])
          ? (filterdiff = _.differenceWith(c, removedUsers[val], isEqual))
          : (filterdiff = c);
        return (
          <>
            {objectName == "rowlevel" ||
            objectName == "policyhivemask" ||
            objectName == "rowpolicy" ? (
              <i>{`Accesses: `} </i>
            ) : (
              <i>{`Permissions: `}</i>
            )}

            {!isEqual(c, newval[val])
              ? !isEmpty(removedUsers[val])
                ? _.unionBy(
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
              : !isEmpty(c)
              ? c.map((obj) => obj.type).join(", ")
              : "<empty>"}
          </>
        );
      }

      /* GROUPS */

      if (val == "groups") {
        let filterdiff = null;
        !isEmpty(removedUsers[val])
          ? (filterdiff = _.difference(c, removedUsers[val]))
          : (filterdiff = c);
        return (
          <>
            <i>{`Groups`}</i>:{" "}
            {!isEqual(c, newval[val])
              ? !isEmpty(removedUsers[val])
                ? _.unionBy(
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
              : !isEmpty(c)
              ? c.map((obj) => obj).join(", ")
              : "<empty>"}
          </>
        );
      }

      /* ROLES */

      if (val == "roles") {
        let filterdiff = null;
        !isEmpty(removedUsers[val])
          ? (filterdiff = _.difference(c, removedUsers[val]))
          : (filterdiff = c);
        return (
          <>
            <i>{`Roles`}</i>:{" "}
            {!isEqual(c, newval[val])
              ? !isEmpty(removedUsers[val])
                ? _.unionBy(
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
              : !isEmpty(c)
              ? c.map((obj) => obj).join(", ")
              : "<empty>"}
          </>
        );
      }

      /* USERS */

      if (val == "users") {
        let filterdiff = null;
        !isEmpty(removedUsers[val])
          ? (filterdiff = _.difference(c, removedUsers[val]))
          : (filterdiff = c);
        return (
          <>
            <i>{`Users`}</i>:{" "}
            {!isEqual(c, newval[val])
              ? !isEmpty(removedUsers[val])
                ? _.unionBy(
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
              : !isEmpty(c)
              ? c.map((obj) => obj).join(", ")
              : "<empty>"}
          </>
        );
      }
      if (val == "conditions") {
        let filterdiff = null;
        !isEmpty(removedUsers[val])
          ? (filterdiff = _.difference(c, removedUsers[val]))
          : (filterdiff = c);
        return (
          <>
            <i>{`Conditions`}</i>:{" "}
            {!isEqual(c, newval[val])
              ? !isEmpty(removedUsers[val])
                ? _.unionBy(
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
              : !isEmpty(c)
              ? c.map((obj) => {
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
            {!isEmpty(c.filterExpr) ? <span>{c.filterExpr}</span> : "empty"}
          </>
        );
      }
      if (val == "DataMasklabel") {
        return (
          <>
            <i>{`Data Mask Types`}</i>
            {`: ${!isEmpty(c) ? c : "<empty>"}`}
          </>
        );
      }

      if (val == "delegateAdmin") {
        return (
          <>
            <i>{`Delegate Admin`}</i>
            {`: ${c === false ? "disabled" : "enabled"}`}
          </>
        );
      }

      return `${val.charAt(0).toUpperCase() + val.slice(1)}:  ${
        !isEmpty(c) ? c : "<empty>"
      }`;
    };

    const getfilterednewval = (val, newvals) => {
      let b = newvals[0];
      let c = b[val];
      /* PERMISSIONS */

      if (val == "accesses") {
        let filterdiff = null;
        !isEmpty(addUsers[val])
          ? (filterdiff = _.differenceWith(c, addUsers[val], isEqual))
          : (filterdiff = c);
        return (
          <>
            {objectName == "rowlevel" ||
            objectName == "policyhivemask" ||
            objectName == "rowpolicy" ? (
              <i>{`Accesses: `} </i>
            ) : (
              <i>{`Permissions: `}</i>
            )}

            {!isEqual(c, oldval[val])
              ? !isEmpty(addUsers[val])
                ? _.unionBy(
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
              : !isEmpty(c)
              ? c.map((obj) => obj.type).join(", ")
              : "<empty>"}
          </>
        );
      }
      /* GROUPS */
      if (val == "groups") {
        let filterdiff = null;
        !isEmpty(addUsers[val])
          ? (filterdiff = _.difference(c, addUsers[val]))
          : (filterdiff = c);
        return (
          <>
            <i>{`Groups`}</i>:{" "}
            {!isEqual(c, oldval[val])
              ? !isEmpty(addUsers[val])
                ? _.unionBy(
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
              : !isEmpty(c)
              ? c.map((obj) => obj).join(", ")
              : "<empty>"}
          </>
        );
      }
      /* ROLES */
      if (val == "roles") {
        let filterdiff = null;
        !isEmpty(addUsers[val])
          ? (filterdiff = _.difference(c, addUsers[val]))
          : (filterdiff = c);
        return (
          <>
            <i>{`Roles`}</i>:{" "}
            {!isEqual(c, oldval[val])
              ? !isEmpty(addUsers[val])
                ? _.unionBy(
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
              : !isEmpty(c)
              ? c.map((obj) => obj).join(", ")
              : "<empty>"}
          </>
        );
      }
      /* USERS */
      if (val == "users") {
        let filterdiff = null;
        !isEmpty(addUsers[val])
          ? (filterdiff = _.difference(c, addUsers[val]))
          : (filterdiff = c);
        return (
          <>
            <i>{`Users`}</i>:{" "}
            {!isEqual(c, oldval[val])
              ? !isEmpty(addUsers[val])
                ? _.unionBy(
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
              : !isEmpty(c)
              ? c.map((obj) => obj).join(", ")
              : "<empty>"}
          </>
        );
      }
      // if (val == "conditions") {
      //   return (
      //     <>
      //       <i>{`Conditions`}</i>
      //       {`: ${
      //         c.length > 0
      //           ? c.map((type) => `${type.type} : ${type.values}`).join(", ")
      //           : "<empty>"
      //       }`}
      //     </>
      //   );
      // }

      if (val == "conditions") {
        let filterdiff = null;
        !isEmpty(addUsers[val])
          ? (filterdiff = _.differenceWith(c, addUsers[val], isEqual))
          : (filterdiff = c);
        return (
          <>
            <i>{`Conditions`}</i>:{" "}
            {!isEqual(c, oldval[val])
              ? !isEmpty(addUsers[val])
                ? _.unionBy(
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
              : !isEmpty(c)
              ? c.map((obj) => {
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
            {`: ${!isEmpty(c) ? c : "<empty>"}`}
          </>
        );
      }

      if (val == "rowFilterInfo") {
        return (
          <>
            <i>{`Row Level Filter`}</i>
            {`: `}
            {!isEmpty(c.filterExpr) ? <span>{c.filterExpr}</span> : "empty"}
          </>
        );
      }

      if (val == "delegateAdmin") {
        return (
          <>
            <i>{`Delegate Admin`}</i>
            {`: ${c === false ? "disabled" : "enabled"}`}
          </>
        );
      }

      return `${val.charAt(0).toUpperCase() + val.slice(1)}:  ${
        c.length > 0 ? c : "<empty>"
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

  const deletePolicyDetails = reportdata.filter((c) => {
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
  const deletePolicyResources = reportdata.filter((c) => {
    return c.attributeName == "Policy Resources" && c.action == "delete";
  });
  const deleteDetails = (details, resources) => {
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

  const deleteConditionOld = deleteCondition.map((obj) =>
    obj.previousValue != "" ? JSON.parse(obj.previousValue) : []
  );
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

  /* EXPORT JSON LOGS */

  const exportJson = reportdata.filter((obj) => obj.action == "EXPORT JSON");

  const rowmask = reportdata.filter(
    (obj) => obj.attributeName == "Row level filter Policy Items"
  );

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
                    <thead>
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>
                    {createValidityNew.map((policyitem) => {
                      return policyitem.map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              {`Start Date: ${
                                policy.startTime.length == 0
                                  ? "<empty>"
                                  : policy.startTime
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              {`End Date: ${
                                policy.endTime.length == 0
                                  ? "<empty>"
                                  : policy.endTime
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              {`Time Zone: ${
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
                    <thead>
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {createConditionNew.map((policyitem) => {
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

            {action == "create" &&
              !isEmpty(createPolicyItems) &&
              !isUndefined(createPolicyItems) &&
              createPolicyItems != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Allow PolicyItems:
                  </h5>
                  <Table className="table table-striped  table-bordered w-auto">
                    <thead>
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {createPolicyItems.map((policyitem) => {
                      return JSON.parse(policyitem.newValue).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Roles`}</i>
                              {`: ${
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles.join(", ")
                              }`}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups.join(", ")
                              }`}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users.join(", ")
                              }`}
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
                            {policy.conditions.length > 0 && (
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
              !isEmpty(createRowMaskNew) &&
              !isUndefined(createRowMaskNew) &&
              createRowMaskNew != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">
                    Row Level Filter Policy Items:
                  </h5>
                  <Table className="table table-striped  table-bordered  table-responsive w-auto">
                    <thead>
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {createRowMaskNew.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Roles`}</i>
                              {`: ${
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles.join(", ")
                              }`}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups.join(", ")
                              }`}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users.join(", ")
                              }`}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Accesses`}</i>
                              {`: ${policy.accesses
                                .map((obj) => obj.type)
                                .join(", ")}`}
                            </td>
                          </tr>

                          <tr>
                            <td className="table-warning">
                              <i>{`Row Level Filter`}</i>
                              {`: ${policy.rowFilterInfo.filterExpr}`}
                            </td>
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                  <br />
                </>
              )}

            {/* {action == "update" && policyexception.length > 0 && (
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
            )} */}

            {action == "create" &&
              !isEmpty(createExceptionNew) &&
              !isUndefined(createExceptionNew) &&
              createExceptionNew != 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">Allow Exceptions:</h5>
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead>
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {createExceptionNew.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Roles`}</i>
                              {`: ${
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles.join(", ")
                              }`}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups.join(", ")
                              }`}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users.join(", ")
                              }`}
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
                            {policy.conditions.length > 0 && (
                              <td className="table-warning">
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
                            <td className="table-warning">
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
                    <thead>
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {createDenyPolicyNew.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Roles`}</i>
                              {`: ${
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles.join(", ")
                              }`}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups.join(", ")
                              }`}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users.join(", ")
                              }`}
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
                            {policy.conditions.length > 0 && (
                              <td className="table-warning">
                                <i>{`Conditions`}</i>
                                {`: ${policy.conditions
                                  .map((type) => `${type.type}: ${type.values}`)
                                  .join(", ")}`}
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
                    <thead>
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {createDenyExceptionNew.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Roles`}</i>
                              {`: ${
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles.join(", ")
                              }`}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups.join(", ")
                              }`}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users.join(", ")
                              }`}
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
                            {policy.conditions.length > 0 && (
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
                  </h5>{" "}
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead>
                      <tr>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {createMaskPolicyNew.map((policyitem) => {
                      return JSON.parse(policyitem).map((policy) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              <i>{`Roles`}</i>
                              {`: ${
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles.join(", ")
                              }`}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups.join(", ")
                              }`}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users.join(", ")
                              }`}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Accesses`}</i>
                              {`: ${policy.accesses
                                .map((obj) => obj.type)
                                .join(", ")}`}
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
                                }`}
                              </td>
                            )}
                          </tr>
                          <tr>
                            {!isEmpty(policy.DataMasklabel) && (
                              <td className="table-warning">
                                <i>{`Data Mask Types`}</i>
                                {`: ${policy.DataMasklabel}`}
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

            {(updatePolicyDetails.length > 0 ||
              updatePolicyResources.length > 0) && (
              <>
                <h5 className="bold wrap-header m-t-sm">Policy details</h5>
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
                    <thead>
                      <tr>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {updateValidity.map((policyitem) => {
                      return <tbody>{updatePolicyOldNew(policyitem)}</tbody>;
                    })}
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
                    <thead>
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
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead>
                      <tr>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    {updatePolicyCondition.map((policyitem) => {
                      return <tbody>{updateConditionOldNew(policyitem)}</tbody>;
                    })}
                  </Table>
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
                    <thead>
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
                    <thead>
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
                    <thead>
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
                    <thead>
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
                    <thead>
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
              <thead>
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
              deleteValidityOld.length > 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">Validity Period:</h5>
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead>
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
                                policy.startTime.length == 0
                                  ? "<empty>"
                                  : policy.startTime
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`End Date`}</i>
                              {`: ${
                                policy.endTime.length == 0
                                  ? "<empty>"
                                  : policy.endTime
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Time Zone`}</i>
                              {`: ${
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
                    <thead>
                      <tr>
                        <th>Old Value</th>
                      </tr>
                    </thead>

                    {deleteConditionOld.map((policyitem) => {
                      return policyitem.map((policy) => (
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
                    <thead>
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
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Accesses`}</i>
                              {`: ${policy.accesses
                                .map((obj) => obj.type)
                                .join(", ")} `}
                            </td>
                          </tr>

                          <tr>
                            <td className="table-warning">
                              <i>{`Row Level Filter`}</i>
                              {`: ${policy.rowFilterInfo.filterExpr} `}
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
                    <thead>
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
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Accesses`}</i>
                              {`: ${policy.accesses
                                .map((obj) => obj.type)
                                .join(", ")} `}
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
                            {policy.DataMasklabel.length > 0 && (
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
                    <thead>
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
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Permissions`}</i>
                              {`: ${policy.accesses
                                .map((obj) => obj.type)
                                .join(", ")} `}
                            </td>
                          </tr>
                          <tr>
                            {policy.conditions.length > 0 && (
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
                    <thead>
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
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Permissions`}</i>
                              {`: ${policy.accesses
                                .map((obj) => obj.type)
                                .join(", ")} `}
                            </td>
                          </tr>
                          <tr>
                            {policy.conditions.length > 0 && (
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
                    <thead>
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
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Permissions`}</i>
                              {`: ${policy.accesses
                                .map((obj) => obj.type)
                                .join(", ")} `}
                            </td>
                          </tr>
                          <tr>
                            {policy.conditions.length > 0 && (
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
                    <thead>
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
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users.join(", ")
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Permissions`}</i>
                              {`: ${policy.accesses
                                .map((obj) => obj.type)
                                .join(", ")} `}
                            </td>
                          </tr>
                          <tr>
                            {policy.conditions.length > 0 && (
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

            {action == "Import Delete" &&
              !isEmpty(importDelValidityOld) &&
              !isUndefined(importDelValidityOld) &&
              importDelValidityOld != "[]" &&
              importDelValidityOld.length > 0 && (
                <>
                  <h5 className="bold wrap-header m-t-sm">Validity Period:</h5>
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead>
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
                                policy.startTime.length == 0
                                  ? "<empty>"
                                  : policy.startTime
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`End Date`}</i>
                              {`: ${
                                policy.endTime.length == 0
                                  ? "<empty>"
                                  : policy.endTime
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Time Zone`}</i>
                              {`: ${
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
                    <thead>
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
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Groups`}</i>
                              {`: ${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Users`}</i>
                              {`: ${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-warning">
                              <i>{`Accesses`}</i>
                              {`: ${policy.accesses.map((obj) => obj.type)} `}
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
                            {policy.DataMasklabel.length > 0 && (
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
                    <thead>
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
                    <thead>
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
                                    policy.roles.length == 0
                                      ? "<empty>"
                                      : policy.roles.join(", ")
                                  } `}
                                </td>
                              </tr>
                              <tr>
                                <td className="table-warning">
                                  <i>{`Groups`}</i>
                                  {`: ${
                                    policy.groups.length == 0
                                      ? "<empty>"
                                      : policy.groups.join(", ")
                                  } `}
                                </td>
                              </tr>
                              <tr>
                                <td className="table-warning">
                                  <i>{`Users`}</i>
                                  {`: ${
                                    policy.users.length == 0
                                      ? "<empty>"
                                      : policy.users.join(", ")
                                  } `}
                                </td>
                              </tr>
                              <tr>
                                <td className="table-warning">
                                  <i>{`Permissions`}</i>
                                  {`: ${policy.accesses
                                    .map((obj) => obj.type)
                                    .join(", ")} `}
                                </td>
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
              <thead>
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
                          policy.roles.length == 0
                            ? "<empty>"
                            : policy.roles.join(", ")
                        } `}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Groups`}</i>
                        {`: ${
                          policy.groups.length == 0
                            ? "<empty>"
                            : policy.groups.join(", ")
                        } `}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Users`}</i>
                        {`: ${
                          policy.users.length == 0
                            ? "<empty>"
                            : policy.users.join(", ")
                        } `}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Permissions`}</i>
                        {`: ${policy.accesses
                          .map((obj) => obj.type)
                          .join(", ")} `}
                      </td>
                    </tr>
                    <tr>
                      {policy.conditions.length > 0 && (
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
              <thead>
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
                          policy.roles.length == 0
                            ? "<empty>"
                            : policy.roles.join(", ")
                        } `}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Groups`}</i>
                        {`: ${
                          policy.groups.length == 0
                            ? "<empty>"
                            : policy.groups.join(", ")
                        } `}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Users`}</i>
                        {`: ${
                          policy.users.length == 0
                            ? "<empty>"
                            : policy.users.join(", ")
                        }`}
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
                      {policy.conditions.length > 0 && (
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
              <thead>
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
                          policy.roles.length == 0
                            ? "<empty>"
                            : policy.roles.join(", ")
                        }`}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Groups`}</i>
                        {`: ${
                          policy.groups.length == 0
                            ? "<empty>"
                            : policy.groups.join(", ")
                        }`}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-warning">
                        <i>{`Users`}</i>
                        {`: ${
                          policy.users.length == 0
                            ? "<empty>"
                            : policy.users.join(", ")
                        }`}
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
                      {policy.conditions.length > 0 && (
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
