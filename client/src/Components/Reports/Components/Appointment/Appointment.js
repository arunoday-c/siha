import React, { Component } from "react";
import {
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import { APPT_TYPE } from "../../../../utils/GlobalVariables.json";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import FrontDesk from "../../../../Search/FrontDesk.json";

export default class Appointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: ""
    };
  }

  dropDownHandle(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  patientSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: FrontDesk
      },
      searchName: "patients",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        console.log("Selected Row:", row);
        this.setState({
          patient_code: row.patient_code,
          patient_id: row.hims_d_patient_id
        });
      }
    });
  }

  render() {
    const _myReportUI = this.props.ui;

    switch (_myReportUI) {
      case "availability":
        return (
          <div className="col-lg-12">
            <div className="row">
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ forceLabel: "From Date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "from_date"
                }}
                maxDate={new Date()}
                events={{
                  onChange: selectedDate => {
                    this.setState({
                      from_date: selectedDate
                    });
                  }
                }}
                value={this.state.from_date}
              />
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ forceLabel: "To Date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "to_date"
                }}
                maxDate={new Date()}
                events={{
                  onChange: selectedDate => {
                    this.setState({
                      to_date: selectedDate
                    });
                  }
                }}
                value={this.state.to_date}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Appointment Type",
                  isImp: true
                }}
                selector={{
                  name: "appt_type",
                  className: "select-fld",
                  value: this.state.appt_type,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: APPT_TYPE
                  },
                  onChange: this.dropDownHandle.bind(this)
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Appointment Type",
                  isImp: true
                }}
                selector={{
                  name: "appt_type",
                  className: "select-fld",
                  value: this.state.appt_type,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: APPT_TYPE
                  },
                  onChange: this.dropDownHandle.bind(this)
                }}
              />
            </div>
          </div>
        );

      case "appt_details_pat_wise":
        return (
          <div className="col-lg-12">
            <div className="row">
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ forceLabel: "From Date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "from_date"
                }}
                maxDate={new Date()}
                events={{
                  onChange: selectedDate => {
                    this.setState({
                      from_date: selectedDate
                    });
                  }
                }}
                value={this.state.from_date}
              />
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ forceLabel: "To Date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "to_date"
                }}
                maxDate={new Date()}
                events={{
                  onChange: selectedDate => {
                    this.setState({
                      to_date: selectedDate
                    });
                  }
                }}
                value={this.state.to_date}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Office / Branch",
                  isImp: true
                }}
                selector={{
                  name: "appt_type",
                  className: "select-fld",
                  value: this.state.appt_type,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: APPT_TYPE
                  },
                  onChange: this.dropDownHandle.bind(this)
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Patient Code",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "patient_code",
                  others: {
                    disabled: true
                  },
                  value: this.state.patient_code,
                  events: {
                    onChange: null
                  }
                }}
              />

              <div className="col-lg-1">
                <i
                  //onClick={this.getPatient.bind(this)}
                  onClick={this.patientSearch.bind(this)}
                  className="fas fa-search"
                  style={{ marginLeft: "-75%", cursor: "pointer" }}
                />
              </div>
            </div>
          </div>
        );

      default:
        return <div>Default</div>;
    }
  }
}
