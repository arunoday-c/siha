import React, { Component } from "react";
import {
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import { APPT_TYPE } from "../../../../utils/GlobalVariables.json";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import FrontDesk from "../../../../Search/FrontDesk.json";
import { reportHandler } from "../../ReportHandlers";

export default class Appointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: "",
      doctors: [],
      departments: [],
      all_docs: false,
      all_depts: false
    };
  }

  componentDidMount() {
    reportHandler(this).getDeptDocs();
  }

  changeChecks(e) {
    e.target.name === "all_docs"
      ? this.setState({
          [e.target.name]: !this.state.all_docs,
          employee_id: null,
          hims_d_sub_department_id: null
        })
      : this.setState({
          [e.target.name]: !this.state.all_depts,
          employee_id: null,
          hims_d_sub_department_id: null
        });
  }

  dropDownHandle(value) {
    value.name === "hims_d_sub_department_id"
      ? this.setState({
          [value.name]: value.value,
          doctors: value.selected.doctors
        })
      : // : value.name === "employee_id"
        // ? this.setState({
        //     [value.name]: value.value,
        //     departments: value.selected.departments
        //   })
        this.setState({
          [value.name]: value.value
        });
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
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

              <div className="col-lg-2" style={{ marginTop: 19 }}>
                <input
                  name="all_docs"
                  checked={this.state.all_docs}
                  type="checkbox"
                  style={{ marginRight: "5px" }}
                  onChange={this.changeChecks.bind(this)}
                />
                <label>All Doctors</label>
              </div>

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Doctors",
                  isImp: true
                }}
                selector={{
                  name: "employee_id",
                  className: "select-fld",
                  value: this.state.employee_id,
                  dataSource: {
                    textField: "full_name",
                    valueField: "employee_id",
                    data: this.state.doctors
                  },
                  onChange: this.dropDownHandle.bind(this),
                  others: {
                    disabled: this.state.all_docs
                  }
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
                  style={{
                    marginLeft: "-65%",
                    cursor: "pointer",
                    marginTop: "28px"
                  }}
                />
              </div>
            </div>
          </div>
        );

      case "appt_list":
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

              <AlagehFormGroup
                div={{ className: "col-lg-2" }}
                label={{
                  forceLabel: "From Time",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "from_time",
                  value: this.state.from_time,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },
                  others: {
                    type: "time"
                  }
                }}
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

              <AlagehFormGroup
                div={{ className: "col-lg-2" }}
                label={{
                  forceLabel: "To Time",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "to_time",
                  value: this.state.to_time,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },
                  others: {
                    type: "time"
                  }
                }}
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

              <div className="col-lg-2" style={{ marginTop: 19 }}>
                <input
                  name="all_depts"
                  checked={this.state.all_depts}
                  type="checkbox"
                  style={{ marginRight: "5px" }}
                  onChange={this.changeChecks.bind(this)}
                />
                <label>All Departments</label>
              </div>

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Department",
                  isImp: true
                }}
                selector={{
                  name: "hims_d_sub_department_id",
                  className: "select-fld",
                  value: this.state.hims_d_sub_department_id,
                  dataSource: {
                    textField: "sub_department_name",
                    valueField: "sub_department_id",
                    data: this.state.departments
                  },
                  onChange: this.dropDownHandle.bind(this),
                  others: {
                    disabled: this.state.all_depts
                  }
                }}
              />

              <div className="col-lg-2" style={{ marginTop: 19 }}>
                <input
                  name="all_docs"
                  checked={this.state.all_docs}
                  type="checkbox"
                  style={{ marginRight: "5px" }}
                  onChange={this.changeChecks.bind(this)}
                />
                <label>All Doctors</label>
              </div>

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Doctor",
                  isImp: true
                }}
                selector={{
                  name: "employee_id",
                  className: "select-fld",
                  value: this.state.employee_id,
                  dataSource: {
                    textField: "full_name",
                    valueField: "employee_id",
                    data: this.state.doctors
                  },
                  onChange: this.dropDownHandle.bind(this),
                  others: {
                    disabled: this.state.all_docs
                  }
                }}
              />
            </div>
          </div>
        );
      case "appt_cancellations":
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

              <AlagehFormGroup
                div={{ className: "col-lg-2" }}
                label={{
                  forceLabel: "From Time",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "from_time",
                  value: this.state.from_time,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },
                  others: {
                    type: "time"
                  }
                }}
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

              <AlagehFormGroup
                div={{ className: "col-lg-2" }}
                label={{
                  forceLabel: "To Time",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "to_time",
                  value: this.state.to_time,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },
                  others: {
                    type: "time"
                  }
                }}
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
              <div className="col-lg-2" style={{ marginTop: 19 }}>
                <input
                  name="all_depts"
                  checked={this.state.all_depts}
                  type="checkbox"
                  style={{ marginRight: "5px" }}
                  onChange={this.changeChecks.bind(this)}
                />
                <label>All Departments</label>
              </div>

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Department",
                  isImp: true
                }}
                selector={{
                  name: "hims_d_sub_department_id",
                  className: "select-fld",
                  value: this.state.hims_d_sub_department_id,
                  dataSource: {
                    textField: "sub_department_name",
                    valueField: "sub_department_id",
                    data: this.state.departments
                  },
                  onChange: this.dropDownHandle.bind(this),
                  others: {
                    disabled: this.state.all_depts
                  }
                }}
              />
              <div className="col-lg-2" style={{ marginTop: 19 }}>
                <input
                  name="all_docs"
                  checked={this.state.all_docs}
                  type="checkbox"
                  style={{ marginRight: "5px" }}
                  onChange={this.changeChecks.bind(this)}
                />
                <label>All Doctors</label>
              </div>

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Doctor",
                  isImp: true
                }}
                selector={{
                  name: "employee_id",
                  className: "select-fld",
                  value: this.state.employee_id,
                  dataSource: {
                    textField: "full_name",
                    valueField: "employee_id",
                    data: this.state.doctors
                  },
                  onChange: this.dropDownHandle.bind(this),
                  others: {
                    disabled: this.state.all_docs
                  }
                }}
              />
            </div>
          </div>
        );

      case "appt_list_detailed":
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

              <AlagehFormGroup
                div={{ className: "col-lg-2" }}
                label={{
                  forceLabel: "From Time",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "from_time",
                  value: this.state.from_time,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },
                  others: {
                    type: "time"
                  }
                }}
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

              <AlagehFormGroup
                div={{ className: "col-lg-2" }}
                label={{
                  forceLabel: "To Time",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "to_time",
                  value: this.state.to_time,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },
                  others: {
                    type: "time"
                  }
                }}
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

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Users",
                  isImp: true
                }}
                selector={{
                  name: "hims_d_sub_department_id",
                  className: "select-fld",
                  value: this.state.hims_d_sub_department_id,
                  dataSource: {
                    textField: "sub_department_name",
                    valueField: "hims_d_sub_department_id",
                    data: this.state.departments
                  },
                  onChange: this.dropDownHandle.bind(this)
                }}
              />

              <div className="col-lg-2" style={{ marginTop: 19 }}>
                <input
                  name="all_depts"
                  checked={this.state.all_depts}
                  type="checkbox"
                  style={{ marginRight: "5px" }}
                  onChange={this.changeChecks.bind(this)}
                />
                <label>All Departments</label>
              </div>

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Department",
                  isImp: true
                }}
                selector={{
                  name: "hims_d_sub_department_id",
                  className: "select-fld",
                  value: this.state.hims_d_sub_department_id,
                  dataSource: {
                    textField: "sub_department_name",
                    valueField: "sub_department_id",
                    data: this.state.departments
                  },
                  onChange: this.dropDownHandle.bind(this),
                  others: {
                    disabled: this.state.all_depts
                  }
                }}
              />

              <div className="col-lg-2" style={{ marginTop: 19 }}>
                <input
                  name="all_docs"
                  checked={this.state.all_docs}
                  type="checkbox"
                  style={{ marginRight: "5px" }}
                  onChange={this.changeChecks.bind(this)}
                />
                <label>All Doctors</label>
              </div>

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Doctor",
                  isImp: true
                }}
                selector={{
                  name: "employee_id",
                  className: "select-fld",
                  value: this.state.employee_id,
                  dataSource: {
                    textField: "full_name",
                    valueField: "employee_id",
                    data: this.state.doctors
                  },
                  onChange: this.dropDownHandle.bind(this),
                  others: {
                    disabled: this.state.all_docs
                  }
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

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Appointment Status",
                  isImp: true
                }}
                selector={{
                  name: "hims_d_sub_department_id",
                  className: "select-fld",
                  value: this.state.hims_d_sub_department_id,
                  dataSource: {
                    textField: "sub_department_name",
                    valueField: "hims_d_sub_department_id",
                    data: this.state.departments
                  },
                  onChange: this.dropDownHandle.bind(this)
                }}
              />
            </div>
          </div>
        );

      case "pat_recall_report":
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

              <div className="col-lg-2" style={{ marginTop: 19 }}>
                <input
                  name="all_depts"
                  checked={this.state.all_depts}
                  type="checkbox"
                  style={{ marginRight: "5px" }}
                  onChange={this.changeChecks.bind(this)}
                />
                <label>All Departments</label>
              </div>

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Department",
                  isImp: true
                }}
                selector={{
                  name: "hims_d_sub_department_id",
                  className: "select-fld",
                  value: this.state.hims_d_sub_department_id,
                  dataSource: {
                    textField: "sub_department_name",
                    valueField: "sub_department_id",
                    data: this.state.departments
                  },
                  onChange: this.dropDownHandle.bind(this),
                  others: {
                    disabled: this.state.all_depts
                  }
                }}
              />

              <div className="col-lg-2" style={{ marginTop: 19 }}>
                <input
                  name="all_docs"
                  checked={this.state.all_docs}
                  type="checkbox"
                  style={{ marginRight: "5px" }}
                  onChange={this.changeChecks.bind(this)}
                />
                <label>All Doctors</label>
              </div>

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Doctor",
                  isImp: true
                }}
                selector={{
                  name: "employee_id",
                  className: "select-fld",
                  value: this.state.employee_id,
                  dataSource: {
                    textField: "full_name",
                    valueField: "employee_id",
                    data: this.state.doctors
                  },
                  onChange: this.dropDownHandle.bind(this),
                  others: {
                    disabled: this.state.all_docs
                  }
                }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  }
}
