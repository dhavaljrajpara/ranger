import React, { useEffect, useState } from "react";
import { ClassTypes } from "../../utils/XAEnums";
import { Modal, Table, Button, Badge } from "react-bootstrap";
import dateFormat from "dateformat";
import { Loader } from "Components/CommonComponents";
import { fetchApi } from "Utils/fetchAPI";
export const OperationAdminModal = ({ onHide, show, data = {} }) => {
  const [reportdata, setReportData] = useState([]);
  const [loader, setLoader] = useState(false);
  const {
    objectName,
    objectClassType,
    createDate,
    owner,
    action,
    objectId,
    transactionId,
  } = data;

  useEffect(() => {
    show && rowModal();
  }, [show]);

  // const reload = () => window.location.reload();

  const rowModal = async () => {
    setLoader(true);
    try {
      const authResp = await fetchApi({
        url: `assets/report/${transactionId}`,
      });
      let authlogs = authResp.data.vXTrxLogs;

      setReportData(authlogs);
      setLoader(false);
    } catch (error) {
      console.error(`Error occurred while fetching Admin logs! ${error}`);
    }
  };
  const policydelete = reportdata.filter((obj) => {
    return obj.attributeName == "Policy Items";
  });
  const policyitems = reportdata.filter(
    (obj) => obj.attributeName == "Policy Items"
  );
  const policyexception = reportdata.filter(
    (obj) => obj.attributeName == "Allow Exceptions"
  );
  const denyexceptions = reportdata.filter(
    (obj) => obj.attributeName == "Deny Exceptions"
  );
  const denyPolicyItem = reportdata.filter(
    (obj) => obj.attributeName == "DenyPolicy Items"
  );
  const maskPolicyItem = reportdata.filter(
    (obj) => obj.attributeName == "Masked Policy Items"
  );
  const policycreate =
    objectName == "EXPIRES_ON"
      ? reportdata.filter((obj) => obj.attributeName == "DenyPolicy Items")
      : reportdata.filter((obj) => obj.attributeName == "Policy Items");
  const service = reportdata.filter((c) => {
    return c.attributeName != "Connection Configurations";
  });
  return loader ? (
    <Loader />
  ) : (
    <Modal show={show} size="lg" onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Operation :{action || ""}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>
          {action == "create" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_SERVICE.value && (
              <div>
                <div className="font-weight-bolder">
                  Name: {objectName || ""}
                </div>
                <div className="font-weight-bolder">
                  Date:
                  {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Created By: {owner}</div>
                <h5 className="bold wrap-header m-t-sm">Service Details:</h5>
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <th>New Value</th>
                    </tr>
                    {reportdata
                      .filter((obj) => {
                        return obj.attributeName != "Connection Configurations";
                      })
                      .map((c) => {
                        return (
                          <tr key={c.id}>
                            <td>{c.attributeName}</td>

                            <td>{c.newValue || "--"}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                <br />
                <h5 className="bold wrap-header m-t-sm">
                  Connection Configurations :
                </h5>
                <div>
                  <Table className="table  table-bordered  w-auto">
                    {reportdata
                      .filter((obj) => {
                        return obj.attributeName == "Connection Configurations";
                      })
                      .map((c) => {
                        return (
                          <tbody>
                            <tr>
                              <th>Fields</th>
                              <th>New Value</th>
                            </tr>
                            <tr>
                              {Object.keys(JSON.parse(c.newValue)).map(
                                (obj) => (
                                  <tr>
                                    <td>{obj}</td>
                                  </tr>
                                )
                              )}
                              <td>
                                {Object.values(JSON.parse(c.newValue)).map(
                                  (obj) => (
                                    <tr>
                                      <td>{obj}</td>
                                    </tr>
                                  )
                                )}
                              </td>
                            </tr>
                          </tbody>
                        );
                      })}
                  </Table>
                </div>
              </div>
            )}
          {action == "create" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
              <div>
                <div className="font-weight-bolder">
                  Policy ID : <Badge variant="info">{objectId}</Badge>
                </div>
                <div className="font-weight-bolder">
                  Policy Name: {objectName}
                </div>
                <div className="font-weight-bolder">Service Name: {owner}</div>
                <div className="font-weight-bolder">
                  Created Date:{" "}
                  {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")} India
                  Standard Time
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

                  {reportdata
                    .filter((c) => {
                      return (
                        c.attributeName != "Policy Resources" &&
                        c.attributeName != "Policy Conditions" &&
                        c.attributeName != "Policy Items" &&
                        c.attributeName != "DenyPolicy Items" &&
                        c.attributeName != "Allow Exceptions" &&
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
                            <td>{obj.attributeName}</td>

                            <td>{obj.newValue || "--"}</td>
                          </tr>
                        </tbody>
                      );
                    })}
                </Table>
                <br />
                {maskPolicyItem.length > 0 && (
                  <h5 className="bold wrap-header m-t-sm">
                    Masking Policy Items:
                  </h5>
                )}
                {policyitems.length > 0 && (
                  <h5 className="bold wrap-header m-t-sm">
                    Allow PolicyItems:
                  </h5>
                )}
                {denyPolicyItem.length > 0 && (
                  <h5 className="bold wrap-header m-t-sm">Deny PolicyItems:</h5>
                )}
                {
                  <Table className="table table-striped  table-bordered   w-auto">
                    <thead>
                      <tr>
                        {policyitems.length > 0 && denyPolicyItem && (
                          <th>New Value</th>
                        )}
                      </tr>
                    </thead>

                    {policycreate.map((policyitem) => {
                      return JSON.parse(policyitem.newValue).map((policy) => (
                        <tbody>
                          <tr>
                            <td>
                              {`Roles:${
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="overflow-auto text-nowrap ">
                              {`Groups:${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="overflow-auto text-nowrap ">
                              {`Users:${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="overflow-auto text-nowrap ">
                              {`Permissions: ${policy.accesses.map(
                                (obj) => obj.type
                              )}`}
                            </td>
                          </tr>
                          <tr>
                            {policy.conditions.length > 0 && (
                              <td className="overflow-auto text-nowrap ">
                                {`Conditions:${policy.conditions.map(
                                  (type) => `${type.type} : ${type.values}`
                                )} `}
                              </td>
                            )}
                          </tr>
                          <tr>
                            <td className="overflow-auto text-nowrap ">{`Delegate Admin: ${
                              policy.delegateAdmin == true
                                ? "enabled"
                                : "disabled"
                            }`}</td>
                          </tr>
                        </tbody>
                      ));
                    })}
                    {maskPolicyItem && (
                      <thead>
                        <tr>
                          <th>New Value</th>
                        </tr>
                      </thead>
                    )}
                    {maskPolicyItem.map((policyitem) => {
                      return JSON.parse(policyitem.newValue).map((policy) => (
                        <tbody>
                          <tr>
                            <td>
                              {`Roles:${
                                policy.roles.length == 0
                                  ? "<empty>"
                                  : policy.roles
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="overflow-auto text-nowrap ">
                              {`Groups:${
                                policy.groups.length == 0
                                  ? "<empty>"
                                  : policy.groups
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="overflow-auto text-nowrap ">
                              {`Users:${
                                policy.users.length == 0
                                  ? "<empty>"
                                  : policy.users
                              } `}
                            </td>
                          </tr>
                          <tr>
                            <td className="overflow-auto text-nowrap ">
                              {`Accesses: ${policy.accesses.map(
                                (obj) => obj.type
                              )}`}
                            </td>
                          </tr>
                          <tr>
                            {policy.conditions.length > 0 && (
                              <td className="overflow-auto text-nowrap ">
                                {`Data Mask Types: ${policy.DataMasklabel}`}
                              </td>
                            )}
                          </tr>
                        </tbody>
                      ));
                    })}
                  </Table>
                }
              </div>
            )}
          {action == "create" &&
            objectClassType == ClassTypes.CLASS_TYPE_XA_GROUP.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Created By: {owner}</div>
                <h5 className="bold wrap-header m-t-sm">Group Detail:</h5>

                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Fields</th>

                      <th>New Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportdata.map((c) => {
                      return (
                        <tr key={c.id}>
                          <td>{c.attributeName}</td>

                          <td>{c.newValue || "--"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          {action == "create" &&
            objectClassType ==
              ClassTypes.CLASS_TYPE_RANGER_SECURITY_ZONE.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Created By: {owner}</div>
                <h5 className="bold wrap-header m-t-sm">Zone Details:</h5>

                <Table className="table table-striped table-bordered w-auto">
                  <tbody>
                    <tr>
                      <th>Fields</th>

                      <th>New Value</th>
                    </tr>
                    {reportdata
                      .filter((c) => {
                        return c.attributeName != "Zone Services";
                      })
                      .map((obj) => {
                        return (
                          <tr>
                            <td>{obj.attributeName}</td>
                            <td>{obj.newValue || "--"}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                <h5 className="bold wrap-header m-t-sm">
                  Zone Service Details:
                </h5>
                <Table className="table table-striped table-bordered w-50">
                  <thead>
                    <tr>
                      <th>Service Name</th>
                      <th>Zone Service Resources</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportdata
                      .filter((obj) => {
                        return obj.attributeName == "Zone Services";
                      })
                      .map((c) => {
                        return (
                          <tr>
                            <td>
                              <strong>
                                {Object.keys(JSON.parse(c.newValue))}
                              </strong>
                            </td>

                            {Object.values(JSON.parse(c.newValue)).map((o) =>
                              o.resources.map((resource) =>
                                Object.keys(resource).map((policy) => (
                                  <td>
                                    <div className="zone-resource">
                                      <strong>{`${policy} : `}</strong>
                                      {resource[policy].join(", ")}
                                      <br />{" "}
                                    </div>
                                  </td>
                                ))
                              )
                            )}
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            )}
          {action == "create" &&
            objectClassType == ClassTypes.CLASS_TYPE_XA_USER.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Created By: {owner} </div>

                <h5 className="bold wrap-header m-t-sm">User Details:</h5>

                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>

                      <th>New Value</th>
                    </tr>
                    {reportdata.map((u) => {
                      return (
                        <tr key={u.id}>
                          <td>{u.attributeName}</td>

                          <td>{u.newValue}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          {action == "create" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_ROLE.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Created By: {owner} </div>

                <h5 className="bold wrap-header m-t-sm">Role Detail:</h5>

                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>

                      <th>New Value</th>
                    </tr>
                    {reportdata

                      .filter((c) => {
                        return (
                          c.attributeName != "Users" &&
                          c.attributeName != "Groups"
                        );
                      })
                      .map((u) => {
                        return (
                          <tr key={u.id}>
                            <td>{u.attributeName}</td>

                            <td>{u.newValue || "--"}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                <br />
                <h5 className="bold wrap-header m-t-sm">Users:</h5>
                <Table className="table  border w-auto">
                  <tbody>
                    {reportdata
                      .filter((c) => {
                        return c.attributeName == "Users";
                      })
                      .map((u) => {
                        return (
                          <div>
                            <tr>
                              <th>Name</th>

                              <th> Role Admin</th>
                            </tr>
                            <tr>
                              <td>
                                {JSON.parse(u.newValue).map((obj) => (
                                  <tr>
                                    <td>{Object.values(obj.name)}</td>
                                  </tr>
                                ))}
                              </td>
                              <td>
                                {JSON.parse(u.newValue).map((obj) => (
                                  <tr>
                                    <td>
                                      {Object.values(obj.isAdmin) == false
                                        ? "false"
                                        : "true"}
                                    </td>{" "}
                                  </tr>
                                ))}
                              </td>
                            </tr>
                          </div>
                        );
                      })}
                  </tbody>
                </Table>
                <br />

                <h5 className="bold wrap-header m-t-sm">Groups:</h5>
                <Table className="table  border w-auto">
                  <tbody>
                    {reportdata

                      .filter((c) => {
                        return c.attributeName == "Groups";
                      })
                      .map((u) => {
                        return (
                          <div>
                            <tr>
                              <th>Name</th>

                              <th> Role Admin</th>
                            </tr>
                            <tr>
                              <td>
                                {JSON.parse(u.newValue).map((obj) => (
                                  <tr>
                                    <td>{Object.values(obj.name)}</td>
                                  </tr>
                                ))}
                              </td>
                              <td>
                                {JSON.parse(u.newValue).map((obj) => (
                                  <tr>
                                    <td>
                                      {Object.values(obj.isAdmin) == false
                                        ? "false"
                                        : "true"}
                                    </td>{" "}
                                  </tr>
                                ))}
                              </td>
                            </tr>
                          </div>
                        );
                      })}
                  </tbody>
                </Table>
                <br />
                <h5 className="bold wrap-header m-t-sm">Roles:</h5>
                <Table className="table  border w-auto">
                  <tbody>
                    {reportdata

                      .filter((c) => {
                        return c.attributeName == "Roles";
                      })
                      .map((u) => {
                        return (
                          <div>
                            <tr>
                              <th>Name</th>

                              <th> Role Admin</th>
                            </tr>
                            <tr>
                              <td>
                                {JSON.parse(u.newValue).map((obj) => (
                                  <tr>
                                    <td>{Object.values(obj.name)}</td>
                                  </tr>
                                ))}
                              </td>
                              <td>
                                {JSON.parse(u.newValue).map((obj) => (
                                  <tr>
                                    <td>
                                      {Object.values(obj.isAdmin) == false
                                        ? "false"
                                        : "true"}
                                    </td>{" "}
                                  </tr>
                                ))}
                              </td>
                            </tr>
                          </div>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            )}

          {/* Update */}

          {action == "update" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_SERVICE.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Updated By: {owner} </div>

                {!service && (
                  <Table striped bordered hover>
                    <tbody>
                      <tr>
                        <th>Fields</th>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                      {reportdata
                        .filter((c) => {
                          return c.attributeName != "Connection Configurations";
                        })
                        .map((u) => {
                          return (
                            <>
                              <tr key={u.id}>
                                <td>{u.attributeName}</td>
                                <td>{u.previousValue || "--"}</td>
                                <td>{u.newValue}</td>
                              </tr>
                            </>
                          );
                        })}
                    </tbody>
                  </Table>
                )}
                <br />
                <h5 className="bold wrap-header m-t-sm">
                  Connection Configurations :
                </h5>

                <Table className="table  table-bordered table-striped table-responsive ">
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
                              <th>Old Value</th>
                              <th>New Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {Object.keys(JSON.parse(c.newValue)).map(
                                (obj) => (
                                  <td className="overflow-auto text-nowrap ">
                                    {obj}
                                  </td>
                                )
                              )}
                              {Object.values(JSON.parse(c.previousValue)).map(
                                (obj) => (
                                  <td className="overflow-auto text-nowrap ">
                                    {obj}
                                  </td>
                                )
                              )}
                              {Object.values(JSON.parse(c.newValue)).map(
                                (obj) => (
                                  <td className="overflow-auto text-nowrap ">
                                    {obj}
                                  </td>
                                )
                              )}
                            </tr>
                          </tbody>
                        </>
                      );
                    })}
                </Table>
              </div>
            )}
          {action == "update" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Updated By: {owner} </div>

                {/* <h5 className="bold wrap-header m-t-sm">Validity Period:</h5>

                <Table className="table table-striped table-bordered  ">
                  <tbody>
                    <tr>
                      <th>Old Value</th>
                      <th>New Value</th>
                    </tr>
                    {reportdata

                      .filter((c) => {
                        return c.attributeName == "Validity Schedules";
                      })
                      .map((u) => {
                        return (
                          <tr>
                            <td className="p-3 mb-2 bg-white text-dark  align-middle text-center ">
                              <strong>
                                {u.previousValue.length == 0
                                  ? "<empty>"
                                  : u.previousValue}
                              </strong>
                            </td>

                            {JSON.parse(u.newValue).map((obj) => {
                              return Object.keys(obj).map((policy) => (
                                <tr>
                                  <td>
                                    <strong>{`${policy} : `}</strong>
                                    <span className="add-text">
                                      {obj[policy]}
                                    </span>
                                  </td>
                                </tr>
                              ));
                            })}
                          </tr>
                        );
                      })}
                  </tbody>
                </Table> */}

                <br />
                <h5 className="bold wrap-header m-t-sm">Allow PolicyItems:</h5>

                <Table className="table table-striped  table-bordered  w-auto">
                  <thead>
                    <tr>
                      <th>Old Value</th>
                      <th>New Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policycreate.map((policy) => {
                      return (
                        <tr>
                          <td>
                            {policy.previousValue.length == 0
                              ? "<empty>"
                              : JSON.parse(policy.previousValue).map(
                                  (policy) => (
                                    <tr>
                                      <tr>
                                        <td className="w-50">
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
                                        <td>
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
                                        <td>
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
                                        <td>
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
                                          <td>
                                            Conditions:
                                            {policy.conditions.map(
                                              (type) =>
                                                `${type.type} : ${type.values}`
                                            )}
                                          </td>
                                        )}
                                      </tr>
                                      <tr>
                                        <td>
                                          Delegate Admin:{" "}
                                          {policy.delegateAdmin == true
                                            ? " enabled"
                                            : "disabled"}
                                        </td>
                                      </tr>
                                    </tr>
                                  )
                                )}
                          </td>
                          {JSON.parse(policy.newValue).map((policy) => (
                            <tbody>
                              <tr>
                                <tr>
                                  <td className="w-50">
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
                                  <td>
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
                                  <td>
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
                                  <td>
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
                                    <td>
                                      Conditions:
                                      {policy.conditions.map(
                                        (type) =>
                                          `${type.type} : ${type.values}`
                                      )}
                                    </td>
                                  )}
                                </tr>
                                <tr>
                                  <td>
                                    Delegate Admin:{" "}
                                    {policy.delegateAdmin == true
                                      ? " enabled"
                                      : "disabled"}
                                  </td>
                                </tr>
                              </tr>
                            </tbody>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>

                <br />
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
                  <tbody>
                    {policyexception.map((policy) => {
                      return (
                        <tr>
                          <td>
                            {policy.previousValue.length == 0
                              ? "<empty>"
                              : JSON.parse(policy.previousValue).map(
                                  (policy) => (
                                    <tbody>
                                      <tr>
                                        <tr>
                                          <td>
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
                                          <td>
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
                                          <td>
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
                                          <td>
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
                                            <td>
                                              {`Conditions:${policy.conditions.map(
                                                (type) =>
                                                  `${type.type} : ${type.values}`
                                              )} `}
                                            </td>
                                          )}
                                        </tr>
                                        <tr>
                                          <td>
                                            Delegate Admin:{" "}
                                            {policy.delegateAdmin == true
                                              ? "enabled"
                                              : "disabled"}
                                          </td>
                                        </tr>
                                      </tr>
                                    </tbody>
                                  )
                                )}
                          </td>

                          {JSON.parse(policy.newValue).map((policy) => (
                            <tbody>
                              <tr>
                                <tr>
                                  <td>
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
                                  <td>
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
                                  <td>
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
                                  <td>
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
                                    <td>
                                      {`Conditions:${policy.conditions.map(
                                        (type) =>
                                          `${type.type} : ${type.values}`
                                      )} `}
                                    </td>
                                  )}
                                </tr>
                                <tr>
                                  <td>
                                    Delegate Admin:{" "}
                                    {policy.delegateAdmin == true
                                      ? "enabled"
                                      : "disabled"}
                                  </td>
                                </tr>
                              </tr>
                            </tbody>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <br />
                <h5 className="bold wrap-header m-t-sm">Deny PolicyItems:</h5>

                <Table className="table table-striped  table-bordered  w-auto ">
                  <thead>
                    <tr>
                      <th>Old Value</th>
                      <th>New Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {denyPolicyItem.map((policy) => {
                      return (
                        <tr>
                          <td>
                            {policy.previousValue.length == 0
                              ? "<empty>"
                              : JSON.parse(policy.previousValue).map(
                                  (policy) => (
                                    <tbody>
                                      <tr>
                                        <tr>
                                          <td>
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
                                          <td>
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
                                          <td>
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
                                          <td>
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
                                            <td>
                                              {`Conditions:${policy.conditions.map(
                                                (type) =>
                                                  `${type.type} : ${type.values}`
                                              )} `}
                                            </td>
                                          )}
                                        </tr>
                                        <tr>
                                          <td>
                                            Delegate Admin:{" "}
                                            {policy.delegateAdmin == true
                                              ? "enabled"
                                              : "disabled"}
                                          </td>
                                        </tr>
                                      </tr>
                                    </tbody>
                                  )
                                )}
                          </td>

                          {JSON.parse(policy.newValue).map((policy) => (
                            <tbody>
                              <tr>
                                <tr>
                                  <td>
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
                                  <td>
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
                                  <td>
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
                                  <td>
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
                                    <td>
                                      {`Conditions:${policy.conditions.map(
                                        (type) =>
                                          `${type.type} : ${type.values}`
                                      )} `}
                                    </td>
                                  )}
                                </tr>
                                <tr>
                                  <td>
                                    Delegate Admin:{" "}
                                    {policy.delegateAdmin == true
                                      ? "enabled"
                                      : "disabled"}
                                  </td>
                                </tr>
                              </tr>
                            </tbody>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <br />
                <h5 className="bold wrap-header m-t-sm">Deny PolicyItems:</h5>

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
                            {policy.previousValue.length == 0
                              ? "<empty>"
                              : JSON.parse(policy.previousValue).map(
                                  (policy) => (
                                    <tbody>
                                      <tr>
                                        <tr>
                                          <td>
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
                                          <td>
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
                                          <td>
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
                                          <td>
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
                                            <td>
                                              {`Conditions:${policy.conditions.map(
                                                (type) =>
                                                  `${type.type} : ${type.values}`
                                              )} `}
                                            </td>
                                          )}
                                        </tr>
                                        <tr>
                                          <td>
                                            Delegate Admin:{" "}
                                            {policy.delegateAdmin == true
                                              ? "enabled"
                                              : "disabled"}
                                          </td>
                                        </tr>
                                      </tr>
                                    </tbody>
                                  )
                                )}
                          </td>

                          {JSON.parse(policy.newValue).map((policy) => (
                            <tbody>
                              <tr>
                                <tr>
                                  <td>
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
                                  <td>
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
                                  <td>
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
                                  <td>
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
                                    <td>
                                      {`Conditions:${policy.conditions.map(
                                        (type) =>
                                          `${type.type} : ${type.values}`
                                      )} `}
                                    </td>
                                  )}
                                </tr>
                                <tr>
                                  <td>
                                    Delegate Admin:{" "}
                                    {policy.delegateAdmin == true
                                      ? "enabled"
                                      : "disabled"}
                                  </td>
                                </tr>
                              </tr>
                            </tbody>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}

          {action == "update" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_ROLE.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Updated By: {owner} </div>
                <div className="row">
                  <div className="col">
                    <h5 className="bold wrap-header m-t-sm">
                      Old Groups Details:
                    </h5>
                    <Table className="table  table-bordered w-auto">
                      <tbody>
                        {reportdata.map((u) => {
                          return (
                            <div>
                              <tr>
                                <th>Name</th>

                                <th> is Role Admin</th>
                              </tr>
                              <tr>
                                <td>
                                  {JSON.parse(u.previousValue).map((obj) => (
                                    <tr>{Object.values(obj.name)}</tr>
                                  ))}
                                </td>
                                <td>
                                  {JSON.parse(u.previousValue).map((obj) => (
                                    <tr>
                                      {Object.values(obj.isAdmin) == false
                                        ? "false"
                                        : "true"}
                                    </tr>
                                  ))}
                                </td>
                              </tr>
                            </div>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                  <div className="col">
                    <h5 className="bold wrap-header m-t-sm">
                      New Groups Details:
                    </h5>
                    <Table className="table  table-bordered w-auto">
                      <tbody>
                        {reportdata.map((u) => {
                          return (
                            <div>
                              <tr>
                                <th>Name</th>

                                <th> is Role Admin</th>
                              </tr>
                              <tr>
                                <td>
                                  {JSON.parse(u.newValue).map((obj) => (
                                    <tr>{Object.values(obj.name)}</tr>
                                  ))}
                                </td>
                                <td>
                                  {JSON.parse(u.newValue).map((obj) => (
                                    <tr>
                                      {Object.values(obj.isAdmin) == false
                                        ? "false"
                                        : "true"}
                                    </tr>
                                  ))}
                                </td>
                              </tr>
                            </div>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          {action == "update" &&
            objectClassType ==
              ClassTypes.CLASS_TYPE_RANGER_SECURITY_ZONE.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Updated By: {owner} </div>

                <h5 className="bold wrap-header m-t-sm">Zone Details:</h5>

                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <th>Old Value</th>
                      <th>New Value</th>
                    </tr>
                    {reportdata.map((obj) => (
                      <tr key={obj.id}>
                        <td>{obj.attributeName}</td>
                        <td>{obj.previousValue}</td>
                        <td>{obj.newValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}

          {action == "update" &&
            objectClassType == ClassTypes.CLASS_TYPE_XA_USER.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Updated By: {owner} </div>

                <h5 className="bold wrap-header m-t-sm">Zone Details:</h5>

                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <th>Old Value</th>
                      <th>New Value</th>
                    </tr>

                    <tr>
                      <td>Groups</td>
                      <td>
                        {reportdata.map((obj) => {
                          return obj.previousValue;
                        }) || "--"}
                      </td>
                      <td>
                        {reportdata.map((obj) => {
                          return obj.newValue;
                        }) || "--"}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            )}

          {/*Delete*/}

          {action == "delete" &&
            objectClassType == ClassTypes.CLASS_TYPE_XA_USER.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Created By: {owner} </div>
                <div className="font-weight-bolder">Deleted By: {owner} </div>

                <h5 className="bold wrap-header m-t-sm">Group Details:</h5>

                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <th>Old Value</th>
                    </tr>
                    {reportdata.map((obj) => {
                      return (
                        <tr>
                          <td>{obj.attributeName}</td>
                          <td>{obj.previousValue || "--"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}

          {action == "delete" &&
            objectClassType == ClassTypes.CLASS_TYPE_XA_GROUP.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Created By: {owner} </div>
                <div className="font-weight-bolder">Deleted By: {owner} </div>

                <h5 className="bold wrap-header m-t-sm">Group Details:</h5>

                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <th>Old Value</th>
                    </tr>
                    {reportdata.map((obj) => {
                      return (
                        <tr>
                          <td>{obj.attributeName}</td>
                          <td>{obj.previousValue || "--"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          {action == "delete" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
              <div>
                <div className="font-weight-bolder">
                  Policy ID: <Badge variant="info">{objectId}</Badge>
                </div>
                <div className="font-weight-bolder">
                  Policy Name: {objectName}
                </div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Created By: {owner} </div>
                <div className="font-weight-bolder">Deleted By: {owner} </div>

                <h5 className="bold wrap-header m-t-sm">Group Details:</h5>

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
                          c.attributeName != "Deny Exception" &&
                          c.attributeName != "Masked Policy Items" &&
                          c.attributeName != "Row level filter Policy Items" &&
                          c.attributeName != "Validity Schedules"
                        );
                      })
                      .map((obj) => {
                        return (
                          <tr>
                            <td>{obj.attributeName}</td>
                            <td>{obj.previousValue || "--"}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                <br />
                <h5 className="bold wrap-header m-t-sm">Group Details:</h5>
                <Table className="table table-striped table-bordered w-auto">
                  <tbody>
                    {policydelete.map((policyitem) =>
                      JSON.parse(policyitem.previousValue).map((policy) => {
                        return (
                          <div>
                            <tr>
                              <td>Old Value</td>
                            </tr>
                            <tr>
                              <td>
                                {`Roles:${
                                  policy.roles.length == 0
                                    ? "<empty>"
                                    : policy.roles
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                {`Groups:${
                                  policy.groups.length == 0
                                    ? "<empty>"
                                    : policy.groups
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td>{`Users: ${policy.users}`}</td>
                            </tr>
                            <tr>
                              <td>
                                {`Permissions: ${policy.accesses.map(
                                  (obj) => obj.type
                                )}`}
                              </td>
                            </tr>
                            <tr>
                              <td>{`Delegate Admin: ${
                                policy.delegateAdmin == false
                                  ? "disabled"
                                  : "enabled"
                              }`}</td>
                            </tr>
                          </div>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          {action == "delete" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_SERVICE.value && (
              <div>
                <div className="font-weight-bolder">
                  Name: {objectName || ""}
                </div>
                <div className="font-weight-bolder">
                  Date:
                  {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Created By: {owner}</div>
                <h5 className="bold wrap-header m-t-sm">Service Details:</h5>
                <Table className="table  table-bordered table-striped  w-auto">
                  <tbody>
                    <tr>
                      <td>Fields</td>
                      <td>Old Value</td>
                    </tr>
                    {reportdata
                      .filter((obj) => {
                        return obj.attributeName != "Connection Configurations";
                      })
                      .map((c) => {
                        return (
                          <tr key={c.id}>
                            <td>{c.attributeName}</td>

                            <td>{c.previousValue || "--"}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                <br />
                <h5 className="bold wrap-header m-t-sm">
                  Connection Configurations :
                </h5>
                <Table className="table  table-bordered table-striped table-responsive w-auto">
                  <tbody>
                    <tr>
                      <td>Fields</td>
                      <td>Old Value</td>
                    </tr>
                    {reportdata
                      .filter((obj) => {
                        return obj.attributeName == "Connection Configurations";
                      })
                      .map((c) => {
                        return (
                          <>
                            <tr>
                              {" "}
                              {Object.keys(JSON.parse(c.previousValue)).map(
                                (obj) => (
                                  <tr>
                                    <td>{obj}</td>
                                  </tr>
                                )
                              )}
                              <td>
                                {Object.values(JSON.parse(c.previousValue)).map(
                                  (obj) => (
                                    <tr>
                                      <td className="overflow-auto text-nowrap ">
                                        {obj}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            )}
          {action == "delete" &&
            objectClassType ==
              ClassTypes.CLASS_TYPE_RANGER_SECURITY_ZONE.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Deleted By: {owner}</div>
                <h5 className="bold wrap-header m-t-sm">Zone Details:</h5>
                <Table className="table table-striped table-bordered w-auto">
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <th>Old Value</th>
                    </tr>
                    {reportdata
                      .filter((obj) => {
                        return obj.attributeName != "Zone Services";
                      })
                      .map((c) => {
                        return (
                          <tr key={c.id}>
                            <td>{c.attributeName}</td>

                            <td>{c.previousValue || "--"}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                <br />
                <h5 className="bold wrap-header m-t-sm">
                  Zone Service Details:
                </h5>
                <Table className="table table-striped table-bordered w-50">
                  <thead>
                    <tr>
                      <th>Service Name</th>
                      <th>Zone Service Resources</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportdata
                      .filter((obj) => {
                        return obj.attributeName == "Zone Services";
                      })
                      .map((c) => {
                        return (
                          <tr>
                            <td>
                              <strong>
                                {Object.keys(JSON.parse(c.previousValue))}
                              </strong>
                            </td>

                            {Object.values(JSON.parse(c.previousValue)).map(
                              (o) =>
                                o.resources.map((resource) =>
                                  Object.keys(resource).map((policy) => (
                                    <td>
                                      <div className="zone-resource">
                                        <strong>{`${policy} : `}</strong>
                                        {resource[policy].join(", ")}
                                        <br />{" "}
                                      </div>
                                    </td>
                                  ))
                                )
                            )}
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            )}

          {action == "delete" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_ROLE.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Created By: {owner} </div>

                <h5 className="bold wrap-header m-t-sm">Role Detail:</h5>

                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>

                      <th>New Value</th>
                    </tr>
                    {reportdata

                      .filter((c) => {
                        return (
                          c.attributeName != "Users" &&
                          c.attributeName != "Groups"
                        );
                      })
                      .map((u) => {
                        return (
                          <tr key={u.id}>
                            <td>{u.attributeName}</td>

                            <td>{u.previousValue || "--"}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                <br />
                <h5 className="bold wrap-header m-t-sm">Users:</h5>
                <Table className="table  border w-auto">
                  <tbody>
                    {reportdata
                      .filter((c) => {
                        return c.attributeName == "Users";
                      })
                      .map((u) => {
                        return (
                          <div>
                            <tr>
                              <th>Name</th>

                              <th> Role Admin</th>
                            </tr>
                            <tr>
                              <td>
                                {JSON.parse(u.previousValue).map((obj) => (
                                  <tr>
                                    <td>{Object.values(obj.name)}</td>
                                  </tr>
                                ))}
                              </td>
                              <td>
                                {JSON.parse(u.previousValue).map((obj) => (
                                  <tr>
                                    <td>
                                      {Object.values(obj.isAdmin) == false
                                        ? "false"
                                        : "true"}
                                    </td>{" "}
                                  </tr>
                                ))}
                              </td>
                            </tr>
                          </div>
                        );
                      })}
                  </tbody>
                </Table>
                <br />

                <h5 className="bold wrap-header m-t-sm">Groups:</h5>
                <Table className="table  border w-auto">
                  <tbody>
                    {reportdata

                      .filter((c) => {
                        return c.attributeName == "Groups";
                      })
                      .map((u) => {
                        return (
                          <div>
                            <tr>
                              <th>Name</th>

                              <th> Role Admin</th>
                            </tr>
                            <tr>
                              <td>
                                {JSON.parse(u.previousValue).map((obj) => (
                                  <tr>
                                    <td>{Object.values(obj.name)}</td>
                                  </tr>
                                ))}
                              </td>
                              <td>
                                {JSON.parse(u.previousValue).map((obj) => (
                                  <tr>
                                    <td>
                                      {Object.values(obj.isAdmin) == false
                                        ? "false"
                                        : "true"}
                                    </td>{" "}
                                  </tr>
                                ))}
                              </td>
                            </tr>
                          </div>
                        );
                      })}
                  </tbody>
                </Table>
                <br />
                <h5 className="bold wrap-header m-t-sm">Roles:</h5>
                <Table className="table  border w-auto">
                  <tbody>
                    {reportdata

                      .filter((c) => {
                        return c.attributeName == "Roles";
                      })
                      .map((u) => {
                        return (
                          <div>
                            <tr>
                              <th>Name</th>

                              <th> Role Admin</th>
                            </tr>
                            <tr>
                              <td>
                                {JSON.parse(u.previousValue).map((obj) => (
                                  <tr>
                                    <td>{Object.values(obj.name)}</td>
                                  </tr>
                                ))}
                              </td>
                              <td>
                                {JSON.parse(u.previousValue).map((obj) => (
                                  <tr>
                                    <td>
                                      {Object.values(obj.isAdmin) == false
                                        ? "false"
                                        : "true"}
                                    </td>{" "}
                                  </tr>
                                ))}
                              </td>
                            </tr>
                          </div>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            )}

          {action == "delete" &&
            objectClassType == ClassTypes.CLASS_TYPE_USER_PROFILE.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Created By: {owner} </div>
                <div className="font-weight-bolder">Deleted By: {owner} </div>

                <h5 className="bold wrap-header m-t-sm">Group Details:</h5>

                <Table className="table table-striped table-bordered w-auto">
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <th>Old Value</th>
                    </tr>
                    {reportdata.map((obj) => {
                      return (
                        <tr>
                          <td>{obj.attributeName}</td>
                          <td>{obj.previousValue || "--"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          {/* IMPORT END */}
          {action == "IMPORT END" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
              <div>
                <h5 className="bold wrap-header m-t-sm">Details:</h5>
                <Table striped bordered hover>
                  <tbody>
                    {reportdata.map((c) => {
                      return (
                        <tr>
                          <td>
                            {" "}
                            {Object.keys(JSON.parse(c.previousValue)).map(
                              (s) => {
                                return (
                                  <tr>
                                    <td>{s}</td>
                                  </tr>
                                );
                              }
                            )}
                          </td>

                          <td>
                            {Object.values(JSON.parse(c.previousValue)).map(
                              (d) => {
                                return (
                                  <tr>
                                    <td>{d}</td>
                                  </tr>
                                );
                              }
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
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
              <div>
                <h5 className="bold wrap-header m-t-sm">Details:</h5>
                <Table className="table table-striped table-bordered w-auto">
                  <tbody>
                    {reportdata.map((c) => (
                      <tr>
                        <td>
                          {" "}
                          {Object.keys(JSON.parse(c && c.previousValue)).map(
                            (s) => (
                              <tr>
                                <td>{s}</td>
                              </tr>
                            )
                          )}
                        </td>

                        <td>
                          {Object.values(JSON.parse(c && c.previousValue)).map(
                            (d) => (
                              <tr>
                                <td>{d}</td>
                              </tr>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          {action == "Import Delete" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
              <div>
                {" "}
                <div className="font-weight-bolder">
                  Policy ID : <Badge variant="info">{objectId}</Badge>
                </div>
                <div className="font-weight-bolder">
                  Policy Name: {objectName}
                </div>
                <div className="font-weight-bolder">
                  Deleted Date:
                  {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")} India
                  Standard Time
                </div>
                <div className="font-weight-bolder">Deleted By: {owner} </div>
                <h5 className="bold wrap-header m-t-sm">Policy Details:</h5>
                <Table className="table table-striped table-bordered w-auto">
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <th>Old Value</th>
                    </tr>
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
                          <tr>
                            <td>{obj.attributeName}</td>
                            <td>{obj.previousValue || "--"}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                <br />
                <h5 className="bold wrap-header m-t-sm"> Allow PolicyItems:</h5>
                <Table className="table table-striped table-bordered w-auto">
                  <tbody>
                    {policydelete.map((policyitem) =>
                      JSON.parse(policyitem.previousValue).map((policy) => {
                        return (
                          <div>
                            <tr>
                              <td>Old Value</td>
                            </tr>
                            <tr>
                              <td>
                                {`Roles:${
                                  policy.roles.length == 0
                                    ? "<empty>"
                                    : policy.roles
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                {`Groups:${
                                  policy.groups.length == 0
                                    ? "<empty>"
                                    : policy.groups
                                } `}
                              </td>
                            </tr>
                            <tr>
                              <td>{`Users: ${policy.users}`}</td>
                            </tr>
                            <tr>
                              <td>
                                {`Permissions: ${policy.accesses.map(
                                  (obj) => obj.type
                                )}`}
                              </td>
                            </tr>
                            <tr>
                              <td>{`Delegate Admin: ${
                                policy.delegateAdmin == false
                                  ? "enabled"
                                  : "disabled"
                              }`}</td>
                            </tr>{" "}
                          </div>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          {action == "password change" &&
            objectClassType == ClassTypes.CLASS_TYPE_PASSWORD_CHANGE.value && (
              <div>
                <div className="font-weight-bolder">Name : {objectName}</div>
                <div className="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
                  India Standard Time
                </div>
                <div className="font-weight-bolder">Updated By: {owner}</div>
                <h5 className="bold wrap-header m-t-sm">Details:</h5>
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <th>Old Value</th>
                      <th>New Value</th>
                    </tr>
                    {reportdata.map((obj) => (
                      <tr>
                        <td>{obj.attributeName}</td>
                        <td>{obj.previousValue}</td>
                        <td>{obj.newValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default OperationAdminModal;
