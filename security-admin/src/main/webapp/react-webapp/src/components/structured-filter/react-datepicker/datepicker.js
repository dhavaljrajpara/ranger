var React = require("react");
import Popover from "./popover";
import Calendar from "./calendar";
import DateInput from "./date_input";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";

var DatePicker = createReactClass({
  propTypes: {
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func
  },

  getInitialState: function () {
    return {
      focus: true
    };
  },

  handleFocus: function () {
    this.setState({
      focus: true
    });
  },

  hideCalendar: function () {
    this.setState({
      focus: false
    });
  },

  handleSelect: function (date) {
    this.hideCalendar();
    this.setSelected(date);
  },

  setSelected: function (date) {
    this.props.onChange(date);
  },

  onInputClick: function () {
    this.setState({
      focus: true
    });
  },

  calendar: function () {
    if (this.state.focus) {
      return (
        <Popover>
          <Calendar
            onSelect={this.handleSelect}
            hideCalendar={this.hideCalendar}
          />
        </Popover>
      );
    }
  },

  render: function () {
    return (
      <div>
        <DateInput
          ref="dateinput"
          focus={this.state.focus}
          onFocus={this.handleFocus}
          onKeyDown={this.props.onKeyDown}
          handleClick={this.onInputClick}
          handleEnter={this.hideCalendar}
          setSelected={this.setSelected}
          hideCalendar={this.hideCalendar}
          placeholderText={this.props.placeholderText}
        />
        {this.calendar()}
      </div>
    );
  }
});

// module.exports = DatePicker;
export default DatePicker;
