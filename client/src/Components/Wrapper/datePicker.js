import React, { Component } from "react";
import Label from "../Wrapper/label";
import DayPickerInput from "react-date-picker";
import "../Wrapper/wrapper.css";
import { getCookie } from "../../utils/algaehApiCall.js";
import moment from "moment";
export default class DateHandler extends Component {
  generateLabel = () => {
    if (this.props.label != null) {
      return <Label label={this.props.label} />;
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      language: "en",
      value: new Date()
    };
  }

  componentWillReceiveProps(nextProps) {
    let momentDate = nextProps.value ? moment(nextProps.value) : null;
    let lang = getCookie("Language");
    this.setState({
      language: lang === null ? lang : "en",
      value: momentDate ? (momentDate.isValid() ? momentDate._d : null) : null
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.value !== this.state.value ||
      (nextProps.disabled != null &&
        nextProps.disabled != this.state.disabled) ||
      nextState != this.state.value
    )
      return true;
    return false;
  }
  onDayChange = (selected, modifiers) => {
    this.props.events !== undefined &&
    typeof this.props.events.onChange === "function"
      ? this.props.events.onChange(selected, this.props.textBox.name)
      : null;
  };

  renderDatePicker = () => {
    return (
      <div className="algaeh-datePicker">
        <DayPickerInput
          value={this.state.value}
          onChange={this.onDayChange.bind(this)}
          disabled={this.props.disabled}
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          {...this.props.textBox.others}
        />
      </div>
    );
  };

  render() {
    if (this.props.div != null) {
      return (
        <div className={this.props.div.className} {...this.props.div.others}>
          {this.generateLabel()}
          {this.renderDatePicker()}
        </div>
      );
    } else {
      return (
        <React.Fragment>
          {this.generateLabel()}
          {this.renderDatePicker()}
        </React.Fragment>
      );
    }
  }
}
