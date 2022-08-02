import React, { useState, useRef, useCallback, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import XATableLayout from "Components/XATableLayout";
import { isSystemAdmin, isKeyAdmin } from "Utils/XAUtils";
import { MoreLess } from "Components/CommonComponents";
import { isEmpty, reject, find, isUndefined, map, sortBy } from "lodash";
import { fetchApi } from "Utils/fetchAPI";
import { commonBreadcrumb } from "../../utils/XAUtils";
import StructuredFilter from "../../components/structured-filter/react-typeahead/tokenizer";

function Permissions() {
  const [permissionslistData, setPermissions] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const fetchIdRef = useRef(0);
  const [isAdminRole] = useState(isSystemAdmin() || isKeyAdmin());
  const [searchFilterParams, setSearchFilterParams] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [defaultSearchFilterParams, setDefaultSearchFilterParams] = useState(
    []
  );

  useEffect(() => {
    let searchFilterParam = {};
    let searchParam = {};
    let defaultSearchFilterParam = [];

    // Get Search Filter Params from current search params
    const currentParams = Object.fromEntries([...searchParams]);
    console.log("PRINT search params : ", currentParams);

    for (const param in currentParams) {
      let searchFilterObj = find(searchFilterOption, {
        urlLabel: param
      });

      if (!isUndefined(searchFilterObj)) {
        let category = searchFilterObj.category;
        let value = currentParams[param];

        if (searchFilterObj.type == "textoptions") {
          let textOptionObj = find(searchFilterObj.options(), {
            label: value
          });
          value = textOptionObj !== undefined ? textOptionObj.value : value;
        }

        searchFilterParam[category] = value;
        defaultSearchFilterParam.push({
          category: category,
          value: value
        });
      }
    }

    // Updating the states for search params, search filter and default search filter
    setSearchParams({ ...currentParams, ...searchParam });
    setSearchFilterParams(searchFilterParam);
    setDefaultSearchFilterParams(defaultSearchFilterParam);
    setLoader(false);

    console.log(
      "PRINT Final searchFilterParam to server : ",
      searchFilterParam
    );
    console.log(
      "PRINT Final defaultSearchFilterParam to tokenzier : ",
      defaultSearchFilterParam
    );
  }, []);

  const fetchPermissions = useCallback(
    async ({ pageSize, pageIndex }) => {
      let permissionsdata = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      let params = { ...searchFilterParams };
      if (fetchId === fetchIdRef.current) {
        params["pageSize"] = pageSize;
        params["startIndex"] = pageIndex * pageSize;
        try {
          const permissionResp = await fetchApi({
            url: "xusers/permission",
            params: params
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
    },
    [searchFilterParams]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Modules",
        accessor: "module",
        Cell: (rawValue) => {
          if (rawValue.value) {
            return isAdminRole ? (
              <Link
                className={`${"text-info"}`}
                to={`/permissions/${rawValue.row.original.id}/edit`}
              >
                {rawValue.row.original.module}
              </Link>
            ) : (
              rawValue.row.original.module
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
          console.log(Users);
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
                className="btn btn-sm m-r-5"
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

  const searchFilterOption = [
    {
      category: "groupName",
      label: "Group Name",
      urlLabel: "groupName",
      type: "text"
    },
    {
      category: "module",
      label: "Module Name",
      urlLabel: "moduleName",
      type: "text"
    },
    {
      category: "userName",
      label: "User Name",
      urlLabel: "userName",
      type: "text"
    }
  ];

  const updateSearchFilter = (filter) => {
    console.log("PRINT Filter from tokenizer : ", filter);

    let searchFilterParam = {};
    let searchParam = {};

    map(filter, function (obj) {
      searchFilterParam[obj.category] = obj.value;

      let searchFilterObj = find(searchFilterOption, {
        category: obj.category
      });

      let urlLabelParam = searchFilterObj.urlLabel;

      if (searchFilterObj.type == "textoptions") {
        let textOptionObj = find(searchFilterObj.options(), {
          value: obj.value
        });
        searchParam[urlLabelParam] = textOptionObj.label;
      } else {
        searchParam[urlLabelParam] = obj.value;
      }
    });
    setSearchFilterParams(searchFilterParam);
    setSearchParams(searchParam);
  };

  return (
    <>
      {commonBreadcrumb(["ModulePermissions"])}
      <h3 className="wrap-header bold">Permissions</h3>
      <div className="wrap">
        {loader ? (
          <Row>
            <Col sm={12} className="text-center">
              <div className="spinner-border mr-2" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </Col>
          </Row>
        ) : (
          <React.Fragment>
            <Row className="mb-4">
              <Col md={9}>
                <StructuredFilter
                  key="permission-listing-search-filter"
                  placeholder="Search for permissions..."
                  options={sortBy(searchFilterOption, ["label"])}
                  onTokenAdd={updateSearchFilter}
                  onTokenRemove={updateSearchFilter}
                  defaultSelected={defaultSearchFilterParams}
                />
              </Col>
            </Row>
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
          </React.Fragment>
        )}
      </div>
    </>
  );
}

export default Permissions;
