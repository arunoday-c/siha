import React, { Component } from "react";
import { Paper, Button, TextField } from "material-ui";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import {
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../Components/Wrapper/algaehWrapper";

class DeptMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openFinderForm: "d-none",
      definer: "",
      fieldSelectorValue: "",
      fieldSelectorType: "%"
    };
  }
  openFinderFinder = e => {
    if (this.state.openFinderForm === "d-none")
      this.setState({ openFinderForm: "d-block", definer: "dropdown-toggle" });
    else this.setState({ openFinderForm: "d-none", definer: "" });
  };

  decideArraows = () => {
    if (this.state.openFinderForm === "d-block") {
      return <ArrowDropUp />;
    } else {
      return <ArrowDropDown />;
    }
  };

  render() {
    return (
      <Paper>
        <div className="row">
          <div className="col-lg-6">
            <TextField style={{ width: "100%" }} />
          </div>
          <div className="col-lg-6">
            <Button value="Show Search">Show Search</Button>
          </div>
        </div>
      </Paper>
    );
  }
}

export default DeptMaster;
