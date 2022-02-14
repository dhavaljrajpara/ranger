import React, { useState, useCallback, useRef } from "react";
import { Badge, Button, Row, Col } from "react-bootstrap";
import XATableLayout from "Components/XATableLayout";
import { Loader } from "Components/CommonComponents";
import { useHistory } from "react-router-dom";

function Roles() {
  let history = useHistory();
  const [roleListingData, setRoleData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = useRef(0);

  const fetchRoleInfo = useCallback(async ({ pageSize, pageIndex }) => {
    let roleData = [];
    let totalCount = 0;
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      try {
        const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
        const roleResp = await fetchApi({
          url: "roles/lookup/roles",
          params: {
            pageSize: pageSize,
            startIndex: pageIndex * pageSize,
          },
        });
        roleData = roleResp.data.roles;
        totalCount = roleResp.data.totalCount;
      } catch (error) {
        console.error(`Error occurred while fetching User list! ${error}`);
      }
      setRoleData(roleData);
      setPageCount(Math.ceil(totalCount / pageSize));
      setLoader(false);
    }
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Select",
        accessor: "Select", // accessor is the "key" in the data
      },
      {
        Header: "Role Name",
        accessor: "name",
      },

      {
        Header: "Users",
        accessor: "users",
        accessor: (raw) => {
          if (!raw.users[0] == 0) {
            return (
              <Badge variant="info">{Object.values(raw.users[0].name)}</Badge>
            );
          } else {
            return "--";
          }
        },
      },
      {
        Header: "Groups",
        accessor: "groups",
        accessor: (raw) => {
          if (!raw.groups[0] == 0) {
            return <Badge variant="info">{Object.values(raw.groups[0])}</Badge>;
          } else {
            return "--";
          }
        },
      },
      {
        Header: "Roles",
        accessor: "roles",
        accessor: (raw) => {
          if (raw.roles.length !== 0) {
            return <Badge variant="info">{raw.roles[0].name}</Badge>;
          } else {
            return "--";
          }
        },
      },
    ],
    []
  );
  const addRole = () => {
    history.push("/roleCreate");
  };
  return loader ? (
    <Loader />
  ) : (
    <div>
      <h1>Role List</h1>
      <Row className="mb-4">
        <Col md={9}></Col>
        <Col md={3}>
          <Button onClick={addRole}>Add Role</Button>
        </Col>
      </Row>
      <div>
        <XATableLayout
          data={roleListingData}
          columns={columns}
          fetchData={fetchRoleInfo}
          pageCount={pageCount}
        />
      </div>
    </div>
  );
}

export default Roles;
