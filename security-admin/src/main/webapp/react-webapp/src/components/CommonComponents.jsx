import React, { Component, useState, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Alert,
  Badge,
  Popover,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { Field } from "react-final-form";
import { isEmpty, isUndefined } from "lodash";

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
      <>
        {this.state.data.map((key) => {
          return (
            <Badge variant="info" key={key} className="m-1">
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
      </>
    );
  }
}

export class AccessMoreLess extends Component {
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
            <span className="item" key={index}>
              {key}
            </span>
          );
        })}
        <a
          onClick={(e) => {
            e.stopPropagation();
            this.handleShowMoreClick();
          }}
        >
          {this.props.data.length > 4 ? (
            this.state.show ? (
              <span className="float-left-margin-1">
                <code className="show-more-less"> + More..</code>
              </span>
            ) : (
              <span className="float-left-margin-1">
                <code className="show-more-less"> - Less..</code>
              </span>
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
    let startIndex = !isEmpty(entriesDetails) && entriesDetails.startIndex + 1;
    let endIndex =
      !isEmpty(entriesDetails) &&
      Math.min(
        startIndex + entriesDetails.pageSize - 1,
        entriesDetails.totalCount
      );
    return entriesDetails && entriesDetails.totalCount > 0
      ? `${startIndex} to ${endIndex} of 
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

export const CustomPopover = ({ title, content, placement, trigger, icon }) => {
  return (
    <>
      <OverlayTrigger
        trigger={trigger}
        placement={placement}
        overlay={
          <Popover id={`popover-${placement}`}>
            <Popover.Title as="h3">{title}</Popover.Title>
            <Popover.Content>{content}</Popover.Content>
          </Popover>
        }
      >
        <i className={icon}></i>
      </OverlayTrigger>
    </>
  );
};

export const CustomPopoverOnClick = ({
  title,
  content,
  placement,
  trigger,
  icon
}) => {
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };

  return (
    <>
      <OverlayTrigger
        show={show}
        trigger={trigger}
        placement={placement}
        overlay={
          <Popover
            id={`popover-${placement}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Popover.Title as="h3">
              {title}
              <i
                class="pull-right"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                ×
              </i>
            </Popover.Title>
            <Popover.Content>{content}</Popover.Content>
          </Popover>
        }
      >
        <i
          className={icon}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        ></i>
      </OverlayTrigger>
    </>
  );
};

export const CustomPopoverTagOnClick = ({
  data,
  title,
  content,
  placement,
  trigger,
  icon
}) => {
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };

  return (
    <>
      <OverlayTrigger
        show={show}
        trigger={trigger}
        placement={placement}
        overlay={
          <Popover
            id={`popover-${placement}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Popover.Title as="h3">
              {title}
              <i
                class="pull-right"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                ×
              </i>
            </Popover.Title>
            <Popover.Content>{content}</Popover.Content>
          </Popover>
        }
      >
        <span
          className={icon}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {data}
        </span>
      </OverlayTrigger>
    </>
  );
};

export const CustomTooltip = ({ placement, content, icon }) => (
  <OverlayTrigger
    placement={placement}
    overlay={<Tooltip id={`tooltip-${placement}`}>{content}</Tooltip>}
  >
    <i className={icon}></i>
  </OverlayTrigger>
);

export const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

export { Loader };
