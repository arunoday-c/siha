import React, { PureComponent } from "react";
import Label from "../Wrapper/label";
import "../Wrapper/autoComplete.css";
import Enumarable from "linq";

class AutoComplete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: "",
      displayText: "",
      disabled: false,
      listState: "d-none",
      arrowIcon: "fa-angle-down",
      _sortData: [],
      multiselect: []
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillReceiveProps(props) {
    const _text = this.getTextByValue(
      props.selector.value,
      props.selector.dataSource.data
    );

    this.setState({
      displayValue: props.selector.value,
      displayText: _text,
      disabled: props.selector.disabled,
      _sortData: this.dataSorting("")
    });
  }

  onClickArrowIcon() {
    let data = {};
    if (
      this.state._sortData !== this.props.selector.dataSource.data ||
      this.state._sortData.length === 0
    ) {
      data = {
        _sortData: this.dataSorting("")
      };
    }
    if (this.state.listState === "d-block") {
      this.setState({
        listState: "d-none",
        arrowIcon: "fa-angle-down",
        ...data
      });
    } else {
      this.setState({
        listState: "d-block",
        arrowIcon: "fa-angle-up",
        ...data
      });
    }
  }

  onFocusTextbox(e) {
    let data = {};
    if (
      this.state._sortData !== this.props.selector.dataSource.data ||
      this.state._sortData.length === 0
    ) {
      data = {
        _sortData: this.dataSorting("")
      };
    }

    this.setState({
      listState: "d-block",
      arrowIcon: "fa-angle-up",
      ...data
    });
  }

  checkValueExistsInMultiSelect(item) {
    const _isExists = Enumarable.from(this.state.multiselect)
      .where(
        w => w.displayValue === item[this.props.selector.dataSource.valueField]
      )
      .firstOrDefault();
    if (_isExists !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  getTextByValue(value, passProps) {
    passProps = passProps || this.props.selector.dataSource.data;
    const _data = passProps === undefined ? [] : passProps;
    const _enableMultiselect =
      this.props.selector.multiselect !== undefined
        ? this.props.selector.multiselect
        : false;
    if (!_enableMultiselect) {
      const _dtl = Enumarable.from(_data)
        .where(
          w =>
            String(w[this.props.selector.dataSource.valueField]).trim() ===
            String(value).trim()
        )
        .firstOrDefault();

      if (_dtl !== undefined) {
        return _dtl[this.props.selector.dataSource.textField];
      } else {
        return "";
      }
    } else {
      let _values = "";
      const _valSplit = value;
      for (let i = 0; i < _valSplit.length; i++) {
        const _dtl = Enumarable.from(_data)
          .where(
            w =>
              String(w[this.props.selector.dataSource.valueField]).trim() ===
              String(_valSplit[i]).trim()
          )
          .firstOrDefault();
        if (_dtl !== undefined) {
          _values += String(_dtl[this.props.selector.dataSource.textField]);
        }
        if (i !== _valSplit.length - 1) _values += ",";
      }
      return _values;
    }
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
    const _required =
      this.props.label !== undefined
        ? this.props.label.isImp !== undefined
          ? { required: this.props.label.isImp }
          : {}
        : {};
    if (!_required) {
      this.setState({
        displayValue: this.props.selector.value,
        displayText: this.getTextByValue(this.props.selector.value),
        _sortData: this.dataSorting("")
      });
    } else {
      this.setState({
        displayValue: this.props.selector.value,
        displayText: this.getTextByValue(this.props.selector.value)
      });
    }
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside, false);
  }
  handleClickOutside(event) {
    if (!this.autoComp.contains(event.target)) {
      this.setState({
        listState: "d-none",
        arrowIcon: "fa-angle-down"
      });
    }
  }

  dropDownKeyDown(e) {
    if (e.keyCode == 38) {
      // up
      var selected = document.getElementsByClassName("myUL");
      document.getElementsByClassName("myUL li").removeClass("selected");

      // if there is no element before the selected one, we select the last one
      if (selected.prev().length == 0) {
        selected
          .siblings()
          .last()
          .addClass("selected");
      } else {
        // otherwise we just select the next one
        selected.prev().addClass("selected");
      }
    }
  }

  bluringEvent(e) {
    if (this.props.selector.userList !== undefined) {
      if (e.currentTarget.value !== "") {
        if (
          this.state.displayValue === undefined ||
          this.state.displayValue === null ||
          this.state.displayValue === ""
        ) {
          this.props.selector.userList(e.currentTarget.value.split(","));
        }
      }
    }
  }

  onAutoCompleteTextHandler(e) {
    const $this = this;
    const _value = e.target.value;
    $this.setState({
      displayText: _value,
      _sortData: $this.dataSorting(_value)
    });
  }

  renderTemplate(item, key) {
    if (this.props.selector.displayTemplate !== undefined) {
      return this.props.selector.displayTemplate(item, key);
    }
    return null;
  }

  dataSorting(text) {
    const data =
      this.props.selector.dataSource.data === undefined
        ? []
        : this.props.selector.dataSource.data;

    return Enumarable.from(data)
      .where(w =>
        String(w[this.props.selector.dataSource.textField])
          .toUpperCase()
          .includes(String(text).toUpperCase())
      )
      .toArray();
  }

  clearInput(e) {
    this.setState({ displayText: "", displayValue: "" }, () => {
      if (this.props.selector.onClear !== undefined) {
        this.props.selector.onClear(this.props.selector.name);
      }
    });
  }

  onListSelected(item, e) {
    const _enableMultiselect =
      this.props.selector.multiselect !== undefined
        ? this.props.selector.multiselect
        : false;

    const _value = item[this.props.selector.dataSource.valueField];
    const _text = item[this.props.selector.dataSource.textField];

    if (!_enableMultiselect) {
      this.setState(
        {
          listState: "d-none",
          displayValue: _value,
          displayText: _text,
          arrowIcon: "fa-angle-down"
        },
        () => {
          this.props.selector.onChange({
            selected: item,
            value: _value,
            name: this.props.selector.name
          });
        }
      );
    } else {
      let _multiselect = this.state.multiselect;
      const row = Enumarable.from(this.state.multiselect)
        .where(w => w.displayValue === _value)
        .firstOrDefault();
      const _index = _multiselect.indexOf(row);
      if (_index > -1) _multiselect.splice(_index, 1);
      else {
        _multiselect.push({
          displayValue: _value,
          displayText: _text,
          selected: item
        });
      }
      const _displayText = Enumarable.from(_multiselect)
        .select(s => s.displayText)
        .toArray()
        .join(",");
      const _displayValue = Enumarable.from(_multiselect)
        .select(s => s.displayValue)
        .toArray()
        .join(",");
      this.setState(
        {
          displayText: _displayText,
          displayValue: _displayValue,
          multiselect: _multiselect
        },
        () => {
          this.props.selector.onChange({
            arrayList: this.state.multiselect,
            name: this.props.selector.name
          });
        }
      );
    }
  }

  renderAutoComplete = () => {
    const _required =
      this.props.label !== undefined
        ? this.props.label.isImp !== undefined
          ? { required: this.props.label.isImp }
          : {}
        : {};
    const _enableMultiselect =
      this.props.selector.multiselect !== undefined
        ? this.props.selector.multiselect
        : false;
    const isDisable =
      this.props.selector.others !== undefined &&
      this.props.selector.others.disabled !== undefined
        ? this.props.selector.others.disabled
        : this.state.disabled;
    const _placeHolder =
      this.props.selector.placeholder === undefined
        ? "Select..."
        : this.props.selector.placeholder;
    return (
      <div
        className="autoselect-Div"
        ref={autoComp => (this.autoComp = autoComp)}
      >
        <span className="loadingSelect">
          <i className="fas fa-sync fa-spin" />
        </span>
        <div className="auto-suggestCntr">
          <input
            type="text"
            className="myInput"
            name={this.props.selector.name}
            placeholder={_placeHolder}
            title={_placeHolder}
            onFocus={this.onFocusTextbox.bind(this)}
            referencevalue={this.state.displayValue}
            value={this.state.displayText}
            disabled={isDisable}
            onChange={this.onAutoCompleteTextHandler.bind(this)}
            onBlur={this.bluringEvent.bind(this)}
            {...this.props.selector.others}
            autoComplete="off"
            {..._required}
          />
          {!isDisable ? (
            <React.Fragment>
              {this.state.displayText !== undefined &&
              this.state.displayText !== "" ? (
                <span className="clearall" onClick={this.clearInput.bind(this)}>
                  <i className="fas  fa-times-circle" />
                </span>
              ) : null}

              <span
                className="showall"
                onClick={this.onClickArrowIcon.bind(this)}
              >
                <i className={"fas " + this.state.arrowIcon} />
              </span>
              <ol className={"myUL " + this.state.listState}>
                {this.state._sortData.map((item, index) => (
                  <li
                    onClick={this.onListSelected.bind(this, item)}
                    key={index}
                  >
                    {!_enableMultiselect ? (
                      <span
                        value={item[this.props.selector.dataSource.valueField]}
                      >
                        {this.props.selector.displayTemplate !== undefined
                          ? this.renderTemplate.bind(this, item, index)
                          : item[this.props.selector.dataSource.textField]}
                      </span>
                    ) : (
                      <span className="customCheckbox">
                        <label
                          className="checkbox"
                          style={{ color: "rgb(33, 37, 41)" }}
                        >
                          <input
                            type="checkbox"
                            checked={this.checkValueExistsInMultiSelect(item)}
                          />
                          <span style={{ fontSize: " 0.8rem" }}>
                            {item[this.props.selector.dataSource.textField]}
                          </span>
                        </label>
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </React.Fragment>
          ) : (
            <React.Fragment />
          )}
        </div>
      </div>
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
