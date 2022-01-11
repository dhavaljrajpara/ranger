import React, { useEffect, useState } from "react";
import { ClassTypes } from "../../utils/XAEnums";
import { Modal, Table, Button, Badge } from "react-bootstrap";
import dateFormat from "dateformat";
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
    transactionId
  } = data;

  useEffect(() => {
    show && rowModal();
  }, [show]);

  const rowModal = async () => {
    try {
      const authResp = await fetchApi({
        url: `assets/report/${transactionId}`
      });
      let authlogs = authResp.data.vXTrxLogs;

      setReportData(authlogs);
    } catch (error) {
      console.error(`Error occurred while fetching Admin logs! ${error}`);
    }
  };
  const policydelete = reportdata.filter((obj) => {
    return obj.attributeName == "Policy Items";
  });
  const policycreate =
    objectName == "EXPIRES_ON"
      ? reportdata.filter((obj) => obj.attributeName == "DenyPolicy Items")
      : reportdata.filter((obj) => obj.attributeName == "Policy Items");
  return (
    <Modal show={show} size="lg" onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Operation :{action || ""}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {action == "create" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_SERVICE.value && (
              <div>
                <div class="font-weight-bolder">Name: {objectName || ""}</div>
                <div class="font-weight-bolder">
                  Date:
                  {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
                  India Standard Time
                </div>
                <div class="font-weight-bolder">Created By: {owner}</div>
                <h5 class="bold wrap-header m-t-sm">Service Details:</h5>
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <td>New Value</td>
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
                <h5 class="bold wrap-header m-t-sm">
                  Connection Configurations :
                </h5>
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <td>New Value</td>
                    </tr>
                    {reportdata
                      .filter((obj) => {
                        return obj.attributeName == "Connection Configurations";
                      })
                      .map((c) => {
                        return (
                          <tr key={c.id}>
                            <td>{Object.keys(JSON.parse(c.newValue))}</td>
                            <td>{Object.values(JSON.parse(c.newValue))}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            )}
          {action == "create" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
              <div>
                <div class="font-weight-bolder">
                  Policy ID : <Badge variant="info">{objectId}</Badge>
                </div>
                <div class="font-weight-bolder">Policy Name: {objectName}</div>
                <div class="font-weight-bolder">Service Name: {owner}</div>
                <div class="font-weight-bolder">
                  Created Date:{" "}
                  {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")} India
                  Standard Time
                </div>
                <div class="font-weight-bolder">Created By: {owner}</div>
                <h5 class="bold wrap-header m-t-sm">Policy Details:</h5>
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <td>New Value</td>
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
                            <td>{obj.newValue || "--"}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                <br />
                <h5 class="bold wrap-header m-t-sm">Deny PolicyItems:</h5>
                <Table className="table table-striped border w-auto">
                  <tbody>
                    <tr>
                      <th>New Value</th>
                    </tr>
                    {policycreate.map((policyitem) => {
                      return (
                        <tr key={policyitem.id}>
                          {JSON.parse(policyitem.newValue).map((policy) => (
                            <div>
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
                                <td>
                                  {`Users:${
                                    policy.users.length == 0
                                      ? "<empty>"
                                      : policy.groups
                                  } `}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  {`Permissions: ${policy.accesses.map(
                                    (obj) => obj.type
                                  )}`}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  {" "}
                                  {`Conditions:${policy.conditions.map(
                                    (type) => `${type.type} : ${type.values}`
                                  )} `}
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
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          {action == "create" &&
            objectClassType == ClassTypes.CLASS_TYPE_XA_GROUP.value && (
              <div>
                <div class="font-weight-bolder">Name : {objectName}</div>
                <div class="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
                  India Standard Time
                </div>
                <div class="font-weight-bolder">Created By: {owner}</div>
                <h5 class="bold wrap-header m-t-sm">Group Detail:</h5>

                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>

                      <th>New Value</th>
                    </tr>
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
                <div class="font-weight-bolder">Name : {objectName}</div>
                <div class="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
                  India Standard Time
                </div>
                <div class="font-weight-bolder">Created By: {owner}</div>
                <h5 class="bold wrap-header m-t-sm">Zone Details:</h5>

                <Table striped bordered hover>
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
                <br />
                <h5 class="bold wrap-header m-t-sm">Zone Details:</h5>
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Service Name</th>

                      <th> Zone Service Resources</th>
                    </tr>
                  </tbody>
                </Table>
              </div>
            )}
          {action == "create" &&
            objectClassType == ClassTypes.CLASS_TYPE_XA_USER.value && (
              <div>
                <div class="font-weight-bolder">Name : {objectName}</div>
                <div class="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div class="font-weight-bolder">Created By: {owner} </div>

                <h5 class="bold wrap-header m-t-sm">User Details:</h5>

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
                <div class="font-weight-bolder">Name : {objectName}</div>
                <div class="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div class="font-weight-bolder">Created By: {owner} </div>

                <h5 class="bold wrap-header m-t-sm">Role Detail:</h5>

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
                <h5 class="bold wrap-header m-t-sm">Users:</h5>
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

                <h5 class="bold wrap-header m-t-sm">Groups:</h5>
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
                <h5 class="bold wrap-header m-t-sm">Roles:</h5>
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
                <div class="font-weight-bolder">Name : {objectName}</div>
                <div class="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div class="font-weight-bolder">Updated By: {owner} </div>

                <h5 class="bold wrap-header m-t-sm">Group Detail:</h5>

                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <th>Old Value</th>
                      <th>New Value</th>
                    </tr>
                    {reportdata.map((u) => {
                      return (
                        <tr key={u.id}>
                          <td>{u.attributeName}</td>
                          <td>{u.previousValue || "--"}</td>
                          <td>{u.newValue}</td>
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
                <div class="font-weight-bolder">Name : {objectName}</div>
                <div class="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div class="font-weight-bolder">Updated By: {owner} </div>

                <h5 class="bold wrap-header m-t-sm">Old Groups Details:</h5>

                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <th> Is Role Admin</th>
                    </tr>
                  </tbody>
                </Table>
              </div>
            )}
          {action == "update" &&
            objectClassType ==
              ClassTypes.CLASS_TYPE_RANGER_SECURITY_ZONE.value && (
              <div>
                <div class="font-weight-bolder">Name : {objectName}</div>
                <div class="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div class="font-weight-bolder">Updated By: {owner} </div>

                <h5 class="bold wrap-header m-t-sm">Zone Details:</h5>

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
                        <td>{obj.newValue}</td>
                        <td>{obj.previousValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}

          {/*Delete*/}

          {action == "delete" &&
            objectClassType == ClassTypes.CLASS_TYPE_XA_GROUP.value && (
              <div>
                <div class="font-weight-bolder">Name : {objectName}</div>
                <div class="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div class="font-weight-bolder">Created By: {owner} </div>
                <div class="font-weight-bolder">Deleted By: {owner} </div>

                <h5 class="bold wrap-header m-t-sm">Group Details:</h5>

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
                <div class="font-weight-bolder">
                  Policy ID: <Badge variant="info">{objectId}</Badge>
                </div>
                <div class="font-weight-bolder">Policy Name: {objectName}</div>
                <div class="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}{" "}
                  India Standard Time
                </div>
                <div class="font-weight-bolder">Created By: {owner} </div>
                <div class="font-weight-bolder">Deleted By: {owner} </div>

                <h5 class="bold wrap-header m-t-sm">Group Details:</h5>

                <Table striped bordered hover>
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
                <h5 class="bold wrap-header m-t-sm">Group Details:</h5>
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Old Value</th>
                    </tr>
                    {policydelete.map((policyitem) => {
                      return (
                        <tr key={policyitem.id}>
                          {JSON.parse(policyitem.previousValue).map(
                            (policy) => {
                              return (
                                <div>
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
                            }
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          {action == "delete" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_SERVICE.value && (
              <div>
                <div class="font-weight-bolder">Name: {objectName || ""}</div>
                <div class="font-weight-bolder">
                  Date:
                  {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
                  India Standard Time
                </div>
                <div class="font-weight-bolder">Deleted By: {owner}</div>
                <h5 class="bold wrap-header m-t-sm">Service Details:</h5>

                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <th>Old Value</th>
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
                <h5 class="bold wrap-header m-t-sm">
                  Connection Configurations:
                </h5>
              </div>
            )}
          {action == "delete" &&
            objectClassType ==
              ClassTypes.CLASS_TYPE_RANGER_SECURITY_ZONE.value && (
              <div>
                <div class="font-weight-bolder">Name : {objectName}</div>
                <div class="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
                  India Standard Time
                </div>
                <div class="font-weight-bolder">Deleted By: {owner}</div>
                <h5 class="bold wrap-header m-t-sm">Zone Details:</h5>
                <Table striped bordered hover>
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
                <h5 class="bold wrap-header m-t-sm">Zone Service Details:</h5>
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <th>Old Value</th>
                    </tr>
                    {reportdata
                      .filter((obj) => {
                        return obj.attributeName == "Zone Services";
                      })
                      .map((c) => {
                        return (
                          <tr key={c.id}>
                            <td>{Object.keys(JSON.parse(c.previousValue))}</td>

                            {Object.values(JSON.parse(c.previousValue)).map(
                              (o) =>
                                o.resources.map((resource) =>
                                  Object.keys(resource).map((policy) => (
                                    <td>
                                      {" "}
                                      <p>
                                        <strong>{`${policy} : `}</strong>
                                        {resource[policy].join(", ")}
                                      </p>
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

          {/* IMPORT END */}
          {action == "IMPORT END" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
              <div>
                <h5 class="bold wrap-header m-t-sm">Details:</h5>
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
                <h5 class="bold wrap-header m-t-sm">Details:</h5>
                <Table className="table  border w-auto">
                  <tbody>
                    {reportdata.map((c) => {
                      return (
                        <div>
                          <tr>
                            <td>
                              {Object.keys(JSON.parse(c.previousValue)).map(
                                (s) => (
                                  <tr>
                                    <td>{s}</td>
                                  </tr>
                                )
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
                        </div>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          {action == "Import Delete" &&
            objectClassType == ClassTypes.CLASS_TYPE_RANGER_POLICY.value && (
              <div>
                {" "}
                <div class="font-weight-bolder">
                  Policy ID : <Badge variant="info">{objectId}</Badge>
                </div>
                <div class="font-weight-bolder">Policy Name: {objectName}</div>
                <div class="font-weight-bolder">
                  Deleted Date:
                  {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")} India
                  Standard Time
                </div>
                <div class="font-weight-bolder">Deleted By: {owner} </div>
                <h5 class="bold wrap-header m-t-sm">Policy Details:</h5>
                <Table striped bordered hover>
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
                <h5 class="bold wrap-header m-t-sm"> Allow PolicyItems:</h5>
              </div>
            )}
          {action == "password change" &&
            objectClassType == ClassTypes.CLASS_TYPE_PASSWORD_CHANGE.value && (
              <div>
                <div class="font-weight-bolder">Name : {objectName}</div>
                <div class="font-weight-bolder">
                  Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")}
                  India Standard Time
                </div>
                <div class="font-weight-bolder">Updated By: {owner}</div>
                <h5 class="bold wrap-header m-t-sm">Details:</h5>
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
