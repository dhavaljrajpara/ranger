import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { fetchApi } from "Utils/fetchAPI";
import { isEmpty } from "lodash";

function TestConnection(props) {
  const { formValues, getTestConnConfigs } = props;

  const [modelState, setModalState] = useState({
    showTestConnModal: false,
    showMore: true
  });

  const [modelContent, setModalContent] = useState({
    showMoreModalContent: "",
    testConnModalContent: ""
  });

  const hideTestConnModal = () =>
    setModalState({
      showTestConnModal: false,
      showMore: true
    });

  const showMoreClass = (val) => {
    setModalState({
      showTestConnModal: true,
      showMore: val
    });
  };

  const validateConfig = async () => {
    let testConnResp;

    try {
      testConnResp = await fetchApi({
        url: "plugins/services/validateConfig",
        method: "post",
        data: getTestConnConfigs(formValues)
      });

      let respMsg = testConnResp.data.msgDesc;
      let respStatusCode = testConnResp.data.statusCode;
      let respMsgList = testConnResp.data.messageList;
      let msgModal,
        msgListModal = [];

      if (respStatusCode !== undefined && respStatusCode === 1) {
        msgModal = [
          <div
            className="test-conn-content"
            key={`${respStatusCode}.msgContent`}
          >
            <b>Connection Failed</b>
            <p>{respMsg}</p>
          </div>
        ];
        if (respMsgList !== undefined && respMsgList.length === 1) {
          msgListModal = [
            <div
              className="test-conn-content"
              key={`${respStatusCode}.msgList`}
            >
              <p className="connection-error mt-2">{respMsgList[0].message}</p>
            </div>
          ];
        }
      } else {
        msgModal = [
          <div className="test-conn-content" key={respStatusCode}>
            Connected Successfully.
          </div>
        ];
      }
      setModalState({
        showTestConnModal: true,
        showMore: true
      });
      setModalContent({
        testConnModalContent: msgModal,
        showMoreModalContent: msgListModal
      });
    } catch (error) {
      console.error(`Error occurred while validating the configs!  ${error}`);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="outline-dark"
        size="sm"
        className="btn-sm"
        onClick={() => {
          validateConfig();
        }}
      >
        Test Connection
      </Button>
      <Modal show={modelState.showTestConnModal} onHide={hideTestConnModal}>
        <Modal.Body>
          {modelContent.testConnModalContent}
          {!modelState.showMore && modelContent.showMoreModalContent}
        </Modal.Body>

        <Modal.Footer>
          {!isEmpty(modelContent.showMoreModalContent) &&
            (modelState.showMore ? (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  showMoreClass(false);
                }}
              >
                Show More..
              </Button>
            ) : (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  showMoreClass(true);
                }}
              >
                Show Less..
              </Button>
            ))}
          <Button variant="primary" size="sm" onClick={hideTestConnModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default TestConnection;
