import React, { Component } from "react";
import "./chiefcomplaints.scss";

import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehModalPopUp
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
      hims_d_hpi_header_id: null,
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
      masterChiefComplaints: [],
      HPI_masters: {},
      location: [],
      quality: [],
      context: [],
      timing: [],
      modifying_factor: [],
      associated_symptoms: [],
      patientHPIElements: []
    };

    this.handleClose = this.handleClose.bind(this);

    if (
      this.props.patient_chief_complaints === undefined ||
      this.props.patient_chief_complaints.length === 0
    ) {
      if (Window.global !== undefined) {
        getPatientChiefComplaints(this);
      }
      // Window.global === undefined ? null : getPatientChiefComplaints(this);
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
    this.setState({ [data.name]: data.value });
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
        hpi_header_id: data.hims_d_hpi_header_id
      },
      that: this,
      onSuccess: response => {
        let _ResponseSplit = {};
        Enumerable.from(response.data.records)
          .groupBy("$.element_type", null, (k, g) => {
            switch (k) {
              case "L":
                _ResponseSplit["location"] = g.getSource();
                break;
              case "Q":
                _ResponseSplit["quality"] = g.getSource();
                break;
              case "C":
                _ResponseSplit["context"] = g.getSource();
                break;
              case "T":
                _ResponseSplit["timing"] = g.getSource();
                break;
              case "M":
                _ResponseSplit["modifying_factor"] = g.getSource();
                break;
              case "A":
                _ResponseSplit["associated_symptoms"] = g.getSource();
                break;
              default:
                break;
            }
          })
          .toArray();

        this.setState({
          openHpiModal: true,
          hims_f_episode_chief_complaint_id:
            data.hims_f_episode_chief_complaint_id,
          hims_d_hpi_header_id: data.hims_d_hpi_header_id,
          HPI_masters: _ResponseSplit,
          location: [],
          quality: [],
          context: [],
          timing: [],
          modifying_factor: [],
          associated_symptoms: []
        });
      }
    });
  }

  addNewLocation(e) {
    const _elemntType = e.currentTarget.getAttribute("elementtype");
    const _elemntFetch = e.currentTarget.getAttribute("elementfetch");
    const _element_description = document.getElementsByName(_elemntFetch)[0]
      .value;
    const that = this;
    algaehApiCall({
      uri: "/hpi/addHpiElement",
      method: "POST",
      data: {
        hpi_header_id: this.state.hims_d_hpi_header_id,
        element_description: _element_description,
        element_type: _elemntType,
        patient_id: Window.global.current_patient,
        episode_id: Window.global.episode_id
      },
      onSuccess: response => {
        if (response.data.success) {
          that.openHPIAddModal(
            {
              hims_d_hpi_header_id: that.state.hims_d_hpi_header_id,
              hims_f_episode_chief_complaint_id:
                that.state.hims_f_episode_chief_complaint_id
            },
            null
          );
          swalMessage({
            title: "'" + _element_description + "', successfully added",
            type: "success"
          });
        }
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
    algaehApiCall({
      uri: "/hpi/getPatientHpi",
      method: "GET",
      data: {
        episode_id: Window.global.episode_id
      },
      onSuccess: response => {
        if (response.data.success)
          options.that.setState({ patientHPIElements: response.data.records });
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
            title: "Chief Complaint Recorded",
            type: "success"
          });
        }
      }
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
      confirmButtonText: "Yes",
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

              if (Window.global !== undefined) {
                getPatientChiefComplaints(this);
              }
              // Window.global === undefined
              //   ? null
              //   : getPatientChiefComplaints(this);
            }
          }
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  HPIDropdownHandle(e) {
    // this.setState({
    //   [e.name]: Enumerable.from(e.arrayList)
    //     .select(s => s.displayValue)
    //     .toArray()
    // });

    this.setState({
      [e.name]: e.value
    });
  }

  HPIElementsSaveToPatient(e) {
    let _hpi_details_ids = [];
    Enumerable.from(this.state.location)
      .select(s => {
        _hpi_details_ids.push({ hpi_detail_id: s });
      })
      .toArray();
    Enumerable.from(this.state.quality)
      .select(s => {
        _hpi_details_ids.push({ hpi_detail_id: s });
      })
      .toArray();
    Enumerable.from(this.state.context)
      .select(s => {
        _hpi_details_ids.push({ hpi_detail_id: s });
      })
      .toArray();
    Enumerable.from(this.state.timing)
      .select(s => {
        _hpi_details_ids.push({ hpi_detail_id: s });
      })
      .toArray();
    Enumerable.from(this.state.modifying_factor)
      .select(s => {
        _hpi_details_ids.push({ hpi_detail_id: s });
      })
      .toArray();
    Enumerable.from(this.state.associated_symptoms)
      .select(s => {
        _hpi_details_ids.push({ hpi_detail_id: s });
      })
      .toArray();

    const that = this;
    algaehApiCall({
      uri: "/hpi/addPatientHpi",
      data: {
        episode_id: Window.global["episode_id"],
        patient_id: Window.global["current_patient"],
        hpi_header_id: this.state.hims_d_hpi_header_id,
        hpi_detail_ids: _hpi_details_ids
      },
      method: "POST",
      onSuccess: response => {
        if (response.data.success) {
          algaehApiCall({
            uri: "/hpi/getPatientHpi",
            method: "GET",
            data: {
              episode_id: Window.global.episode_id
            },
            onSuccess: responsePatient => {
              if (response.data.success) {
                that.setState({
                  patientHPIElements: responsePatient.data.records
                });
                swalMessage({
                  title: "Record save successfully . .",
                  type: "success"
                });
              }
            }
          });
        }
      }
    });
  }
  CleanHPIElements() {
    this.setState({
      location: [],
      quality: [],
      context: [],
      timing: [],
      modifying_factor: [],
      associated_symptoms: []
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
    const _HPI = this.state.HPI_masters;
    return (
      <React.Fragment>
        <AlgaehModalPopUp
          events={{
            onClose: this.handleClose.bind(this)
          }}
          title="Add / Edit History of Present Illness"
          openPopup={this.state.openHpiModal}
        >
          <div className="col-lg-12 popupInner">
            <div className="row">
              <div className="col-lg-3 popLeftDiv">
                <div className="row" id="hpiElements_area">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-12" }}
                    label={{
                      fieldName: "chief_cmpln"
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
                      fieldName: "duration_onset",
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
                  <div className="col-12">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-10" }}
                        label={{
                          fieldName: "hpiArea"
                        }}
                        selector={{
                          name: "location",
                          className: "select-fld",
                          value: this.state.location,
                          // multiselect: true,
                          dataSource: {
                            textField: "element_description",
                            valueField: "hims_d_hpi_details_id",
                            data: _HPI !== undefined ? _HPI.location : []
                          },
                          onChange: this.HPIDropdownHandle.bind(this)
                        }}
                      />
                      <div className="actions col-2">
                        <a
                          style={{ marginTop: 22, marginLeft: -18 }}
                          className="btn btn-primary btn-circle active"
                          elementtype="L"
                          elementfetch="location"
                          onClick={this.addNewLocation.bind(this)}
                        >
                          <i className="fas fa-plus" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-10" }}
                        label={{
                          fieldName: "qlty"
                        }}
                        selector={{
                          name: "quality",
                          className: "select-fld",
                          value: this.state.quality,
                          // multiselect: true,
                          dataSource: {
                            textField: "element_description",
                            valueField: "hims_d_hpi_details_id",
                            data: _HPI !== undefined ? _HPI.quality : []
                          },
                          onChange: this.HPIDropdownHandle.bind(this)
                        }}
                      />
                      <div className="actions col-2">
                        <a
                          style={{ marginTop: 22, marginLeft: -18 }}
                          className="btn btn-primary btn-circle active"
                          elementtype="Q"
                          elementfetch="quality"
                          onClick={this.addNewLocation.bind(this)}
                        >
                          <i className="fas fa-plus" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-10" }}
                        label={{
                          fieldName: "ctx"
                        }}
                        selector={{
                          name: "context",
                          className: "select-fld",
                          value: this.state.context,
                          // multiselect: true,
                          dataSource: {
                            textField: "element_description",
                            valueField: "hims_d_hpi_details_id",
                            data: _HPI !== undefined ? _HPI.context : []
                          },
                          onChange: this.HPIDropdownHandle.bind(this)
                        }}
                      />

                      <div className="actions col-2">
                        <a
                          style={{ marginTop: 22, marginLeft: -18 }}
                          className="btn btn-primary btn-circle active"
                          elementtype="C"
                          elementfetch="context"
                          onClick={this.addNewLocation.bind(this)}
                        >
                          <i className="fas fa-plus" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-10" }}
                        label={{
                          fieldName: "timing"
                        }}
                        selector={{
                          name: "timing",
                          className: "select-fld",
                          // multiselect: true,
                          value: this.state.timing,
                          dataSource: {
                            textField: "element_description",
                            valueField: "hims_d_hpi_details_id",
                            data: _HPI !== undefined ? _HPI.timing : []
                          },
                          onChange: this.HPIDropdownHandle.bind(this)
                        }}
                      />

                      <div className="actions col-2">
                        <a
                          style={{ marginTop: 22, marginLeft: -18 }}
                          className="btn btn-primary btn-circle active"
                          elementtype="T"
                          elementfetch="timing"
                          onClick={this.addNewLocation.bind(this)}
                        >
                          <i className="fas fa-plus" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-10" }}
                        label={{
                          fieldName: "mdfyng_fctr"
                        }}
                        selector={{
                          name: "modifying_factor",
                          className: "select-fld",
                          // multiselect: true,
                          value: this.state.modifying_factor,
                          dataSource: {
                            textField: "element_description",
                            valueField: "hims_d_hpi_details_id",
                            data:
                              _HPI !== undefined ? _HPI.modifying_factor : []
                          },
                          onChange: this.HPIDropdownHandle.bind(this)
                        }}
                      />

                      <div className="actions col-2">
                        <a
                          style={{ marginTop: 22, marginLeft: -18 }}
                          className="btn btn-primary btn-circle active"
                          elementtype="M"
                          elementfetch="modifying_factor"
                          onClick={this.addNewLocation.bind(this)}
                        >
                          <i className="fas fa-plus" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-10" }}
                        label={{
                          fieldName: "ast_symptms"
                        }}
                        selector={{
                          name: "associated_symptoms",
                          className: "select-fld",
                          value: this.state.associated_symptoms,
                          // multiselect: true,
                          dataSource: {
                            textField: "element_description",
                            valueField: "hims_d_hpi_details_id",
                            data:
                              _HPI !== undefined ? _HPI.associated_symptoms : []
                          },
                          onChange: this.HPIDropdownHandle.bind(this)
                        }}
                      />

                      <div className="actions col-2">
                        <a
                          style={{ marginTop: 22, marginLeft: -18 }}
                          className="btn btn-primary btn-circle active"
                          elementtype="A"
                          elementfetch="associated_symptoms"
                          onClick={this.addNewLocation.bind(this)}
                        >
                          <i className="fas fa-plus" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 popRightDiv">
                <div className="row margin-top-15">
                  <div className="col-lg-12" id="hpi-grid-popup-cntr">
                    <AlgaehDataGrid
                      id="hpi-grid"
                      columns={[
                        {
                          fieldName: "chief_complaint",
                          label: (
                            <AlgaehLabel label={{ fieldName: "chief_cmpln" }} />
                          )
                        },
                        {
                          fieldName: "element_type",
                          label: (
                            <AlgaehLabel label={{ fieldName: "hpi_type" }} />
                          ),
                          displayTemplate: row => (
                            <span>
                              {row.element_type === "L"
                                ? "Area"
                                : row.element_type === "Q"
                                ? "Quality"
                                : row.element_type === "C"
                                ? "Context"
                                : row.element_type === "T"
                                ? "Timing"
                                : row.element_type === "M"
                                ? "Modification Factor"
                                : row.element_type === "A"
                                ? "Associated Symptoms"
                                : ""}
                            </span>
                          )
                        },
                        {
                          fieldName: "element_description",
                          label: (
                            <AlgaehLabel label={{ fieldName: "hpi_desc" }} />
                          )
                        }
                      ]}
                      keyId="hpi"
                      dataSource={{
                        data: this.state.patientHPIElements
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
                      fieldName: "cmts",
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
                <div className="col-lg-3">
                  <button
                    className="btn btn-primary"
                    onClick={this.HPIElementsSaveToPatient.bind(this)}
                  >
                    Add
                  </button>
                  <button
                    className="btn btn-default"
                    onClick={this.CleanHPIElements.bind(this)}
                  >
                    Clear
                  </button>
                </div>
                <div className="col-lg-9">
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
        </AlgaehModalPopUp>
        {/* HPI MOdal End */}

        {/* BEGIN Portlet PORTLET */}
        <div className="portlet portlet-bordered margin-bottom-15">
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
                  {
                    fieldName: "hpi_view",

                    label: <AlgaehLabel label={{ forceLabel: "HPI" }} />,

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
                    label: <AlgaehLabel label={{ fieldName: "chronic" }} />,
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
                    fieldName: "chief_complaint_status",
                    label: (
                      <AlgaehLabel
                        label={{
                          fieldName: "chief_complaint_status"
                          // fieldName: "inactive"
                        }}
                      />
                    ),
                    displayTemplate: row => {
                      const _inactive =
                        row.complaint_inactive === "N" ? "Active" : "Inactive";
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
                    fieldName: "complaint_status_date",
                    label: (
                      <AlgaehLabel
                        label={{
                          fieldName: "complaint_status_date"
                          // fieldName: "inactive"
                        }}
                      />
                    ),
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

                    label: (
                      <AlgaehLabel
                        label={{
                          fieldName: "comments"
                          // fieldName: "inactive"
                        }}
                      />
                    ),
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
