import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import XATableLayout from "Components/XATableLayout";
import { isSystemAdmin, isKeyAdmin } from "Utils/XAUtils";
import { MoreLess } from "Components/CommonComponents";
import { isEmpty, reject } from "lodash";
import { fetchApi } from "Utils/fetchAPI";
import { commonBreadcrumb } from "../../utils/XAUtils";

function Permissions() {
  const [permissionslistData, setPermissions] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const fetchIdRef = useRef(0);
  const [isAdminRole] = useState(isSystemAdmin() || isKeyAdmin());

  const fetchPermissions = useCallback(async ({ pageSize, pageIndex }) => {
    let permissionsdata = [];
    let totalCount = 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        const permissionResp = await fetchApi({
          url: "xusers/permission",
          params: {
            pageSize: pageSize,
            startIndex: pageIndex * pageSize
          }
        });
        permissionsdata = permissionResp.data.vXModuleDef;
        totalCount = permissionResp.data.totalCount;
      } catch (error) {
        console.error(`Error occurred while fetching Group list! ${error}`);
      }
      setPermissions(permissionsdata);
      setTotalCount(totalCount);
      setPageCount(Math.ceil(totalCount / pageSize));
      setLoader(false);
    }
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Modules",
        accessor: "module",
        Cell: (rawValue) => {
          if (rawValue.value) {
            return (
              <Link
                className={`${"text-info"}`}
                to={`/permissions/${rawValue.row.original.id}/edit`}
              >
                {rawValue.row.original.module}
              </Link>
            );
          }
          return "--";
        },
        width: 80
      },
      {
        Header: "Groups",
        accessor: "groupPermList",
        accessor: (raw) => {
          const Groups = raw.groupPermList.map((group) => {
            return group.groupName;
          });

          return !isEmpty(Groups) ? (
            <MoreLess data={Groups} />
          ) : (
            <div className="text-center">--</div>
          );
        }
        // maxWidth: 210
      },
      {
        Header: "Users",
        accessor: "userPermList",
        accessor: (raw) => {
          const Users = raw.userPermList.map((user) => {
            return user.userName;
          });

          return !isEmpty(Users) ? (
            <MoreLess data={Users} />
          ) : (
            <div className="text-center">--</div>
          );
        }
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: (rawValue) => {
          return (
            <div className="text-center">
              <Link
                className="btn btn-outline-dark btn-sm m-r-5"
                title="Edit"
                to={`/permissions/${rawValue.row.original.id}/edit`}
              >
                <i className="fa-fw fa fa-edit fa-fw fa fa-large"></i>
              </Link>
            </div>
          );
        },
        width: 50
      }
    ],
    []
  );

  return (
    <>
      {commonBreadcrumb(["ModulePermissions"])}
      <h3 className="wrap-header bold">Permissions</h3>
      <div className="wrap">
        <br />
        <XATableLayout
          data={permissionslistData}
          columns={
            isAdminRole ? columns : reject(columns, ["Header", "Action"])
          }
          totalCount={totalCount}
          loading={loader}
          fetchData={fetchPermissions}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}

export default Permissions;
