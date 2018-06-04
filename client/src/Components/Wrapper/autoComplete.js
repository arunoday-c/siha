import React, { Component } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import CancelIcon from "@material-ui/icons/Cancel";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { MenuItem, Typography, Chip, Input } from "material-ui";
const suggestions = [
  { label: "Afghanistan" },
  { label: "Aland Islands" },
  { label: "Albania" },
  { label: "Algeria" },
  { label: "American Samoa" },
  { label: "Andorra" },
  { label: "Angola" },
  { label: "Anguilla" },
  { label: "Antarctica" },
  { label: "Antigua and Barbuda" },
  { label: "Argentina" },
  { label: "Armenia" },
  { label: "Aruba" },
  { label: "Australia" },
  { label: "Austria" },
  { label: "Azerbaijan" },
  { label: "Bahamas" },
  { label: "Bahrain" },
  { label: "Bangladesh" },
  { label: "Barbados" },
  { label: "Belarus" },
  { label: "Belgium" },
  { label: "Belize" },
  { label: "Benin" },
  { label: "Bermuda" },
  { label: "Bhutan" },
  { label: "Bolivia, Plurinational State of" },
  { label: "Bonaire, Sint Eustatius and Saba" },
  { label: "Bosnia and Herzegovina" },
  { label: "Botswana" },
  { label: "Bouvet Island" },
  { label: "Brazil" },
  { label: "British Indian Ocean Territory" },
  { label: "Brunei Darussalam" }
].map(suggestion => ({
  value: suggestion.label,
  label: suggestion.label
}));

export default class AutoComplete extends Component {
  handleClick = event => {
    this.props.onSelect(this.props.option, event);
  };

  render() {
    const { children, isFocused, isSelected, onFocus } = this.props;

    function SelectWrapped() {
      return (
        <Select
          optionComponent={Option}
          noResultsText={<Typography>{"No results found"}</Typography>}
          arrowRenderer={arrowProps => {
            return arrowProps.isOpen ? (
              <ArrowDropUpIcon />
            ) : (
              <ArrowDropDownIcon />
            );
          }}
          clearRenderer={() => <ClearIcon />}
          valueComponent={valueProps => {
            const { value, children, onRemove } = valueProps;

            const onDelete = event => {
              event.preventDefault();
              event.stopPropagation();
              onRemove(value);
            };

            if (onRemove) {
              return (
                <Chip
                  tabIndex={-1}
                  //  label={children}
                  //  className={classes.chip}
                  deleteIcon={
                    <CancelIcon
                    //onTouchEnd={onDelete}
                    />
                  }
                  //onDelete={onDelete}
                />
              );
            }

            return <div className="Select-value">{children}</div>;
          }}
        />
      );
    }

    return (
      <Input
        fullWidth
        inputComponent={SelectWrapped()}
        // value={this.state.single}
        // onChange={this.handleChange('single')}
        placeholder="Search a country (start with a)"
        id="react-select-single"
        inputProps={{
          name: "react-select-single",
          instanceId: "react-select-single",
          simpleValue: true,
          options: suggestions
        }}
      />
    );
  }
}
