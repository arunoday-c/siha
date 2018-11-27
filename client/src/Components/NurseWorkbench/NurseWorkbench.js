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
  getPatientChiefComplaints
} from "./NurseWorkbenchEvents";
import { setGlobal } from "../../utils/GlobalFunctions";

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
      comment: "",
      duration: 0,
      episode_id: Window.global["episode_id"],
      interval: "D",
      onset_date: new Date(),
      pain: "NH",
      score: 0,
      severity: "MI",
      patient_id: Window.global["current_patient"],
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

  textHandle(e) {
    this.setState({
      [e.target.name]: e.target.value
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

  moveToStation(e) {
    const patient_encounter_id = e.currentTarget.getAttribute(
      "data-encounterid"
    );
    const patient_id = e.currentTarget.getAttribute("data-patientid");

    setGlobal({
      current_patient: patient_id,
      episode_id: patient_encounter_id
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

                      // this.state.data.length
                    }
                  </span>
                </div>
              </div>

              <div className="portlet-body">
                <div className="opPatientList">
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
                            onClick={this.moveToStation.bind(this)}
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
                    <AlgaehLabel
                      label={{
                        fieldName: "encounter_list",
                        returnText: "true"
                      }}
                    />
                  </h3>
                </div>
                <div className="actions rightLabelCount">Station</div>
              </div>

              <div className="portlet-body">
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

                {/* Vitals Start */}
                <Vitals />
                {/* Vitals End */}

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
                            onChange: this.textHandle.bind(this)
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
    patient_chief_complaints: state.patient_chief_complaints
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAllChiefComplaints: AlgaehActions,
      getPatientChiefComplaints: AlgaehActions
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
