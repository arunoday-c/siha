import React, { Component } from "react";

import Label from "../Wrapper/label";

import Enumerable from "linq";

class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      single: "",
      disabled: false
    };
  }

  componentWillReceiveProps(props) {
    if (props.selector.dataSource.data !== undefined) {
      const item = new Enumerable.from(props.selector.dataSource.data)
        .where(
          w =>
            String(w[this.props.selector.dataSource.textField])
              .toUpperCase()
              .trim() ===
            String(props.selector.value)
              .toUpperCase()
              .trim()
        )
        .lastOrDefault();

      if (item !== undefined) {
        this.setState({
          single: item[this.props.selector.dataSource.textField]
        });
      }
    }
  }

  componentDidMount() {
    if (this.props.selector.dataSource.data !== undefined) {
      const item = new Enumerable.from(this.props.selector.dataSource.data)
        .where(
          w =>
            String(w[this.props.selector.dataSource.textField])
              .toUpperCase()
              .trim() ===
            String(this.props.selector.value)
              .toUpperCase()
              .trim()
        )
        .lastOrDefault();
      if (item !== undefined) {
        this.setState({
          single: item[this.props.selector.dataSource.textField]
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.selector.value !== this.state.single ||
      (nextProps.selector.others != null &&
        nextProps.selector.others.disabled !== this.state.disabled) ||
      nextState !== this.state.single
    )
      return true;
    return false;
  }

  bluringEvent(e) {
    if (this.props.selector.userList !== undefined) {
      if (e.currentTarget.value !== "") {
        if (
          this.state.single === undefined ||
          this.state.single === null ||
          this.state.single === ""
        ) {
          this.props.selector.userList(e.currentTarget.value.split(","));
        }
      }
    }
  }

  onChangeSelectedDropDown(e) {
    const value = e.currentTarget.value;
    const name = e.currentTarget.name;
    const data = this.props.selector.dataSource.data;
    const item = new Enumerable.from(data)
      .where(
        w =>
          String(w[this.props.selector.dataSource.textField])
            .toUpperCase()
            .trim() ===
          String(value)
            .toUpperCase()
            .trim()
      )
      .lastOrDefault();

    if (item !== undefined) {
      this.setState({ single: value }, () => {
        this.props.selector.onChange({
          selected: item,
          value: item[this.props.selector.dataSource.valueField],
          name: name
        });
      });
    } else {
      this.setState({ single: value });
    }
  }
  clearInput(e) {
    this.setState({ single: "" });
  }
  renderAutoComplete = () => {
    const data =
      this.props.selector.dataSource.data === undefined
        ? []
        : this.props.selector.dataSource.data;
    return (
      <div className="autoselect-Div">
        <input
          className="autoselect-input"
          list={this.props.selector.name}
          placeholder="Select.."
          onChange={this.onChangeSelectedDropDown.bind(this)}
          value={this.state.single}
          name={this.props.selector.name}
          {...this.props.selector.others}
        />
        <i
          className="fas fa-times-circle"
          onClick={this.clearInput.bind(this)}
        />
        <datalist id={this.props.selector.name}>
          {data.map((item, index) => (
            <option
              key={index}
              data-index={index}
              data-value={item[this.props.selector.dataSource.valueField]}
            >
              {this.props.selector.template === undefined
                ? item[this.props.selector.dataSource.textField]
                : this.props.selector.template}
            </option>
          ))}
        </datalist>
      </div>
      // <TextField
      //   fullWidth
      //   placeholder="Select multiple countries"
      //   style={{ background: "#fbfbfb" }}
      //   InputProps={{
      //     inputComponent: () => {
      //       return (
      //         <Select
      //           labelKey={this.props.selector.dataSource.textField}
      //           valueKey={this.props.selector.dataSource.valueField}
      //           name={this.props.selector.name}
      //           onChange={this.handleChange.bind(this)}
      //           value={this.state.single}
      //           options={this.props.selector.dataSource.data}
      //           multi={this.props.selector.multi}
      //           valueComponent={this.props.selector.valueComponet}
      //           optionComponent={this.props.selector.optionComponent}
      //           selectedValue={this.props.selector.value}
      //           onBlur={this.bluringEvent.bind(this)}
      //           clearable={false}
      //           {...this.props.selector.others}
      //         />
      //       );
      //     }
      //   }}
      //   error={this.props.error}
      //   helperText={this.props.helperText}
      // />
    );
  };

  renderLabel = () => {
    return <Label label={this.props.label} />;
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
        {this.renderAutoComplete()}
      </div>
    );
  }
}
export default AutoComplete;
