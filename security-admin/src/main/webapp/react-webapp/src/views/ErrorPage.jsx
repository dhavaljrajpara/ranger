import React, { Component } from "react";
import errorIcon from "Images/error-404-icon.png";
import { Button } from "react-bootstrap";

class ErrorPage extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  onGoBack = (e) => {
    console.log(e);
    this.props.history.goBack();
  };

  errorCode = () => {
    let errorHeader = "";
    if (this.props.errorCode == "401") {
      errorHeader = "Access Denied (401)";
    }
    return errorHeader;
  };

  render() {
    return (
      <>
        <div data-id="pageNotFoundPage" className="new-error-page">
          <div className="new-error-box">
            <div className="error-white-bg">
              <div className="new-icon-box">
                <img src={errorIcon}></img>
              </div>
              <div className="new-description-box">
                <h4 class="m-t-xs m-b-xs" data-id="msg">
                  {this.errorCode()}
                </h4>
                <div data-id="moreInfo">
                  Sorry, you don't have enough privileges to view this page.
                </div>
              </div>
            </div>
            <div>
              <Button
                //href="/#/policymanager/resource"
                size="sm"
                onClick={this.onGoBack}
                className="mr-1"
              >
                <i class="fa-fw fa fa-long-arrow-left"></i> Go back
              </Button>
              <Button href="/#/policymanager/resource" size="sm">
                Home
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ErrorPage;
