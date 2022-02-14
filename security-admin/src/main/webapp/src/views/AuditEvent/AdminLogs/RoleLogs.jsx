import React from "react";
import { Table } from "react-bootstrap";
import dateFormat from "dateformat";
import { ClassTypes } from "../../../utils/XAEnums";

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
            <div className="font-weight-bolder">Name : {objectName}</div>
            <div className="font-weight-bolder">
              Date: {dateFormat(createDate, "mm/dd/yyyy hh:MM:ss TT ")} India
              Standard Time
            </div>
            <div className="font-weight-bolder">Created By: {owner} </div>

            <h5 className="bold wrap-header m-t-sm">Role Detail:</h5>

            <Table className="table table-bordered table-striped w-50">
              <thead>
                <tr>
                  <th>Fields</th>
                  <th>New Value</th>
                </tr>
              </thead>
              {Roledetail.map((u, index) => {
                return (
                  <tbody>
                    <tr key={index}>
                      <td className="table-warning">{u.attributeName}</td>

                      <td className="table-warning">{u.newValue || "--"}</td>
                    </tr>
                  </tbody>
                );
              })}
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
                {Userscreate.map((u) => {
                  return (
                    <>
                      {JSON.parse(u.newValue).map((obj, index) => (
                        <tbody>
                          <tr key={index}>
                            <td className="table-warning">
                              {Object.values(obj.name)}
                            </td>
                            <td className="table-warning">
                              {Object.values(obj.isAdmin) == false
                                ? "false"
                                : "true"}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </>
                  );
                })}
              </>
            </Table>
            <br />

            <h5 className="bold wrap-header m-t-sm">Groups:</h5>
            <Table className="table  table-bordered table-striped w-50">
              <>
                <thead>
                  <tr>
                    <th>Name</th>

                    <th> Role Admin</th>
                  </tr>
                </thead>
                {Groupscreate.map((u) => {
                  return (
                    <>
                      {JSON.parse(u.newValue).map((obj, index) => (
                        <tbody>
                          <tr key={index}>
                            <td className="table-warning">
                              {Object.values(obj.name)}
                            </td>

                            <td className="table-warning">
                              {JSON.parse(u.newValue).map((obj) =>
                                Object.values(obj.isAdmin) == false
                                  ? "false"
                                  : "true"
                              )}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </>
                  );
                })}
              </>
            </Table>
            <br />
            <h5 className="bold wrap-header m-t-sm">Roles:</h5>
            <Table className="table  table-bordered  table-striped w-50">
              <>
                <thead>
                  <tr>
                    <th>Name</th>

                    <th> Role Admin</th>
                  </tr>
                </thead>
                {Rolescreate.map((u) => {
                  return (
                    <>
                      {JSON.parse(u.newValue).map((obj, index) => (
                        <tbody>
                          <tr key={index}>
                            <td className="table-warning">
                              {Object.values(obj.name)}
                            </td>

                            <td className="table-warning">
                              {JSON.parse(u.newValue).map((obj) =>
                                Object.values(obj.isAdmin) == false
                                  ? "false"
                                  : "true"
                              )}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </>
                  );
                })}
              </>
            </Table>
          </div>
        )}

      {/* UPDATE */}

      {action == "update" &&
        objectClassType == ClassTypes.CLASS_TYPE_RANGER_ROLE.value && (
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
            {Roledetail.length > 0 && (
              <h5 className="bold wrap-header m-t-sm">Role Detail:</h5>
            )}

            {Roledetail.length > 0 && (
              <Table className="table table-bordered table-striped w-75">
                <tbody>
                  <tr>
                    <th>Fields</th>
                    <th>Old Value</th>
                    <th>New Value</th>
                  </tr>
                  {Roledetail.map((u, index) => {
                    return (
                      <tr key={index}>
                        <td className="table-warning">{u.attributeName}</td>
                        <td className="table-warning">
                          {u.previousValue || "--"}
                        </td>
                        <td className="table-warning">
                          <span className="add-text">{u.newValue || "--"}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
            <br />
            {Usersupdate.length > 0 && (
              <div className="row">
                <div className="col">
                  <h5 className="bold wrap-header m-t-sm">
                    Old Users Details:
                  </h5>

                  <Table className="table  table-bordered table-striped w-100">
                    {Usersupdate.map((u) => {
                      return (
                        <>
                          <thead>
                            <tr>
                              <th>Name</th>

                              <th> Role Admin</th>
                            </tr>
                          </thead>
                          {u.previousValue.length > 0 ? (
                            JSON.parse(u.previousValue).map((obj) => (
                              <tbody>
                                <tr>
                                  <td className="oldvalbg">{obj.name}</td>
                                  <td className="oldvalbg">
                                    {Object.values(obj.isAdmin) == false
                                      ? "false"
                                      : "true"}
                                  </td>
                                </tr>
                              </tbody>
                            ))
                          ) : (
                            <tbody>
                              <tr>
                                <td colSpan={2} className="oldvalbg">
                                  Empty
                                </td>
                              </tr>
                            </tbody>
                          )}
                        </>
                      );
                    })}
                  </Table>
                </div>
                <div className="col">
                  <h5 className="bold wrap-header m-t-sm">
                    New Users Details:
                  </h5>
                  <Table className="table  table-bordered table-striped w-100">
                    {Usersupdate.map((u) => {
                      return (
                        <>
                          <thead>
                            <tr>
                              <th>Name</th>

                              <th> Role Admin</th>
                            </tr>
                          </thead>
                          {u.newValue.length > 0 ? (
                            JSON.parse(u.newValue).map((obj) => (
                              <tbody>
                                <tr>
                                  <td className="table-warning">{obj.name}</td>
                                  <td className="table-warning">
                                    {Object.values(obj.isAdmin) == false
                                      ? "false"
                                      : "true"}
                                  </td>
                                </tr>
                              </tbody>
                            ))
                          ) : (
                            <tbody>
                              <tr>
                                <td colSpan={2} className="oldvalbg">
                                  Empty
                                </td>
                              </tr>
                            </tbody>
                          )}
                        </>
                      );
                    })}
                  </Table>
                </div>
              </div>
            )}
            <br />
            {Groupsupdate.length > 0 && (
              <div className="row">
                <div className="col">
                  <h5 className="bold wrap-header m-t-sm">
                    Old Groups Details:
                  </h5>

                  <Table className="table  table-bordered table-striped w-100">
                    {Groupsupdate.map((u) => {
                      return (
                        <>
                          <thead>
                            <tr>
                              <th>Name</th>

                              <th> Role Admin</th>
                            </tr>
                          </thead>
                          {u.previousValue.length > 0 ? (
                            JSON.parse(u.previousValue).map((obj) => (
                              <tbody>
                                <tr>
                                  <td className="oldvalbg">{obj.name}</td>
                                  <td className="oldvalbg">
                                    {Object.values(obj.isAdmin) == false
                                      ? "false"
                                      : "true"}
                                  </td>
                                </tr>
                              </tbody>
                            ))
                          ) : (
                            <tbody>
                              <tr>
                                <td colSpan={2} className="oldvalbg">
                                  Empty
                                </td>
                              </tr>
                            </tbody>
                          )}
                        </>
                      );
                    })}
                  </Table>
                </div>
                <div className="col">
                  <h5 className="bold wrap-header m-t-sm">
                    New Groups Details:
                  </h5>

                  <Table className="table  table-bordered table-striped w-100">
                    {Groupsupdate.map((u) => {
                      return (
                        <>
                          <thead>
                            <tr>
                              <th>Name</th>

                              <th> Role Admin</th>
                            </tr>
                          </thead>
                          {u.newValue.length > 0 ? (
                            JSON.parse(u.newValue).map((obj) => (
                              <tbody>
                                <tr>
                                  <td className="table-warning">{obj.name}</td>
                                  <td className="table-warning">
                                    {Object.values(obj.isAdmin) == false
                                      ? "false"
                                      : "true"}
                                  </td>
                                </tr>
                              </tbody>
                            ))
                          ) : (
                            <tbody>
                              <tr>
                                <td colSpan={2} className="table-warning">
                                  Empty
                                </td>
                              </tr>
                            </tbody>
                          )}
                        </>
                      );
                    })}
                  </Table>
                </div>
              </div>
            )}
            <br />
            {Rolesupdate.length > 0 && (
              <div className="row">
                <div className="col">
                  <h5 className="bold wrap-header m-t-sm">
                    Old Roles Details:
                  </h5>

                  <Table className="table  table-bordered table-striped w-100">
                    {Rolesupdate.map((u) => {
                      return (
                        <>
                          <thead>
                            <tr>
                              <th>Name</th>

                              <th> Role Admin</th>
                            </tr>
                          </thead>
                          {u.previousValue.length > 0 ? (
                            JSON.parse(u.previousValue).map((obj) => (
                              <tbody>
                                <tr>
                                  <td className="oldvalbg">{obj.name}</td>
                                  <td className="oldvalbg">
                                    {Object.values(obj.isAdmin) == false
                                      ? "false"
                                      : "true"}
                                  </td>
                                </tr>
                              </tbody>
                            ))
                          ) : (
                            <tbody>
                              <tr>
                                <td colSpan={2} className="oldvalbg">
                                  Empty
                                </td>
                              </tr>
                            </tbody>
                          )}
                        </>
                      );
                    })}
                  </Table>
                </div>
                <div className="col">
                  <h5 className="bold wrap-header m-t-sm">
                    New Roles Details:
                  </h5>

                  <Table className="table  table-bordered table-striped w-100">
                    {Rolesupdate.map((u) => {
                      return (
                        <>
                          <thead>
                            <tr>
                              <th>Name</th>

                              <th> Role Admin</th>
                            </tr>
                          </thead>
                          {u.newValue.length > 0 ? (
                            JSON.parse(u.newValue).map((obj) => (
                              <tbody>
                                <tr>
                                  <td className="table-warning">{obj.name}</td>
                                  <td className="table-warning">
                                    {Object.values(obj.isAdmin) == false
                                      ? "false"
                                      : "true"}
                                  </td>
                                </tr>
                              </tbody>
                            ))
                          ) : (
                            <tbody>
                              <tr>
                                <td colSpan={2} className="table-warning">
                                  Empty
                                </td>
                              </tr>
                            </tbody>
                          )}
                        </>
                      );
                    })}
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
            <div className="font-weight-bolder">Name : {objectName}</div>
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
                {reportdata

                  .filter((c) => {
                    return (
                      c.attributeName != "Users" &&
                      c.attributeName != "Groups" &&
                      c.attributeName != "Roles"
                    );
                  })
                  .map((u) => {
                    return (
                      <tbody>
                        <tr key={u.id}>
                          <td className="table-warning">{u.attributeName}</td>

                          <td className="table-warning">
                            {u.previousValue || "--"}
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
              </>
            </Table>
            <br />
            <h5 className="bold wrap-header m-t-sm">Users:</h5>
            <Table className="table  table-bordered table-striped w-50">
              {Users.map((u) => {
                return (
                  <>
                    <thead>
                      <tr>
                        <th>Name</th>

                        <th> Role Admin</th>
                      </tr>
                    </thead>
                    {JSON.parse(u.previousValue).map((obj) => (
                      <tbody>
                        <tr>
                          <td className="table-warning">{obj.name}</td>
                          <td className="table-warning">
                            {Object.values(obj.isAdmin) == false
                              ? "false"
                              : "true"}
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </>
                );
              })}
            </Table>
            <br />

            <h5 className="bold wrap-header m-t-sm">Groups:</h5>
            <Table className="table  table-bordered table-striped w-50">
              <>
                {Groups.map((u) => {
                  return (
                    <>
                      <thead>
                        <tr>
                          <th>Name</th>

                          <th> Role Admin</th>
                        </tr>
                      </thead>

                      {JSON.parse(u.previousValue).map((obj) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              {Object.values(obj.name)}
                            </td>
                            <td className="table-warning">
                              {Object.values(obj.isAdmin) == false
                                ? "false"
                                : "true"}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </>
                  );
                })}
              </>
            </Table>
            <br />
            <h5 className="bold wrap-header m-t-sm">Roles:</h5>
            <Table className="table  table-bordered table-striped w-50">
              <>
                {Roles.map((u) => {
                  return (
                    <>
                      <thead>
                        <tr>
                          <th>Name</th>

                          <th> Role Admin</th>
                        </tr>
                      </thead>

                      {JSON.parse(u.previousValue).map((obj) => (
                        <tbody>
                          <tr>
                            <td className="table-warning">
                              {Object.values(obj.name)}
                            </td>
                            <td className="table-warning">
                              {Object.values(obj.isAdmin) == false
                                ? "false"
                                : "true"}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </>
                  );
                })}
              </>
            </Table>
          </div>
        )}
    </div>
  );
};

export default RoleLogs;
