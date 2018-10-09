import React, { Component } from "react";
import "./chiefcomplaints.css";
import "react-rangeslider/lib/index.css";
import Button from "@material-ui/core/Button";
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
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import HPI from "@material-ui/icons/AssignmentInd";
import moment from "moment";
import {
  algaehApiCall,
  cancelRequest,
  swalMessage
} from "../../../utils/algaehApiCall";
import Enumerable from "linq";
import algaehLoader from "../../Wrapper/fullPageLoader";
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
      duration: "",
      comment: "",
      new_chief_complaint: [],
      ifCheckBoxChange: false,
      masterChiefComplaints: []
    };

    this.handleClose = this.handleClose.bind(this);
    this.setPainScale = this.setPainScale.bind(this);
  }

  componentWillUnmount() {
    this.mounted = false;
    cancelRequest("getChiefComplaints");
    cancelRequest("getPatientChiefComplaints");
  }
  componentDidMount() {
    this.mounted = true;
    //getAllChiefComplaints(this);
    //this.getPatientChiefComplaintsDetails();
    if (
      this.props.patient_chief_complaints === undefined ||
      this.props.patient_chief_complaints.length === 0
    ) {
      getPatientChiefComplaints(this);
    }
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
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
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

  addNewChiefComplaint(callBack) {
    algaehApiCall({
      uri: "/doctorsWorkBench/addNewChiefComplaint",
      data: Enumerable.from(this.state.new_chief_complaint)
        .select(s => {
          return {
            hpi_description: s
          };
        })
        .toArray(),
      method: "post",
      onSuccess: response => {
        if (response.data.success) {
          getAllChiefComplaints(this, callBack);

          //getPatientChiefComplaints(this);
          //  this.getPatientChiefComplaintsDetails();
        }
      },
      onFailure: error => {}
    });
  }

  deleteChiefComplain(data, e) {
    this.showconfirmDialog(data);
  }

  deleteChiefComplaintFromGrid(data) {
    this.showconfirmDialog(data.hims_f_episode_chief_complaint_id);
  }

  handleChange = pain => {
    var element = document.querySelectorAll("li[paintab]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    const liPainTab = document.querySelector("li[paintab='" + pain + "']");
    liPainTab.classList.add("active");
    this.setState(
      {
        score: pain,
        pain: liPainTab.getAttribute("pain-type")
      },
      () => {
        this.settingUpdateChiefComplaints({
          currentTarget: {
            name: "score",
            value: pain
          }
        });
      }
    );
  };

  setPainScale(pain_number, e) {
    var element = document.querySelectorAll("[paintab]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    const pain = e.currentTarget.getAttribute("pain-type");
    this.setState({ score: pain_number, pain: pain }, () => {
      this.settingUpdateChiefComplaints({
        currentTarget: {
          name: "score",
          value: pain_number
        }
      });
      this.settingUpdateChiefComplaints({
        currentTarget: {
          name: "pain",
          value: pain
        }
      });
    });
  }

  dropDownHandle(data) {
    const updateScroe =
      data.selected.score !== undefined ? { score: data.selected.score } : {};
    if (updateScroe.score !== undefined) {
      var element = document.querySelectorAll("[paintab]");
      for (var i = 0; i < element.length; i++) {
        element[i].classList.remove("active");
      }
      document
        .querySelector("li[paintab='" + data.selected.score + "']")
        .classList.add("active");
    }
    this.setState({ [data.name]: data.value, ...updateScroe }, () => {
      this.settingUpdateChiefComplaints({
        currentTarget: {
          name: data.name,
          value: data.value
        }
      });
    });
  }

  openChiefComplainModal(data) {
    if (
      this.props.allchiefcomplaints === undefined ||
      this.props.allchiefcomplaints.length === 0
    ) {
      getAllChiefComplaints(this, master => {
        this.setState({
          openComplain: true,
          hims_f_episode_chief_complaint_id: data.chief_complaint_id,
          masterChiefComplaints: this.masterChiefComplaintsSortList(
            this.state.patientChiefComplains,
            master
          )
        });
      });
    } else {
      this.setState({
        openComplain: true,
        hims_f_episode_chief_complaint_id: data.chief_complaint_id,
        masterChiefComplaints: this.masterChiefComplaintsSortList(
          this.state.patientChiefComplains,
          this.props.allchiefcomplaints
        )
      });
    }
  }

  deleteChiefComplainFromList(e) {
    this.showconfirmDialog(e.currentTarget.getAttribute("data-cpln-id"));
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
            getPatientChiefComplaints();
            this.getPatientChiefComplaintsDetails();
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
            this.getPatientChiefComplaintsDetails();
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
  openHPIAddModal(data) {
    this.setState({
      openHpiModal: true,
      hims_f_episode_chief_complaint_id: data.hims_f_episode_chief_complaint_id
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
    let patChiefComp = this.state.patientChiefComplains;
    if (Array.isArray(list)) {
      this.setState({ new_chief_complaint: list }, () => {
        const new_chief_complaint = this.state.new_chief_complaint;

        this.addNewChiefComplaint(master => {
          let newMaster = Enumerable.from(master)
            .where(
              w =>
                moment(w.created_date).format("YYYYMMDD") ===
                moment(new Date()).format("YYYYMMDD")
            )
            .toArray();
          newMaster = newMaster.message === undefined ? newMaster : [];
          for (let i = 0; i < new_chief_complaint.length; i++) {
            let newChiefCompId = Enumerable.from(newMaster)
              .where(w => w.hpi_description === new_chief_complaint[i])
              .firstOrDefault();
            patChiefComp.push({
              Encounter_Date: new Date(),
              chief_complaint_id: newChiefCompId.hims_d_hpi_header_id,
              chief_complaint_name: new_chief_complaint[i],
              comment: "",
              duration: 0,
              episode_id: Window.global["episode_id"],
              interval: "D",
              onset_date: new Date(),
              pain: "NH",
              score: 0,
              severity: "MI",
              patient_id: Window.global["current_patient"],
              recordState: "insert"
            });
          }
          this.setState({
            patientChiefComplains: patChiefComp
          });
        });
      });
    } else {
      if (list !== undefined) {
        this.setState(
          { chief_complaint_id: list.selected.hims_d_hpi_header_id },
          () => {
            patChiefComp.push({
              chief_complaint_id: list.selected.hims_d_hpi_header_id,
              chief_complaint_name: list.selected.hpi_description,
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
              recordState: "insert"
            });
            this.setState({
              patientChiefComplains: patChiefComp.sort((a, b) => {
                return a.chief_complaint_id - b.chief_complaint_id;
              }),
              masterChiefComplaints: this.masterChiefComplaintsSortList(
                patChiefComp
              )
            });
          }
        );
      }
    }
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
      newPatientDtl["recordState"] = "update";
      patientComp.splice(index, 0, newPatientDtl);
      this.setState({
        patientChiefComplains: patientComp.sort((a, b) => {
          return a.chief_complaint_id - b.chief_complaint_id;
        })
      });
    }
  }

  render() {
    const patChiefComplain =
      this.state.patientChiefComplains !== undefined
        ? this.state.patientChiefComplains
        : [];

    return (
      <React.Fragment>
        {/* HPI Modal Start */}
        <Modal open={this.state.openHpiModal}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Add / Edit History of Patient Illness</h4>
            </div>
            <div className="col-lg-12 popupInner">
              <div className="col-12">
                <div className="row">
                  <div className="col-lg-4 popLeftDiv">
                    <div className="card">
                      <div className="card-body box-shadow-normal">
                        <AlagehAutoComplete
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "Selected Chief Complaint"
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

                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "Duration / Onset",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "onset_date",
                            value: this.state.onset_date,
                            events: {}
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
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
                          div={{ className: "col" }}
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
                          div={{ className: "col" }}
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
                          div={{ className: "col" }}
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
                          div={{ className: "col" }}
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
                          div={{ className: "col" }}
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
                          div={{ className: "col" }}
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
                  </div>
                  <div className="col-lg-8 popRightDiv">
                    <div className="card">
                      <div className="card-body box-shadow-normal">
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
                                <AlgaehLabel
                                  label={{ forceLabel: "Location" }}
                                />
                              )
                            },
                            {
                              fieldName: "complaint",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Quality" }}
                                />
                              )
                            },
                            {
                              fieldName: "complaint",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Context" }}
                                />
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
                                <AlgaehLabel
                                  label={{ forceLabel: "Remarks" }}
                                />
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
                                <AlgaehLabel
                                  label={{ forceLabel: "Severity" }}
                                />
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
                          paging={{ page: 0, rowsPerPage: 5 }}
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
            </div>
            <div className="popupFooter">
              <div className="col-lg-4">
                <Button
                  variant="raised"
                  color="secondary"
                  style={{ backgroundColor: "#24B256" }}
                  // onClick={        }
                  size="small"
                >
                  Add
                </Button>
                <Button
                  variant="raised"
                  style={{ backgroundColor: "#D5D5D5" }}
                  size="small"
                >
                  Clear
                </Button>
              </div>
              <div className="col-lg-8">
                <Button
                  variant="raised"
                  onClick={this.handleClose}
                  style={{ backgroundColor: "#D5D5D5" }}
                  // onClick={        }
                  size="small"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
        {/* HPI MOdal End */}

        {/* Chief Complain Modal Start */}
        <Modal
          style={{
            margin: "auto"
          }}
          open={this.state.openComplain}
        >
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Add / Edit Chief Complaint</h4>
            </div>
            <div className="popupInner">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4 popLeftDiv">
                    <div className="complain-box">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-10 displayInlineBlock" }}
                        label={{
                          forceLabel: "Chief Complaint"
                        }}
                        selector={{
                          name: "chief_complaint_id",
                          className: "select-fld",
                          value: this.state.chief_complaint_id,
                          dataSource: {
                            textField: "hpi_description",
                            valueField: "hims_d_hpi_header_id",
                            data: this.state.masterChiefComplaints
                          },
                          onChange: this.addChiefComplainToPatient.bind(this),
                          userList: list => {
                            this.addChiefComplainToPatient(list);
                          }
                        }}
                      />

                      <div className="col-lg-2 displayInlineBlock">
                        <i
                          className="fas fa-plus fa-1x"
                          style={{ color: "#34b8bc", cursor: "pointer" }}
                          onClick={this.addNewChiefComplaint.bind(this)}
                        />
                      </div>

                      <div className="col-lg-12">
                        <div className="bordered-layout">
                          <ul>
                            {/* patientChiefComplains */}

                            {patChiefComplain.map((data, index) => (
                              <li key={index}>
                                <span
                                  data-cpln-id={
                                    data.hims_f_episode_chief_complaint_id
                                  }
                                  onClick={this.fillComplainDetails.bind(
                                    this,
                                    data
                                  )}
                                  style={{
                                    width: "80%"
                                  }}
                                >
                                  {data.chief_complaint_name}
                                </span>
                                <i
                                  data-cpln-id={
                                    data.hims_f_episode_chief_complaint_id
                                  }
                                  className="fas fa-trash fa-1x float-right"
                                  style={{
                                    cursor: "pointer"
                                  }}
                                  onClick={this.deleteChiefComplainFromList.bind(
                                    this
                                  )}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                        <br />
                        <h6>Nurse Chief Complaints</h6>
                        <div className="bordered-layout">
                          <ul>
                            <li>
                              <span />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-8 popRightDiv">
                    <h6> Chief Complaint: {this.state.chief_complaint_name}</h6>
                    <hr />
                    <div className="row">
                      <AlgaehDateHandler
                        div={{ className: "col" }}
                        label={{ fieldName: "onset_date", isImp: true }}
                        textBox={{
                          className: "txt-fld",
                          name: "onset_date"
                        }}
                        disabled={false}
                        maxDate={new Date()}
                        events={{
                          onChange: selectedDate => {
                            let duration = 0;
                            let interval = "D";
                            if (moment().diff(selectedDate, "days") < 31) {
                              duration = moment().diff(selectedDate, "days");
                              interval = "D";
                            } else if (
                              moment().diff(selectedDate, "months") < 12
                            ) {
                              duration = moment().diff(selectedDate, "months");
                              interval = "M";
                            } else if (moment().diff(selectedDate, "years")) {
                              duration = moment().diff(selectedDate, "years");
                              interval = "Y";
                            }

                            this.setState(
                              {
                                onset_date: selectedDate,
                                duration: duration,
                                interval: interval
                              },
                              () => {
                                this.settingUpdateChiefComplaints({
                                  currentTarget: {
                                    name: "onset_date",
                                    value: selectedDate
                                  }
                                });
                              }
                            );
                          }
                        }}
                        value={this.state.onset_date}
                      />

                      <div className="col durationCntr">
                        <label
                          className="style_Label"
                          style={{ width: "100%", marginBottom: "4px" }}
                        >
                          Duration
                          <span className="imp">&nbsp;*</span>
                        </label>
                        <AlagehFormGroup
                          div={{ className: "divDur" }}
                          label={{
                            forceLabel: "",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "duration",
                            others: {
                              type: "number"
                            },
                            value: this.state.duration,
                            events: {
                              onChange: this.calculateDurationDate.bind(this)
                            }
                          }}
                        />

                        <AlagehAutoComplete
                          div={{ className: "divDay" }}
                          label={{
                            fieldName: "food"
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

                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{
                          fieldName: "pain_severity"
                        }}
                        selector={{
                          name: "severity",
                          className: "select-fld",
                          value: this.state.severity,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.PAIN_SEVERITY
                          },

                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />
                    </div>
                    <div className="row pain_slider">
                      <div className="col">
                        <Slider
                          step={2}
                          min={0}
                          max={10}
                          value={this.state.score}
                          // onChangeStart={this.handleChangeStart}
                          onChange={this.handleChange}
                          //  onChangeComplete={this.handleChangeComplete}
                        />

                        <ul className="pain-scale-ul">
                          <li
                            className="pain-1"
                            paintab="0"
                            pain-type="NH"
                            onClick={this.setPainScale.bind(this, 0)}
                          />
                          <li
                            className="pain-2"
                            paintab="2"
                            pain-type="HLB"
                            onClick={this.setPainScale.bind(this, 2)}
                          />
                          <li
                            className="pain-3"
                            paintab="4"
                            pain-type="HLM"
                            onClick={this.setPainScale.bind(this, 4)}
                          />
                          <li
                            className="pain-4"
                            paintab="6"
                            pain-type="HEM"
                            onClick={this.setPainScale.bind(this, 6)}
                          />
                          <li
                            className="pain-5"
                            paintab="8"
                            pain-type="HWL"
                            onClick={this.setPainScale.bind(this, 8)}
                          />
                          <li
                            className="pain-6"
                            paintab="10"
                            pain-type="HW"
                            onClick={this.setPainScale.bind(this, 10)}
                          />
                        </ul>
                      </div>
                      <div className="col">
                        <AlagehFormGroup
                          div={{ className: "" }}
                          label={{
                            forceLabel: "Score",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "score",
                            others: {
                              type: "number",
                              disabled: true
                            },
                            value: this.state.score,
                            events: {}
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "" }}
                          label={{
                            forceLabel: "Pain",
                            isImp: true
                          }}
                          selector={{
                            name: "pain",
                            className: "select-fld",
                            value: this.state.pain,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.PAIN_SCALE
                            },
                            onChange: this.dropDownHandle.bind(this)
                          }}
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col">
                        <Checkbox color="primary" onChange={() => {}} />
                        <AlgaehLabel
                          label={{
                            forceLabel: "Chronic"
                          }}
                        />
                      </div>
                      <div className="col">
                        <Checkbox
                          color="primary"
                          onChange={() => {
                            this.setState({ inactive_date: new Date() });
                          }}
                        />
                        <AlgaehLabel
                          label={{
                            forceLabel: "Inactive"
                          }}
                        />
                      </div>

                      <AlgaehDateHandler
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: ""
                        }}
                        maxDate={new Date()}
                        events={{
                          onChange: selectedDate => {
                            this.setState({ inactive_date: selectedDate });
                          }
                        }}
                        value={this.state.inactive_date}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-12" }}
                        label={{
                          fieldName: "comments",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "comment",
                          others: {
                            multiline: true,
                            rows: "4"
                          },
                          value: this.state.comment,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="popupFooter">
              <div className="col">
                <div className="row">
                  <div className="col-lg-12">
                    {/* <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.handleClose}
                    >
                      Save
                    </button> */}
                    <button
                      type="button"
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
        {/* Chief Complain Modal End */}

        {/* BEGIN Portlet PORTLET */}
        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Chief Complaint</h3>
            </div>
            <div className="actions">
              <a
                href="javascript:;"
                className="btn btn-primary btn-circle active"
                onClick={this.openChiefComplainModal.bind(this)}
              >
                <i className="fas fa-plus" />
              </a>
            </div>
          </div>
          <div className="portlet-body">
            <AlgaehDataGrid
              id="complaint-grid"
              columns={[
                {
                  fieldName: "chief_complaint_name",
                  label: <AlgaehLabel label={{ fieldName: "complaint_name" }} />
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
                  }
                },
                {
                  fieldName: "severity",
                  label: <AlgaehLabel label={{ fieldName: "severity" }} />,
                  displayTemplate: data => {
                    return (
                      <span>
                        {data.severity === "MI" ? (
                          <span> Mild</span>
                        ) : data.severity === "MO" ? (
                          <span> Moderate</span>
                        ) : (
                          <span> Severe</span>
                        )}
                      </span>
                    );
                  }
                },
                {
                  fieldName: "onset_date",
                  label: <AlgaehLabel label={{ fieldName: "onset_date" }} />,
                  displayTemplate: data => {
                    return new Date(data.onset_date).toLocaleDateString();
                  }
                },
                {
                  fieldName: "duration",
                  label: <AlgaehLabel label={{ fieldName: "duration" }} />
                },
                {
                  fieldName: "interval",
                  label: <AlgaehLabel label={{ fieldName: "interval" }} />,
                  displayTemplate: data => {
                    return data.interval === "H"
                      ? "Hour(s)"
                      : data.interval === "D"
                        ? "Day(s)"
                        : data.interval === "W"
                          ? "Week(s)"
                          : data.interval === "M"
                            ? "Month(s)"
                            : data.interval === "Y"
                              ? "Year(s)"
                              : "";
                  }
                },
                {
                  fieldName: "actions",
                  label: <AlgaehLabel label={{ fieldName: "actions" }} />,
                  displayTemplate: data => {
                    return (
                      <span>
                        <IconButton
                          color="primary"
                          title="Edit"
                          onClick={this.openChiefComplainModal.bind(this, data)}
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          color="primary"
                          title="HPI"
                          onClick={this.openHPIAddModal.bind(this, data)}
                        >
                          <HPI />
                        </IconButton>

                        <IconButton
                          color="primary"
                          title="Delete"
                          onClick={this.deleteChiefComplaintFromGrid.bind(
                            this,
                            data
                          )}
                        >
                          <Delete />
                        </IconButton>
                      </span>
                    );
                  }
                }
              ]}
              keyId="patient_id"
              dataSource={{
                data: this.props.patient_chief_complaints
              }}
              isEditable={false}
              paging={{ page: 0, rowsPerPage: 5 }}
              events={{
                onDelete: row => {},
                onEdit: row => {},
                onDone: row => {}
              }}
            />
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
