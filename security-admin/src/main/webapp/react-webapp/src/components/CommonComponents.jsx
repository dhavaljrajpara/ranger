import { isEmpty } from "lodash";
import moment from "moment-timezone";
import React, { Component, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  OverlayTrigger,
  Popover,
  Row
} from "react-bootstrap";
import { Field } from "react-final-form";
import { useLocation } from "react-router-dom";

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
        <div className={this.state.show ? "show-less" : "show-more"}>
          {this.state.data.map((key) => {
            return (
              <Badge
                variant="info"
                title={key}
                key={key}
                className="m-1 text-truncate more-less-width"
              >
                {key}
              </Badge>
            );
          })}
          <a onClick={this.handleShowMoreClick}>
            {this.props.data.length > 4 ? (
              this.state.show ? (
                <code
                  className="show-more-less"
                  data-id="showMore"
                  data-cy="showMore"
                >
                  {" "}
                  + More..
                </code>
              ) : (
                <code
                  className="show-more-less"
                  data-id="showLess"
                  data-cy="showLess"
                >
                  {" "}
                  - Less..
                </code>
              )
            ) : null}
          </a>
        </div>
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
    <div className="row text-right mb-3">
      <div className="col-sm-12">
        Last Updated Time:&nbsp;
        <h6 className="d-inline">
          <Badge className="mr-1" variant="info">
            {moment
              .tz(moment(), "Asia/Kolkata")
              .format("MM/DD/YYYY hh:mm:ss A")}
          </Badge>
        </h6>
        <span className="mr-1"> | </span>
        Entries:&nbsp;
        <h6 className="d-inline">
          <Badge className="mr-1" variant="info">
            {showPageDetail(entries)}
          </Badge>
        </h6>
        <button
          className="link-tag m-l-xsm"
          title="Refresh"
          onClick={() => {
            refreshTables();
          }}
          data-id="refresh"
          data-cy="refresh"
        >
          <i className="fa-fw fa fa-refresh"></i>
        </button>
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

export const CustomPopover = ({
  title,
  content,
  placement,
  trigger,
  icon,
  dangerousInnerHtml
}) => {
  return (
    <>
      <OverlayTrigger
        trigger={trigger}
        placement={placement}
        overlay={
          <Popover id={`popover-${placement}`}>
            <Popover.Title as="h3">{title}</Popover.Title>
            {dangerousInnerHtml != undefined && dangerousInnerHtml ? (
              <Popover.Content>
                <span dangerouslySetInnerHTML={{ __html: content }} />
              </Popover.Content>
            ) : (
              <Popover.Content>{content}</Popover.Content>
            )}
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
  icon,
  id
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
            <Popover.Title>
              {title}
              <i
                className="pull-right close"
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
          title="Query Info"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          data-id={id}
          data-cy={id}
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
                className="pull-right"
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
    overlay={<Popover id={`tooltip-${placement}`}>{content}</Popover>}
  >
    <i className={icon} data-id="infoTextFiled" data-cy="infoTextFiled"></i>
  </OverlayTrigger>
);

export const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

export const CommonScrollButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    setVisible(scrolled > 100);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
  }, []);

  return (
    <Button
      title="Scroll to top"
      size="sm"
      variant="outline-secondary"
      className={`top-scroll position-fixed ${visible ? "d-inline" : "d-none"}`}
      onClick={scrollToTop}
    >
      <i className="fa fa-arrow-up" />
    </Button>
  );
};

export const scrollToError = (selector) => {
  return (
    selector &&
    selector.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    })
  );
};

export const selectCustomStyles = {
  control: () => {
    return {
      border: "4px solid red",
      borderRadius: "4px",
      borderWidth: "1px"
    };
  }
};

export const scrollToNewData = (usrData, resultSize) => {
  let newRowAdded;
  newRowAdded = document.getElementById(usrData[resultSize - 1].id);
  if (newRowAdded) {
    newRowAdded.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
    newRowAdded.bgColor = "#dbe8f7";

    setTimeout(function () {
      newRowAdded.bgColor = "";
    }, 8000);
  }
};

export const ContentLoader = (props) => {
  const { size } = props;
  return (
    <Row>
      <Col sm={12}>
        <center>
          <i
            className="fa fa-spinner fa-pulse fa-lg fa-fw"
            style={{ fontSize: size, color: "#505054" }}
          ></i>
        </center>
      </Col>
    </Row>
  );
};

export { Loader };
