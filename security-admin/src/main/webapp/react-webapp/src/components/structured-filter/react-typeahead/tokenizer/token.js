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

  render: function () {
    return (
      <div className="typeahead-token">
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
        &#x00d7;
      </a>
    );
  }
});

export default Token;
