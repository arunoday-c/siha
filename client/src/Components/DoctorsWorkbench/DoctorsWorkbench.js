import React, { Component } from "react";
import "./doctor_workbench.css";
import { AlgaehDataGrid, AlgaehLabel } from "../Wrapper/algaehWrapper";
import {
  algaehApiCall,
  cancelRequest,
  swalMessage
} from "../../utils/algaehApiCall";
import { setGlobal } from "../../utils/GlobalFunctions";
import Enumerable from "linq";
import moment from "moment";
import algaehLoader from "../Wrapper/fullPageLoader";
import sockets from "../../sockets";

class DoctorsWorkbench extends Component {
  constructor(props) {
    super(props);
    let dateToday = moment().format("YYYY") + moment().format("MM") + "01";
    this.state = {
      my_daylist: [],
      selectedLang: "en",
      data: [],
      appointments: [],
      selectedHDate: moment(dateToday, "YYYYMMDD")._d,
      fromDate: moment()._d,
      toDate: moment()._d,
      activeDateHeader: moment()._d
    };

    // this.moveToEncounterList = this.moveToEncounterList.bind(this);
    this.socket = sockets;
    this.loadListofData = this.loadListofData.bind(this);
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  dateHandle(value) {
    let dob = moment(value)._d;
    this.setState({ date_of_birth: value, client_date: dob });

    let age = moment().diff(dob, "years");
    this.setState({ age: age });
  }

  getAppointmentStatus() {
    algaehApiCall({
      uri: "/appointment/getAppointmentStatus",
      module: "frontDesk",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            status: res.data.records
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: "Failed to get appointment status"
        });
        this.setState({ status: [] });
      }
    });
  }

  statusCheck = id => {
    const { status } = this.state;
    const [reqStatus] = status.filter(
      stat => stat.hims_d_appointment_status_id === id
    );
    return reqStatus.statusDesc;
  };

  getAppointments(e) {
    let send_data = {
      sub_dept_id: this.state.sub_department_id,
      schedule_date: moment(this.state.activeDateHeader).format("YYYY-MM-DD"),
      provider_id: this.state.provider_id
    };
    algaehApiCall({
      uri: "/appointment/getDoctorScheduleDateWise",
      module: "frontDesk",
      method: "GET",
      data: send_data,
      onSuccess: response => {
        const { success, records } = response.data;
        if (success && records.length > 0) {
          this.setState({
            appointments: records[0].patientList
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

  moveToEncounterList(data, e) {
    const patient_encounter_id = e.currentTarget.getAttribute(
      "data-encounterid"
    );
    const patient_id = e.currentTarget.getAttribute("data-patientid");

    algaehApiCall({
      uri: "/doctorsWorkBench/updatdePatEncntrStatus",
      data: {
        patient_encounter_id: patient_encounter_id
      },
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          this.loadListofData();

          setGlobal({
            vitals_mandatory: data.vitals_mandatory,
            "EHR-STD": "PatientProfile",
            current_patient: data.patient_id,
            episode_id: data.episode_id,
            visit_id: data.visit_id,
            encounter_id: response.data.records.encounter_id,
            provider_id: data.provider_id,
            chart_type: data.chart_type,
            gender: data.gender,
            sub_department_id: data.sub_department_id
          });
          document.getElementById("ehr-router").click();
          // setGlobal(
          //   {
          //     "EHR-STD": "PatientProfile",
          //     current_patient: patient_id,
          //     episode_id: patient_encounter_id,
          //     case_type: "OP"
          //   },
          //   () => {
          //     document.getElementById("ehr-router").click();
          //   }
          // );
        }
      }
    });
  }

  loadListofData() {
    algaehLoader({ show: true });

    const dateRange =
      localStorage.getItem("workbenchDateRange") !== null
        ? JSON.parse(localStorage.getItem("workbenchDateRange"))
        : {
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            activeDateHeader: this.state.fromDate
          };

    algaehApiCall({
      uri: "/doctorsWorkBench/getMyDay",
      data: {
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate
      },
      method: "GET",
      cancelRequestId: "getMyDay",
      onSuccess: response => {
        if (response.data.success) {
          const _selecDate = new Date(dateRange.activeDateHeader).setDate(1);
          if (Array.isArray(response.data.records)) {
            this.setState(
              {
                selectedHDate: _selecDate,
                data: response.data.records,
                activeDateHeader: dateRange.activeDateHeader,
                provider_id: response.data.records[0].provider_id,
                sub_department_id: response.data.records[0].sub_department_id
              },
              () => {
                this.getAppointments();
                algaehLoader({ show: false });
              }
            );
          } else {
            this.setState(
              {
                provider_id: response.data.records.provider_id,
                sub_department_id: response.data.records.sub_department_id,
                activeDateHeader: dateRange.activeDateHeader,
                data: []
              },
              () => {
                this.getAppointments();
                algaehLoader({ show: false });
              }
            );
          }
        }
      },
      onFailure: error => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  componentWillUnmount() {
    cancelRequest("getMyDay");
  }

  componentDidMount() {
    this.loadListofData();
    this.socket.on("patient_added", patient => {
      const { appointment_date } = patient;
      const dateCheck = moment(appointment_date).isSame(
        moment(this.state.activeDateHeader),
        "days"
      );
      console.log(dateCheck, "date check mwb");
      if (dateCheck) {
        this.loadListofData();
      }
    });
    this.getAppointmentStatus();
  }

  liGenerate() {
    let momDate = moment(this.state.selectedHDate);
    let initialDate = momDate._d;
    var date = initialDate,
      y = date.getFullYear(),
      m = date.getMonth();
    var lastDay = new Date(y, m + 1, 0);
    let endDate = moment(lastDay)._d;

    let generatedLi = [];

    while (
      moment(initialDate).format("YYYYMMDD") <=
      moment(endDate).format("YYYYMMDD")
    ) {
      let dt = moment(initialDate);

      generatedLi.push({
        day: dt.format("DD"),
        currentdate: dt._d,
        dayName: dt.format("ddd")
      });

      initialDate.setDate(initialDate.getDate() + 1);
    }
    return generatedLi;
  }
  onSelectedDateHandler(e) {
    const fromDate = e.currentTarget.getAttribute("date");
    this.setState(
      {
        activeDateHeader: e.currentTarget.getAttribute("date"),
        fromDate: e.currentTarget.getAttribute("date"),
        toDate: e.currentTarget.getAttribute("date")
      },
      () => {
        localStorage.setItem(
          "workbenchDateRange",
          JSON.stringify({
            fromDate: fromDate,
            toDate: fromDate,
            activeDateHeader: fromDate
          })
        );
        this.loadListofData();
      }
    );
  }

  generateHorizontalDateBlocks() {
    const act_date = new Date(this.state.activeDateHeader);
    return (
      <div className="calendar">
        <div className="col-12">
          <div className="row">
            {this.liGenerate().map((row, index) => {
              const _currDate = moment(row.currentdate).format("YYYYMMDD");
              const _activeDate = moment(act_date).format("YYYYMMDD");
              return (
                <div
                  // className="col"
                  key={index}
                  date={row.currentdate}
                  className={
                    _currDate === _activeDate
                      ? _currDate === moment().format("YYYYMMDD")
                        ? "col activeDate CurrentDate"
                        : "col activeDate"
                      : _currDate === moment().format("YYYYMMDD")
                      ? "col CurrentDate"
                      : "col"
                  }
                  onClick={this.onSelectedDateHandler.bind(this)}
                >
                  {row.day}
                  <span
                  // date={row.currentdate}
                  // onClick={this.onSelectedDateHandler.bind(this)}
                  >
                    {row.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  monthChangeHandler(e) {
    let dt = moment(e.target.value + "-01", "YYYY-MM-DD")._d;
    this.setState({ selectedHDate: dt, activeDateHeader: dt });
  }

  OpenPatientProfile(data) {
    if (data.visit_status === "C") {
      swalMessage({
        title: "Visit is closed, Cannot proceed further",
        type: "error"
      });
      return;
    }

    let inRange = moment(data.visit_expiery_date).isBefore(
      moment().format("YYYY-MM-DD")
    );
    if (inRange) {
      swalMessage({
        title: "Visit is Expired, Cannot proceed further",
        type: "error"
      });
      return;
    }
    setGlobal({
      vitals_mandatory: data.vitals_mandatory,
      "EHR-STD": "PatientProfile",
      current_patient: data.patient_id,
      episode_id: data.episode_id,
      visit_id: data.visit_id,
      encounter_id: data.encounter_id,
      provider_id: data.provider_id,
      chart_type: data.chart_type,
      gender: data.gender,
      sub_department_id: data.sub_department_id
    });
    document.getElementById("ehr-router").click();
  }

  render() {
    return (
      <div className="doctor_workbench">
        <div className="row">
          <div className="my-calendar col-lg-12">
            <div style={{ height: "34px" }}>
              <div className="myDay_date">
                <input
                  className="calender-date"
                  type="month"
                  onChange={this.monthChangeHandler.bind(this)}
                  value={moment(this.state.selectedHDate).format("YYYY-MM")}
                  max={moment(new Date()).format("YYYY-MM")}
                />
                {/* <button
                        onClick={() => {
                          this.setState({
                            activeDateHeader: new Date()
                          });
                        }}
                        className="btn btn-default btn-sm  todayBtn"
                      >
                        {getLabelFromLanguage({
                          fieldName: "today"
                        })}
                      </button> */}
              </div>
            </div>
            {this.generateHorizontalDateBlocks()}
          </div>
        </div>

        <div className="row card-deck panel-layout">
          {/* Appointment UI Panel Start*/}
          <div className="col-3">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">List of Appointment</h3>
                </div>
              </div>

              <div className="portlet-body">
                <div className="appPatientList">
                  {/* <div className="appoStatusLegend">
                    <span>
                      <small>Pending</small>10
                    </span>
                    <span>
                      <small>Confirmed</small>10
                    </span>
                    <span>
                      <small>Cancelled</small>10
                    </span>
                  </div> */}
                  <ul className="appList">
                    {this.state.appointments.length !== 0 ? (
                      this.state.appointments.map((data, index) => (
                        <li key={index}>
                          <span className="app-sec-1">
                            {/* <i className="appointment-icon" /> */}
                            <i className={"appointment-icon"} />
                            <span className="appTime">
                              {moment(
                                data.appointment_from_time,
                                "HH:mm:ss"
                              ).format("hh:mm A")}
                            </span>
                          </span>
                          <span className="app-sec-2">
                            <span className="appPatientName">
                              {data.patient_name}
                            </span>
                            <span className="appStatus nursing" />{" "}
                            <span className="appoPatientStatus newVisit">
                              {this.statusCheck(data.appointment_status_id)}
                            </span>
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="col noPatientDiv">
                        {/* <h4>Relax</h4> */}
                        <i className="fas fa-calendar-alt" />
                        <p>No Appointment Available</p>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Appointment UI Panel End*/}
          {/* Left Pane Start */}
          <div className="col-3" style={{ padding: 0 }}>
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    List of Checked In Patients
                  </h3>
                </div>
                {/* <div className="actions">
                  <a
                    className="btn btn-primary btn-circle active"
                    onClick={this.loadListofData}
                  >
                    <i className="fas fa-sync-alt" />
                  </a>
                </div> */}
              </div>

              <div className="portlet-body">
                <div className="opPatientList">
                  {" "}
                  {/* <div className="opStatusLegend">
                    <span>
                      <small>Follow Up</small>10
                    </span>
                    <span>
                      <small>New Visit</small>10
                    </span>
                    <span>
                      <small>Package Visit</small>10
                    </span>
                  </div> */}
                  <ul className="opList">
                    {Enumerable.from(this.state.data)
                      .where(w => w.status === "V")
                      .toArray().length !== 0 ? (
                      Enumerable.from(this.state.data)
                        .where(w => w.status === "V")
                        .toArray()
                        .map((data, index) => (
                          <li
                            key={index}
                            data-encounterid={String(
                              data.hims_f_patient_encounter_id
                            )}
                            data-patientid={String(data.patient_id)}
                            onClick={this.moveToEncounterList.bind(this, data)}
                          >
                            <span className="op-sec-1">
                              {/* <i className="appointment-icon" /> */}
                              <i
                                className={
                                  data.appointment_patient === "Y"
                                    ? "appointment-icon"
                                    : "walking-icon"
                                }
                              />
                              <span className="opTime">
                                {moment(data.encountered_date).format(
                                  "HH:mm A"
                                )}
                              </span>
                            </span>
                            <span className="op-sec-2">
                              <span className="opPatientName">
                                {data.full_name}
                              </span>

                              {data.nurse_examine === "Y" ? (
                                <span className="opStatus nursing">
                                  Nursing Done
                                </span>
                              ) : (
                                <span className="opStatus nursing">
                                  Nursing Pending
                                </span>
                              )}

                              {data.new_visit_patient === "Y" ? (
                                <span className="opPatientStatus newVisit">
                                  New Visit
                                </span>
                              ) : data.new_visit_patient === "P" ? (
                                <span className="opPatientStatus packageVisit">
                                  Package Utilize Visit
                                </span>
                              ) : (
                                <span className="opPatientStatus followUp">
                                  Follow Up Visit
                                </span>
                              )}
                            </span>
                          </li>
                        ))
                    ) : (
                      <li className="col noPatientDiv">
                        <i className="fas fa-user-injured" />
                        <p>No Patients Available</p>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Left Pane End */}

          {/* Right Pane Start */}

          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    <AlgaehLabel
                      label={{
                        fieldName: "encounter_list",
                        returnText: "true"
                      }}
                    />
                  </h3>
                </div>
                <div className="actions rightLabelCount">
                  <AlgaehLabel label={{ forceLabel: "No. of Encounters" }} />
                  <span className="countNo">
                    {
                      Enumerable.from(this.state.data)
                        .where(w => w.status !== "V")
                        .toArray().length
                    }
                  </span>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12" id="encounter_table">
                    <AlgaehDataGrid
                      //filter={true}
                      columns={[
                        {
                          fieldName: "status",
                          label: (
                            <AlgaehLabel label={{ fieldName: "status" }} />
                          ),
                          disabled: true,
                          displayTemplate: data => {
                            return (
                              <span>
                                {data.status === "W" ? <span>WIP </span> : ""}
                              </span>
                            );
                          },
                          others: {
                            width: 70,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "patient_code",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "patient_code" }}
                            />
                          ),
                          displayTemplate: data => {
                            return (
                              <span
                                className="pat-code"
                                onClick={this.OpenPatientProfile.bind(
                                  this,
                                  data
                                )}
                              >
                                {data.patient_code}
                              </span>
                            );
                          },
                          className: row => {
                            return "greenCell";
                          },
                          others: {
                            width: 130,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "full_name",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "patient_name" }}
                            />
                          )
                        },
                        {
                          fieldName: "encountered_date",
                          label: <AlgaehLabel label={{ fieldName: "date" }} />,
                          displayTemplate: data => {
                            return (
                              <span>
                                {moment(data.encountered_date).format(
                                  "DD-MM-YYYY"
                                )}
                              </span>
                            );
                          },
                          others: {
                            width: 90,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "encountered_date",
                          label: <AlgaehLabel label={{ fieldName: "time" }} />,
                          displayTemplate: data => {
                            return (
                              <span>
                                {moment(data.encountered_date).format(
                                  "HH:mm A"
                                )}
                              </span>
                            );
                          },
                          others: {
                            width: 70,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "patient_type",
                          label: (
                            <AlgaehLabel label={{ fieldName: "pay_type" }} />
                          ),
                          displayTemplate: data => {
                            return (
                              <span>
                                {data.payment_type === "I"
                                  ? "Insurance"
                                  : "Self"}
                              </span>
                            );
                          },
                          others: {
                            width: 80,
                            style: { textAlign: "center" }
                          }
                        }
                        // ,
                        // {
                        //   fieldName: "transfer_status",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ fieldName: "transfer_status" }}
                        //     />
                        //   )
                        // }
                      ]}
                      rowClassName={row => {
                        //return "greenCell";
                      }}
                      keyId="encounter_code"
                      dataSource={{
                        data: Enumerable.from(this.state.data)
                          .where(w => w.status !== "V")
                          .toArray()
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
          {/* Right Pane End */}
        </div>
      </div>
    );
  }
}

export default DoctorsWorkbench;
