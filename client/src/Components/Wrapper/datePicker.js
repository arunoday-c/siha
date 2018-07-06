import React, { Component } from "react";
import Label from "../Wrapper/label";
import { TextField, FormControl } from "material-ui";
import moment from "moment";
import DayPickerInput from "react-day-picker/DayPickerInput";
import MomentLocaleUtils from "react-day-picker/moment";
import "react-day-picker/lib/style.css";
import "../Wrapper/wrapper.css";
// import "moment/locale/ar";
import { getCookie } from "../../utils/algaehApiCall.js";

// import InputAdornment from "@material-ui/core/InputAdornment";
// import Visibility from "@material-ui/icons/Visibility";
// import IconButton from "@material-ui/core/IconButton";
// import Person from "@material-ui/icons/Person";

export default class DateHandler extends Component {
  generateLabel = () => {
    if (this.props.label != null) {
      return <Label label={this.props.label} />;
    }
  };

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

  constructor(props) {
    super(props);
    this.state = {
      language: "en",
      value: new Date()
    };
    // let lang = getCookie("Language");
    // this.setState({
    //   language: lang === null ? lang : "en",
    //   value: this.props.value
    // });
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
      ? this.props.events.onChange(selected, this.props.textBox.name)
      : null;
  };

  renderDatePicker = () => {
    return (
      <div className="algaeh-datePicker">
        <TextField
          // style={{ minWidth: "100%", backgroundColor: "#fbfbfb" }}
          InputProps={{
            ...this.props.textBox.inputProps,
            ...{
              inputComponent: () => {
                return (
                  <DayPickerInput
                    value={this.props.value}
                    onDayChange={this.onDayChange.bind(this)}
                    className={this.props.textBox.className}
                    dayPickerProps={{
                      todayButton: "Today",
                      // localeUtils: MomentLocaleUtils,
                      // locale: this.state.language,
                      disabledDays: this.disabledStartDate.bind(this)
                    }}
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

  scriptRunning = () => {
    var datePickers = document.querySelectorAll("[datepickerfocus='true']");
    if (datePickers != null) {
      for (var i = 0; i < datePickers.length; i++) {
        datePickers[i].addEventListener("click", function(event) {
          this.previousSibling.firstChild.click();
        });
      }
    }
  };

  render() {
    if (this.props.div != null) {
      return (
        <div className={this.props.div.className} {...this.props.div.others}>
          {this.generateLabel()}
          {this.renderDatePicker()}
          <script> {this.scriptRunning()} </script>
        </div>
      );
    } else {
      return (
        <React.Fragment>
          {this.generateLabel()}
          {this.renderDatePicker()}
          <script> {this.scriptRunning()} </script>
        </React.Fragment>
      );
    }
  }
}
