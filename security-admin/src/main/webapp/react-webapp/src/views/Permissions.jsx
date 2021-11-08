/*import React, { Component, useState, useEffect } from "react";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";
import { MoreLess } from "Components/CommonComponents";

function Permissions() {
  const [permissionslistData, setPermissions] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    let permissionsdata = [];
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      const permissionResp = await fetchApi({
        url: "xusers/permission",
      });
      permissionsdata = permissionResp.data.vXModuleDef;
    } catch (error) {
      console.error(`Error occurred while fetching Permission logs! ${error}`);
    }
    setPermissions(permissionsdata);
    setLoader(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Modules",
        accessor: "module", // accessor is the "key" in the data
      },
      {
        Header: "Groups",
        accessor: (raw) => {
          const Groups = raw.groupPermList.map((group) => {
            return group.groupName;
          });

          return (
            <>
              <MoreLess data={Groups} />
            </>
          );
        },
      },
      {
        Header: "Users",
        accessor: (raw) => {
          const Users = raw.userPermList.map((user) => {
            return user.userName;
          });

          return (
            <>
              <MoreLess data={Users} />
            </>
          );
        },
      },
      {groupListingData
        Header: "Action",
        accessor: "action",
        Cell: () => {
          return (
            <button className="permissionbtn">
              <a className="permissions" title="Edit">
                <i className="fa-fw fa fa-edit fa-fw fa fa-large"></i>
              </a>
            </button>
          );
        },
      },
    ],
    []
  );
  return loader ? (
    <Loader />
  ) : (
    <div>
      <h4 className="wrap-header bold">Permissions</h4>
      <div className="wrap">
        <XATableLayout data={permissionslistData} columns={columns} />
      </div>
    </div>
  );
}

export default Permissions;*/

import React, {
  Component,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";
import { useHistory } from "react-router-dom";
import { MoreLess } from "Components/CommonComponents";

import _ from "lodash";

function Permissions() {
  let history = useHistory();
  const [permissionslistData, setPermissions] = useState([]);
  const [loader, setLoader] = useState(true);
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
            startIndex: pageIndex * pageSize,
          },
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
        accessor: "module", // accessor is the "key" in the data
      },
      {
        Header: "Groups",
        accessor: (raw) => {
          const Groups = raw.groupPermList.map((group) => {
            return group.groupName;
          });

          return (
            <>
              <MoreLess data={Groups} />
            </>
          );
        },
      },
      {
        Header: "Users",
        accessor: (raw) => {
          const Users = raw.userPermList.map((user) => {
            return user.userName;
          });

          return (
            <>
              <MoreLess data={Users} />
            </>
          );
        },
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: () => {
          return (
            <button className="permissionbtn">
              <a className="permissions" title="Edit">
                <i className="fa-fw fa fa-edit fa-fw fa fa-large"></i>
              </a>
            </button>
          );
        },
      },
    ],
    []
  );

  return (
    <div>
      <h1>Permissions</h1>

      <div>
        <XATableLayout
          data={permissionslistData}
          columns={columns}
          fetchData={fetchPermissions}
          pageCount={pageCount}
        />
      </div>
    </div>
  );
}

export default Permissions;
