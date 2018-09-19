import React, { Component } from "react";
// import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import NumberFormat from "react-number-format";
import "./wrapper.css";
import Label from "../Wrapper/label";
export default class FormGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languageBind: null,
      textLanguageBind: null,
      value: null,
      error: false,
      helperText: "",
      disabled: false
    };
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

  componentWillMount() {
    let textTypeValue =
      this.props.textBox.decimal !== undefined
        ? 0.0
        : this.props.textBox.number !== undefined
          ? 0
          : "";

    this.setState({
      value: this.props.textBox.value
        ? this.props.textBox.value
        : textTypeValue,
      disabled:
        this.props.textBox.disabled !== undefined
          ? this.props.textBox.disabled
          : false
    });
  }
  componentWillReceiveProps(props) {
    if (
      props.textBox.value !== this.state.value ||
      props.textBox.error !== this.state.error ||
      props.textBox.helperText !== this.state.helperText ||
      props.textBox.disabled !== this.state.disabled
    ) {
      let textTypeValue =
        props.textBox.decimal !== undefined
          ? 0.0
          : props.textBox.number !== undefined
            ? 0
            : "";

      this.setState({
        value: props.textBox.value ? props.textBox.value : textTypeValue,
        error: props.textBox.error,
        helperText: props.textBox.helperText,
        disabled:
          props.textBox.disabled !== undefined ? props.textBox.disabled : false
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.textBox.value !== this.state.value ||
      nextProps.textBox.error !== this.state.error ||
      nextProps.textBox.helperText !== this.state.helperText ||
      nextProps.textBox.disabled !== this.state.disabled
    ) {
      return true;
    }

    return false;
  }

  textBoxRender = () => {
    if (this.props.textBox !== undefined) {
      if (this.props.textBox.decimal !== undefined) {
        return (
          <NumberFormat
            name={this.props.textBox.name}
            customInput={TextField}
            thousandSeparator={
              this.props.textBox.decimal.thousandSeparator === undefined
                ? ","
                : this.props.textBox.decimal.thousandSeparator
            }
            decimalSeparator={
              this.props.textBox.decimal.decimalSeparator === undefined
                ? "."
                : this.props.textBox.decimal.decimalSeparator
            }
            allowNegative={
              this.props.textBox.decimal.allowNegative === undefined
                ? true
                : this.props.textBox.decimal.allowNegative
            }
            decimalScale={
              this.props.textBox.decimal.decimalScale === undefined
                ? 2
                : this.props.textBox.decimal.decimalScale
            }
            fixedDecimalScale={true}
            onValueChange={
              this.props.textBox.events !== undefined
                ? this.props.textBox.events.onChange
                : () => {}
            }
            className={this.props.textBox.className}
            numberbox="true"
            prefix={this.props.textBox.decimal.prefix}
            suffix={this.props.textBox.decimal.suffix}
            value={
              this.props.textBox.value === undefined
                ? 0
                : this.props.textBox.value
            }
            disabled={this.state.disabled}
            ref={
              this.props.textBox.ref !== undefined
                ? ele => {
                    return this.props.textBox.ref(ele);
                  }
                : null
            }
            style={{ fontSize: "14px" }}
            {...this.props.textBox.others}
          />
        );
      } else if (this.props.textBox.number !== undefined) {
        return (
          <NumberFormat
            name={this.props.textBox.name}
            customInput={TextField}
            thousandSeparator={
              this.props.textBox.number.thousandSeparator === undefined
                ? ","
                : this.props.textBox.number.thousandSeparator
            }
            allowNegative={
              this.props.textBox.number.allowNegative === undefined
                ? true
                : this.props.textBox.number.allowNegative
            }
            onValueChange={
              this.props.textBox.events !== undefined
                ? this.props.textBox.events.onChange
                : () => {}
            }
            decimalScale={0}
            className={this.props.textBox.className}
            numberbox="true"
            value={this.props.textBox.value}
            prefix={this.props.textBox.number.prefix}
            suffix={this.props.textBox.number.suffix}
            ref={
              this.props.textBox.ref !== undefined
                ? ele => {
                    return this.props.textBox.ref(ele);
                  }
                : null
            }
            disabled={this.state.disabled}
            {...this.props.textBox.others}
          />
        );
      } else if (this.props.textBox.mask !== undefined) {
        return (
          <NumberFormat
            name={this.props.textBox.name}
            customInput={TextField}
            onValueChange={
              this.props.textBox.events !== undefined
                ? this.props.textBox.events.onChange
                : () => {}
            }
            decimalScale={0}
            className={this.props.textBox.className}
            value={this.props.textBox.value}
            format={this.props.textBox.mask.format}
            disabled={this.state.disabled}
            ref={
              this.props.textBox.ref !== undefined
                ? ele => {
                    return this.props.textBox.ref(ele);
                  }
                : null
            }
            {...this.props.textBox.others}
          />
        );
      } else {
        return (
          <TextField
            name={this.props.textBox.name}
            className={this.props.textBox.className}
            value={this.state.value}
            label={this.state.textLanguageBind}
            onChange={this.props.textBox.events.onChange}
            onBlur={this.props.textBox.events.onBlur}
            onFocus={this.props.textBox.events.onFocus}
            onKeyPress={this.props.textBox.events.onKeyPress}
            onKeyDown={this.props.textBox.events.onKeyDown}
            onKeyUp={this.props.textBox.events.onKeyUp}
            error={this.state.error}
            helperText={this.state.helperText}
            disabled={this.state.disabled}
            autoComplete={"off"}
            ref={
              this.props.textBox.ref !== undefined
                ? ele => {
                    return this.props.textBox.ref(ele);
                  }
                : null
            }
            {...this.props.textBox.others}
          />
        );
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
