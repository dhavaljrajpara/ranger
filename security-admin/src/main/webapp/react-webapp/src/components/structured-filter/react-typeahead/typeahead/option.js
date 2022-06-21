var React = require("react");
var classNames = require("classnames");
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

/**
 * A single option within the TypeaheadSelector
 */
var TypeaheadOption = createReactClass({
  propTypes: {
    customClasses: PropTypes.object,
    onClick: PropTypes.func,
    children: PropTypes.string
  },

  getDefaultProps: function () {
    return {
      customClasses: {},
      onClick: function (event) {
        event.preventDefault();
      }
    };
  },

  getInitialState: function () {
    return {
      hover: false
    };
  },

  render: function () {
    var classes = {
      hover: this.props.hover
    };
    classes[this.props.customClasses.listItem] =
      !!this.props.customClasses.listItem;
    var classList = classNames(classes);

    return (
      <li className={classList} onClick={this._onClick}>
        <a href="#" className={this._getClasses()} ref="anchor">
          {this.props.children}
        </a>
      </li>
    );
  },

  _getClasses: function () {
    var classes = {
      "typeahead-option": true
    };
    classes[this.props.customClasses.listAnchor] =
      !!this.props.customClasses.listAnchor;
    return classNames(classes);
  },

  _onClick: function (event) {
    event.preventDefault();
    return this.props.onClick();
  }
});

export default TypeaheadOption;
