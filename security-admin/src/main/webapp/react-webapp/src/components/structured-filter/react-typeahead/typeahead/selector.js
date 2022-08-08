var React = window.React || require("react");
import TypeaheadOption from "./option";
var classNames = require("classnames");
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

/**
 * Container for the options rendered as part of the autocompletion process
 * of the typeahead
 */
var TypeaheadSelector = createReactClass({
  propTypes: {
    options: PropTypes.array,
    optionsLabel: PropTypes.array,
    header: PropTypes.string,
    customClasses: PropTypes.object,
    selectionIndex: PropTypes.number,
    onOptionSelected: PropTypes.func
  },

  getDefaultProps: function () {
    return {
      selectionIndex: null,
      customClasses: {},
      onOptionSelected: function (option) {}
    };
  },

  getInitialState: function () {
    return {
      selectionIndex: this.props.selectionIndex,
      selection: this.getSelectionForIndex(this.props.selectionIndex)
    };
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({ selectionIndex: null });
  },

  render: function () {
    var classes = {
      "typeahead-selector": true
    };
    classes[this.props.customClasses.results] =
      this.props.customClasses.results;
    var classList = classNames(classes);

    var results = this.props.options.map(function (result, i) {
      return (
        <TypeaheadOption
          ref={result}
          key={result}
          hover={this.state.selectionIndex === i}
          customClasses={this.props.customClasses}
          onClick={this._onClick.bind(this, result)}
        >
          {this._getOptionsLabel(result)}
        </TypeaheadOption>
      );
    }, this);
    return <ul className={classList}>{results}</ul>;
  },

  _getOptionsLabel: function (option) {
    if (this.props.header == "Category") {
      for (var i = 0; i < this.props.fullOptions.length; i++) {
        if (this.props.fullOptions[i].category == option) {
          return this.props.fullOptions[i].label;
        }
      }
    } else if (this.props.header == "Value") {
      var options = this._getCategoryOptions();
      if (options == null) {
        return [];
      } else {
        for (var i = 0; i < options().length; i++) {
          if (options()[i].value == option) {
            return options()[i].label;
          }
        }
      }
    }
    return option;
  },

  _getCategoryOptions: function () {
    for (var i = 0; i < this.props.fullOptions.length; i++) {
      if (this.props.fullOptions[i].category == this.props.currentCategory) {
        return this.props.fullOptions[i].options;
      }
    }
  },

  setSelectionIndex: function (index) {
    this.setState({
      selectionIndex: index,
      selection: this.getSelectionForIndex(index)
    });
  },

  getSelectionForIndex: function (index) {
    if (index === null) {
      return null;
    }
    return this.props.options[index];
  },

  _onClick: function (result) {
    this.props.onOptionSelected(result);
  },

  _nav: function (delta) {
    if (!this.props.options) {
      return;
    }
    var newIndex;
    if (this.state.selectionIndex === null) {
      if (delta == 1) {
        newIndex = 0;
      } else {
        newIndex = delta;
      }
    } else {
      newIndex = this.state.selectionIndex + delta;
    }
    if (newIndex < 0) {
      newIndex += this.props.options.length;
    } else if (newIndex >= this.props.options.length) {
      newIndex -= this.props.options.length;
    }
    var newSelection = this.getSelectionForIndex(newIndex);
    this.setState({ selectionIndex: newIndex, selection: newSelection });
  },

  navDown: function () {
    this._nav(1);
  },

  navUp: function () {
    this._nav(-1);
  }
});

export default TypeaheadSelector;
