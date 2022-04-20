import React from "react";
import { Table, Badge } from "react-bootstrap";
import dateFormat from "dateformat";
import { ClassTypes } from "../../../utils/XAEnums";
import _, { isEmpty } from "lodash";

export const RoleLogs = ({ data, reportdata }) => {
  const { objectName, objectClassType, createDate, owner, action } = data;

  let Userscreate = reportdata.filter(
    (o) => o.attributeName == "Users" && o.action == "create"
  );
  let Groupscreate = reportdata.filter(
    (o) => o.attributeName == "Groups" && o.action == "create"
  );
  let Rolescreate = reportdata.filter(
    (o) => o.attributeName == "Roles" && o.action == "create"
  );
  let Usersupdate = reportdata.filter(
    (o) => o.attributeName == "Users" && o.action == "update"
  );
  let Groupsupdate = reportdata.filter(
    (o) => o.attributeName == "Groups" && o.action == "update"
  );
  let Rolesupdate = reportdata.filter(
    (o) => o.attributeName == "Roles" && o.action == "update"
  );
  let Users = reportdata.filter(
    (o) => o.attributeName == "Users" && o.action == "delete"
  );

  let Groups = reportdata.filter(
    (o) => o.attributeName == "Groups" && o.action == "delete"
  );
  let Roles = reportdata.filter(
    (o) => o.attributeName == "Roles" && o.action == "delete"
  );
  let Roledetail = reportdata.filter((c) => {
    return (
      c.attributeName != "Users" &&
      c.attributeName != "Groups" &&
      c.attributeName != "Roles"
    );
  });
  return (
    <div>
      {/* CREATE  */}
      {action == "create" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_ROLE.value && (
          <div>
            <div className="font-weight-bolder">Name: {objectName}</div>
            <div className="font-weight-bolder">
              Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")} India
              Standard Time
            </div>
            <div className="font-weight-bolder">Created By: {owner} </div>
            <br />
            <h5 className="bold wrap-header m-t-sm">Role Detail:</h5>

            <Table className="table table-bordered table-striped w-50">
              <thead>
                <tr>
                  <th>Fields</th>
                  <th>New Value</th>
                </tr>
              </thead>
              <tbody>
                {Roledetail.map((role, index) => {
                  return (
                    <tr key={index}>
                      <td className="table-warning">{role.attributeName}</td>

                      <td className="table-warning">{role.newValue || "--"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <br />
            <h5 className="bold wrap-header m-t-sm">Users:</h5>
            <Table className="table  table-bordered table-striped w-50">
              <>
                <thead>
                  <tr>
                    <th>Name</th>

                    <th> Role Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {Userscreate.map((usr) => {
                    return (
                      <>
                        {JSON.parse(usr.newValue).map((obj, idx) => (
                          <tr key={idx}>
                            <td className="table-warning">{obj.name}</td>
                            <td className="table-warning">
                              {obj.isAdmin === false ? "false" : "true"}
                            </td>
                          </tr>
                        ))}
                      </>
                    );
                  })}
                </tbody>
              </>
            </Table>
            <br />

            <h5 className="bold wrap-header m-t-sm">Groups:</h5>
            <Table className="table  table-bordered table-striped w-50">
              <thead>
                <tr>
                  <th>Name</th>

                  <th> Role Admin</th>
                </tr>
              </thead>
              <tbody>
                {Groupscreate.map((grp) => {
                  return (
                    <>
                      {JSON.parse(grp.newValue).map((obj, index) => (
                        <tr key={index}>
                          <td className="table-warning">{obj.name}</td>

                          <td className="table-warning">
                            {obj.isAdmin === false ? "false" : "true"}
                          </td>
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
            </Table>
            <br />
            <h5 className="bold wrap-header m-t-sm">Roles:</h5>
            <Table className="table  table-bordered  table-striped w-50">
              <thead>
                <tr>
                  <th>Name</th>

                  <th> Role Admin</th>
                </tr>
              </thead>
              <tbody>
                {Rolescreate.map((roles) => {
                  return (
                    <>
                      {JSON.parse(roles.newValue).map((obj, index) => (
                        <tr key={index}>
                          <td className="table-warning">{obj.name}</td>

                          <td className="table-warning">
                            {obj.isAdmin === false ? "false" : "true"}
                          </td>
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}

      {/* UPDATE */}

      {action == "update" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_ROLE.value && (
          <div>
            <div className="row">
              <div className="col-md-6">
                <div className="font-weight-bolder">Name: {objectName}</div>
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

            {action == "update" && !isEmpty(Roledetail) && (
              <>
                <h5 className="bold wrap-header m-t-sm">Role Detail:</h5>
                <Table className="table table-bordered table-striped w-75">
                  <tbody>
                    <tr>
                      <th>Fields</th>
                      <th>Old Value</th>
                      <th>New Value</th>
                    </tr>
                    {Roledetail.map((role, index) => {
                      return (
                        <tr key={index}>
                          <td className="table-warning">
                            {role.attributeName}
                          </td>
                          <td className="table-warning text-nowrap">
                            {!isEmpty(role.previousValue) ? (
                              isEmpty(role.newValue) ? (
                                <h6>
                                  <Badge
                                    className="d-inline mr-1"
                                    variant="danger"
                                  >
                                    {role.previousValue}
                                  </Badge>
                                </h6>
                              ) : (
                                role.previousValue
                              )
                            ) : (
                              "--"
                            )}
                          </td>
                          <td className="table-warning text-nowrap">
                            {!isEmpty(role.newValue) ? (
                              isEmpty(role.previousValue) ? (
                                <h6>
                                  <Badge
                                    className="d-inline mr-1"
                                    variant="success"
                                  >
                                    {role.newValue}
                                  </Badge>
                                </h6>
                              ) : (
                                role.newValue
                              )
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

            {action == "update" && !isEmpty(Usersupdate) && (
              <div className="row">
                <div className="col">
                  <h5 className="bold wrap-header m-t-sm">
                    Old Users Details:
                  </h5>

                  <Table className="table  table-bordered table-striped w-100">
                    <thead>
                      <tr>
                        <th>Name</th>

                        <th> Role Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Usersupdate.map((usr) => {
                        return !isEmpty(usr.previousValue) ? (
                          JSON.parse(usr.previousValue).map((obj, index) => (
                            <tr key={index}>
                              <td className="oldvalbg">{obj.name}</td>
                              <td className="oldvalbg">
                                {obj.isAdmin === false ? "false" : "true"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={2} className="oldvalbg">
                              Empty
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
                <div className="col">
                  <h5 className="bold wrap-header m-t-sm">
                    New Users Details:
                  </h5>

                  <Table className="table  table-bordered table-striped w-100">
                    <thead>
                      <tr>
                        <th>Name</th>

                        <th> Role Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Usersupdate.map((usr) => {
                        return !isEmpty(usr.newValue) ? (
                          JSON.parse(usr.newValue).map((obj, index) => (
                            <tr key={index}>
                              <td className="table-warning">{obj.name}</td>
                              <td className="table-warning">
                                {obj.isAdmin === false ? "false" : "true"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={2} className="table-warning">
                              Empty
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <br />
                </div>
              </div>
            )}

            {action == "update" && !isEmpty(Groupsupdate) && (
              <div className="row">
                <div className="col">
                  <h5 className="bold wrap-header m-t-sm">
                    Old Groups Details:
                  </h5>

                  <Table className="table  table-bordered table-striped w-100">
                    <thead>
                      <tr>
                        <th>Name</th>

                        <th> Role Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Groupsupdate.map((grp) => {
                        return !isEmpty(grp.previousValue) ? (
                          JSON.parse(grp.previousValue).map((obj, index) => (
                            <tr key={index}>
                              <td className="oldvalbg">{obj.name}</td>
                              <td className="oldvalbg">
                                {obj.isAdmin === false ? "false" : "true"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={2} className="oldvalbg">
                              Empty
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
                <div className="col">
                  <h5 className="bold wrap-header m-t-sm">
                    New Groups Details:
                  </h5>

                  <Table className="table  table-bordered table-striped w-100">
                    <thead>
                      <tr>
                        <th>Name</th>

                        <th> Role Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Groupsupdate.map((grp) => {
                        return !isEmpty(grp.newValue) ? (
                          JSON.parse(grp.newValue).map((obj, index) => (
                            <tr key={index}>
                              <td className="table-warning">{obj.name}</td>
                              <td className="table-warning">
                                {obj.isAdmin === false ? "false" : "true"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={2} className="table-warning">
                              Empty
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
            <br />
            {action == "update" && !isEmpty(Rolesupdate) && (
              <div className="row">
                <div className="col">
                  <h5 className="bold wrap-header m-t-sm">
                    Old Roles Details:
                  </h5>

                  <Table className="table  table-bordered table-striped w-100">
                    <thead>
                      <tr>
                        <th>Name</th>

                        <th> Role Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Rolesupdate.map((roles) => {
                        return !isEmpty(roles.previousValue) ? (
                          JSON.parse(roles.previousValue).map((obj, index) => (
                            <tr key={index}>
                              <td className="oldvalbg">{obj.name}</td>
                              <td className="oldvalbg">
                                {obj.isAdmin === false ? "false" : "true"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={2} className="oldvalbg">
                              Empty
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
                <div className="col">
                  <h5 className="bold wrap-header m-t-sm">
                    New Roles Details:
                  </h5>

                  <Table className="table  table-bordered table-striped w-100">
                    <thead>
                      <tr>
                        <th>Name</th>

                        <th> Role Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Rolesupdate.map((roles) => {
                        return !isEmpty(roles.newValue) ? (
                          JSON.parse(roles.newValue).map((obj, index) => (
                            <tr key={index}>
                              <td className="table-warning">{obj.name}</td>
                              <td className="table-warning">
                                {obj.isAdmin === false ? "false" : "true"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={2} className="table-warning">
                              Empty
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}

      {/* DELETE  */}

      {action == "delete" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_ROLE.value && (
          <div>
            <div className="font-weight-bolder">Name: {objectName}</div>
            <div className="font-weight-bolder">
              Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")} India
              Standard Time
            </div>
            <div className="font-weight-bolder">Created By: {owner} </div>
            <div className="font-weight-bolder">Deleted By: {owner} </div>
            <br />
            <h5 className="bold wrap-header m-t-sm">Role Detail:</h5>

            <Table className="table  table-bordered table-striped w-50">
              <>
                <thead>
                  <tr>
                    <th>Fields</th>

                    <th>New Value</th>
                  </tr>
                </thead>
                <tbody>
                  {reportdata
                    .filter((val) => {
                      return (
                        val.attributeName != "Users" &&
                        val.attributeName != "Groups" &&
                        val.attributeName != "Roles"
                      );
                    })
                    .map((role, index) => {
                      return (
                        <tr key={index}>
                          <td className="table-warning">
                            {role.attributeName}
                          </td>

                          <td className="table-warning">
                            {!isEmpty(role.previousValue)
                              ? role.previousValue
                              : "--"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </>
            </Table>
            <br />
            <h5 className="bold wrap-header m-t-sm">Users:</h5>
            <Table className="table  table-bordered table-striped w-50">
              <thead>
                <tr>
                  <th>Name</th>

                  <th> Role Admin</th>
                </tr>
              </thead>
              <tbody>
                {Users.map((usr) => {
                  return JSON.parse(usr.previousValue).map((obj, index) => (
                    <tr key={index}>
                      <td className="table-warning">{obj.name}</td>
                      <td className="table-warning">
                        {obj.isAdmin === false ? "false" : "true"}
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </Table>
            <br />

            <h5 className="bold wrap-header m-t-sm">Groups:</h5>
            <Table className="table  table-bordered table-striped w-50">
              <thead>
                <tr>
                  <th>Name</th>

                  <th> Role Admin</th>
                </tr>
              </thead>

              <tbody>
                {Groups.map((u) => {
                  return JSON.parse(u.previousValue).map((obj, index) => (
                    <tr key={index}>
                      <td className="table-warning">{obj.name}</td>
                      <td className="table-warning">
                        {obj.isAdmin === false ? "false" : "true"}
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </Table>
            <br />
            <h5 className="bold wrap-header m-t-sm">Roles:</h5>
            <Table className="table  table-bordered table-striped w-50">
              <thead>
                <tr>
                  <th>Name</th>

                  <th> Role Admin</th>
                </tr>
              </thead>

              <tbody>
                {Roles.map((roles) => {
                  return JSON.parse(roles.previousValue).map((obj, index) => (
                    <tr key={index}>
                      <td className="table-warning">{obj.name}</td>
                      <td className="table-warning">
                        {obj.isAdmin === false ? "false" : "true"}
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </Table>
          </div>
        )}
    </div>
  );
};

export default RoleLogs;
