import React, { Component } from "react";
import errorIcon from "Images/error-404-icon.png";
import { Button } from "react-bootstrap";

class ErrorPage extends Component {
  constructor(props) {
    super(props);
    this.state = { errorCode: null, errorInfo: null };
  }

  componentDidMount = () => {
    if (this.props.errorCode == "401") {
      this.setState({
        errorCode: "Access Denied (401).",
        errorInfo: "Sorry, you don't have enough privileges to view this page."
      });
    }
    if (this.props.errorCode == "404") {
      this.setState({
        errorCode: "Page not found (404).",
        errorInfo: "Sorry, this page isn't here or has moved."
      });
    }
  };

  onGoBack = (e) => {
    console.log(e);
    this.props.history.goBack();
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
                <h4 className="m-t-xs m-b-xs" data-id="msg">
                  {this.state.errorCode}
                </h4>
                <div data-id="moreInfo">{this.state.errorInfo}</div>
              </div>
            </div>
            <div>
              <Button
                //href="/#/policymanager/resource"
                size="sm"
                onClick={this.onGoBack}
                className="mr-1"
              >
                <i className="fa-fw fa fa-long-arrow-left"></i> Go back
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
