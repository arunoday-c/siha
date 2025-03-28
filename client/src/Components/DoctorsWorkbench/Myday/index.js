import React, { Component } from "react";
import ReactCalender from "react-datepicker";
import { AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import "react-datepicker/dist/react-datepicker.css";
import { cancelRequest, swalMessage } from "../../../utils/algaehApiCall";
import MyDayEvents from "./events";
import _ from "lodash";

export default class MyDayView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPatientDashboard: false,
      fromDate: new Date(),
      toDate: new Date(),
      mydayList: [],
      selectedPatinetId: undefined,
      visit_by: "AW",
    };
  }
  componentDidMount() {
    this.plotMyDayList({
      inputParam: {
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      },
    });
  }

  componentWillUnmount() {
    cancelRequest("getMyDay");
  }
  onDateChangeHandler(e) {
    cancelRequest("getMyDay");
    /* cancel Vital requies is 
added here because if any request to vitals 
has same request  */
    cancelRequest("ehr_vitals");
    this.setState({
      fromDate: e,
      toDate: e,
    });
    this.plotMyDayList({
      inputParam: {
        fromDate: e,
        toDate: e,
      },
    });
  }
  plotMyDayList(options) {
    MyDayEvents()
      .loadPatientsList(options)
      .then((res) => {
        if (res.data.success) {
          this.setState({
            showPatientDashboard: false,
            mydayList: res.data.records,
          });
        } else {
          swalMessage({
            title: res.data.message,
            type: "error",
          });
        }
      })
      .catch((error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      });
  }

  onVisiByChange(e) {
    this.setState({
      visit_by: e.selected.value,
    });
  }
  onVisitClear(e) {
    this.setState({
      visit_by: undefined,
    });
  }
  onClickMyDayHandler(patientID, e) {
    /* cancel Vital requies is 
    added here because if any request to vitals 
    has same request  */
    cancelRequest("ehr_vitals");
    MyDayEvents()
      .getPatientDetails({
        inputParam: {
          hims_d_patient_id: patientID,
        },
      })
      .then((response) => {
        const _result = response.data;
        if (_result.success) {
          this.setState(
            {
              showPatientDashboard: true,
              selectedPatinetId: patientID,
            },
            () => {
              this.props.onupdatingdata({
                showPatientDashboard: this.state.showPatientDashboard,
                selectedPatientDetails: response.data.records,
              });
            }
          );
        } else {
          swalMessage({
            title: _result.message,
            type: "error",
          });
        }
      })
      .catch((error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      });
  }

  patientStatusWisePlotUI(status, nursing) {
    let _element = undefined;
    switch (status) {
      case "V":
        if (nursing === "Y")
          _element = <span className="nursingDone">Nursing Done</span>;
        else _element = <span className="nursingGoing">Nursing Pending</span>;
        break;
      case "W":
        _element = (
          <span className="inProgress animated infinite flash">
            In-Progress
          </span>
        );
        break;
      case "C":
        _element = <span className="close">Close</span>;
        break;
      case "CA":
        _element = <span className="cancelled">Cancelled</span>;
        break;
      case "CO":
        _element = <span className="completed">Completed</span>;
        break;
      default:
        break;
    }
    return _element;
  }

  render() {
    const _patientList = MyDayEvents().myDayOnSelection(
      this.state.mydayList,
      this.state.visit_by
    );
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
          <AlagehAutoComplete
            div={{ className: "col viewAllApp" }}
            label={{ forceLabel: "View by", isImp: false }}
            selector={{
              name: "view_by",
              className: "select-fld",
              dataSource: {
                data: MyDayEvents().visitBy,
                displayText: "text",
                displayValue: "value",
              },
              value: this.state.visit_by,
              onChange: this.onVisiByChange.bind(this),
              onClear: this.onVisitClear.bind(this),
            }}
          />

          <div className="appPatientList">
            <div className="appPatientListCntr">
              {_patientList.length !== 0 ? (
                _patientList.map((patient, index) => {
                  return (
                    <div
                      key={index}
                      className={
                        "appSection" +
                        (this.state.selectedPatinetId === patient.patient_id
                          ? " active"
                          : "")
                      }
                      onClick={this.onClickMyDayHandler.bind(
                        this,
                        patient.patient_id
                      )}
                    >
                      <div className="appIconSec">
                        {patient.appointment_patient === "N" ? (
                          <i className="fas fa-walking" />
                        ) : (
                          <i className="fas fa-calendar-alt" />
                        )}
                        {new Date(
                          patient.encountered_date
                        ).toLocaleTimeString()}
                      </div>
                      <div className="apptDetailsSec">
                        <span className="patName">
                          {_.startCase(_.toLower(patient.full_name))}
                        </span>
                        <span className="patVisit">{patient.visit_type}</span>
                        <span className="patStatus ">
                          {this.patientStatusWisePlotUI(
                            patient.status,
                            patient.nurse_examine
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="noAppRecord">
                  <i className="fas fa-calendar-alt" />
                  <span>
                    No appointment for
                    <span>
                      {new Date(this.state.fromDate).toDateString() ===
                      new Date().toDateString()
                        ? "Today"
                        : new Date(this.state.fromDate).toDateString()}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
