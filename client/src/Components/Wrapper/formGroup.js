import React, { PureComponent } from "react";
// import PropTypes from "prop-types";
//import TextField from "@material-ui/core/TextField";
//import NumberFormat from "react-number-format";
import "./wrapper.css";
import Label from "../Wrapper/label";
export default class FormGroup extends PureComponent {
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

  // shouldComponentUpdate(nextProps, nextState) {
  //   debugger;
  //   if (
  //     nextProps.textBox.value !== this.state.value ||
  //     nextProps.textBox.error !== this.state.error ||
  //     nextProps.textBox.helperText !== this.state.helperText ||
  //     nextProps.textBox.disabled !== this.state.disabled
  //   ) {
  //     return true;
  //   }

  //   return false;
  // }

  errorInvoid(e) {
    if (typeof this.props.textBox.helperText === "function") {
      e.currentTarget.setCustomValidity(
        this.props.textBox.helperText(e.currentTarget.value)
      );
    } else {
      e.currentTarget.setCustomValidity(this.props.textBox.helperText);
    }
  }

  textBoxRender = () => {
    if (this.props.textBox !== undefined) {
      const _disabled =
        this.props.textBox.disabled !== undefined
          ? { disabled: this.props.textBox.disabled }
          : {};
      const _required =
        this.props.label !== undefined
          ? this.props.label.isImp !== undefined
            ? { required: this.props.label.isImp }
            : {}
          : {};
      const _invalid =
        this.props.textBox.helperText !== undefined
          ? {
              onInvalid: this.errorInvoid.bind(this),
              onBlur: this.errorInvoid.bind(this)
            }
          : {};
      if (this.props.textBox.decimal !== undefined) {
        return (
          <input
            type="number"
            step=".0"
            name={this.props.textBox.name}
            value={this.props.textBox.value}
            onChange={
              this.props.textBox.events !== undefined
                ? this.props.textBox.events.onChange
                : () => {}
            }
            {..._disabled}
            {..._required}
            {...this.props.textBox.others}
          />
        );
      } else if (this.props.textBox.number !== undefined) {
        return (
          <input
            type="number"
            step=".0"
            name={this.props.textBox.name}
            value={this.props.textBox.value}
            onChange={
              this.props.textBox.events !== undefined
                ? this.props.textBox.events.onChange
                : () => {}
            }
            {..._required}
            {..._disabled}
            {...this.props.textBox.others}
          />
        );
      } else if (this.props.textBox.mask !== undefined) {
        return (
          <input
            type="number"
            step=".0"
            name={this.props.textBox.name}
            value={this.props.textBox.value}
            onChange={
              this.props.textBox.events !== undefined
                ? this.props.textBox.events.onChange
                : () => {}
            }
            {..._disabled}
            {..._required}
            {...this.props.textBox.others}
          />
        );
      } else {
        return (
          <input
            type="text"
            name={this.props.textBox.name}
            value={this.state.value}
            onChange={this.props.textBox.events.onChange}
            {..._disabled}
            {..._required}
            {..._invalid}
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
