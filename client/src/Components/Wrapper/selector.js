import React, { Component } from "react";
import { Select, MenuItem } from "material-ui";
import Label from "../Wrapper/label";
export default class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      display: ""
    };
  }
  algaehChangeEvent = e => {
    let getKeyArray = Object.keys(e.target);
    let getKey = getKeyArray[1];
    this.props.selector.onChange({
      selected: e.target[getKey]["data"],
      value: e.target.value,
      selectedIndex: e.target[getKey]["index"],
      name: e.target.name
    });
    this.setState({ value: e.target.value });
  };

  plotTemplate = (row, textField, valueField) => {
    if (this.props.selector.template == null) {
      return row[textField];
    } else {
      return this.props.selector.template(row);
    }
  };

  generateMenu = () => {
    let getData = this.props.selector.dataSource;

    return getData.data.map((row, index) => (
      <MenuItem
        value={row[getData["valueField"]]}
        key={index}
        data={row}
        index={index}
      >
        {this.plotTemplate(row, getData["textField"], getData["valueField"])}
      </MenuItem>
    ));
  };
  componentWillReceiveProps(nextProps) {
    // debugger;
    this.setState({ value: nextProps.selector.value });
  }

  generateSelect = () => {
    if (this.props.selector != null) {
      return (
        <Select
          className={this.props.selector.className}
          value={this.state.value}
          onChange={this.algaehChangeEvent.bind(this)}
          inputProps={{
            name: this.props.selector.name
          }}
        >
          {this.generateMenu()}
        </Select>
      );
    } else return null;
  };
  generateLabel = () => {
    if (this.props.label != null) {
      return (
        <Label
          label={this.props.label}
        />
      );
    }
  };

  render() {
    return (
      <div className={this.props.div.className}>
        {this.generateLabel()}
        {this.generateSelect()}
      </div>
    );
  }
}
