import React, { useState, useCallback, useRef, useEffect } from "react";
import { fetchApi } from "Utils/fetchAPI";
import { Button, Row, Col } from "react-bootstrap";
import { Loader } from "Components/CommonComponents";
import { indexOf } from "lodash";

export function GroupAssociateUserDetails(props) {
  const { groupID } = props;
  const [userListData, setUserDataList] = useState([]);
  const [filterUserListData, setFilterUserDataList] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    getUserList();
  }, []);
  const getUserList = async () => {
    let errorMsg = "",
      userList;
    try {
      userList = await fetchApi({
        url: `xusers/${groupID}/users`,
        method: "GET",
        params: {
          pageSize: 100,
          startIndex: 0
        }
      });
    } catch (error) {
      console.error(error);
    }

    let userData = _.map(userList.data.vXUsers, function (value) {
      return { value: value.name, id: value.id };
    });
    console.log(userData);
    setUserDataList(userData);
    setFilterUserDataList(userData);
    setLoader(false);
  };

  const onChangeSearch = (e) => {
    console.log(e);
    let userList = userListData.filter((v) => {
      return v.value.includes(e.currentTarget.value);
    });
    setFilterUserDataList(userList);
  };

  //   const showUserDetails = () => {
  //     console.log("sdsdd");
  //   };

  return loader ? (
    <Loader />
  ) : (
    <>
      <Row>
        <Col className="col-sm-12">
          <input
            className="form-control"
            type="text"
            // value={this.state.searchText}
            onChange={onChangeSearch}
            placeholder="Search"
          ></input>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          {filterUserListData.map((val, index) => {
            return (
              <Button
                variant="link"
                href={`#/user/${val.id}`}
                size="sm"
                className="mr-2 rounded-pill border"
                key={index}
                // onClick={showUserDetails}
              >
                {val.value}
              </Button>
            );
          })}
        </Col>
      </Row>
    </>
  );
}
export default GroupAssociateUserDetails;
