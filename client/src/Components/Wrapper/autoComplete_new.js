import React, { PureComponent } from "react";
import Label from "./label";
import "../Wrapper/autoComplete.css";
import Enumarable from "linq";
import Select from "react-select";
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

  componentWillReceiveProps(props) {
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
          {/* <input
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
          /> */}
          <Select value={options.filter(({ id }) => id === this.props.value)}
          defaultInputValue={}
          
          />
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
