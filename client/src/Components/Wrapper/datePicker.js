import React, { PureComponent } from "react";
import Label from "../Wrapper/label";
import { getCookie, swalMessage } from "../../utils/algaehApiCall.js";
import moment from "moment";
import config from "../../utils/config.json";
import { checkSecurity } from "../../utils/GlobalFunctions";
// import "../../../node_modules/hijri-date-picker/build/css/index.scss";
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
      value: momentDate,
      hasSecurity: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.hasSecurity) return;
    let momentDate = nextProps.value ? moment(nextProps.value) : null;
    let lang = getCookie("Language");
    this.setState({
      language: lang === null ? lang : "en",
      value: momentDate ? (momentDate.isValid() ? momentDate._d : null) : null,
    });
  }

  componentDidMount() {
    const _hasSecurity = this.getSecurityCheck();
    if (_hasSecurity) {
      this.setState({ hasSecurity: true });
      return;
    }
  }

  getSecurityCheck() {
    let hasSecurity = false;
    if (this.props.textBox.security !== undefined) {
      const _security = this.props.textBox.security;

      checkSecurity({
        securityType: "element",
        component_code: _security.component_code,
        module_code: _security.module_code,
        screen_code: _security.screen_code,
        screen_element_code: _security.screen_element_code,
        hasSecurity: () => {
          hasSecurity = true;
        },
      });
    }
    return hasSecurity;
  }

  onDayChange = (e) => {
    if (this.props.singleOutput === undefined) {
      if (
        this.props.events !== undefined &&
        typeof this.props.events.onChange === "function"
      ) {
        const configType =
          this.props.type !== undefined && this.props.type === "time"
            ? config.formators.time
            : config.formators.date;
        this.props.events.onChange(
          moment(e.target.value, configType)._d,
          e.target.name
        );
      }
    } else {
      if (
        this.props.events !== undefined &&
        typeof this.props.events.onChange === "function"
      ) {
        const configType =
          this.props.type !== undefined && this.props.type === "time"
            ? config.formators.time
            : config.formators.date;
        this.props.events.onChange({
          value: moment(e.target.value, configType)._d,
          name: e.target.name,
        });
      }
    }
  };

  dateValidation = (e) => {
    const { name, value } = e.target;
    const { dontAllow } = this.props;
    let test, title;
    if (dontAllow === "future") {
      test = moment(value).isAfter(moment(), "day");
      title = "Future date not allowed";
    }
    if (dontAllow === "past") {
      test = moment(value).isBefore(moment(), "day");
      title = "Past date not allowed";
    }
    if (test) {
      swalMessage({
        title,
        type: "error",
      });
      this.setState(
        {
          value: null,
        },
        () => this.props.events.onChange(this.state.value, name)
      );
    }
  };

  onBlur = (e) => {
    if (this.props.events !== undefined) {
      const configType =
        this.props.type !== undefined && this.props.type === "time"
          ? config.formators.time
          : config.formators.date;
      if (typeof this.props.events.onBlur === "function") {
        this.props.events.onBlur(moment(e.target.value, configType)._d, e);
      } else {
        const { dontAllow } = this.props;
        if (typeof dontAllow === "string") {
          this.dateValidation(e);
        }
      }
    }
  };

  renderDatePicker = () => {
    const minDate =
      this.props.minDate !== undefined
        ? {
            min: moment(this.props.minDate).format(
              this.props.type !== undefined && this.props.type === "time"
                ? config.formators.time
                : config.formators.date
            ),
          }
        : {};
    const maxDate =
      this.props.maxDate !== undefined
        ? {
            max: moment(this.props.maxDate).format(
              this.props.type !== undefined && this.props.type === "time"
                ? config.formators.time
                : config.formators.date
            ),
          }
        : {};
    const value =
      this.state.value !== undefined
        ? this.state.value !== null
          ? moment(this.state.value).format(
              this.props.type !== undefined && this.props.type === "time"
                ? config.formators.time
                : config.formators.date
            )
          : ""
        : "";
    const name =
      this.props.textBox.name !== undefined
        ? { name: this.props.textBox.name }
        : {};

    const _required =
      this.props.label !== undefined
        ? this.props.label.isImp !== undefined
          ? { algaeh_required: this.props.label.isImp.toString() }
          : {}
        : {};

    const _isHijri = this.props.textBox.hijri !== undefined ? true : false;
    const _type = this.props.type !== undefined ? this.props.type : "date";
    return (
      <div className="algaeh-datePicker" {..._required}>
        {!_isHijri ? (
          <input
            data_role="datepicker"
            type={_type}
            value={value}
            {...name}
            {...maxDate}
            {...minDate}
            disabled={this.props.disabled}
            onChange={this.onDayChange}
            onBlur={this.onBlur}
            {...this.props.textBox.others}
          />
        ) : null}
      </div>
    );
  };

  render() {
    if (this.state.hasSecurity) return null;
    else {
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
}
