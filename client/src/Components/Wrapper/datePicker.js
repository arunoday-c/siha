import React, { PureComponent } from "react";
import Label from "../Wrapper/label";
//import DayPickerInput from "react-date-picker";
import "../Wrapper/wrapper.css";
import { getCookie } from "../../utils/algaehApiCall.js";
import moment from "moment";
import config from "../../utils/config.json";
export default class DateHandler extends PureComponent {
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

  onDayChange = e => {
    this.props.events !== undefined &&
    typeof this.props.events.onChange === "function"
      ? this.props.events.onChange(
          moment(e.target.value, config.formators.date)._d,
          e.target.name
        )
      : null;
  };

  renderDatePicker = () => {
    const minDate =
      this.props.minDate !== undefined
        ? { min: moment(this.props.minDate).format(config.formators.date) }
        : {};
    const maxDate =
      this.props.maxDate !== undefined
        ? { max: moment(this.props.maxDate).format(config.formators.date) }
        : {};
    const value =
      this.state.value !== undefined
        ? this.state.value !== null
          ? moment(this.state.value).format(config.formators.date)
          : ""
        : "";
    const name =
      this.props.textBox.name !== undefined
        ? { name: this.props.textBox.name }
        : {};
    const _required =
      this.props.label !== undefined
        ? this.props.label.isImp !== undefined
          ? { required: this.props.label.isImp }
          : {}
        : {};
    return (
      <div className="algaeh-datePicker">
        <input
          type="date"
          value={value}
          {...name}
          {...maxDate}
          {...minDate}
          disabled={this.props.disabled}
          onChange={this.onDayChange.bind(this)}
          {...this.props.textBox.others}
          {..._required}
        />
        {/* <DayPickerInput
          value={this.state.value}
          onChange={this.onDayChange.bind(this)}
          disabled={this.props.disabled}
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          {...this.props.textBox.others}
        /> */}
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
