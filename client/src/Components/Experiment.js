import React, { Component } from "react";
import { Paper, TextField, InputAdornment } from "material-ui";
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
        <center>
          <div className="col-lg-6">
            <div className="row">
              <div className="form-group next_actions">
                <i className="fas fa-step-backward" />
                <i className="fas fa-chevron-left" />
              </div>
              <div className="form-group col-lg-8">
                <TextField
                  // className={this.state.definer + " form-control"}
                  className="form-control"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        onClick={this.openFinderFinder.bind(this)}
                      >
                        {this.decideArraows()}
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <div className="form-group previous_actions">
                <i className="fas fa-chevron-right" />
                <i className="fas fa-step-forward" />
              </div>
              <div className="form-group print_actions">
                <i className="fas fa-search fa-2x" />
              </div>
            </div>
            <div className={this.state.openFinderForm}>
              <Paper>
                <div className="row">
                  <div className="col-lg-6">
                    <AlagehAutoComplete
                      selector={{
                        dataSource: {
                          textField: "text",
                          valueField: "value",
                          data: [
                            {
                              text: "Patient Code",
                              value: "hims_patient_code"
                            },
                            {
                              text: "Patient Name",
                              value: "hims_patient_Name"
                            },
                            { text: "Gender", value: "hims_patient_gender" },
                            { text: "Mobile No", value: "hims_patient_Mobile" }
                          ]
                        },
                        onChange: selector => {
                          this.setState({ fieldSelectorValue: selector.value });
                        }
                      }}
                      value={this.state.fieldSelectorValue}
                    />
                  </div>
                  <div className="col-lg-6">
                    <AlagehAutoComplete
                      selector={{
                        dataSource: {
                          textField: "text",
                          valueField: "value",
                          data: [
                            {
                              text: "Contains",
                              value: "%"
                            },
                            {
                              text: "Equals",
                              value: "="
                            },
                            { text: "Grater Than", value: ">" },
                            { text: "Less Than", value: "<" }
                          ]
                        },
                        onChange: selector => {
                          this.setState({ fieldSelectorType: selector.value });
                        }
                      }}
                      value={this.state.fieldSelectorValue}
                    />
                  </div>
                </div>
                <div className="row">
                  <AlgaehDataGrid />
                </div>
              </Paper>
            </div>
          </div>
        </center>
      </Paper>
    );
  }
}

export default DeptMaster;
