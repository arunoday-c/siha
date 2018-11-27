import React, { Component } from "react";
import "./nurse_workbench.css";
import moment from "moment";
import { AlgaehLabel, AlagehFormGroup } from "../Wrapper/algaehWrapper";
import Enumerable from "linq";
import algaehLoader from "../Wrapper/fullPageLoader";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import Vitals from "../PatientProfile/Vitals/Vitals";
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
import {
  getAllChiefComplaints,
  getPatientChiefComplaints,
  getDepartmentVitals,
  temperatureConvertion,
  getFormula
} from "./NurseWorkbenchEvents";

class NurseWorkbench extends Component {
  constructor(props) {
    super(props);
    let dateToday = moment().format("YYYY") + moment().format("MM") + "01";
    this.state = {
      my_daylist: [],
      selectedLang: "en",
      data: [],
      selectedHDate: moment(dateToday, "YYYYMMDD")._d,
      fromDate: moment()._d,
      toDate: moment()._d,
      activeDateHeader: moment()._d
    };

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

  dropDownHandle(value) {
    this.setState(
      { [value.name]: value.value },

      () => {
        this.loadListofData();
      }
    );
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

  addChiefComplainToPatient(list) {
    const $this = this;
    let patChiefComp = [];
    patChiefComp.push({
      chief_complaint_id: list.selected.hims_d_hpi_header_id,
      chief_complaint_name: list.selected.hpi_description,
      hpi_description: list.selected.hpi_description,
      Encounter_Date: new Date(),
      nurse_notes: "",
      duration: 0,
      episode_id: this.state.episode_id,
      interval: "D",
      onset_date: new Date(),
      pain: "NH",
      score: 0,
      severity: "MI",
      patient_id: this.state.patient_id,
      recordState: "insert",
      chronic: "N",
      complaint_inactive: "N"
    });

    algaehApiCall({
      uri: "/nurseWorkBench/addPatientNurseChiefComplaints",
      data: patChiefComp,
      onSuccess: response => {
        if (response.data.success) {
          getPatientChiefComplaints($this);
          swalMessage({
            title: "Chief Complaint Recorded",
            type: "success"
          });
        }
      }
    });
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
    const _row = row;

    // algaehApiCall({
    //   uri: "/doctorsWorkBench/updatePatientChiefComplaints",
    //   method: "PUT",
    //   data: { chief_complaints: [_row] },
    //   onSuccess: response => {
    //     if (response.data.success) {
    //       swalMessage({
    //         title:
    //           "Complaint '" +
    //           _row.chief_complaint_name +
    //           "' updated successfuly",
    //         type: "success"
    //       });
    //     }
    //   },
    //   onFailure: error => {
    //     swalMessage({
    //       title: error.message,
    //       type: "error"
    //     });
    //   }
    // });
  }
  onChiefComplaintRowDelete(row) {
    // swal({
    //   title: "Delete Complaint " + row.chief_complaint_name + "?",
    //   type: "warning",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes!",
    //   confirmButtonColor: "#44b8bd",
    //   cancelButtonColor: "#d33",
    //   cancelButtonText: "No"
    // }).then(willDelete => {
    //   if (willDelete.value) {
    //     let data = {
    //       hims_f_episode_chief_complaint_id:
    //         row.hims_f_episode_chief_complaint_id
    //     };
    //     algaehApiCall({
    //       uri: "/doctorsWorkBench/deletePatientChiefComplaints",
    //       data: data,
    //       method: "DELETE",
    //       onSuccess: response => {
    //         if (response.data.success) {
    //           swalMessage({
    //             title: "Record deleted successfully . .",
    //             type: "success"
    //           });
    //           //  this.getPatientChiefComplaintsDetails();
    //           getAllChiefComplaints(this);
    //           Window.global === undefined
    //             ? null
    //             : getPatientChiefComplaints(this);
    //         }
    //       }
    //     });
    //   } else {
    //     swalMessage({
    //       title: "Delete request cancelled",
    //       type: "error"
    //     });
    //   }
    // });
  }

  monthChangeHandler(e) {
    let dt = moment(e.target.value + "-01", "YYYY-MM-DD")._d;
    this.setState({ selectedHDate: dt, activeDateHeader: dt });
  }

  // textHandle(e) {
  //   this.setState({
  //     [e.target.name]: e.target.value
  //   });
  // }

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

  moveToStation(data, e) {
    debugger;
    this.setState({
      patient_name: data.full_name,
      current_patient: data.patient_id,
      episode_id: data.episode_id,
      encounter_id: data.hims_f_patient_encounter_id,
      patient_id: data.patient_id
    });
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
    if (e.target.name === "weight") {
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
      this.props.patient_chief_complaints !== undefined
        ? this.props.patient_chief_complaints.sort((a, b) => {
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
                        .where(w => w.status === "V")
                        .toArray().length
                    }
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <AlagehAutoComplete
                    div={{ className: "col mandatory" }}
                    label={{
                      fieldName: "department_name",
                      isImp: true
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

              <div className="portlet-body">
                {/* Vitals Start */}
                <div className="row margin-bottom-15">
                  {_department_viatals.map((item, index) => {
                    const _className =
                      item.hims_d_vitals_header_id === 1
                        ? "col-6"
                        : item.hims_d_vitals_header_id >= 3
                        ? "col-6 vitalTopFld15"
                        : item.hims_d_vitals_header_id === 5 ||
                          item.hims_d_vitals_header_id === 6
                        ? "col-6 vitalTopFld20"
                        : "col-6";
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
                              div={{ className: "col-6" }}
                              label={{
                                forceLabel: "Temp. From"
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
                            div={{ className: "col-6" }}
                            label={{
                              forceLabel: "BP (mmHg)",
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
                            div={{ className: "col-6" }}
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
                    div={{ className: "col-6" }}
                    label={{ forceLabel: "Recorded Date", isImp: true }}
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
                    div={{ className: "col-6" }}
                    label={{
                      isImp: true,
                      forceLabel: "Recorded Time"
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

                {/* <Vitals /> */}
                {/* Vitals End */}

                {/* ChiefComplaints Start */}

                <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Chief Complaint</h3>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <AlagehAutoComplete
                          selector={{
                            name: "chief_complaint_id",
                            className: "select-fld",
                            value: this.state.chief_complaint_id,
                            dataSource: {
                              textField: "hpi_description",
                              valueField: "hims_d_hpi_header_id",
                              data: _allUnselectedChiefComp
                              //               data: this.props.allchiefcomplaints
                            },
                            onChange: this.addChiefComplainToPatient.bind(this)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div id="hpi-grid-cntr">
                      <AlgaehDataGrid
                        id="complaint-grid"
                        columns={[
                          // {
                          //   fieldName: "hpi_view",
                          //   label: "HPI",
                          //   displayTemplate: row => {
                          //     return (
                          //       <i
                          //         className="fas fa-file-prescription"
                          //         onClick={this.openHPIAddModal.bind(this, row)}
                          //       />
                          //     );
                          //   },
                          //   disabled: true,
                          //   others: {
                          //     fixed: "left",
                          //     resizable: false
                          //   }
                          // },
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
                            label: (
                              <AlgaehLabel label={{ fieldName: "pain" }} />
                            ),
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
                                    onChange: this.gridLevelUpdate.bind(
                                      this,
                                      row
                                    )
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
                              return <span>{_serv}</span>;
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
                                    onChange: this.gridLevelUpdate.bind(
                                      this,
                                      row
                                    )
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "onset_date",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "onset_date" }}
                              />
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
                                    onChange: this.gridLevelUpdate.bind(
                                      this,
                                      row
                                    )
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
                                    onChange: this.gridLevelUpdate.bind(
                                      this,
                                      row
                                    )
                                  }}
                                />
                              );
                            }
                          }
                          // {
                          //   fieldName: "comment",
                          //   label: "Comments",
                          //   displayTemplate: row => {
                          //     return <span>{row.comment}</span>;
                          //   },
                          //   editorTemplate: row => {
                          //     return (
                          //       <AlagehFormGroup
                          //         textBox={{
                          //           name: "comment",
                          //           others: {
                          //             multiline: true,
                          //             rows: "4"
                          //           },
                          //           value: row.comment,
                          //           events: {
                          //             onChange: this.gridLevelUpdate.bind(this, row)
                          //           }
                          //         }}
                          //       />
                          //     );
                          //   }
                          // }
                        ]}
                        noDataText="No More Chief Complaints"
                        keyId="patient_id"
                        dataSource={{
                          data: this.props.patient_chief_complaints
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
                </div>

                {/* Chief Complaint End */}

                {/* Notes Start */}
                <div className="portlet portlet-bordered box-shadow-normal margin-top-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Nurse Notes</h3>
                    </div>
                  </div>

                  <div className="portlet-body">
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
                  </div>
                </div>
                {/* Notes End */}

                <div style={{ float: "right" }}>
                  <button className="btn btn-primary">SAVE</button>
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
