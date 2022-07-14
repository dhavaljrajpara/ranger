var React = require("react");

var Popover = require("./popover").default;
var DateUtil = require("./util/date").default;
var Calendar = require("./calendar").default;
var DateInput = require("./date_input").default;
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
    this.props.onChange(date.moment());
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
            selected={this.props.selected}
            onSelect={this.handleSelect}
            hideCalendar={this.hideCalendar}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
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
          date={this.props.selected}
          dateFormat={this.props.dateFormat}
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
