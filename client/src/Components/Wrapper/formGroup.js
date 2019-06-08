import React, { PureComponent } from "react";
import {
  checkSecurity,
  AlgaehOpenContainer
} from "../../utils/GlobalFunctions";
import "./wrapper.css";
import Label from "../Wrapper/label";
import Cleave from "cleave.js/react";
import NumberFormat from "react-number-format";
import { Input, TextArea } from "semantic-ui-react";
export default class FormGroup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      languageBind: null,
      textLanguageBind: null,
      value: null,
      error: false,
      helperText: "",
      disabled: false,
      hasSecurity: false,
      options: {
        thousandSeparator: ",",
        decimalSeparator: ".",
        decimalScale: 2,
        allowNegative: true
      },
      cardIcon: "fas fa-credit-card"
    };
    if (props.textBox.decimal !== undefined) {
      this.decimalOnChangeHandler = this.decimalOnChangeHandler.bind(this);
    }
  }

  important = () => {
    if (this.props.label.isImp != null && this.props.label.isImp === true) {
      return <span className="imp">&nbsp;*</span>;
    } else {
      return null;
    }
  };

  labelRender = () => {
    if (this.props.label !== undefined)
      return <Label label={this.props.label} />;
  };
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
        }
      });
    }
    return hasSecurity;
  }
  onKeyPressHandler(evt) {
    try {
      if (evt.keyCode === 69) return false;

      if (!isNaN(evt.target.min) && !isNaN(evt.target.value)) {
        if (parseFloat(evt.target.value) >= parseFloat(evt.target.min)) {
          if (evt.target.max === "") return true;
        } else {
          if (evt.target.value !== "") evt.target.value = evt.target.min;
          return false;
        }
      }
      if (!isNaN(evt.target.max) && !isNaN(evt.target.value)) {
        if (parseFloat(evt.target.value) <= parseFloat(evt.target.max)) {
          return true;
        } else {
          if (evt.target.value !== "") evt.target.value = evt.target.max;
          return false;
        }
      }
      return true;
    } catch (e) {
      return false;
    }

    // if (
    //   charCode > 31 &&
    //   (charCode < 48 || charCode > 57) &&
    //   this.state.decimal_separator_code !== charCode &&
    //   this.state.thousand_separator_code !== charCode
    // ) {
    //   if (!isNaN(evt.target.min) && !isNaN(evt.target.value)) {
    //     if (parseFloat(evt.target.value) >= parseFloat(evt.target.min)) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }
    //   if (!isNaN(evt.target.max) && !isNaN(evt.target.value)) {
    //     if (parseFloat(evt.target.value) <= parseFloat(evt.target.max)) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }
    //   return false;
    // }
    // return true;
  }

  getKeyCode(decimal) {
    decimal = decimal || false;

    try {
      // let settings = AlgaehOpenContainer(
      //   sessionStorage.getItem("CurrencyDetail")
      // );
      let settings = JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      );
      if (typeof settings === "string") {
        settings = JSON.parse(settings);
      }
      if (!decimal) {
        this.setState({
          decimal_separator_code: settings.decimal_separator.charCodeAt(0),
          thousand_separator_code: settings.thousand_separator.charCodeAt(0)
        });
      } else {
        this.setState({
          options: {
            thousandSeparator: settings.thousand_separator,
            decimalSeparator: settings.decimal_separator,
            decimalScale: parseInt(settings.decimal_places, 10),
            allowNegative: true,
            ...this.props.textBox.decimal
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  componentDidMount() {
    const _hasSecurity = this.getSecurityCheck();
    if (_hasSecurity) {
      this.setState({ hasSecurity: true });
      return;
    }
    if (this.props.textBox.number !== undefined) {
      this.getKeyCode(false);
    }
    if (this.props.textBox.decimal !== undefined) this.getKeyCode(true);
    this.setState({
      value: this.props.textBox.value,
      disabled:
        this.props.textBox.disabled !== undefined
          ? this.props.textBox.disabled
          : false
    });
  }
  componentWillReceiveProps(props) {
    if (this.state.hasSecurity) return;
    if (
      props.textBox.value !== this.state.value ||
      props.textBox.error !== this.state.error ||
      props.textBox.helperText !== this.state.helperText ||
      props.textBox.disabled !== this.state.disabled
    ) {
      this.setState({
        value: props.textBox.value,
        error: props.textBox.error,
        helperText: props.textBox.helperText,
        disabled:
          props.textBox.disabled !== undefined ? props.textBox.disabled : false
      });
    }
  }
  internalStateSetting(e) {
    this.setState({ value: e.currentTarget.value });
  }
  errorInvoid(e) {
    if (typeof this.props.textBox.helperText === "function") {
      e.target.setCustomValidity(
        this.props.textBox.helperText(e.currentTarget.value)
      );
    } else {
      e.target.setCustomValidity(this.props.textBox.helperText);
    }
  }

  cardTypeChangeHandler(type) {
    switch (type) {
      case "mastercard":
        this.setState({ cardIcon: "fab fa-cc-mastercard animated fadeIn" });
        break;
      case "visa":
        this.setState({ cardIcon: "fab fa-cc-visa animated fadeIn" });
        break;
      case "amex":
        this.setState({ cardIcon: " fab fa-cc-amex animated fadeIn" });
        break;
      case "diners":
        this.setState({ cardIcon: "fab fa-cc-diners-club animated fadeIn" });
        break;
      case "jcb":
        this.setState({ cardIcon: "fab fa-cc-jcb animated fadeIn" });
        break;

      case "discover":
        this.setState({ cardIcon: "fab fa-cc-discover animated fadeIn" });
        break;
      case "uatp":
        this.setState({ cardIcon: "fab fa-uniregistry animated fadeIn" });
        break;
      default:
        this.setState({ cardIcon: "fas fa-credit-card animated fadeIn" });
        break;
    }
  }

  decimalOnChangeHandler(e) {
    if (
      this.props.textBox.events !== undefined &&
      typeof this.props.textBox.events.onChange === "function"
    ) {
      this.props.textBox.events.onChange({
        target: {
          name: this.props.textBox.name,
          formattedValue: e.formattedValue,
          rawValue: e.value,
          value: e.floatValue
        }
      });
    }
  }

  textBoxRender = () => {
    const _class =
      this.props.textBox.className !== undefined
        ? { className: this.props.textBox.className }
        : {};
    const _value =
      this.state.value === undefined || this.state.value === null
        ? ""
        : this.state.value;
    if (this.props.textBox !== undefined) {
      const _disabled =
        this.props.textBox.disabled !== undefined
          ? { disabled: this.props.textBox.disabled }
          : {};
      const _required =
        this.props.label !== undefined
          ? this.props.label.isImp !== undefined
            ? { algaeh_required: "" + this.props.label.isImp }
            : {}
          : {};
      const _invalid =
        this.props.textBox.helperText !== undefined
          ? {
              onInvalid: this.errorInvoid.bind(this),
              onBlur: this.errorInvoid.bind(this)
            }
          : {};
      const _onChange =
        this.props.textBox.events !== undefined
          ? { onChange: this.props.textBox.events.onChange }
          : { onChange: this.internalStateSetting.bind(this) };
      if (this.props.textBox.decimal !== undefined) {
        return (
          <div className="ui input txt-fld">
            <NumberFormat
              name={this.props.textBox.name}
              {..._disabled}
              {..._required}
              {...this.props.textBox.others}
              {..._class}
              value={_value}
              thousandSeparator={this.state.options.thousandSeparator}
              decimalSeparator={this.state.options.decimalSeparator}
              decimalScale={this.state.options.decimalScale}
              allowNegative={this.state.options.allowNegative}
              fixedDecimalScale={true}
              // {..._onChange}
              onValueChange={this.decimalOnChangeHandler}
            />
          </div>
        );
      } else if (this.props.textBox.number !== undefined) {
        return (
          <Input
            type="number"
            name={this.props.textBox.name}
            value={_value}
            {..._onChange}
            {..._required}
            {..._disabled}
            {...this.props.textBox.others}
            {..._class}
            pattern="\d+((\.|,)\d+)?"
            onKeyUp={this.onKeyPressHandler.bind(this)}
          />
        );
      } else if (this.props.textBox.mask !== undefined) {
        return (
          <input
            type="number"
            step=".0"
            name={this.props.textBox.name}
            value={_value}
            {..._onChange}
            {..._disabled}
            {..._required}
            {...this.props.textBox.others}
            {..._class}
          />
        );
      } else if (this.props.textBox.card !== undefined) {
        const _options = {
          creditCard: true,
          delimiter: "-",
          onCreditCardTypeChanged: this.cardTypeChangeHandler.bind(this),
          ...this.props.textBox.card
        };
        return (
          <React.Fragment>
            <div className="ui input txt-fld">
              <Cleave
                options={_options}
                name={this.props.textBox.name}
                value={_value}
                {..._onChange}
                {..._required}
                {..._disabled}
                {...this.props.textBox.others}
                {..._class}
              />
              <span className={"creditCardIcon  " + this.state.cardIcon} />
            </div>
          </React.Fragment>
        );
      } else {
        const _isMultiline =
          this.props.textBox.others !== undefined
            ? this.props.textBox.others.multiline !== undefined
              ? true
              : false
            : false;
        if (_isMultiline === false)
          return (
            <Input
              // type="text"
              name={this.props.textBox.name}
              autoComplete="new-password"
              value={_value}
              {..._onChange}
              {..._disabled}
              {..._required}
              {..._invalid}
              {...this.props.textBox.others}
              {..._class}
            />
          );
        else {
          let _others = this.props.textBox.others;
          if (this.props.textBox.others !== undefined) {
            delete _others.multiline;
          }
          return (
            <TextArea
              name={this.props.textBox.name}
              autoComplete="new-password"
              value={_value}
              {..._onChange}
              {..._disabled}
              {..._required}
              {..._invalid}
              {..._others}
              {..._class}
            />
          );
        }
      }
    } else {
      return null;
    }
  };

  renderOthers = () => {
    if (this.props.div !== undefined) {
      return this.props.div.others;
    }
  };

  render() {
    if (this.state.hasSecurity) return null;
    else
      return (
        <div
          className={
            this.props.div !== undefined ? this.props.div.className : null
          }
          {...this.renderOthers()}
        >
          {this.labelRender()}
          {this.textBoxRender()}
        </div>
      );
  }
}
