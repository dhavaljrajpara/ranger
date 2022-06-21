import React, { Component } from "react";
import createReactClass from "create-react-class";

var Day = require("./day");
var DateUtil = require("./util/date");
var moment = require("moment");

// var Calendar = createReactClass({
class Calendar extends Component {
  // mixins: [require("react-onclickoutside")],

  handleClickOutside() {
    this.props.hideCalendar();
  }

  getInitialState() {
    return {
      date: new DateUtil(this.props.selected).safeClone(moment())
    };
  }

  increaseMonth() {
    this.setState({
      date: this.state.date.addMonth()
    });
  }

  decreaseMonth() {
    this.setState({
      date: this.state.date.subtractMonth()
    });
  }

  weeks() {
    return this.state.date.mapWeeksInMonth(this.renderWeek);
  }

  handleDayClick(day) {
    this.props.onSelect(day);
  }

  renderWeek(weekStart, key) {
    if (!weekStart.weekInMonth(this.state.date)) {
      return;
    }

    return <div key={key}>{this.days(weekStart)}</div>;
  }

  renderDay(day, key) {
    var minDate = new DateUtil(this.props.minDate).safeClone(),
      maxDate = new DateUtil(this.props.maxDate).safeClone(),
      disabled = day.isBefore(minDate) || day.isAfter(maxDate);

    return (
      <Day
        key={key}
        day={day}
        date={this.state.date}
        onClick={this.handleDayClick.bind(this, day)}
        selected={new DateUtil(this.props.selected)}
        disabled={disabled}
      />
    );
  }

  days(weekStart) {
    return weekStart.mapDaysInWeek(this.renderDay);
  }

  render() {
    return (
      <div className="datepicker">
        <div className="datepicker__triangle"></div>
        <div className="datepicker__header">
          <a
            className="datepicker__navigation datepicker__navigation--previous"
            onClick={this.decreaseMonth}
          ></a>
          <span className="datepicker__current-month">
            {this.state.date.format("MMMM YYYY")}
          </span>
          <a
            className="datepicker__navigation datepicker__navigation--next"
            onClick={this.increaseMonth}
          ></a>
          <div>
            <div className="datepicker__day">Mo</div>
            <div className="datepicker__day">Tu</div>
            <div className="datepicker__day">We</div>
            <div className="datepicker__day">Th</div>
            <div className="datepicker__day">Fr</div>
            <div className="datepicker__day">Sa</div>
            <div className="datepicker__day">Su</div>
          </div>
        </div>
        <div className="datepicker__month">{this.weeks()}</div>
      </div>
    );
  }
}

// module.exports = Calendar;
export default Calendar;
