import React, { Component } from "react";
import "./chiefcomplaints.css";
import "react-rangeslider/lib/index.css";
import Slider from "react-rangeslider";
import Modal from "@material-ui/core/Modal";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import {
  getAllChiefComplaints,
  getPatientChiefComplaints
} from "./ChiefComplaintsHandlers";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import moment from "moment";
import {
  algaehApiCall,
  cancelRequest,
  swalMessage
} from "../../../utils/algaehApiCall";
import Enumerable from "linq";
import swal from "sweetalert2";

// let patChiefComplain = [];

class ChiefComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openComplain: false,
      openHpiModal: false,
      patientChiefComplains: [],
      chief_complaint_name: null,
      chief_complaint_id: null,
      hims_f_episode_chief_complaint_id: null,
      hims_f_patient_encounter_id: null,
      pain: "NH",
      score: 0,
      severity: "MI",
      onset_date: new Date(),
      episode_id: "",
      interval: "",
      duration: 0,
      comment: "",
      chiefComplaints_Inactive: false,
      masterChiefComplaints: []
    };

    this.handleClose = this.handleClose.bind(this);

    if (
      this.props.patient_chief_complaints === undefined ||
      this.props.patient_chief_complaints.length === 0
    ) {
      getPatientChiefComplaints(this);
    } else {
      const _patient = Enumerable.from(
        this.props.patient_chief_complaints
      ).firstOrDefault();
      if (_patient !== undefined) {
        const _patient_id = _patient.patient_id;
        if (_patient_id !== Window.global.current_patient) {
          getPatientChiefComplaints(this);
        }
      }
    }
    if (
      this.props.allchiefcomplaints === undefined ||
      this.props.allchiefcomplaints.length === 0
    ) {
      getAllChiefComplaints(this);
    }
  }

  componentWillUnmount() {
    cancelRequest("getChiefComplaints");
    cancelRequest("getPatientChiefComplaints");
  }

  texthandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  showconfirmDialog(id) {
    swal({
      title: "Are you sure you want to delete this Chief Complaint?",
      type: "warning",

      showCancelButton: true,
      cancelButtonText: "No",
      confirmButtonText: "Yes !"
    }).then(willDelete => {
      if (willDelete.value) {
        let data = { hims_f_episode_chief_complaint_id: id };
        algaehApiCall({
          uri: "/doctorsWorkBench/deletePatientChiefComplaints",
          data: data,
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });
              //  this.getPatientChiefComplaintsDetails();
              getAllChiefComplaints(this);
              getPatientChiefComplaints(this);
            }
          },
          onFailure: error => {}
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "success"
        });
      }
    });
  }

  addNewChiefComplaint() {
    let _newValues = document.getElementsByName("chief_complaint_id")[0].value;
    if (_newValues === "") {
      swalMessage({ title: "No new chief complaint found.", type: "warning" });
      return;
    }
    const new_chief_complaint = _newValues.split(",");
    let $that = this;
    algaehApiCall({
      uri: "/doctorsWorkBench/addNewChiefComplaint",
      data: Enumerable.from(new_chief_complaint)
        .select(s => {
          return {
            hpi_description: s
          };
        })
        .toArray(),
      method: "post",
      onSuccess: response => {
        if (response.data.success) {
          getAllChiefComplaints($that, result => {
            let _currentChiefComplaints = $that.state.patientChiefComplains;
            let _masterChief = result;
            Enumerable.from(new_chief_complaint)
              .select(s => {
                let _firstOrDef = Enumerable.from(result)
                  .where(w => w.hpi_description === s)
                  .firstOrDefault();
                _currentChiefComplaints.push({
                  Encounter_Date: new Date(),
                  chief_complaint_id: _firstOrDef.hims_d_hpi_header_id,
                  chief_complaint_name: _firstOrDef.hpi_description,
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
                  complaint_inactive: "N",
                  complaint_inactive_date: null
                });
                if (_firstOrDef !== undefined)
                  _masterChief.splice(_firstOrDef, 1);
              })
              .toArray();

            $that.setState({
              patientChiefComplains: _currentChiefComplaints.sort((a, b) => {
                return a.chief_complaint_id - b.chief_complaint_id;
              }),
              masterChiefComplaints: _masterChief
            });
            swalMessage({
              title: "New complaint added successfully",
              type: "success"
            });
          });
        }
      }
    });
  }

  deleteChiefComplain(data, e) {
    this.showconfirmDialog(data);
  }

  deleteChiefComplaintFromGrid(data) {
    this.showconfirmDialog(data.hims_f_episode_chief_complaint_id);
  }

  dropDownHandle(data) {
    const updateScroe =
      data.selected.score !== undefined ? { score: data.selected.score } : {};

    this.setState({ [data.name]: data.value, ...updateScroe }, () => {
      this.settingUpdateChiefComplaints({
        currentTarget: {
          name: data.name,
          value: data.value
        }
      });
    });
  }

  handleClose() {
    this.addChiefComplain();
    this.updatePatientChiefComplaints();
  }
  addChiefComplain() {
    const data = Enumerable.from(this.state.patientChiefComplains)
      .where(w => w.recordState === "insert")
      .toArray();

    if (data.length !== 0) {
      algaehApiCall({
        uri: "/doctorsWorkBench/addPatientChiefComplaints",
        data: data,
        onSuccess: response => {
          if (response.data.success) {
            this.setState({
              openComplain: false,
              openHpiModal: false,
              hims_f_episode_chief_complaint_id: null
            });
            getPatientChiefComplaints(this);
            swalMessage({
              title: "New Complaints are updated",
              type: "success"
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
    } else {
      this.setState({
        openComplain: false,
        openHpiModal: false
      });
    }
  }

  updatePatientChiefComplaints() {
    const data = Enumerable.from(this.state.patientChiefComplains)
      .where(w => w.recordState === "update")
      .toArray();
    if (data.length !== 0) {
      algaehApiCall({
        uri: "/doctorsWorkBench/updatePatientChiefComplaints",
        method: "PUT",
        data: { chief_complaints: data },
        onSuccess: response => {
          if (response.data.success) {
            this.setState({
              openComplain: false,
              openHpiModal: false,
              hims_f_episode_chief_complaint_id: null
            });
            swalMessage({
              title: "Modified Complaints are updated",
              type: "success"
            });
            getPatientChiefComplaints(this);
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    } else {
      this.setState({
        openComplain: false,
        openHpiModal: false
      });
    }
  }

  fillComplainDetails(data, e) {
    this.setState({
      hims_f_episode_chief_complaint_id: data.chief_complaint_id,
      onset_date: data.onset_date,
      chief_complaint_name: data.chief_complaint_name,
      duration: data.duration,
      interval: data.interval,
      severity: data.severity,
      score: data.score,
      pain: data.pain,
      comment: data.comment
    });
  }
  openHPIAddModal(data, e) {
    this.loadHPIDetails({
      inputParamter: {
        hpi_header_id: data.hims_f_episode_chief_complaint_id
      },
      onSuccess: response => {
        debugger;
        this.setState({
          openHpiModal: true,
          hims_f_episode_chief_complaint_id:
            data.hims_f_episode_chief_complaint_id
        });
      }
    });
  }
  loadHPIDetails(options) {
    algaehApiCall({
      uri: "/hpi/getHpiElements",
      method: "GET",
      data: options.inputParamter,
      onSuccess: response => {
        if (response.data.success) {
          options.onSuccess(response);
        }
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

  calculateDurationDate(e) {
    if (parseFloat(e.currentTarget.value) < 0) {
      swalMessage({
        title: "Invalid input, Duration cannot be negative.",
        type: "error"
      });

      this.setState({
        duration: 0
      });
      return;
    }

    let intervalRow = Enumerable.from(GlobalVariables.PAIN_DURATION)
      .where(w => w.value === this.state.interval)
      .firstOrDefault();
    let interval =
      intervalRow === undefined
        ? "days"
        : String(intervalRow.name).toLowerCase();
    let selectedDate = moment().add(
      -parseFloat(e.currentTarget.value),
      interval
    );
    const ifNointerval = intervalRow === undefined ? { interval: "D" } : {};
    const name = e.currentTarget.name;
    const cValue = e.currentTarget.value;
    this.setState(
      {
        onset_date: selectedDate,
        duration: e.currentTarget.value,
        ...ifNointerval
      },
      () => {
        this.settingUpdateChiefComplaints({
          currentTarget: {
            name: name,
            value: cValue
          }
        });
        if (ifNointerval.interval !== undefined) {
          this.settingUpdateChiefComplaints({
            currentTarget: {
              name: "interval",
              value: ifNointerval.interval
            }
          });
        }
      }
    );
  }
  addChiefComplainToPatient(list) {
    debugger;

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
      complaint_inactive: "N",
      complaint_inactive_date: null
    });
    algaehApiCall({
      uri: "/doctorsWorkBench/addPatientChiefComplaints",
      data: patChiefComp,
      onSuccess: response => {
        if (response.data.success) {
          getPatientChiefComplaints($this);
          swalMessage({
            title: "Added chief complaint",
            type: "success"
          });
        }
      }
    });
    // swalMessage({
    //   title: "Added chief complaint",
    //   type: "success"
    // });
    // this.setState({
    //   patientChiefComplains: patChiefComp.sort((a, b) => {
    //     return a.chief_complaint_id - b.chief_complaint_id;
    //   }),
    //   masterChiefComplaints: this.masterChiefComplaintsSortList(patChiefComp)
    // });
  }

  settingUpdateChiefComplaints(e) {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    let patientComp = this.state.patientChiefComplains;
    let newPatientDtl = Enumerable.from(patientComp)
      .where(
        w =>
          w.chief_complaint_id === this.state.hims_f_episode_chief_complaint_id
      )
      .firstOrDefault();
    if (newPatientDtl !== undefined) {
      let index = patientComp.indexOf(newPatientDtl);
      patientComp.splice(index, 1);
      index = index - 1;
      newPatientDtl[name] = value;
      newPatientDtl["chronic"] =
        this.state.chronic === undefined ? "N" : this.state.chronic;
      newPatientDtl["complaint_inactive"] =
        this.state.complaint_inactive === undefined
          ? "N"
          : this.state.complaint_inactive;
      newPatientDtl["complaint_inactive_date"] =
        this.state.complaint_inactive_date === null
          ? new Date()
          : this.state.complaint_inactive_date;
      newPatientDtl["recordState"] = "update";
      patientComp.splice(index, 0, newPatientDtl);
      this.setState({
        patientChiefComplains: patientComp.sort((a, b) => {
          return a.chief_complaint_id - b.chief_complaint_id;
        })
      });
      swalMessage({ title: "Complaint added successfully", type: "success" });
    }
  }

  chronicCheckBoxHandler(e) {
    const _chronic = e.currentTarget.checked ? "Y" : "N";
    this.setState(
      {
        chronic: _chronic
      },
      () => {
        this.settingUpdateChiefComplaints({
          currentTarget: {
            name: "chronic",
            value: _chronic
          }
        });
      }
    );
  }
  inactiveCheckBoxHandler(e) {
    const _inactive = e.currentTarget.checked ? "Y" : "N";
    this.setState(
      {
        complaint_inactive_date: new Date(),
        complaint_inactive: _inactive
      },
      () => {
        this.settingUpdateChiefComplaints({
          currentTarget: {
            name: "complaint_inactive_date",
            value: new Date()
          }
        });
        this.settingUpdateChiefComplaints({
          currentTarget: {
            name: "complaint_inactive",
            value: _inactive
          }
        });
      }
    );
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
    return { duration, interval };
  }
  durationToDateAndInterval(duration, interval) {
    const _interval = Enumerable.from(GlobalVariables.PAIN_DURATION)
      .where(w => w.value === interval)
      .firstOrDefault().name;
    const _date = moment().add(-duration, _interval.toLowerCase());
    return { interval, onset_date: _date._d };
  }

  gridLevelUpdate(row, e) {
    debugger;
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

    algaehApiCall({
      uri: "/doctorsWorkBench/updatePatientChiefComplaints",
      method: "PUT",
      data: { chief_complaints: [_row] },
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title:
              "Complaint '" +
              _row.chief_complaint_name +
              "' updated successfuly",
            type: "success"
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
        let data = {
          hims_f_episode_chief_complaint_id:
            row.hims_f_episode_chief_complaint_id
        };

        algaehApiCall({
          uri: "/doctorsWorkBench/deletePatientChiefComplaints",
          data: data,
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });
              //  this.getPatientChiefComplaintsDetails();
              getAllChiefComplaints(this);
              getPatientChiefComplaints(this);
            }
          },
          onFailure: error => {}
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
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

    return (
      <React.Fragment>
        {/* HPI Modal Start */}
        <Modal open={this.state.openHpiModal}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>Add / Edit History of Patient Illness</h4>
                </div>
                <div className="col-lg-4">
                  <button type="button" className="" onClick={this.handleClose}>
                    <i className="fas fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-12 popupInner">
              <div className="row">
                <div className="col-lg-4 popLeftDiv">
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-12" }}
                      label={{
                        forceLabel: "Chief Complaint"
                      }}
                      selector={{
                        name: "hims_f_episode_chief_complaint_id",
                        className: "select-fld",
                        value: this.state.hims_f_episode_chief_complaint_id,
                        dataSource: {
                          textField: "chief_complaint_name",
                          valueField: "hims_f_episode_chief_complaint_id",
                          data: patChiefComplain
                        },
                        onChange: this.dropDownHandle.bind(this)
                      }}
                    />
                    <AlgaehDateHandler
                      div={{ className: "col-lg-12" }}
                      label={{
                        forceLabel: "Duration / Onset",
                        isImp: false
                      }}
                      textBox={{
                        name: "onset_date",
                        others: {
                          disabled: true
                        }
                      }}
                      maxDate={new Date()}
                      value={this.state.onset_date}
                      events={{
                        onChange: selectDate => {}
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-6" }}
                      label={{
                        forceLabel: "Location",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "location",

                        //value: this.state.pain,
                        events: {}
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-6" }}
                      label={{
                        forceLabel: "Quality",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "quality",

                        //value: this.state.pain,
                        events: {}
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-6" }}
                      label={{
                        forceLabel: "Context",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "context",

                        //value: this.state.pain,
                        events: {}
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-6" }}
                      label={{
                        forceLabel: "Timing",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "timing",

                        //value: this.state.pain,
                        events: {}
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-12" }}
                      label={{
                        forceLabel: "Modifying Factor",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "modifying_factor",

                        //value: this.state.pain,
                        events: {}
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-12" }}
                      label={{
                        forceLabel: "Associated Symptoms",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "associated_symptoms",

                        //value: this.state.pain,
                        events: {}
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-lg-12" }}
                      label={{
                        forceLabel: "Remarks",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "remarks",
                        others: {
                          multiline: true,
                          rows: "4"
                        },
                        //value: this.state.pain,
                        events: {}
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-8 popRightDiv">
                  <div className="row">
                    <div className="col-lg-12" id="hpi-grid-popup-cntr">
                      <AlgaehDataGrid
                        id="hpi-grid"
                        columns={[
                          {
                            fieldName: "complaint",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Complaint" }}
                              />
                            )
                          },
                          {
                            fieldName: "complaint",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Duration / Onset" }}
                              />
                            )
                          },
                          {
                            fieldName: "complaint",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Location" }} />
                            )
                          },
                          {
                            fieldName: "complaint",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Quality" }} />
                            )
                          },
                          {
                            fieldName: "complaint",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Context" }} />
                            )
                          },
                          {
                            fieldName: "complaint",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Timing" }} />
                            )
                          },
                          {
                            fieldName: "complaint",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Modifying Factor" }}
                              />
                            )
                          },
                          {
                            fieldName: "complaint",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Associated Systems" }}
                              />
                            )
                          },
                          {
                            fieldName: "complaint",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Remarks" }} />
                            )
                          },
                          {
                            fieldName: "complaint",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Pain Scale" }}
                              />
                            )
                          },
                          {
                            fieldName: "complaint",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Severity" }} />
                            )
                          },
                          {
                            fieldName: "complaint",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Entered By" }}
                              />
                            )
                          },
                          {
                            fieldName: "complaint",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Action" }} />
                            )
                          }
                        ]}
                        keyId="hpi"
                        dataSource={{
                          data: []
                        }}
                        isEditable={false}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        events={{
                          onDelete: row => {},
                          onEdit: row => {},
                          onDone: row => {}
                        }}
                      />
                    </div>
                    <AlagehFormGroup
                      div={{ className: "col-lg-12" }}
                      label={{
                        forceLabel: "Comments",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "comments",
                        others: {
                          multiline: true,
                          rows: "4"
                        },
                        //value: this.state.pain,
                        events: {}
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4">
                    <button className="btn btn-primary">Add</button>
                    <button className="btn btn-default">Clear</button>
                  </div>
                  <div className="col-lg-8">
                    <button
                      className="btn btn-default"
                      onClick={this.handleClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {/* HPI MOdal End */}

        {/* BEGIN Portlet PORTLET */}
        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Chief Complaint</h3>
            </div>
            <div>
              <AlagehAutoComplete
                selector={{
                  name: "chief_complaint_id",
                  className: "select-fld",
                  value: this.state.chief_complaint_id,
                  dataSource: {
                    textField: "hpi_description",
                    valueField: "hims_d_hpi_header_id",
                    data: _allUnselectedChiefComp
                  },
                  onChange: this.addChiefComplainToPatient.bind(this)
                }}
              />
            </div>
          </div>
          <div className="portlet-body">
            <div id="hpi-grid-cntr">
              <AlgaehDataGrid
                id="complaint-grid"
                columns={[
                  {
                    fieldName: "hpi_view",
                    label: "HPI",
                    displayTemplate: row => {
                      return (
                        <i
                          className="fas fa-file-prescription"
                          onClick={this.openHPIAddModal.bind(this, row)}
                        />
                      );
                    },
                    disabled: true,
                    others: {
                      fixed: "left",
                      resizable: false
                    }
                  },
                  {
                    fieldName: "chief_complaint_name",
                    label: (
                      <AlgaehLabel label={{ fieldName: "complaint_name" }} />
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
                    label: <AlgaehLabel label={{ fieldName: "severity" }} />,
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
                            onChange: this.gridLevelUpdate.bind(this, row)
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "onset_date",
                    label: <AlgaehLabel label={{ fieldName: "onset_date" }} />,
                    displayTemplate: data => {
                      return new Date(data.onset_date).toLocaleDateString();
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
                    label: <AlgaehLabel label={{ fieldName: "duration" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          textBox={{
                            className: "txt-fld",
                            name: "duration",
                            number: true,
                            value: row.duration,
                            events: {
                              onChange: this.gridLevelUpdate.bind(this, row)
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
                    label: <AlgaehLabel label={{ fieldName: "interval" }} />,
                    displayTemplate: data => {
                      return Enumerable.from(GlobalVariables.PAIN_DURATION)
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
                    fieldName: "chronic",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "chronic", forceLabel: "Chronic" }}
                      />
                    ),
                    displayTemplate: row => {
                      const _chronic = row.chronic === "N" ? "No" : "Yes";
                      return <span>{_chronic}</span>;
                    },
                    editorTemplate: row => {
                      const _chronic = row.chronic === "N" ? false : true;
                      return (
                        <input
                          type="checkbox"
                          name="chronic"
                          checked={_chronic}
                          onChange={this.gridLevelUpdate.bind(this, row)}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "complaint_inactive_date",
                    label: (
                      <AlgaehLabel
                        label={{
                          fieldName: "complaint_inactive_date",
                          forceLabel: "Inactive"
                        }}
                      />
                    ),
                    displayTemplate: row => {
                      const _inactive =
                        row.complaint_inactive === "N" ? "No" : "Yes";
                      return <span>{_inactive}</span>;
                    },
                    editorTemplate: row => {
                      const _inactive =
                        row.complaint_inactive === "N" ? false : true;
                      return (
                        <input
                          type="checkbox"
                          name="complaint_inactive"
                          checked={_inactive}
                          onChange={this.gridLevelUpdate.bind(this, row)}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "complaint_inactive_date",
                    label: "Inactive Date",
                    displayTemplate: row => {
                      const _inactive_date =
                        row.complaint_inactive_date !== null
                          ? new Date(
                              String(row.complaint_inactive_date)
                            ).toLocaleDateString()
                          : "";
                      return <span>{_inactive_date}</span>;
                    },
                    disabled: true
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
                              onChange: this.gridLevelUpdate.bind(this, row)
                            }
                          }}
                        />
                      );
                    }
                  }
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
        {/* END Portlet PORTLET */}
      </React.Fragment>
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
  )(ChiefComplaints)
);
