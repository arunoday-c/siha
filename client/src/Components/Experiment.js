import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { algaehApiCall } from "../utils/algaehApiCall";
import AlgaehSearch from "../Components/Wrapper/globalSearch";
import {
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../Components/Wrapper/algaehWrapper";
var intervalId;
class DeptMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textboxField: "",
      openFinder: false,
      dropDownValue: "patient_code",
      loadedData: this.dummyRows(),
      gridData: this.dummyRows(),
      searchByDropDown: [
        { name: "Patient Code", value: "patient_code" },
        { name: "First Name", value: "patient_fname" },
        { name: "Middle Name", value: "patient_mname" },
        { name: "Last Name", value: "patient_lname" },
        { name: "Gender", value: "patient_gender" }
      ]
    };
  }

  dummyRows = () => {
    let arrayObj = [];
    for (var i = 0; i <= 20; i++) {
      arrayObj.push({
        patient_code: "PAT-A-" + i,
        patient_fname: "F Patient-" + i,
        patient_mname: "M Patient-" + i,
        patient_lname: "L Patient-" + i,
        patient_gender: i % 2 == 0 ? "M" : "F"
      });
    }
    return arrayObj;
  };
  //onClickAway={this.handleCloseFinder.bind(this)}
  openFinderForm = () => {
    return (
      <div className="col-lg-6">
        {/* <ClickAwayListener> */}
        <AlgaehDataGrid
          columns={[
            {
              fieldName: "patient_code",
              label: "Patient Code"
            },
            {
              fieldName: "patient_fname",
              label: "Patient First Name"
            },
            {
              fieldName: "patient_mname",
              label: "Patient Middle Name"
            },
            {
              fieldName: "patient_lname",
              label: "Patient Last Name"
            },
            {
              fieldName: "patient_gender",
              label: "Gender"
            }
          ]}
          dataSource={{
            data: this.state.gridData
          }}
          paging={{ page: 0, rowsPerPage: 5 }}
        />
        {/* </ClickAwayListener> */}
      </div>
    );
  };
  handleCloseFinder() {
    this.setState({
      openFinder: false
    });
  }
  handleOpenFinder() {
    AlgaehSearch({
      searchGrid: {
        columns: [
          {
            fieldName: "patient_code",
            label: "Patient Code"
          },
          {
            fieldName: "full_name",
            label: "Name"
          },
          {
            fieldName: "arabic_name",
            label: "Arabic Name"
          },
          {
            fieldName: "gender",
            label: "Gender"
          },
          {
            fieldName: "contact_number",
            label: "Contact Number"
          }
        ]
      },
      searchName: "patients",
      uri: "/gloabelSearch/get",
      inputs: "country_id=2",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        this.setState({ textboxField: row.patient_code });
      }
    });
  }

  handleSearchChange(e) {
    let filterData = this.state.loadedData.filter(f => {
      if (f[this.state.dropDownValue].indexOf(e.target.value) > -1) {
        return f;
      }
    });
    if (filterData.length === 0) {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        this.apiCallingFunction(e.target.value);
        clearInterval(intervalId);
      }, 500);
    } else this.setState({ gridData: filterData });
  }

  apiCallingFunction = contains => {
    algaehApiCall({
      uri: "/globalSearch",
      data: {
        fieldName: this.state.dropDownValue,
        fieldContains: contains
      },
      method: "GET",
      onSuccess: response => {
        if (response.data.success === true) {
          this.setState({
            loadedData: response.data.records,
            gridData: response.data.records
          });
        } else {
          console.error(response);
          alert(response.data.message);
        }
      },
      onFailure: data => {
        console.error(data);
        alert(data);
      }
    });
  };

  dropDownFilterBy() {
    return (
      <div className="col-lg-2">
        <AlagehAutoComplete
          selector={{
            className: "select-fld",
            value: this.state.dropDownValue,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: this.state.searchByDropDown
            },
            onChange: selected => {
              this.setState({ dropDownValue: selected.value });
            }
          }}
        />
      </div>
    );
  }

  render() {
    return (
      <Paper style={{ height: "700px" }}>
        <div className="row">
          <div className="col-lg-4">
            <TextField
              style={{ width: "100%" }}
              onChange={this.handleSearchChange.bind(this)}
              value={this.state.textboxField}
            />
          </div>
          {this.state.openFinder ? this.dropDownFilterBy() : null}

          <div className="col-lg-6">
            <Button
              value="Show Search"
              onClick={this.handleOpenFinder.bind(this)}
            >
              Show Search
            </Button>
          </div>
        </div>
        <div />
        {this.state.openFinder ? this.openFinderForm() : null}
      </Paper>
    );
  }
}

export default DeptMaster;
