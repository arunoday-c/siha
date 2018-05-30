import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField } from "material-ui";
import NumberFormat from "react-number-format";
import $ from "jquery";
import "./wrapper.css";
export default class FormGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languageBind: null,
      textLanguageBind: null
    };
  }

  getTargetLanguage = (fieldName, callBack) => {
    if (fieldName != null && fieldName != "") {
      let fileImport = "./languages/" + this.props.language.fileName + ".json";

      $.getJSON(fileImport, data => {
        callBack(data[fieldName]);
        return;
      });
    } else {
      console.error("Label is missing with 'fieldName'");
    }
  };
  important = () => {
    if (this.props.label.isImp != null && this.props.label.isImp == true) {
      return <span className="imp">&nbsp;*</span>;
    } else {
      return null;
    }
  };
  labelRender = () => {
    if (this.props.label != null) {
      return (
        <label>
          {this.state.languageBind}
          {this.important()}
        </label>
      );
    } else {
      return null;
    }
  };

  textBoxRender = () => {
    if (this.props.textBox != null) {
      if (this.props.textBox.decimal != null) {
        return (
          <NumberFormat
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
            numberBox="true"
            prefix={this.props.textBox.decimal.prefix}
            suffix={this.props.textBox.decimal.suffix}
            value={this.props.textBox.value}
          />
        );
      } else if (this.props.textBox.number != null) {
        return (
          <NumberFormat
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
            numberBox="true"
            value={this.props.textBox.value}
            prefix={this.props.textBox.number.prefix}
            suffix={this.props.textBox.number.suffix}
          />
        );
      } else if (this.props.textBox.mask != null) {
        return (
          <NumberFormat
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
          />
        );
      } else {
        return (
          <TextField
            className={this.props.textBox.className}
            value={this.props.textBox.value}
            label={this.state.textLanguageBind}
            onChange={this.props.textBox.events.onChange}
            onBlur={this.props.textBox.events.onBlur}
            onFocus={this.props.textBox.events.onFocus}
            onKeyPress={this.props.textBox.events.onKeyPress}
            onKeyDown={this.props.textBox.events.onKeyDown}
            onKeyUp={this.props.textBox.events.onKeyUp}
          />
        );
      }
    } else {
      return null;
    }
  };
  componentWillMount() {
    if (this.props.label != null) {
      this.getTargetLanguage(this.props.label.fieldName, data => {
        this.setState({ languageBind: data });
      });
    } else {
      if (this.props.textBox.label != null) {
        this.getTargetLanguage(this.props.textBox.label.fieldName, data => {
          this.setState({ textLanguageBind: data });
        });
      }
    }
  }
  render() {
    return (
      <div className={this.props.div.className}>
        {this.labelRender()}
        {this.textBoxRender()}
      </div>
    );
  }
}
FormGroup.propTypes = {
  label: PropTypes.object,
  textBox: PropTypes.object,
  div: PropTypes.object,
  language: PropTypes.object
};
