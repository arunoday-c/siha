import React, { Component } from "react";
import dept from "../DeptMaster/dept.css";
import { Select, MenuItem } from "material-ui";

class SelectField extends Component {
  constructor(args) {
    super(args);
    this.state = {
      values: [],
      Type: ""
    };
  }

  menuItems(data) {
    return data.map(dataValue => (
      <MenuItem value={dataValue.value} key={dataValue.key}>
        {dataValue.name}
      </MenuItem>
    ));
  }

  handleChange(event) {
    this.props.selected(event.target.value);
    this.setState({ Type: event.target.value });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({Type:nextProps.displayValue});
  }

  render() {
    return (
      <div>
        <Select
          className="select-fld"
          width="100%"
          value={this.state.Type}
          inputProps={{
            name: "Type"
          }}
          onChange={this.handleChange.bind(this)}
        >
          {this.menuItems(this.props.children)}
        </Select>
      </div>
    );
  }
}

export default SelectField;