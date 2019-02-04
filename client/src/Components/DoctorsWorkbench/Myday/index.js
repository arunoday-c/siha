import React, { Component } from "react";
import { Checkbox } from "semantic-ui-react";
import ReactCalender from "react-datepicker";
import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import "react-datepicker/dist/react-datepicker.css";
import { cancelRequest, swalMessage } from "../../../utils/algaehApiCall";
import MyDayEvents from "./events";
import _ from "lodash";
export default class MyDayView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: new Date(),
      toDate: new Date(),
      patientViewType: "APP",
      appoinmentPatientsList: [],
      encounterPatientList: [],
      selectedPatinetId: undefined
    };
  }
  componentDidMount() {
    this.plotMyDayList({
      fromDate: this.state.fromDate,
      toDate: this.state.toDate
    });
  }

  componentWillUnmount() {
    cancelRequest("getMyDay");
  }
  onDateChangeHandler(e) {
    cancelRequest("getMyDay");
    this.setState({
      fromDate: e,
      toDate: e
    });
    this.plotMyDayList({
      fromDate: e,
      toDate: e
    });
  }
  plotMyDayList(options) {
    MyDayEvents()
      .loadPatientsList(options)
      .then(res => {
        if (res.data.success) {
          const _appointment = _.chain(res.data.records)
            .filter(f => f.encounter_id === null)
            .value();
          const _encounter = _.chain(res.data.records)
            .filter(f => f.encounter_id !== null)
            .value();
          this.setState({
            appoinmentPatientsList: _appointment,
            encounterPatientList: _encounter
          });
        } else {
          swalMessage({
            title: res.data.message,
            type: "error"
          });
        }
        console.log("res", res);
      })
      .catch(error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      });
  }

  render() {
    const _patientList =
      this.state.patientViewType === "APP"
        ? this.state.appoinmentPatientsList
        : this.state.encounterPatientList;
    return (
      <div className="cldrPatientList">
        <div className="cldrSection">
          <ReactCalender
            inline
            selected={this.state.fromDate}
            onChange={this.onDateChangeHandler.bind(this)}
            todayButton="Today"
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            fixedHeight
            dropdownMode="select"
          />
        </div>
        <div className="newPatientSec">
          {/* <Checkbox slider label="Show Encounter" className="mx-auto" /> */}

          <AlagehAutoComplete
            div={{ className: "col viewAllApp" }}
            label={{ forceLabel: "View by", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />

          <div className="appPatientList">
            <div className="appPatientListCntr">
              {_patientList.map((patient, index) => {
                return (
                  <div
                    key={index}
                    className={
                      "appSection " +
                      (this.state.selectedPatinetId === patient.patient_id
                        ? " active"
                        : "")
                    }
                  >
                    <span className="appIconSec">
                      {patient.appointment_patient === "N" ? (
                        <i className="fas fa-walking" />
                      ) : (
                        <i className="fas fa-calendar-alt" />
                      )}
                      {new Date(patient.encountered_date).toLocaleTimeString()}
                    </span>
                    <span className="patName">{patient.full_name}</span>
                    <span className="patVisit">Follow Up</span>
                    <span className="patStatus inProgress ">
                      <span
                        className={
                          this.state.selectedPatinetId === patient.patient_id
                            ? "animated infinite flash"
                            : ""
                        }
                      >
                        {patient.nurse_examine === "Y"
                          ? "Nursing Done"
                          : "Nursing Pending"}
                      </span>
                    </span>
                  </div>
                );
              })}

              {/* <div className="appSection">
                <span className="appIconSec">
                  <i className="fas fa-calendar-alt" />
                  11:25:31
                </span>
                <span className="patName">SYED ADIL FAWAD NIZAMI</span>
                <span className="patVisit">New Visit</span>
                <span className="patStatus nursingDone">Nursing Done</span>
              </div>
              <div className="appSection">
                <span className="appIconSec">
                  <i className="fas fa-calendar-alt" />
                  11:25:31
                </span>
                <span className="patName">SYED ADIL FAWAD NIZAMI</span>
                <span className="patVisit">New Visit</span>
                <span className="patStatus nursingDone">Nursing Done</span>
              </div>
              <div className="appSection ">
                <span className="appIconSec">
                  <i className="fas fa-calendar-alt" />
                  11:25:31
                </span>
                <span className="patName">SYED ADIL FAWAD NIZAMI</span>
                <span className="patVisit">New Visit</span>
                <span className="patStatus nursingGoing">Nursing Going</span>
              </div>
              <div className="appSection">
                <span className="appIconSec">
                  <i className="fas fa-walking" />
                  11:25:31
                </span>
                <span className="patName">SYED ADIL FAWAD NIZAMI</span>
                <span className="patVisit">New Visit</span>
                <span className="patStatus checkedIn">Checked In</span>
              </div>
              <div className="appSection ">
                <span className="appIconSec">
                  <i className="fas fa-walking" />
                  11:25:31
                </span>
                <span className="patName">SYED ADIL FAWAD NIZAMI</span>
                <span className="patVisit">New Visit</span>
                <span className="patStatus checkedIn">Checked In</span>
              </div>
              <div className="appSection">
                <span className="appIconSec">
                  <i className="fas fa-calendar-alt" />
                  11:25:31
                </span>
                <span className="patName">SYED ADIL FAWAD NIZAMI</span>
                <span className="patVisit">New Visit</span>
                <span className="patStatus notShown">Not Shown</span>
              </div>
              <div className="appSection">
                <span className="appIconSec">
                  <i className="fas fa-walking" />
                  11:25:31
                </span>
                <span className="patName">SYED ADIL FAWAD NIZAMI</span>
                <span className="patVisit">New Visit</span>
                <span className="patStatus notShown">Not Shown</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
