import React, { Component } from "react";
import { Alert, Badge } from "react-bootstrap";
import { Field } from "react-final-form";
import moment from "moment-timezone";
import { isEmpty } from "lodash";
const Loader = () => {
  return (
    <div className="loading-img">
      <div id="center">
        <div className="letter_container_1">
          <span>L</span>
        </div>
        <div className="letter_container_2">
          <span>O</span>
        </div>
        <div className="letter_container_3">
          <span>A</span>
        </div>
        <div className="letter_container_4">
          <span>D</span>
        </div>
        <div className="letter_container_5">
          <span>I</span>
        </div>
        <div className="letter_container_6">
          <span>N</span>
        </div>
        <div className="letter_container_7">
          <span>G</span>
        </div>
        <div className="letter_container_8">
          <span>..</span>
        </div>
      </div>
    </div>
  );
};
export const FieldError = ({ name }) => (
  <Field name={name}>
    {({ meta: { error, touched } }) => {
      return error && touched ? (
        <div className="invalid-field">{error}</div>
      ) : null;
    }}
  </Field>
);

export class MoreLess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data.length > 4 ? props.data.slice(0, 4) : props.data,
      show: true
    };
  }

  handleShowMoreClick = () => {
    let show = !this.state.show;
    let data = show ? this.props.data.slice(0, 4) : this.props.data;
    this.setState({ show, data });
  };

  render() {
    return (
      <div>
        {this.state.data.map((key, index) => {
          return (
            <Badge variant="info" className="m-1">
              {key}
            </Badge>
          );
        })}
        <a onClick={this.handleShowMoreClick}>
          {this.props.data.length > 4 ? (
            this.state.show ? (
              <code className="show-more-less"> + More..</code>
            ) : (
              <code className="show-more-less"> - Less..</code>
            )
          ) : null}
        </a>
      </div>
    );
  }
}

export const AuditFilterEntries = (props) => {
  const { entries, refreshTable } = props;
  const refreshTables = () => {
    refreshTable();
  };
  const showPageDetail = (entriesDetails) => {
    let endIndex = Math.min(
      entriesDetails.startIndex + entriesDetails.pageSize - 1,
      entriesDetails.totalCount
    );
    return !isEmpty(entriesDetails)
      ? `${entriesDetails.startIndex + 1} to ${endIndex} of 
            ${entriesDetails.totalCount}`
      : 0;
  };
  return (
    <div className="row">
      <div className="col-md-4"></div>
      <div className="col-md-8 m-b-sm">
        <div className="text-right">
          Last Updated Time:&nbsp;
          <Badge className="d-inline mr-1" variant="info">
            {new Date().toLocaleString("en-US", { hour12: true })}
          </Badge>
          <span className="mr-1"> | </span>
          Entries:&nbsp;
          <Badge className="d-inline mr-1" variant="info">
            {showPageDetail(entries)}
          </Badge>
          <button
            className="link-tag m-l-xsm"
            title="Refresh"
            onClick={() => {
              refreshTables();
            }}
          >
            <i className="fa-fw fa fa-refresh"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export const Condition = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) =>
      value === is ? (
        children
      ) : (
        <Alert variant="warning" className="text-center">
          Select "Audit Filter" to save/add audit filter !!
        </Alert>
      )
    }
  </Field>
);

export { Loader };
