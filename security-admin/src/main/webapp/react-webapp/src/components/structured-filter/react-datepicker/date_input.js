var React = require("react");
var moment = require("moment");
import createReactClass from "create-react-class";
import PropTypes from "prop-types";

var DateUtil = require("./util/date");

var DateInput = createReactClass({
  propTypes: {
    onKeyDown: PropTypes.func
  },

  getDefaultProps: function () {
    return {
      dateFormat: "YYYY-MM-DD"
    };
  },

  getInitialState: function () {
    return {
      value: this.safeDateFormat(this.props.date)
    };
  },

  componentDidMount: function () {
    this.toggleFocus(this.props.focus);
  },

  componentWillReceiveProps: function (newProps) {
    this.toggleFocus(newProps.focus);

    this.setState({
      value: this.safeDateFormat(newProps.date)
    });
  },

  toggleFocus: function (focus) {
    if (focus) {
      this.refs.entry.focus();
    } else {
      this.refs.entry.blur();
    }
  },

  handleChange: function (event) {
    var date = moment(event.target.value, this.props.dateFormat, true);

    this.setState({
      value: event.target.value
    });
  },

  safeDateFormat: function (date) {
    return !!date ? date.format(this.props.dateFormat) : null;
  },

  isValueAValidDate: function () {
    var date = moment(event.target.value, this.props.dateFormat, true);

    return date.isValid();
  },

  handleEnter: function (event) {
    if (this.isValueAValidDate()) {
      var date = moment(event.target.value, this.props.dateFormat, true);
      this.props.setSelected(new DateUtil(date));
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
        value={this.state.value}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        onFocus={this.props.onFocus}
        onChange={this.handleChange}
        className="datepicker__input"
        placeholder={this.props.placeholderText}
      />
    );
  }
});

// module.exports = DateInput;
export default DateInput;
