import React, { useEffect } from "react";
import { useState } from "react";
import { fetchApi } from "Utils/fetchAPI";
import { AuthStatus, AuthType } from "../../utils/XAEnums";
import { Modal, Table, Button } from "react-bootstrap";
import dateFormat from "dateformat";
import { Loader } from "Components/CommonComponents";

export const AdminModal = (props) => {
  const [authSession, setAuthSession] = useState([]);
  // const [showmodal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (props.show) {
      handleShow();
    }
  }, [props.show]);
  const handleShow = async () => {
    let authlogs = [];
    try {
      const authResp = await fetchApi({
        url: "xusers/authSessions",
        params: {
          id: props.data,
        },
      });
      authlogs = authResp.data.vXAuthSessions;
      setAuthSession(authlogs);
      authlogs ? setLoader(false) : setLoader(true);
    } catch (error) {
      console.error(`Error occurred while fetching Admin logs! ${error}`);
    }
  };

  return (
    <Modal show={props.show} size="lg" onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Session Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loader ? (
          <Loader />
        ) : (
          <Table striped bordered hover>
            <tbody>
              <tr>
                <th>Login ID</th>
                <td>
                  {authSession.map((obj) => {
                    return obj.loginId;
                  })}
                </td>
              </tr>
              <tr>
                <th>Result</th>
                <td>
                  {authSession.map((obj) => {
                    var result = "";
                    Object.keys(AuthStatus).map((item) => {
                      if (obj.authStatus == AuthStatus[item].value) {
                        let label = AuthStatus[item].label;
                        if (AuthStatus[item].value == 1) {
                          result = label;
                        } else if (AuthStatus[item].value == 2) {
                          result = label;
                        } else {
                          result = label;
                        }
                      }
                    });
                    return result;
                  })}
                </td>
              </tr>
              <tr>
                <th>Login Type</th>
                <td>
                  {authSession.map((obj) => {
                    var type = "";
                    Object.keys(AuthType).map((item) => {
                      if (obj.authType == AuthType[item].value) {
                        return (type = AuthType[item].label);
                      }
                    });
                    return type;
                  })}
                </td>
              </tr>
              <tr>
                <th>IP</th>
                <td>
                  {authSession.map((obj) => {
                    return obj.requestIP;
                  })}
                </td>
              </tr>
              <tr>
                <th>User Agent</th>
                <td>
                  {authSession.map((obj) => {
                    return obj.requestUserAgent;
                  })}
                </td>
              </tr>
              <tr>
                <th>Login Time</th>
                <td>
                  {authSession.map((obj) => {
                    return (
                      dateFormat(obj.authTime, "mm/dd/yyyy hh:MM:ss TT ") +
                      " India Standard Time"
                    );
                  })}
                </td>
              </tr>
              <tr>
                <th>Login Id</th>
                <td>
                  {authSession.map((obj) => {
                    return obj.id;
                  })}
                </td>
              </tr>
            </tbody>
          </Table>
        )}
        <a className="link-tag">Show Actions</a>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={props.onHide}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default AdminModal;
