import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, matchRoutes } from "react-router-dom";
import errorIcon from "Images/error-404-icon.png";
import { Button } from "react-bootstrap";
import { PathAssociateWithModule } from "../utils/XAEnums";

export const ErrorPage = (props) => {
  const [errorCode, setErrorCode] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);
  let navigate = useNavigate();
  let location = useLocation();

  let allRouter = [];

  for (const key in PathAssociateWithModule) {
    allRouter = [...allRouter, ...PathAssociateWithModule[key]];
  }
  let isValidRouter = matchRoutes(
    allRouter.map((val) => ({ path: val })),
    location.pathname
  );
  useEffect(() => {
    if (isValidRouter != null && isValidRouter.length > 0) {
      setErrorCode("Access Denied (401).");
      setErrorInfo(
        "Sorry, you don't have enough privileges to view this page."
      );
    } else {
      setErrorCode("Page not found (404).");
      setErrorInfo("Sorry, this page isn't here or has moved.");
    }
    if (props.errorCode == "204") {
      setErrorCode("Content not found (204).");
      setErrorInfo(
        "Sorry, Please sync-up the users with your source directory."
      );
    }
    if (props.errorCode == "403") {
      setErrorCode("Forbidden (403).");
      setErrorInfo(
        "Sorry, you don't have enough privileges to view this page."
      );
    }
    if (props.errorCode == "checkSSOTrue") {
      setErrorCode("Sign Out Is Not Complete!");
      setErrorInfo(
        <span>
          Authentication to this instance of Ranger is managed externally(for
          example,Apache Knox). You can still open this instance of Ranger from
          the same web browser without re-authentication.To prevent additional
          access to Ranger,
          <strong>close all browser windows and exit the browser</strong>.
        </span>
      );
    }
  });

  return (
    <div data-id="pageNotFoundPage" className="new-error-page">
      <div className="new-error-box">
        <div className="error-white-bg">
          <div className="new-icon-box">
            <img src={errorIcon}></img>
          </div>
          <div className="new-description-box">
            <h4 className="m-t-xs m-b-xs" data-id="msg">
              {errorCode}
            </h4>
            <div data-id="moreInfo">{errorInfo}</div>
          </div>
        </div>
        <div className="mt-2">
          <Button
            //href="/#/policymanager/resource"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-1"
          >
            <i className="fa-fw fa fa-long-arrow-left"></i> Go back
          </Button>
          {props.errorCode !== "checkSSOTrue" && (
            <Button href="#/policymanager/resource" size="sm">
              Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default ErrorPage;
