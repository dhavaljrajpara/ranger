var React = require("react");
import createReactClass from "create-react-class";
import onClickOutside from "react-onclickoutside";
import Datetime from "react-datetime";

var Calendar = onClickOutside(
  createReactClass({
    handleClickOutside: function () {
      this.props.hideCalendar();
    },

    render: function () {
      return (
        <Datetime
          ref="datetime"
          dateFormat="MM/DD/YYYY"
          timeFormat={false}
          closeOnSelect
          input={false}
          className="typehead-token-datetime"
          onChange={this.props.onSelect}
        />
      );
    }
  })
);

export default Calendar;
