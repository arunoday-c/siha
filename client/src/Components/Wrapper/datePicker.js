import React, { PureComponent } from "react";
import Label from "../Wrapper/label";
import "../Wrapper/wrapper.css";
import { getCookie } from "../../utils/algaehApiCall.js";
import moment from "moment";
import config from "../../utils/config.json";

// import "../../../node_modules/hijri-date-picker/build/css/index.css";
export default class DateHandler extends PureComponent {
  generateLabel = () => {
    if (this.props.label != null) {
      return <Label label={this.props.label} />;
    }
  };

  constructor(props) {
    super(props);
    let momentDate = props.value ? moment(props.value) : null;
    this.state = {
      language: "en",
      value: momentDate
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
    if (this.props.singleOutput === undefined) {
      this.props.events !== undefined &&
      typeof this.props.events.onChange === "function"
        ? this.props.events.onChange(
            moment(e.target.value, config.formators.date)._d,
            e.target.name
          )
        : null;
    } else {
      this.props.events !== undefined &&
      typeof this.props.events.onChange === "function"
        ? this.props.events.onChange({
            value: moment(e.target.value, config.formators.date)._d,
            name: e.target.name
          })
        : null;
    }
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
    const _isHijri = this.props.textBox.hijri !== undefined ? true : false;
    return (
      <div className="algaeh-datePicker">
        {!_isHijri ? (
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
        ) : null}
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
