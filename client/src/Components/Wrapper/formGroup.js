import React, { Component } from "react";
import PropTypes from "prop-types";
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
      helperText: ""
    };
  }

  important = () => {
    if (this.props.label.isImp != null && this.props.label.isImp == true) {
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
      value: this.props.textBox.value ? this.props.textBox.value : textTypeValue
    });
  }
  componentWillReceiveProps(props) {
    if (
      props.textBox.value !== this.state.value ||
      props.textBox.error !== this.state.error ||
      props.textBox.helperText !== this.state.helperText
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
        helperText: props.textBox.helperText
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.textBox.value !== this.state.value ||
      nextProps.textBox.error !== this.state.error ||
      nextProps.textBox.helperText !== this.state.helperText
    ) {
      console.log("inside should update true");
      return true;
    }

    return false;
  }

  textBoxRender = () => {
    if (this.props.textBox != null) {
      if (this.props.textBox.decimal != null) {
        return (
          <NumberFormat
            name={this.props.textBox.name}
            customInput={TextField}
            thousandSeparator={
              this.props.textBox.decimal.thousandSeparator == null
                ? ","
                : this.props.textBox.decimal.thousandSeparator
            }
            decimalSeparator={
              this.props.textBox.decimal.decimalSeparator == null
                ? "."
                : this.props.textBox.decimal.decimalSeparator
            }
            allowNegative={
              this.props.textBox.decimal.allowNegative == null
                ? true
                : this.props.textBox.decimal.allowNegative
            }
            decimalScale={
              this.props.textBox.decimal.decimalScale == null
                ? 2
                : this.props.textBox.decimal.decimalScale
            }
            fixedDecimalScale={true}
            onValueChange={
              this.props.textBox.events != null
                ? this.props.textBox.events.onChange
                : () => {}
            }
            className={this.props.textBox.className}
            numberbox="true"
            prefix={this.props.textBox.decimal.prefix}
            suffix={this.props.textBox.decimal.suffix}
            value={
              this.props.textBox.value == null ? 0 : this.props.textBox.value
            }
            disabled={
              this.props.textBox.disabled != null
                ? this.props.textBox.disabled
                : null
            }
            ref={
              this.props.textBox.ref != null
                ? ele => {
                    return this.props.textBox.ref(ele);
                  }
                : null
            }
            style={{ fontSize: "14px" }}
            {...this.props.textBox.others}
          />
        );
      } else if (this.props.textBox.number != null) {
        return (
          <NumberFormat
            name={this.props.textBox.name}
            customInput={TextField}
            thousandSeparator={
              this.props.textBox.number.thousandSeparator == null
                ? ","
                : this.props.textBox.number.thousandSeparator
            }
            allowNegative={
              this.props.textBox.number.allowNegative == null
                ? true
                : this.props.textBox.number.allowNegative
            }
            onValueChange={
              this.props.textBox.events != null
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
              this.props.textBox.ref != null
                ? ele => {
                    return this.props.textBox.ref(ele);
                  }
                : null
            }
            disabled={
              this.props.textBox.disabled != null
                ? this.props.textBox.disabled
                : null
            }
            {...this.props.textBox.others}
          />
        );
      } else if (this.props.textBox.mask != null) {
        return (
          <NumberFormat
            name={this.props.textBox.name}
            customInput={TextField}
            onValueChange={
              this.props.textBox.events != null
                ? this.props.textBox.events.onChange
                : () => {}
            }
            decimalScale={0}
            className={this.props.textBox.className}
            value={this.props.textBox.value}
            format={this.props.textBox.mask.format}
            disabled={
              this.props.textBox.disabled != null
                ? this.props.textBox.disabled
                : null
            }
            ref={
              this.props.textBox.ref != null
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
            disabled={
              this.props.textBox.disabled != null
                ? this.props.textBox.disabled
                : null
            }
            ref={
              this.props.textBox.ref != null
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
    if (this.props.div != null) {
      return this.props.div.others;
    }
  };

  render() {
    return (
      <div
        className={this.props.div != null ? this.props.div.className : null}
        {...this.renderOthers()}
      >
        {this.labelRender()}
        {this.textBoxRender()}
      </div>
    );
  }
}
