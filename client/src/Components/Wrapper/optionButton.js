import React, { Component } from "react";
import Label from "../Wrapper/label";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";

import extend from "extend";
export default class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      checked: false
    };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
    if (this.props.group.events != null)
      this.props.group.events.onChange(event);
  };
  renderLabel = () => {
    if (this.props.label != null) {
      return <Label label={this.props.label} />;
    }
  };

  orientationHorizontalVertical = () => {
    if (this.props.group.orientation != null) {
      if (this.props.group.orientation == "horizontal") {
        return {};
      }
    }
    return { display: "inline" };
  };
  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.group.value,
      [nextProps.group.changedName]: nextProps.group.value
    });
  }
  renderOptions = () => {
    if (this.props.group.controls != null) {
      return this.props.group.controls.map((row, index) => {
        return (
          <FormControlLabel
            value={row.value}
            control={<Radio color="primary" />}
            label={row.label}
            disabled={row.disabled == null ? false : true}
          />
        );
      });
    } else {
      return null;
    }
  };

  renderRadioGroup = () => {
    return (
      <RadioGroup
        name={this.props.group.name}
        style={this.orientationHorizontalVertical()}
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
        {...this.props.group.others}
      >
        {this.renderOptions()}
      </RadioGroup>
    );
  };

  renderCheckBox = () => {
    if (this.props.group.controls != null) {
      return this.props.group.controls.map((row, index) => {
        return (
          <FormControlLabel
            value={row.value}
            control={
              <Checkbox
                value={row.value}
                checked={row.checked}
                color="primary"
                onChange={row.events != null ? row.events.onChange : null}
                {...row.others}
              />
            }
            label={row.label}
            disabled={row.disabled == null ? false : true}
          />
        );
      });
    } else {
      return null;
    }
  };
  settingState(name, value) {
    value = value || false;
    if (name !== null) {
      let obj = new Object();
      obj[name] = value;
      extend(this.state, obj);
    }
  }

  renderSwitch = () => {
    if (this.props.group.controls != null) {
      return this.props.group.controls.map((row, index) => {
        {
          this.settingState(row.value, row.checked);
        }
        return (
          <FormControlLabel
            value={row.value}
            control={
              <Switch
                checked={this.state[row.value]}
                name={this.props.group.name + "_" + index}
                color="primary"
                onChange={row.events != null ? row.events.onChange : null}
                {...row.others}
              />
            }
            label={row.label}
            disabled={row.disabled == null ? false : true}
          />
        );
      });
    } else {
      return null;
    }
  };

  renderControl = () => {
    if (this.props.optionsType == "radio") return this.renderRadioGroup();
    else if (this.props.optionsType == "checkBox") return this.renderCheckBox();
    else if (this.props.optionsType == "switch") return this.renderSwitch();
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
        {this.renderLabel()}
        <br />
        {this.renderControl()}
      </div>
    );
  }
}
