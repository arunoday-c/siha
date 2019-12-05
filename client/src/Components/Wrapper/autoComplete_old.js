import React, { PureComponent } from "react";
import Label from "./label";
import "../Wrapper/autoComplete.scss";
import Enumarable from "linq";
import { checkSecurity } from "../../utils/GlobalFunctions";
class AutoComplete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: "",
      displayText: "",
      disabled: false,
      listState: "d-none",
      arrowIcon: "fa-angle-down",
      directonClass: "",
      _sortData: [],
      multiselect: [],
      hasSecurity: false,
      listSelectedLi: undefined
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (this.state.hasSecurity) return;
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
    this.setDropDirection();
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
        directonClass: "",
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
    this.setDropDirection();
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

  setDropDirection() {
    const _elementPositionFromTop = this.positionFromTop();
    const _distanceFromBottom = this.distanceFromBottom();
    const _menuHeight = this.menuHeight();

    if (_elementPositionFromTop > _distanceFromBottom) {
      if (_menuHeight < _distanceFromBottom) {
        this.setState({ directonClass: " dropDown" });
        return;
      }
      this.setState({ directonClass: " dropUp" });
    } else {
      this.setState({ directonClass: " dropDown" });
    }
  }
  positionFromTop() {
    const _element = this.autoComp;
    return _element.getBoundingClientRect().top;
  }
  menuHeight() {
    const _element = this.autoComp;
    return _element.querySelector(".myUL").childElementCount * 35;
  }

  distanceFromBottom() {
    const _element = this.autoComp;
    const _isGrid = this.autoComp.parentElement.parentNode.getAttribute(
      "data_role"
    );
    let windowHeight = window.innerHeight - 32;
    if (_isGrid === "grid") {
      windowHeight = this.autoComp.offsetParent.clientHeight;
    }
    let elementOffset = _element.getBoundingClientRect().top,
      distance = windowHeight - elementOffset;
    return distance;
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
  getSecurityCheck() {
    let hasSecurity = false;
    if (this.props.selector.security !== undefined) {
      const _security = this.props.selector.security;

      checkSecurity({
        securityType: "element",
        component_code: _security.component_code,
        module_code: _security.module_code,
        screen_code: _security.screen_code,
        screen_element_code: _security.screen_element_code,
        hasSecurity: () => {
          hasSecurity = true;
        }
      });
    }
    return hasSecurity;
  }
  componentDidMount() {
    const _hasSecurity = this.getSecurityCheck();
    if (_hasSecurity) {
      this.setState({ hasSecurity: true });
      return;
    }
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
        directonClass: "",
        arrowIcon: "fa-angle-down",
        listSelectedLi: undefined
      });
    }
  }

  handleKeyDownNavigation(e) {
    const prent = e.currentTarget.offsetParent.querySelector("ol");
    if (prent.childElementCount > 0) {
      const { listSelectedLi } = this.state;
      let selected = prent.children[0];
      if (e.keyCode === 40) {
        if (listSelectedLi !== undefined) {
          listSelectedLi.children[0].focus();
          selected = listSelectedLi;
        } else {
          prent.children[0].children[0].focus();
        }
        this.setState({ listSelectedLi: selected });
      }
    }
  }

  handleKeyDownListItems(e) {
    e.preventDefault();
    const { listSelectedLi } = this.state;
    if (listSelectedLi !== undefined) {
      if (e.keyCode === 40) {
        const next = listSelectedLi.nextSibling;
        if (next !== null) {
          this.setState({ listSelectedLi: next });

          next.children[0].focus();
        }
      } else if (e.keyCode === 38) {
        const prev = listSelectedLi.previousSibling;
        if (prev !== null) {
          this.setState({ listSelectedLi: prev });

          prev.children[0].focus();
        }
      } else if (e.keyCode === 13) {
        if (e.currentTarget.children.length > 0)
          e.currentTarget.children[0].click();
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
          directonClass: "",
          displayValue: _value,
          displayText: _text,
          arrowIcon: "fa-angle-down",
          listSelectedLi: undefined
        },
        () => {
          if (this.props.selector.onChange !== undefined)
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
          if (this.props.selector.onChange !== undefined)
            this.props.selector.onChange({
              arrayList: this.state.multiselect,
              name: this.props.selector.name
            });
        }
      );
    }
  }

  renderAutoComplete = () => {
    let _liIndex = undefined;
    if (this.state.listSelectedLi !== undefined) {
      _liIndex = this.state.listSelectedLi.getAttribute("li_key");
    }
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
    const _showLoader =
      this.props.showLoading !== undefined ? this.props.showLoading : false;
    const _autocomplete =
      this.props.selector.autoComplete !== undefined
        ? this.props.selector.autoComplete
        : "nope";
    return (
      <div
        // id={"internal_" + this.props.selector.name}
        className="autoselect-Div"
        ref={autoComp => (this.autoComp = autoComp)}
      >
        {_showLoader === true ? (
          <span className="loadingSelect">
            <i className="fas fa-sync fa-spin" />
          </span>
        ) : null}
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
            onKeyDown={this.handleKeyDownNavigation.bind(this)}
            onBlur={this.bluringEvent.bind(this)}
            {...this.props.selector.others}
            autoCorrect="off"
            autoComplete={_autocomplete}
            // autoComplete="new-password"
            {..._required}
            data_role="dropdownlist"
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
              <ol
                className={
                  "myUL " + this.state.listState + this.state.directonClass
                }
              >
                {this.state._sortData.map((item, index) => (
                  <li
                    className={
                      _liIndex !== undefined && index.toString() === _liIndex
                        ? "onselectedByNav"
                        : ""
                    }
                    li_key={index}
                    onClick={this.onListSelected.bind(this, item)}
                    key={index}
                    onKeyDown={this.handleKeyDownListItems.bind(this)}
                  >
                    {!_enableMultiselect ? (
                      <a
                        tabIndex={index + 1}
                        value={item[this.props.selector.dataSource.valueField]}
                      >
                        {this.props.selector.displayTemplate !== undefined
                          ? this.renderTemplate.bind(this, item, index)
                          : String(
                              item[this.props.selector.dataSource.textField]
                            )
                              .toString()
                              .trim()}
                      </a>
                    ) : (
                      <a className="customCheckbox">
                        <label
                          tabIndex={index + 1}
                          className="checkbox"
                          style={{ color: "rgb(33, 37, 41)" }}
                        >
                          <input
                            type="checkbox"
                            checked={this.checkValueExistsInMultiSelect(item)}
                          />
                          <span style={{ fontSize: " 0.8rem" }}>
                            {String(
                              item[this.props.selector.dataSource.textField]
                            )
                              .toString()
                              .trim()}
                          </span>
                        </label>
                      </a>
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
    if (this.state.hasSecurity) return null;
    else
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
