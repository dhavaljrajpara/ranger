import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import XATableLayout from "Components/XATableLayout";
import { isSystemAdmin, isKeyAdmin } from "Utils/XAUtils";
import { MoreLess } from "Components/CommonComponents";
import { reject } from "lodash";

function Permissions() {
  const [permissionslistData, setPermissions] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isAdminRole] = useState(isSystemAdmin() || isKeyAdmin());
  useEffect(() => {
    fetchPermissions();
  }, []);

  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);

  const fetchPermissions = useCallback(async ({ pageSize, pageIndex }) => {
    let permissionsdata = [];
    let totalCount = 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
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
        }
      },
      {
        Header: "Groups",
        accessor: (raw) => {
          const Groups = raw.groupPermList.map((group) => {
            return group.groupName;
          });

          return (
            <>
              <h6>
                <MoreLess data={Groups} />
              </h6>
            </>
          );
        }
      },
      {
        Header: "Users",
        accessor: (raw) => {
          const Users = raw.userPermList.map((user) => {
            return user.userName;
          });

          return (
            <>
              <h6>
                <MoreLess data={Users} />
              </h6>
            </>
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
        }
      }
    ],
    []
  );

  return (
    <>
      <h3 className="wrap-header bold">Permissions</h3>

      <div className="wrap">
        <br />
        <XATableLayout
          data={permissionslistData}
          columns={
            isAdminRole ? columns : reject(columns, ["Header", "Action"])
          }
          loading={loader}
          fetchData={fetchPermissions}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}

export default Permissions;
