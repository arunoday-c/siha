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
      _sortData: [
        { value: "AL", label: "Alabama" },
        { value: "AK", label: "Alaska" },
        { value: "AS", label: "American Samoa" },
        { value: "AZ", label: "Arizona" },
        { value: "AR", label: "Arkansas" },
        { value: "CA", label: "California" },
        { value: "CO", label: "Colorado" },
        { value: "CT", label: "Connecticut" },
        { value: "DE", label: "Delaware" },
        { value: "DC", label: "District Of Columbia" },
        { value: "FM", label: "Federated States Of Micronesia" },
        { value: "FL", label: "Florida" },
        { value: "GA", label: "Georgia" }
      ]
    };
  }

  render() {
    return (
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={this.state._sortData[0]}
        isLoading={true}
        isClearable={true}
        isRtl={true}
        isSearchable={true}
        name="color"
        options={this.state._sortData}
      />
    );
  }
}
export default AutoComplete;
