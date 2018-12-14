import React, { Component } from "react";
import "./nurse_workbench.css";
import moment from "moment";
import { AlgaehLabel, AlagehFormGroup } from "../Wrapper/algaehWrapper";
import Enumerable from "linq";
import algaehLoader from "../Wrapper/fullPageLoader";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import {
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../Wrapper/algaehWrapper";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
import GlobalVariables from "../../utils/GlobalVariables.json";
import { AlgaehValidation } from "../../utils/GlobalFunctions";
import config from "../../utils/config.json";
import {
  getAllChiefComplaints,
  getDepartmentVitals,
  temperatureConvertion,
  getFormula
} from "./NurseWorkbenchEvents";
import swal from "sweetalert2";

class NurseWorkbench extends Component {
  constructor(props) {
    super(props);
    let dateToday = moment().format("YYYY") + moment().format("MM") + "01";
    this.state = {
      my_daylist: [],
      selectedLang: "en",
      data: [],
      patChiefComp: [],
      selectedHDate: moment(dateToday, "YYYYMMDD")._d,
      fromDate: moment()._d,
      toDate: moment()._d,
      activeDateHeader: moment()._d,
      recorded_date: new Date(),
      recorded_time: moment().format(config.formators.time)
    };

    this.baseState = this.state;

    this.loadListofData = this.loadListofData.bind(this);

    if (
      this.props.allchiefcomplaints === undefined ||
      this.props.allchiefcomplaints.length === 0
    ) {
      getAllChiefComplaints(this);
    }
    getDepartmentVitals(this);
    this.getDoctorsAndDepts();
  }

  resetSaveState() {
    this.setState({
      patChiefComp: [],
      nurse_notes: null,
      episode_id: null,
      patient_id: null,
      patient_name: null,
      hims_d_hpi_header_id: null,
      onset_date: null,
      duration: null,
      interval: null,
      severity: null,
      score: null,
      pain: null,
      comment: null,
      chief_complaint_name: null
    });

    const _resetElements = document.getElementById("vitals_recording");
    const _childs = _resetElements.querySelectorAll("[type='number']");
    for (let i = 0; i < _childs.length; i++) {
      let _name = _childs[i].name;
      this.setState({
        [_name]: ""
      });
    }
  }

  savePatientExamn() {
    if (
      this.state.patient_name === undefined ||
      this.state.patient_name === null ||
      this.state.patient_name.length < 0
    ) {
      swalMessage({
        title: "Please Select a patient",
        type: "warning"
      });
      return;
    } else {
      let send_data = {};
      let bodyArray = [];
      const _elements = document.querySelectorAll("[vitalid]");

      for (let i = 0; i < _elements.length; i++) {
        if (_elements[i].value !== "") {
          const _isDepended = _elements[i].getAttribute("dependent");
          bodyArray.push({
            patient_id: this.state.patient_id,
            visit_id: this.state.visit_id,
            visit_date: this.state.recorded_date,
            visit_time: this.state.recorded_time,
            case_type: this.state.case_type,
            vital_id: _elements[i].getAttribute("vitalid"),
            vital_value: _elements[i].value,
            vital_value_one:
              _isDepended !== null
                ? document.getElementsByName(_isDepended)[0].value
                : null,
            formula_value: _elements[i].getAttribute("formula_value")
          });
        }
      }
      send_data.nurse_notes = this.state.nurse_notes;
      send_data.chief_complaints = this.state.patChiefComp;
      send_data.patient_vitals = bodyArray;
      send_data.hims_f_patient_encounter_id = this.state.encounter_id;

      algaehApiCall({
        uri: "/nurseWorkBench/addPatientNurseChiefComplaints",
        method: "POST",
        data: send_data,
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Recorded Successfully",
              type: "success"
            });
            // var element = document.querySelectorAll("[nursing_pat]");
            // for (var i = 0; i < element.length; i++) {
            //   element[i].classList.remove("active");
            // }
            this.resetSaveState();
            this.loadListofData();
          }
        },
        onError: error => {}
      });
    }

    //console.log("Send Data:", send_data);
  }

  deptDropDownHandler(value) {
    this.setState({ [value.name]: value.value }, () => {
      let dept = Enumerable.from(this.state.departments)
        .where(w => w.sub_dept_id === this.state.sub_department_id)
        .firstOrDefault();
      this.setState(
        {
          doctors: dept.doctors
        },
        () => {
          this.loadListofData();
        }
      );
    });
  }

  dateDurationAndInterval(selectedDate) {
    let duration = 0;
    let interval = "D";
    if (moment().diff(selectedDate, "days") < 31) {
      duration = moment().diff(selectedDate, "days");
      interval = "D";
    } else if (moment().diff(selectedDate, "months") < 12) {
      duration = moment().diff(selectedDate, "months");
      interval = "M";
    } else if (moment().diff(selectedDate, "years")) {
      duration = moment().diff(selectedDate, "years");
      interval = "Y";
    }

    this.setState({
      onset_date: selectedDate,
      duration: duration,
      interval: interval
    });
  }

  durationToDateAndInterval(duration, interval) {
    const _interval = Enumerable.from(GlobalVariables.PAIN_DURATION)
      .where(w => w.value === interval)
      .firstOrDefault().name;
    const _date = moment().add(-duration, _interval.toLowerCase());
    return { interval, onset_date: _date._d };
  }

  dropDownHandle(value) {
    switch (value.name) {
      case "provider_id":
        this.setState(
          { [value.name]: value.value },

          () => {
            this.loadListofData();
          }
        );

        break;

      case "chief_complaint_id":
        if (
          this.state.patient_name === undefined ||
          this.state.patient_name === null
        ) {
          swalMessage({
            title: "Please Select a patient",
            type: "warning"
          });
        } else {
          this.setState({
            [value.name]: value.value,
            chief_complaint_name: value.selected.hpi_description
          });
        }

        break;

      default:
        if (
          this.state.patient_name === undefined ||
          this.state.patient_name === null
        ) {
          swalMessage({
            title: "Please Select a patient",
            type: "error"
          });
        } else {
          this.setState({
            [value.name]: value.value
          });
        }

        break;
    }
  }

  getDoctorsAndDepts() {
    algaehApiCall({
      uri: "/department/selectDoctorsAndClinic",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            departments: response.data.records.departmets
          });
          //console.log("All Doctors:", response.data.records);
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

  componentDidMount() {
    this.loadListofData();
  }

  addChiefComplainToPatient() {
    if (
      this.state.chief_complaint_id === null ||
      this.state.chief_complaint_id === undefined ||
      this.state.chief_complaint_id.length < 0
    ) {
      swalMessage({
        title: "Please select a chief complaint",
        type: "warning"
      });
    } else {
      this.state.patChiefComp.push({
        episode_id: this.state.episode_id,
        patient_id: this.state.patient_id,
        chief_complaint_id: this.state.chief_complaint_id,
        onset_date: this.state.onset_date,
        duration: this.state.duration,
        interval: this.state.interval,
        severity: this.state.severity,
        score: this.state.score,
        pain: this.state.pain,
        comment: this.state.comment,
        chief_complaint_name: this.state.chief_complaint_name
      });

      this.setState({
        chief_complaint_id: null,
        onset_date: null,
        duration: null,
        interval: "D",
        severity: null,
        score: null,
        pain: null,
        comment: null,
        chief_complaint_name: null
      });
    }
  }

  gridLevelUpdate(row, e) {
    e = e.name === undefined ? e.currentTarget : e;
    row[e.name] = e.value;
    if (e.name === "onset_date") {
      const _durat_interval = this.dateDurationAndInterval(e.value);
      row["duration"] = _durat_interval.duration;
      row["interval"] = _durat_interval.interval;
    } else if (e.name === "duration") {
      const _duration_Date_Interval = this.durationToDateAndInterval(
        e.value,
        row["interval"]
      );
      row["onset_date"] = _duration_Date_Interval.onset_date;
      row["interval"] = _duration_Date_Interval.interval;
    } else if (e.name === "interval") {
      const _dur_date_inter = this.durationToDateAndInterval(
        row["duration"],
        e.value
      );
      row["onset_date"] = _dur_date_inter.onset_date;
    } else if (e.name === "chronic") {
      row[e.name] = e.checked ? "Y" : "N";
    } else if (e.name === "complaint_inactive") {
      row[e.name] = e.checked ? "Y" : "N";
      if (e.checked) row["complaint_inactive_date"] = moment()._d;
      else row["complaint_inactive_date"] = null;
    }
    row.update();
  }

  onChiefComplaintRowDone(row) {
    this.state.patChiefComp[row.rowIdx] = row;
  }

  onChiefComplaintRowDelete(row) {
    swal({
      title: "Delete Complaint " + row.chief_complaint_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        this.state.patChiefComp.pop(row);

        this.setState({
          patChiefComp: this.state.patChiefComp
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  monthChangeHandler(e) {
    let dt = moment(e.target.value + "-01", "YYYY-MM-DD")._d;
    this.setState({
      selectedHDate: dt,
      activeDateHeader: dt,
      patient_name: null
    });
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
        toDate: e.currentTarget.getAttribute("date"),
        patient_name: null
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

  moveToStation(data, e) {
    
    this.setState({
      patient_name: data.full_name,
      current_patient: data.patient_id,
      episode_id: data.episode_id,
      encounter_id: data.hims_f_patient_encounter_id,
      patient_id: data.patient_id,
      visit_id: data.visit_id
    });

    var element = document.querySelectorAll("[nursing_pat]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
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
                  <span>{row.dayName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
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
      uri: "/nurseWorkBench/getNurseMyDay",
      data: {
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        sub_department_id: this.state.sub_department_id,
        provider_id: this.state.provider_id
      },
      method: "GET",
      cancelRequestId: "getNurseMyDay",
      onSuccess: response => {
        if (response.data.success) {
          const _selecDate = new Date(dateRange.activeDateHeader).setDate(1);

          this.setState(
            {
              selectedHDate: _selecDate,
              data: response.data.records,
              activeDateHeader: dateRange.activeDateHeader
            },
            () => {
              algaehLoader({ show: false });
            }
          );
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

  masterChiefComplaintsSortList(patChiefComplain, allmastercomplaints) {
    allmastercomplaints = allmastercomplaints || null;

    let allChiefComp =
      allmastercomplaints === null
        ? this.props.allchiefcomplaints
        : allmastercomplaints;
    for (let i = 0; i < patChiefComplain.length; i++) {
      let idex = Enumerable.from(allChiefComp)
        .where(
          w =>
            w.hims_d_hpi_header_id === patChiefComplain[i]["chief_complaint_id"]
        )
        .firstOrDefault();
      if (idex !== undefined)
        allChiefComp.splice(allChiefComp.indexOf(idex), 1);
    }
    return allChiefComp;
  }

  texthandle(e) {
    if (
      this.state.patient_name === undefined ||
      this.state.patient_name === null
    ) {
      swalMessage({
        title: "Please Select a patient",
        type: "error"
      });
      return;
    } else if (e.target.name === "weight") {
      //TODO  now hardCoded options need to pull from Db
      getFormula({
        WEIGHTAS: "KG",
        HEIGHTAS: "CM",
        WEIGHT: e.target.value,
        HEIGHT: this.state.height,
        onSuccess: bmi => {
          this.setState({ bmi: bmi });
        }
      });
    } else if (e.target.name === "height") {
      //TODO  now hardCoded options need to pull from Db
      getFormula({
        WEIGHTAS: "KG",
        HEIGHTAS: "CM",
        WEIGHT: this.state.weight,
        HEIGHT: e.target.value,
        onSuccess: bmi => {
          this.setState({ bmi: bmi });
        }
      });
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const patChiefComplain =
      this.state.patChiefComp !== undefined
        ? this.state.patChiefComp.sort((a, b) => {
            return (
              b.hims_f_episode_chief_complaint_id -
              a.hims_f_episode_chief_complaint_id
            );
          })
        : [];

    const _allUnselectedChiefComp =
      this.props.allchiefcomplaints === undefined
        ? []
        : this.masterChiefComplaintsSortList(
            patChiefComplain,
            this.props.allchiefcomplaints
          );

    const _department_viatals =
      this.props.department_vitals === undefined ||
      this.props.department_vitals.length === 0
        ? []
        : this.props.department_vitals;

    return (
      <div className="nurse_workbench">
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
                <button className="btn btn-default btn-sm  todayBtn">
                  Today
                </button>
              </div>
            </div>
            {this.generateHorizontalDateBlocks()}
          </div>
        </div>
        <div className="row card-deck panel-layout">
          <div className="col-lg-4">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    <AlgaehLabel
                      label={{ fieldName: "patients_list", returnText: "true" }}
                    />
                  </h3>
                </div>
                <div className="actions rightLabelCount">
                  <AlgaehLabel label={{ fieldName: "total_patients" }} />
                  <span className="countNo">
                    {
                      Enumerable.from(this.state.data)
                        .where(w => w.status === "V" && w.nurse_examine === "N")
                        .toArray().length
                    }
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{
                      fieldName: "department_name",
                      isImp: false
                    }}
                    selector={{
                      name: "sub_department_id",
                      className: "select-fld",
                      value: this.state.sub_department_id,
                      dataSource: {
                        textField: "sub_department_name",
                        valueField: "sub_dept_id",
                        data: this.state.departments
                      },
                      onChange: this.deptDropDownHandler.bind(this),
                      onClear: () => {
                        this.setState(
                          {
                            sub_department_id: null
                          },
                          () => {
                            this.loadListofData();
                          }
                        );
                      }
                    }}
                  />
                </div>
                <div className="col">
                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{
                      fieldName: "doctor_name"
                    }}
                    selector={{
                      name: "provider_id",
                      className: "select-fld",
                      value: this.state.provider_id,
                      dataSource: {
                        textField: "full_name",
                        valueField: "provider_id",
                        data: this.state.doctors
                      },
                      onChange: this.dropDownHandle.bind(this),
                      onClear: () => {
                        this.setState(
                          {
                            provider_id: null
                          },
                          () => {
                            this.loadListofData();
                          }
                        );
                      }
                    }}
                  />
                </div>
              </div>

              <div className="portlet-body">
                <div className="opPatientList">
                  <ul className="opList">
                    {Enumerable.from(this.state.data)
                      .where(w => w.status === "V" && w.nurse_examine === "N")
                      .toArray().length !== 0 ? (
                      Enumerable.from(this.state.data)
                        .where(w => w.status === "V" && w.nurse_examine === "N")
                        .toArray()
                        .map((data, index) => (
                          <li
                            nursing_pat={index}
                            key={index}
                            onClick={this.moveToStation.bind(this, data)}
                          >
                            <span className="op-sec-1">
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
                              <span className="opStatus nursing">
                                {data.nurse_examine === "Y"
                                  ? "Nursing Done"
                                  : "Nursing Pending"}
                              </span>
                            </span>
                            <span className="op-sec-3">
                              <span className="opPatientStatus newVisit">
                                New Visit
                              </span>
                            </span>
                          </li>
                        ))
                    ) : (
                      <div className="col noPatientDiv">
                        {/* <h4>Relax</h4> */}
                        <p>No Patients Available</p>
                      </div>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    {/* <AlgaehLabel
                      label={{
                        forceLabel: this.state.patient_name,
                        returnText: "true"
                      }}
                    /> */}
                    <span>Patient Name : {this.state.patient_name}</span>
                  </h3>
                </div>
                {/* <div className="actions rightLabelCount">Station</div> */}
              </div>

              <div className="portlet-body" id="vitals_recording">
                {/* Vitals Start */}
                <div className="row margin-bottom-15">
                  {_department_viatals.map((item, index) => {
                    const _className =
                      item.hims_d_vitals_header_id === 1
                        ? "col-3"
                        : item.hims_d_vitals_header_id >= 3
                        ? "col-3 vitalTopFld15"
                        : item.hims_d_vitals_header_id === 5 ||
                          item.hims_d_vitals_header_id === 6
                        ? "col-3 vitalTopFld20"
                        : "col-3";
                    const _name = String(item.vitals_name)
                      .replace(/" "/g, "_")
                      .toLowerCase();
                    const _disable = _name === "bmi" ? true : false;
                    const _dependent =
                      item.hims_d_vitals_header_id === 8 ||
                      item.hims_d_vitals_header_id === 9
                        ? { dependent: "bp_position" }
                        : item.hims_d_vitals_header_id === 4
                        ? { dependent: "temperature_from" }
                        : {};
                    return (
                      <React.Fragment key={index}>
                        {item.hims_d_vitals_header_id === 4 ? (
                          <React.Fragment>
                            <AlagehAutoComplete
                              div={{ className: "col-3" }}
                              label={{
                                fieldName: "temp_frm"
                              }}
                              selector={{
                                name: "temperature_from",
                                className: "select-fld",
                                value: this.state.temperature_from,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.TEMP_FROM
                                },

                                onChange: this.dropDownHandle.bind(this)
                              }}
                            />
                          </React.Fragment>
                        ) : item.hims_d_vitals_header_id === 8 ? (
                          <AlagehAutoComplete
                            div={{ className: "col-3" }}
                            label={{
                              fieldName: "bp",
                              fieldName: "BP_type"
                            }}
                            selector={{
                              name: "bp_position",
                              className: "select-fld",
                              value: this.state.bp_position,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.BP_POSITION
                              },
                              onChange: this.dropDownHandle.bind(this)
                            }}
                          />
                        ) : null}

                        <AlagehFormGroup
                          div={{
                            className: _className,
                            others: { key: index }
                          }}
                          label={{
                            forceLabel:
                              item.uom === "C"
                                ? "°C"
                                : item.uom === "F"
                                ? "°F"
                                : item.vital_short_name +
                                  " (" +
                                  String(item.uom).trim() +
                                  ")",
                            isImp: item.mandatory === 0 ? false : true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: _name,
                            others: {
                              type: "number",
                              min: 0,
                              disabled: _disable,
                              vitalid: item.hims_d_vitals_header_id,
                              formula_value: String(item.uom).trim(),
                              ..._dependent
                            },
                            value: this.state[_name],
                            events: {
                              onChange: this.texthandle.bind(this)
                            }
                          }}
                        />

                        {item.hims_d_vitals_header_id === 4 ? (
                          <AlagehFormGroup
                            div={{ className: "col-3" }}
                            label={{
                              forceLabel: item.uom === "C" ? "°F" : "°C"
                            }}
                            textBox={{
                              className: "txt-fld",
                              disabled: true,
                              value: temperatureConvertion(
                                this.state[_name],
                                item.uom
                              )
                            }}
                          />
                        ) : null}
                        {/* {item.hims_d_vitals_header_id === 8 ? " / " : null} */}
                      </React.Fragment>
                    );
                  })}

                  <AlgaehDateHandler
                    div={{ className: "col-3" }}
                    label={{ fieldName: "rec_date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "recorded_date"
                    }}
                    maxDate={new Date()}
                    events={{
                      onChange: selectedDate => {
                        this.setState({ recorded_date: selectedDate });
                      }
                    }}
                    value={this.state.recorded_date}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-3" }}
                    label={{
                      isImp: true,
                      fieldName: "rec_time"
                    }}
                    textBox={{
                      others: {
                        type: "time"
                      },
                      className: "txt-fld",
                      name: "recorded_time",
                      value: this.state.recorded_time,
                      events: {
                        onChange: this.texthandle.bind(this)
                      }
                    }}
                  />
                </div>
                <hr />
                <h6>Enter Chief Complaints</h6>
                <div className="row">
                  <div className="col-8">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-8" }}
                        label={{
                          fieldName: "chief_cmpln",
                          isImp: false
                        }}
                        selector={{
                          name: "chief_complaint_id",
                          className: "col select-fld",
                          value: this.state.chief_complaint_id,
                          dataSource: {
                            textField: "hpi_description",
                            valueField: "hims_d_hpi_header_id",
                            data: _allUnselectedChiefComp
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-4" }}
                        label={{
                          fieldName: "pain",
                          isImp: false
                        }}
                        selector={{
                          name: "pain",
                          className: "col select-fld",
                          value: this.state.pain,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.PAIN_SCALE
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-4" }}
                        label={{
                          fieldName: "severity",
                          isImp: false
                        }}
                        selector={{
                          name: "severity",
                          className: "col select-fld",
                          value: this.state.severity,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.PAIN_SEVERITY
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />

                      <AlgaehDateHandler
                        div={{ className: "col-4" }}
                        label={{ forceLabel: "Onset Date", isImp: false }}
                        textBox={{
                          className: "txt-fld",
                          name: "onset_date"
                        }}
                        maxDate={new Date()}
                        events={{
                          onChange: this.dateDurationAndInterval.bind(this)
                        }}
                        value={this.state.onset_date}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-4" }}
                        label={{
                          isImp: false,
                          fieldName: "duration"
                        }}
                        textBox={{
                          className: "col txt-fld",
                          name: "duration",
                          number: true,
                          value: this.state.duration,
                          events: {
                            onChange: this.texthandle.bind(this)
                          },
                          others: {
                            min: 0
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-4" }}
                        label={{
                          fieldName: "interval",
                          isImp: false
                        }}
                        selector={{
                          name: "interval",
                          className: "select-fld",
                          value: this.state.interval,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.PAIN_DURATION
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col-12" }}
                        label={{
                          isImp: false,
                          fieldName: "comments"
                        }}
                        textBox={{
                          others: {
                            multiline: true,
                            rows: "2"
                          },
                          className: "txt-fld",
                          name: "comment",
                          value: this.state.comment,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      />
                      <div className="col-12 margin-top-15">
                        <button
                          className="btn btn-primary"
                          onClick={this.addChiefComplainToPatient.bind(this)}
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Vitals End */}
                <hr />

                {/* Chief Complaint First*/}
                <div className="row">
                  <div className="col-12" id="hpi-grid-cntr">
                    <AlgaehDataGrid
                      id="complaint-grid"
                      columns={[
                        {
                          fieldName: "chief_complaint_name",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "complaint_name" }}
                            />
                          ),
                          disabled: true,
                          others: {
                            style: { textAlign: "center" },
                            fixed: "left"
                          }
                        },
                        {
                          fieldName: "pain",
                          label: <AlgaehLabel label={{ fieldName: "pain" }} />,
                          displayTemplate: data => {
                            return (
                              <span>
                                {data.pain === "NH" ? (
                                  <span>No Hurt</span>
                                ) : data.severity === "HLB" ? (
                                  <span>Hurts Little Bit</span>
                                ) : data.severity === "HLM" ? (
                                  <span>Hurts Little More</span>
                                ) : data.severity === "HEM" ? (
                                  <span>Hurts Even More</span>
                                ) : data.severity === "HWL" ? (
                                  <span>Hurts Whole Lot</span>
                                ) : (
                                  <span>Hurts Worst</span>
                                )}
                              </span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                selector={{
                                  name: "pain",
                                  className: "select-fld",
                                  value: row.pain,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.PAIN_SCALE
                                  },
                                  onChange: this.gridLevelUpdate.bind(this, row)
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "severity",
                          label: (
                            <AlgaehLabel label={{ fieldName: "severity" }} />
                          ),
                          displayTemplate: data => {
                            const _serv = Enumerable.from(
                              GlobalVariables.PAIN_SEVERITY
                            )
                              .where(w => w.value === data.severity)
                              .firstOrDefault().name;
                            return (
                              <span>{_serv !== undefined ? _serv : ""}</span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                selector={{
                                  name: "severity",
                                  className: "select-fld",
                                  value: row.severity,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.PAIN_SEVERITY
                                  },
                                  onChange: this.gridLevelUpdate.bind(this, row)
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "onset_date",
                          label: (
                            <AlgaehLabel label={{ fieldName: "onset_date" }} />
                          ),
                          displayTemplate: data => {
                            return new Date(
                              data.onset_date
                            ).toLocaleDateString();
                          },
                          editorTemplate: row => {
                            return (
                              <AlgaehDateHandler
                                textBox={{
                                  className: "txt-fld",
                                  name: "onset_date"
                                }}
                                maxDate={new Date()}
                                events={{
                                  onChange: this.gridLevelUpdate.bind(this, row)
                                }}
                                singleOutput={true}
                                value={row.onset_date}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "duration",
                          label: (
                            <AlgaehLabel label={{ fieldName: "duration" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                textBox={{
                                  className: "txt-fld",
                                  name: "duration",
                                  number: true,
                                  value: row.duration,
                                  events: {
                                    onChange: this.gridLevelUpdate.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    min: 0
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "interval",
                          label: (
                            <AlgaehLabel label={{ fieldName: "interval" }} />
                          ),
                          displayTemplate: data => {
                            return Enumerable.from(
                              GlobalVariables.PAIN_DURATION
                            )
                              .where(w => w.value === data.interval)
                              .firstOrDefault().name;
                          },

                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                selector={{
                                  name: "interval",
                                  className: "select-fld",
                                  value: row.interval,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.PAIN_DURATION
                                  },
                                  onChange: this.gridLevelUpdate.bind(this, row)
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "comment",
                          label: "Comments",
                          displayTemplate: row => {
                            return <span>{row.comment}</span>;
                          },
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                textBox={{
                                  name: "comment",
                                  others: {
                                    multiline: true,
                                    rows: "4"
                                  },
                                  value: row.comment,
                                  events: {
                                    onChange: this.gridLevelUpdate.bind(
                                      this,
                                      row
                                    )
                                  }
                                }}
                              />
                            );
                          }
                        }
                      ]}
                      noDataText="No Chief Complaints Recorded"
                      keyId="patient_id"
                      dataSource={{
                        data: this.state.patChiefComp
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        onDelete: this.onChiefComplaintRowDelete.bind(this),
                        onDone: this.onChiefComplaintRowDone.bind(this)
                      }}
                    />
                  </div>
                </div>
                {/* Chief Complaint End */}

                {/* Notes Start */}
                <hr />
                <h6>Enter Nurse Notes</h6>
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-lg-12" }}
                    label={{
                      forceLabel: "",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "nurse_notes",
                      value: this.state.nurse_notes,
                      others: {
                        multiline: true,
                        rows: "6"
                      },
                      events: {
                        onChange: this.texthandle.bind(this)
                      }
                    }}
                  />
                </div>
                {/* Notes End */}

                <div className="row">
                  <div className="col-12">
                    <button
                      style={{ float: "right" }}
                      onClick={this.savePatientExamn.bind(this)}
                      className="btn btn-primary"
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allchiefcomplaints: state.allchiefcomplaints,
    patient_chief_complaints: state.patient_chief_complaints,
    department_vitals: state.department_vitals
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAllChiefComplaints: AlgaehActions,
      getPatientChiefComplaints: AlgaehActions,
      getDepartmentVitals: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NurseWorkbench)
);
