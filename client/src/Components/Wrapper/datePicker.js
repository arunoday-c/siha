import React, { Component } from "react";
import Label from "../Wrapper/label";
import TextField from "@material-ui/core/TextField";
import DayPickerInput from "react-date-picker";
// import "react-day-picker/lib/style.css";
import "../Wrapper/wrapper.css";
import { getCookie } from "../../utils/algaehApiCall.js";

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
  isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }
  componentWillReceiveProps(nextProps) {
    let lang = getCookie("Language");
    this.setState({
      language: lang === null ? lang : "en",
      value: this.isValidDate(nextProps.value) ? nextProps.value : null
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

    // if (nextProps.value === this.state.value) return false;

    // return true;
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
        <TextField
          InputProps={{
            ...this.props.textBox.inputProps,
            ...{
              inputComponent: () => {
                return (
                  <DayPickerInput
                    value={this.state.value}
                    onChange={this.onDayChange.bind(this)}
                    className={this.props.textBox.className}
                    disabled={this.props.disabled}
                    maxDate={this.props.maxDate}
                    minDate={this.props.minDate}
                    {...this.props.textBox.others}
                  />
                );
              }
            }
          }}
          error={this.props.error}
          helperText={this.props.helperText}
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
