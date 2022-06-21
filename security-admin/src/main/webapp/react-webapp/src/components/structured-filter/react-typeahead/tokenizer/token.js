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
        {this.props.categoryLabel} {this.props.children["operator"]} "
        {this.props.categoryValue}"{this._makeCloseButton()}
      </div>
    );
  },

  _makeCloseButton: function () {
    if (!this.props.onRemove) {
      return "";
    }
    return (
      <a
        className="typeahead-token-close"
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
