import React, { Component } from "react";
// import ClearIcon from "@material-ui/icons/Clear";
// import CancelIcon from "@material-ui/icons/Cancel";
// import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
//import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Select from "react-select";
import Label from "../Wrapper/label";
import "react-select/dist/react-select.css";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const ITEM_HEIGHT = 48;
const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  chip: {
    margin: theme.spacing.unit / 4
  },
  // We had to use a lot of global selectors in order to style react-select.
  // We are waiting on https://github.com/JedWatson/react-select/issues/1679
  // to provide a much better implementation.
  // Also, we had to reset the default style injected by the library.
  "@global": {
    ".Select-control": {
      display: "flex",
      alignItems: "center",
      border: 0,
      height: "auto",
      background: "transparent",
      "&:hover": {
        boxShadow: "none"
      }
    },
    ".Select-multi-value-wrapper": {
      flexGrow: 1,
      display: "flex",
      flexWrap: "wrap",
      fontSize: "14px"
    },
    ".Select--multi .Select-input": {
      margin: 0
    },
    ".Select.has-value.is-clearable.Select--single > .Select-control .Select-value": {
      padding: 0
    },
    ".Select-noresults": {
      padding: theme.spacing.unit * 2
    },

    ".Select-placeholder, .Select--single .Select-value": {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      fontFamily: theme.typography.fontFamily,
      // fontSize: theme.typography.pxToRem(16),
      padding: 0
    },
    ".Select-placeholder": {
      opacity: 0.42,
      color: theme.palette.common.black
    },
    ".Select-menu-outer": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: "absolute",
      left: 0,
      top: `calc(100% + ${theme.spacing.unit}px)`,
      width: "100%",
      background: "#fbfbfb",
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5
    },
    ".Select.is-focused:not(.is-open) > .Select-control": {
      boxShadow: "none"
    },
    ".Select-menu": {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: "auto"
    },
    ".Select-menu div": {
      boxSizing: "content-box"
    },
    ".Select-arrow-zone, .Select-clear-zone": {
      color: theme.palette.action.active,
      cursor: "pointer",
      height: 21,
      width: 21,
      zIndex: 1
    },
    // Only for screen readers. We can't use display none.
    ".Select-aria-only": {
      position: "absolute",
      overflow: "hidden",
      clip: "rect(0 0 0 0)",
      height: 1,
      width: 1,
      margin: -1
    },
    ".Select": {
      width: "100%",
      padding: 0
    }
  }
});
class AutoComplete extends Component {
  handleChange = value => {
    if (value !== null) {
      this.props.selector.onChange({
        selected: value,
        value: value[this.props.selector.dataSource.valueField],
        name: this.props.selector.name
      });
    } else {
      this.setState({ single: null });
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      single: "",
      disabled: false
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      single: props.selector.value,
      disabled:
        props.selector.others != null
          ? props.selector.others.disabled == null
            ? false
            : props.selector.others.disabled
          : false
    });
  }

  componentWillMount() {
    this.setState({
      single: this.props.selector.value
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.selector.value !== this.state.single ||
      (nextProps.selector.others != null &&
        nextProps.selector.others.disabled != this.state.disabled) ||
      nextState != this.state.single
    )
      return true;
    return false;
  }

  renderAutoComplete = () => {
    return (
      <TextField
        fullWidth
        placeholder="Select multiple countries"
        style={{ background: "#fbfbfb" }}
        InputProps={{
          inputComponent: () => {
            return (
              <Select
                labelKey={this.props.selector.dataSource.textField}
                valueKey={this.props.selector.dataSource.valueField}
                name={this.props.selector.name}
                onChange={this.handleChange.bind(this)}
                value={this.state.single}
                options={this.props.selector.dataSource.data}
                multi={this.props.selector.multi}
                valueComponent={this.props.selector.valueComponet}
                optionComponent={this.props.selector.optionComponent}
                selectedValue={this.props.selector.value}
                clearable={false}
                {...this.props.selector.others}
              />
            );
          }
        }}
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
export default withStyles(styles)(AutoComplete);
