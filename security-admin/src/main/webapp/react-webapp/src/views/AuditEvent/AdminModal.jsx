import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchApi } from "Utils/fetchAPI";
import { AuthStatus, AuthType } from "../../utils/XAEnums";
import { Modal, Table, Button } from "react-bootstrap";
import dateFormat from "dateformat";
import { has } from "lodash";

export const AdminModal = (props) => {
  const [authSession, setAuthSession] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchParams] = useSearchParams();

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
          id: props.data
        }
      });
      authlogs = authResp.data.vXAuthSessions;
      setAuthSession(authlogs);
      authlogs ? setLoader(false) : setLoader(true);
    } catch (error) {
      console.error(`Error occurred while fetching Admin logs! ${error}`);
    }
  };

  const setSessionId = () => {
    props.onHide();
    const currentParams = Object.fromEntries([...searchParams]);
    if (!has(currentParams, "sessionId")) {
      props.updateSessionId(props.data);
    }
  };

  return (
    <Modal show={props.show} size="lg" onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Session Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loader ? (
          <div className="row">
            <div className="col-sm-12 text-center">
              <div className="spinner-border mr-2" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
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
            </tbody>
          </Table>
        )}
        <Button
          variant="link"
          className="link-tag"
          size="sm"
          onClick={setSessionId}
          data-id="showAction"
          data-cy="showAction"
        >
          Show Actions
        </Button>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" className="btn-mini" onClick={props.onHide}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default AdminModal;
