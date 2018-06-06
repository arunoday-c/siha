import React, { Component } from "react";
import Label from "../Wrapper/label";
import { TextField, FormControl } from "material-ui";
import moment from "moment";
import DayPickerInput from "react-day-picker/DayPickerInput";
import MomentLocaleUtils from "react-day-picker/moment";
import "react-day-picker/lib/style.css";
import "../Wrapper/wrapper.css";
import "moment/locale/ar";
import { getCookie } from "../../utils/algaehApiCall.js";
export default class DateHandler extends Component {
  generateLabel = () => {
    if (this.props.label != null) {
      return <Label label={this.props.label} />;
    }
  };

  // timePicker = () => {
  //   if (this.props.timePicker != null && this.props.timePicker.enable == true) {
  //     return <TimePickerPanel defaultValue={moment("00:00:00", "HH:mm:ss")} />;
  //   } else {
  //     return null;
  //   }
  // };
  // formator = () => {
  //   return this.props.format != null ? this.props.format : "DD-MM-YYYY";
  // };

  // calendar = () => {
  //   return (
  //     <Calendar
  //       format={this.formator()}
  //       onChange={this.dateHandlerOnChange.bind(this)}
  //       dateInputPlaceholder={this.formator()}
  //       disabledDate={this.disabledStartDate.bind(this)}
  //       timePicker={this.timePicker()}
  //     />
  //   );
  // };
  // dateHandlerOnChange = value => {
  //   if (this.props.events != null) this.props.events.onChange(value);
  // };
  disabledStartDate = selectedDate => {
    if (selectedDate != null) {
      if (this.props.minDate != null && this.props.maxDate != null) {
        let val = moment(selectedDate._d).isBetween(
          moment(this.props.minDate),
          moment(this.props.maxDate)
        );
        return val ? false : true;
      }
      if (this.props.datesBlock != null) {
        let val =
          this.props.datesBlock.indexOf(selectedDate.format("YYYYMMDD")) > -1;
        return val;
      }
    }
    if (this.props.minDate == null && this.props.maxDate == null) return false;

    let date = moment();
    if (!selectedDate) {
      return false;
    }
    if (this.props.minDate != null) {
      date = moment(this.props.minDate);
      return selectedDate.valueOf() <= date.valueOf();
    }
    if (this.props.maxDate != null) {
      date = moment(this.props.maxDate);
      return selectedDate.valueOf() >= date.valueOf();
    }
  };

  // renderDatePicker = () => {
  //   return (
  //     <DatePicker
  //       animation="slide-up"
  //       disabled={this.props.textBox.disabled}
  //       calendar={this.calendar()}
  //       defaultValue={
  //         this.props.value != null
  //           ? moment(this.props.value).format(this.formator())
  //           : null
  //       }
  //     >
  //       {({ value }) => {
  //         return (
  //           <TextField
  //             disabled={this.props.textBox.disabled}
  //             name={this.props.textBox.name}
  //             className={this.props.textBox.className}
  //             value={
  //               value != null ? value.format(this.formator()) : this.props.value
  //             }
  //             label={this.props.textBox.label}
  //             placeholder={this.formator()}
  //           />
  //         );
  //       }}
  //     </DatePicker>
  //   );
  // };

  // render() {
  //   return (
  //     <div className={this.props.div.className}>
  //       {this.generateLabel()}
  //       {this.renderDatePicker()}
  //     </div>
  //   );
  // }

  constructor(props) {
    super(props);
    this.state = {
      language: "en",
      value: null
    };
    let lang = getCookie("Language");
    this.setState({
      language: lang === null ? lang : "en",
      value: this.props.value
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== null) {
      this.setState({
        value: nextProps.value
      });
    }
    let lang = getCookie("Language");
    this.setState({
      language: lang === null ? lang : "en",
      value: this.props.value
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.value === this.state.value) return false;

    return true;
  }
  onDayChange = (selected, modifiers) => {
    this.props.events !== null
      ? this.props.events.onChange(selected, modifiers)
      : null;
  };
  renderDatePicker = () => {
    return (
      <TextField
        InputProps={{
          inputComponent: () => {
            return (
              <DayPickerInput
                value={this.state.value}
                onDayChange={this.onDayChange.bind(this)}
                className={this.props.textBox.className}
                dayPickerProps={{
                  todayButton: "Today",
                  localeUtils: MomentLocaleUtils,
                  locale: this.state.language,
                  disabledDays: this.disabledStartDate.bind(this)
                }}
              />
            );
          }
        }}
      />
    );
  };
  render() {
    return (
      <div className={this.props.div.className}>
        {this.generateLabel()}
        {this.renderDatePicker()}
      </div>
    );
  }
}
