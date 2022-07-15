var React = require("react");
import createReactClass from "create-react-class";
import PropTypes from "prop-types";

var DateInput = createReactClass({
  propTypes: {
    onKeyDown: PropTypes.func
  },

  componentDidMount: function () {
    this.toggleFocus(this.props.focus);
  },

  componentWillReceiveProps: function (newProps) {
    this.toggleFocus(newProps.focus);
  },

  toggleFocus: function (focus) {
    if (focus) {
      this.refs.entry.focus();
    } else {
      this.refs.entry.blur();
    }
  },

  handleKeyDown: function (event) {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        this.handleEnter(event);
        break;
      case "Backspace":
        this.props.onKeyDown(event);
        break;
    }
  },

  handleClick: function (event) {
    this.props.handleClick(event);
  },

  render: function () {
    return (
      <input
        ref="entry"
        type="text"
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        onFocus={this.props.onFocus}
        className="datepicker__input"
        placeholder={this.props.placeholderText}
      />
    );
  }
});

// module.exports = DateInput;
export default DateInput;
