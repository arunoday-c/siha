import React, { PureComponent } from "react";
// import Label from "./label";
import { AlgaehLabel as Label } from "algaeh-react-components";
// import "../Wrapper/autoComplete.scss";
// import Enumarable from "linq";
import isEqual from "lodash/isEqual";
import {
  checkSecurity,
  saveUserPrefernce,
  getUserPreferences,
} from "../../utils/GlobalFunctions";
import { Dropdown } from "semantic-ui-react";
class AutoComplete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasSecurity: false,
      value: null,
      data: [],
      loader: true,
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (this.state.hasSecurity) return;
    const _templtate =
      typeof props.selector.template === "function"
        ? (item) => {
            return props.selector.template(item);
          }
        : undefined;
    if (
      !isEqual(props.selector, this.props.selector) ||
      !isEqual(props.selector.dataSource.data, this.props.selector.dataSource)
    ) {
      const _estData = !Array.isArray(props.selector.dataSource.data)
        ? []
        : props.selector.dataSource.data;
      const _data = !props.selector.sort
        ? _estData
            .sort((a, b) => {
              return (
                "" + a[props.selector.dataSource.textField]
              ).localeCompare(b[props.selector.dataSource.textField]);
            })
            .map((item, index) => {
              return {
                key: index,
                value: item[props.selector.dataSource.valueField],
                text: item[props.selector.dataSource.textField],
                content:
                  _templtate === undefined ? undefined : _templtate(item),
                ...item,
              };
            })
        : _estData.map((item, index) => {
            return {
              key: index,
              value: item[props.selector.dataSource.valueField],
              text: item[props.selector.dataSource.textField],
              content: _templtate === undefined ? undefined : _templtate(item),
              ...item,
            };
          });

      this.setState({
        data: _data,
        loader: false,
      });

      if (props.compireoldprops === true) {
        if (props.selector.value !== this.props.selector.value) {
          this.setState({
            value: props.selector.value,
            loader: false,
          });
        }
      } else {
        this.setState({
          value: props.selector.value,
          loader: false,
        });
      }
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
        },
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
    const that = this;
    const _estData =
      this.props.selector.dataSource.data === undefined
        ? []
        : this.props.selector.dataSource.data;
    const _templtate =
      typeof that.props.selector.template === "function"
        ? (item) => {
            return that.props.selector.template(item);
          }
        : undefined;
    const _data = !this.props.selector.sort
      ? _estData
          .sort((a, b) => {
            return (
              "" + a[that.props.selector.dataSource.textField]
            ).localeCompare(b[that.props.selector.dataSource.textField]);
          })
          .map((item, index) => {
            return {
              key: index,
              value: item[that.props.selector.dataSource.valueField],
              text: item[that.props.selector.dataSource.textField],
              content: _templtate === undefined ? undefined : _templtate(item),
              ...item,
            };
          })
      : _estData.map((item, index) => {
          return {
            key: index,
            value: item[that.props.selector.dataSource.valueField],
            text: item[that.props.selector.dataSource.textField],
            content: _templtate === undefined ? undefined : _templtate(item),
            ...item,
          };
        });

    this.getFromUserPreferences(
      this.props.userPrefernce,
      this.props.selector.name,
      this.props.selector.value
    )
      .then((result) => {
        this.setState({
          value: result,
          data: _data,
          loader: false,
        });
      })
      .catch((e) => {
        this.setState({
          value: this.props.selector.value,
          data: _data,
          loader: false,
        });
      });
  }
  getFromUserPreferences(userPrefernce, name, currrentValue) {
    return new Promise((resolve, reject) => {
      if (
        userPrefernce === true &&
        (currrentValue === "" ||
          currrentValue === undefined ||
          currrentValue === null)
      ) {
        getUserPreferences({ name: name })
          .then((result) => {
            if (Object.keys(result).length > 0) {
              resolve(result.selectedValue);
            } else {
              resolve(currrentValue);
            }
          })
          .catch((e) => {
            reject(e);
          });
      } else {
        resolve(currrentValue);
      }
    });
  }
  setForUserPreferences(userPrefernce, name, currrentValue) {
    return new Promise((resolve, reject) => {
      if (
        userPrefernce === true &&
        (currrentValue !== "" ||
          currrentValue !== null ||
          currrentValue !== undefined)
      ) {
        saveUserPrefernce({ name: name, value: currrentValue })
          .then((result) => {
            resolve();
          })
          .catch((e) => {
            reject();
          });
      } else {
        resolve();
      }
    });
  }
  onDropdownChangeHandler(e, items) {
    const _isClear = e.currentTarget.className;
    if (_isClear === "dropdown icon clear") {
      this.setState(
        {
          value: items.value,
          name: this.props.selector.name,
        },
        () => {
          if (typeof this.props.selector.onClear === "function") {
            this.props.selector.onClear(this.props.selector.name);
          }
        }
      );
      return;
    }
    const _selector = items.options.find((f) => {
      return f.value === items.value;
    });

    this.setForUserPreferences(
      this.props.userPrefernce,
      this.props.selector.name,
      items.value
    );
    this.setState(
      {
        selected: _selector,
        value: items.value,
        name: this.props.selector.name,
      },
      () => {
        if (typeof this.props.selector.onChange === "function") {
          this.props.selector.onChange({
            selected: _selector,
            value: items.value,
            name: this.props.selector.name,
          });
        }
      }
    );
  }

  renderAutoComplete = () => {
    const _enableMultiselect =
      this.props.selector.multiselect !== undefined
        ? { multiple: this.props.selector.multiselect }
        : {};
    const isDisable =
      this.props.selector.others !== undefined &&
      this.props.selector.others.disabled !== undefined
        ? this.props.selector.others.disabled
        : false;
    const _placeHolder =
      this.props.selector.placeholder === undefined
        ? "Select..."
        : this.props.selector.placeholder;
    const _orientation =
      this.props.selector.direction === undefined
        ? {}
        : { direction: this.props.selector.direction };
    const _noResultsMessage =
      this.props.selector.noResultsMessage === undefined
        ? "No results found."
        : this.props.selector.noResultsMessage;
    const _autocomplete =
      this.props.selector.autoComplete === undefined
        ? "nope"
        : this.props.selector.autoComplete;
    const _isImportant =
      this.props.label !== undefined && this.props.label.isImp !== undefined
        ? { algaeh_required: "" + this.props.label.isImp }
        : {};
    const _onClose =
      this.props.selector.onClose !== undefined
        ? { onClose: this.props.selector.onClose }
        : {};
    const referenceValue = {
      referencevalue: this.state.value,
    };

    return (
      <Dropdown
        disabled={isDisable}
        placeholder={_placeHolder}
        loading={this.state.loader}
        fluid
        lazyLoad
        deburr
        item
        search
        clearable
        selection
        inline
        selectOnBlur={false}
        searchInput={{
          autoComplete: _autocomplete,
          name: this.props.selector.name,
          ...referenceValue,
          data_role: "dropdownlist",
          type: "text",
          ..._isImportant,
          ...this.props.selector.others,
        }}
        noResultsMessage={_noResultsMessage}
        value={this.state.value}
        options={this.state.data}
        onChange={this.onDropdownChangeHandler.bind(this)}
        {..._orientation}
        {..._enableMultiselect}
        {..._onClose}
      />
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
