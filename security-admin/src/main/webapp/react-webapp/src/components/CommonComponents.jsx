import React, { Component } from "react";
import { Badge, ThemeProvider } from "react-bootstrap";
import { Field } from "react-final-form";

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
        <div className="col-sm-2 invalid-field">{error}</div>
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

export { Loader };
