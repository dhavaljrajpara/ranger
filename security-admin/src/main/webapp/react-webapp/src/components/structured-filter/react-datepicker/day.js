var React = require("react");
var moment = require("moment");
import createReactClass from "create-react-class";
var classNames = require("classnames");

var Day = createReactClass({
  handleClick: function (event) {
    if (this.props.disabled) return;

    this.props.onClick(event);
  },

  render: function () {
    let classes = classNames({
      datepicker__day: true,
      "datepicker__day--disabled": this.props.disabled,
      "datepicker__day--selected": this.props.day.sameDay(this.props.selected),
      "datepicker__day--today": this.props.day.sameDay(moment())
    });

    return (
      <div className={classes} onClick={this.handleClick}>
        {this.props.day.day()}
      </div>
    );
  }
});

// module.exports = Day;
export default Day;
