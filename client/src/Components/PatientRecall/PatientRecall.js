import React, { Component } from "react";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
// import { AlgaehValidation } from "../../utils/GlobalFunctions";
import moment from "moment";
import Options from "../../Options.json";

class PatientRecall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      doctors: [],
      patients: [],
      sub_department_id: null,
      provider_id: null,
      date_of_recall: new Date()
    };
    this.getDoctorsAndDepts();
  }

  loadPatients() {
    if (
      this.state.sub_department_id === null &&
      this.state.provider_id === null &&
      this.state.date_of_recall === null
    ) {
      swalMessage({
        title: "Department/Doctor/Date is mandatory to load data.",
        type: "warning"
      });
      return;
    }

    let inputObj = { date_of_recall: this.state.date_of_recall };

    if (this.state.provider_id !== null) {
      inputObj.doctor_id = this.state.provider_id;
    }

    if (this.state.sub_department_id !== null) {
      inputObj.sub_department_id = this.state.sub_department_id;
    }
    algaehApiCall({
      uri: "/doctorsWorkBench/getFollowUp",
      method: "GET",
      data: inputObj,
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            patients: response.data.records
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  dateValidate(value, event) {
    let inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
    if (inRange) {
      swalMessage({
        title: "Date cannot be past Date.",
        type: "warning"
      });
      event.target.focus();
      this.setState({
        [event.target.name]: null
      });
    }
  }

  dropDownHandle(value) {
    switch (value.name) {
      case "sub_department_id":
        this.setState({
          [value.name]: value.value,
          doctors: value.selected.doctors
        });
        return;

      default:
        this.setState({
          [value.name]: value.value
        });

        return;
    }
  }

  dateFormater(value) {
    if (value !== null) {
      return String(moment(value).format(Options.dateFormat));
    }
    // "DD-MM-YYYY"
  }

  getDoctorsAndDepts() {
    algaehApiCall({
      uri: "/department/get/get_All_Doctors_DepartmentWise",
      module: "masterSettings",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            departments: response.data.records.departmets
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  render() {
    return (
      <div className="patient_recall">
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Department"
            }}
            selector={{
              name: "sub_department_id",
              className: "select-fld",
              value: this.state.sub_department_id,
              dataSource: {
                textField: "sub_department_name",
                valueField: "sub_department_id",
                data: this.state.departments
              },
              onChange: this.dropDownHandle.bind(this),
              onClear: () => {
                this.setState({
                  sub_department_id: null
                });
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Doctor"
            }}
            selector={{
              name: "provider_id",
              className: "select-fld",
              value: this.state.provider_id,
              dataSource: {
                textField: "full_name",
                valueField: "employee_id",
                data: this.state.doctors
              },
              onChange: this.dropDownHandle.bind(this),
              onClear: () => {
                this.setState({
                  provider_id: null
                });
              }
            }}
          />

          <AlgaehDateHandler
            div={{ className: "col" }}
            label={{ forceLabel: "Date" }}
            textBox={{
              className: "txt-fld",
              name: "date_of_recall"
            }}
            minDate={new Date()}
            events={{
              onChange: selectedDate => {
                this.setState({
                  date_of_recall: selectedDate
                });
              },
              onBlur: this.dateValidate.bind(this)
            }}
            value={this.state.date_of_recall}
          />

          <div className="col form-group">
            <button
              onClick={this.loadPatients.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              LOAD
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered ">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Patient List</h3>
            </div>
          </div>
          <div className="portlet-body" id="mrdList-Cntr">
            <div className="row">
              <div className="col-lg-12">
                <AlgaehDataGrid
                  id="index"
                  columns={[
                    {
                      fieldName: "registration_date",
                      label: "Registration Date",
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "patient_code",
                      label: "Patient Code",
                      displayTemplate: row => {
                        return (
                          <span onClick={() => {}} className="pat-code">
                            {row.patient_code}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" }
                      },
                      className: drow => {
                        return "greenCell";
                      }
                    },
                    {
                      fieldName: "full_name",
                      label: "Patient Name",
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "sub_department_name",
                      label: "Department",
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "employee_name",
                      label: "Doctor",
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "gender",
                      label: "Gender",
                      others: {
                        maxWidth: 90,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "date_of_birth",
                      label: "Date of Birth",
                      displayTemplate: row => {
                        return (
                          <span>{this.dateFormater(row.date_of_birth)}</span>
                        );
                      },
                      others: {
                        maxWidth: 120,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "contact_number",
                      label: "Phone Number",
                      others: {
                        maxWidth: 180,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    }
                  ]}
                  keyId="index"
                  dataSource={{
                    data: this.state.patients
                  }}
                  isEditable={false}
                  paging={{ page: 0, rowsPerPage: 20 }}
                  events={{
                    onDelete: row => {},
                    onEdit: row => {},
                    onDone: row => {}
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PatientRecall;
