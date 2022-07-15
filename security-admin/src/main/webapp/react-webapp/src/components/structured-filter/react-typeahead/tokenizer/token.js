var React = require("react");
import createReactClass from "create-react-class";
import PropTypes from "prop-types";

/**
 * Encapsulates the rendering of an option that has been "selected" in a
 * TypeaheadTokenizer
 */
var Token = createReactClass({
  propTypes: {
    children: PropTypes.object,
    onRemove: PropTypes.func,
    categoryLabel: PropTypes.string
  },

  getInitialState: function () {
    return {
      isHovering: false
    };
  },

  handleMouseOver: function () {
    this.setState({
      isHovering: true
    });
  },

  handleMouseOut: function () {
    this.setState({
      isHovering: false
    });
  },

  render: function () {
    return (
      <div
        className={
          this.state.isHovering
            ? "typeahead-token typeahead-token-maybe-delete"
            : "typeahead-token"
        }
      >
        <span className="typeahead-token-label text-uppercase mr-2 font-weight-bold">
          {this.props.categoryLabel}
        </span>
        <span className="typeahead-token-value">
          {this.props.categoryValue}
        </span>
        {this._makeCloseButton()}
      </div>
    );
  },

  _makeCloseButton: function () {
    if (!this.props.onRemove) {
      return "";
    }
    return (
      <a
        className="typeahead-token-close ml-1"
        href="#"
        onClick={function (event) {
          this.props.onRemove(this.props.children);
          event.preventDefault();
        }.bind(this)}
      >
        <span
          className="typeahead-token-icon-close"
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
        ></span>
      </a>
    );
  }
});

export default Token;
