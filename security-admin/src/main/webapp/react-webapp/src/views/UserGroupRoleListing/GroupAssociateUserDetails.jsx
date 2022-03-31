import React, { useState, useCallback, useRef, useEffect } from "react";
import { fetchApi } from "Utils/fetchAPI";
export function GroupAssociateUserDetails(props) {
  const { groupID } = props;
  useEffect(() => {
    getUserList();
  }, []);
  const getUserList = async () => {
    let errorMsg = "";
    try {
      await fetchApi({
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
  };

  return <></>;
}
export default GroupAssociateUserDetails;
