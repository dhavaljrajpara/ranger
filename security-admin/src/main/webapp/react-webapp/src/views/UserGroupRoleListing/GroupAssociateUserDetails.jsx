import React, { useState, useEffect } from "react";
import { fetchApi } from "Utils/fetchAPI";
import { Button, Row, Col } from "react-bootstrap";
import { Loader } from "Components/CommonComponents";
import { isAuditor, isKMSAuditor } from "Utils/XAUtils";
import { toast } from "react-toastify";

function GroupAssociateUserDetails(props) {
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
  const copyText = (e) => {
    let userCopytext = "";
    userCopytext = filterUserListData
      .map((val) => {
        return val.value;
      })
      .join(" | ");
    if (userCopytext.length == 0) {
      toast.warning("No user list find for copy");
    } else {
      toast.success("User list copied succesfully!!");
    }
    return userCopytext;
  };

  return loader ? (
    <Loader />
  ) : (
    <>
      {userListData && userListData.length > 0 ? (
        <>
          <Row>
            <Col className="col-sm-11">
              <input
                className="form-control"
                type="text"
                // value={this.state.searchText}
                onChange={onChangeSearch}
                placeholder="Search"
                data-id="userInput"
                data-cy="userInput"
              ></input>
            </Col>
            <Col className="col-sm-1">
              <Button
                className="mr-2 rounded-pill border"
                size="sm"
                variant="link"
                onClick={() => navigator.clipboard.writeText(copyText())}
                title="Copy All Users Name"
              >
                <i className="fa-fw fa fa-copy"> </i>
              </Button>
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
                    className={`mr-2 rounded-pill border ${
                      isAuditor() || isKMSAuditor()
                        ? "disabled-link text-secondary"
                        : ""
                    }`}
                    key={index}
                  >
                    {val.value}
                  </Button>
                );
              })}
            </Col>
          </Row>
        </>
      ) : (
        <>
          <center className="text-muted">
            No user associate with this group.!!
          </center>
        </>
      )}
    </>
  );
}
export default GroupAssociateUserDetails;
