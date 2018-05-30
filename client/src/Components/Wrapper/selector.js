import React, { Component } from "react";
import { Select, MenuItem } from "material-ui";
import Label from "../Wrapper/label";
export default class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: []
    };
  }
  algaehChangeEvent = e => {
    debugger;
    this.setState({ value: e.target.value });
    this.props.selector.onChange(e);
  };

  generateMenu = () => {
    if (this.props.selector.template == null) {
      let getData = this.props.selector.dataSource;
      return getData.data.map((row, index) => (
        <MenuItem value={row[getData["valueField"]]} key={index}>
          {row[getData["textField"]]}
        </MenuItem>
      ));
    } else {
      return this.props.selector.template;
    }
  };

  generateSelect = () => {
    if (this.props.selector != null) {
      return (
        <Select
          {...this.props.selector.other}
          className={this.props.selector.className}
          value={this.state.value}
          onChange={this.algaehChangeEvent.bind(this)}
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
          label={{
            fieldName: this.props.label.fieldName,
            language: { fileName: this.props.label.language.fileName },
            isImp: this.props.label.isImp
          }}
        />
      );
    }
  };
  componentWillReceiveProps(nextProps) {
    debugger;
    this.setState({ value: nextProps.selector.value });
  }

  render() {
    return (
      <div className={this.props.div.className}>
        {this.generateLabel()}
        {this.generateSelect()}
      </div>
    );
  }
}
