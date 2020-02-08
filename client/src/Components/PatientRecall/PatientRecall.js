import React, { Component } from "react";
import "./PatientRecall.scss";
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
          <AlgaehDateHandler
            div={{ className: "col-2 form-group" }}
            label={{ forceLabel: "From Date" }}
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
          />{" "}
          <AlgaehDateHandler
            div={{ className: "col-2 form-group" }}
            label={{ forceLabel: "To Date" }}
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
          <AlagehAutoComplete
            div={{ className: "col-2 form-group" }}
            label={{
              forceLabel: "Filter by Department"
            }}
            selector={{
              name: "",
              className: "select-fld",
              value: "",
              dataSource: {}
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 form-group" }}
            label={{
              forceLabel: "Filter by Doctor"
            }}
            selector={{
              name: "",
              className: "select-fld",
              value: "",
              dataSource: {}
            }}
          />
        </div>
        <div className="scrolling-wrapper">
          <div className="card">
            <h2>01-Jan-2020</h2>
            <div className="slotsDiv">
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
          <div className="card">
            <h2>01-Jan-2020</h2>
            <div className="slotsDiv">
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
          <div className="card">
            <h2>01-Jan-2020</h2>
            <div className="slotsDiv">
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
          <div className="card">
            <h2>01-Jan-2020</h2>
            <div className="slotsDiv">
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
            </div>
          </div>
          <div className="card">
            <h2>01-Jan-2020</h2>
            <div className="slotsDiv">
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
            </div>
          </div>
          <div className="card">
            <h2>01-Jan-2020</h2>
            <div className="slotsDiv">
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
          <div className="card">
            <h2>01-Jan-2020</h2>
            <div className="slotsDiv">
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>{" "}
              <div className="eachSlot">
                <small>Patient Code</small>
                <h3>Patient Name</h3>
                <small>Mobile No.</small>
                <br />
                <small>
                  <b>10:00 AM</b> - <b>10:15 AM</b>{" "}
                </small>
                <hr />
                <small>
                  <b>Doctor Name</b>
                </small>
                <br />
                <small>Department Name</small>
                <button className="btn btn-default btn-block btn-sm btn-book">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PatientRecall;
