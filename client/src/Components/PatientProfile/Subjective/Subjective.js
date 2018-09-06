import React, { Component } from "react";
import "./subjective.css";
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
import GlobalVariables from "../../../utils/GlobalVariables.json";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import HPI from "@material-ui/icons/AssignmentInd";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";
import moment from "moment";
import Enumerable from "linq";
import { setPatientChiefComplaints } from "../../../utils/indexer";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getAllAllergies, getReviewOfSystems } from "./SubjectiveHandler";

let patChiefComplain = [];

class Subjective extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openComplain: false,
      openHpiModal: false,
      openAllergyModal: false,
      openROSModal: false,
      pain: 0,
      allergy_value: "F",
      patientChiefComplains: [],
      chiefComplainList: [],
      allAllergies: [],
      patientAllergies: [],
      patientROS: [],
      chief_complaint_name: null,
      chief_complaint_id: null,
      system: "",
      comment: "",
      duration: 0,
      hims_f_episode_chief_complaint_id: null,
      hims_f_patient_encounter_id: null,
      interval: "D",
      onset_date: new Date(),
      pain: "NH",
      score: 0,
      severity: "MI"
    };

    this.addAllergies = this.addAllergies.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.fillComplainDetails = this.fillComplainDetails.bind(this);
    this.addChiefComplain = this.addChiefComplain.bind(this);
    this.setPainScale = this.setPainScale.bind(this);
    this.updatePatientChiefComplaints = this.updatePatientChiefComplaints.bind(
      this
    );
  }

  addROS() {
    this.setState({
      openROSModal: true
    });
  }

  showconfirmDialog(id) {
    swal({
      title: "Are you sure you want to delete this Chief Complain?",
      icon: "warning",
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
              swal("Record deleted successfully . .", {
                icon: "success",
                buttons: false,
                timer: 2000
              });
              this.getPatientChiefComplains();
            }
          },
          onFailure: error => {}
        });
      } else {
        swal("Delete request cancelled");
      }
    });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value }, () => {
      switch (value.value) {
        case "NH":
          this.setState({ score: 0 });
          break;
        case "HLB":
          this.setState({ score: 2 });
          break;
        case "HLM":
          this.setState({ score: 4 });
          break;
        case "HEM":
          this.setState({ score: 6 });
          break;
        case "HWL":
          this.setState({ score: 8 });
          break;
        case "HW":
          this.setState({ score: 10 });
          break;
      }
    });
  }

  allergyDropdownHandler(value) {
    this.setState({ [value.name]: value.value }, () => {
      getAllAllergies(this, this.state.allergy_value);
    });
  }

  texthandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  deleteChiefComplain(data, e) {
    this.showconfirmDialog(data.hims_f_episode_chief_complaint_id);
  }

  handleChangeStart = () => {
    console.log("Change event started");
  };

  handleChange = pain => {
    this.setState({
      score: pain
    });
  };

  handleChangeComplete = () => {
    console.log("Change event completed");
  };

  setPainScale(pain_number, e) {
    var element = document.querySelectorAll("[paintab]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");

    this.setState(
      { score: pain_number },

      () => {
        debugger;
        switch (pain_number) {
          case 0:
            this.setState({ pain: "NH" });
            break;
          case 2:
            this.setState({ pain: "HLB" });
            break;
          case 4:
            this.setState({ pain: "HLM" });
            break;
          case 6:
            this.setState({ pain: "HEM" });
            break;
          case 8:
            this.setState({ pain: "HWL" });
            break;
          case 10:
            this.setState({ pain: "HW" });
            break;
        }
      }
    );
  }

  openChiefComplainModal(data) {
    // console.log("Chief Complain Data:", data);
    this.setState({
      openComplain: true,
      hims_f_episode_chief_complaint_id: data.chief_complaint_id
    });
  }
  addAllergies() {
    this.setState({
      openAllergyModal: true
    });
  }

  handleClose() {
    this.setState({
      openComplain: false,
      openHpiModal: false,
      openAllergyModal: false,
      openROSModal: false
    });
  }

  addChiefComplain() {
    const data = {
      episode_id: Window.global["episode_id"],
      chief_complaint_id: this.state.chief_complaint_id,
      onset_date: this.state.onset_date,
      severity: this.state.severity,
      score: this.state.score,
      pain: this.state.pain,
      comment: this.state.comment
    };
    algaehApiCall({
      uri: "/doctorsWorkBench/addPatientChiefComplaints",
      data: data,
      onSuccess: response => {
        if (response.data.success) {
          this.getPatientChiefComplains();
        }
      },
      onFailure: error => {}
    });
  }

  updatePatientChiefComplaints() {
    // console.log("State:", this.state);
    algaehApiCall({
      uri: "/doctorsWorkBench/updatePatientChiefComplaints",
      method: "PUT",
      data: {
        episode_id: this.state.episode_id,
        chief_complaint_id: this.state.chief_complaint_id,
        onset_date: this.state.onset_date,
        interval: this.state.interval,
        duration: this.state.duration,
        severity: this.state.severity,
        score: this.state.score,
        pain: this.state.pain,
        chronic: null,
        complaint_inactive: null,
        complaint_inactive_date: null,
        comment: this.state.comment,
        hims_f_episode_chief_complaint_id: this.state
          .hims_f_episode_chief_complaint_id
      },
      onSuccess: response => {
        if (response.data.success) {
          //this.setState({ patientChiefComplains: response.data.records });
          console.log("Update Result:", response.data.records);
        }
      },
      onFailure: error => {}
    });
  }

  getPatientChiefComplains() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientChiefComplaints",
      data: {
        episode_id: Window.global["episode_id"]
      },
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          //console.log("Patient chief complains:", response.data.records);
          this.setState(
            { patientChiefComplains: response.data.records },
            setPatientChiefComplaints(response.data.records)
          );
        }
      },
      onFailure: error => {}
    });
  }

  getChiefComplainsList() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getChiefComplaints",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          console.log("Subdepartment chief complains:", response.data.records);
          this.setState({ chiefComplainList: response.data.records });
        }
      },
      onFailure: error => {}
    });
  }

  getPatientROS() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientROS",
      data: {
        patient_id: Window.global["current_patient"],
        episode_id: Window.global["episode_id"]
      },
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          // console.log("ROS Patient's:", response.data.records);
          this.setState({ patientROS: response.data.records });
        }
      },
      onFailure: error => {}
    });
  }

  getPatientAllergies() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientAllergy",
      method: "GET",
      data: {
        patient_id: Window.global["current_patient"]
      },
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ allAllergies: response.data.records });
          console.log("Patient Allergies:", this.state.allAllergies);
          let _allergies = Enumerable.from(response.data.records)
            .groupBy("$.allergy_type", null, (k, g) => {
              return {
                allergy_type: k,
                allergy_type_desc:
                  k === "F"
                    ? "Food"
                    : k === "A"
                      ? "Airborne"
                      : k === "AI"
                        ? "Animal  &  Insect"
                        : k === "C"
                          ? "Chemical & Others"
                          : "",
                allergyList: g.getSource()
              };
            })
            .toArray();
          this.setState({ patientAllergies: _allergies });
        }
      },
      onFailure: error => {}
    });
  }

  // getToken(data) {
  //   console.dir("Indexed Data:", data);
  // }

  componentDidMount() {
    getAllAllergies(this, this.state.allergy_value);
    getReviewOfSystems(this, this.state.system);
    this.getPatientChiefComplains();
    this.getChiefComplainsList();
    this.getPatientAllergies();
    this.getPatientROS();
  }

  openHPIAddModal(data) {
    console.log("Data:", data);
    this.setState({
      openHpiModal: true,
      hims_f_episode_chief_complaint_id: data.hims_f_episode_chief_complaint_id
    });
  }

  fillComplainDetails(e) {
    this.updatePatientChiefComplaints();
    const id = parseInt(e.currentTarget.getAttribute("data-cpln-id"));
    this.getPatientChiefComplains();
    let cce = Enumerable.from(this.state.patientChiefComplains)
      .where(w => w.hims_f_episode_chief_complaint_id === id)
      .firstOrDefault();
    this.setState({ ...cce });
  }

  render() {
    patChiefComplain = this.state.patientChiefComplains
      ? this.state.patientChiefComplains
      : [];
    return (
      <div className="subjective">
        {/* ROS Modal Start */}
        <Modal open={this.state.openROSModal}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Add Review Systems</h4>
            </div>
            <div className="popupInner">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4 popLeftDiv">
                    <div className="complain-box">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-12" }}
                        label={{
                          forceLabel: "Review System",
                          fieldName: "sample"
                        }}
                        selector={{
                          name: "hims_f_episode_chief_complaint_id",
                          className: "select-fld",
                          value: this.state.hims_f_episode_chief_complaint_id,
                          dataSource: {
                            textField: "hpi_description",
                            valueField: "hims_d_hpi_header_id",
                            data:
                              this.state.chiefComplainList.length !== 0
                                ? this.state.chiefComplainList
                                : null
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          forceLabel: "Symptoms",
                          fieldName: "sample"
                        }}
                        selector={{
                          name: "hims_f_episode_chief_complaint_id",
                          className: "select-fld",
                          value: this.state.hims_f_episode_chief_complaint_id,
                          dataSource: {
                            textField: "hpi_description",
                            valueField: "hims_d_hpi_header_id",
                            data:
                              this.state.chiefComplainList.length !== 0
                                ? this.state.chiefComplainList
                                : null
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          forceLabel: "Remarks",
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
                  <div className="col-lg-8 popRightDiv">
                    <h6> List of Review Systems</h6>
                    <hr />
                    <div> Grid comes Here </div>
                    <div>
                      <AlagehFormGroup
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          fieldName: "Overall comments",
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
            <div className="row popupFooter">
              <div className="col-lg-4">
                <button type="button" className="btn btn-primary">
                  Add to Review List
                </button>
                <button type="button" className="btn btn-other">
                  Clear
                </button>
              </div>
              <div className="col-lg-8">
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
        </Modal>

        {/* ROS Modal End */}

        {/* Allergy Modal Start*/}
        <Modal open={this.state.openAllergyModal}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Add Allergy</h4>
            </div>
            <div className="popupInner">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4 popLeftDiv">
                    <div className="complain-box">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-12" }}
                        label={{
                          forceLabel: "Allergy Type",
                          fieldName: "sample"
                        }}
                        selector={{
                          name: "allergy_value",
                          className: "select-fld",
                          value: this.state.allergy_value,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.ALLERGY_TYPES
                          },
                          onChange: this.allergyDropdownHandler.bind(this)
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          forceLabel: "Select a Alergy",
                          fieldName: "sample"
                        }}
                        selector={{
                          name: "hims_d_allergiy_id",
                          className: "select-fld",
                          value: this.state.hims_d_allergiy_id,
                          dataSource: {
                            textField: "allergy_name",
                            valueField: "hims_d_allergiy_id",
                            data: this.props.allallergies
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-12 margin-top-15" }}
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

                  <div className="col-lg-8 popRightDiv">
                    <h6> List of Allergies</h6>
                    <hr />
                    <div> Grid comes Here </div>
                    <div>
                      <AlagehFormGroup
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          fieldName: "Overall comments",
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
            <div className="row popupFooter">
              <div className="col-lg-4">
                <button type="button" className="btn btn-primary">
                  Add to Alergy List
                </button>
                <button type="button" className="btn btn-other">
                  Clear
                </button>
              </div>
              <div className="col-lg-8">
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
        </Modal>

        {/* Allergy Modal End*/}

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

                            //value: this.state.pain,
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
              <h4>Add Chief Complaint</h4>
            </div>
            <div className="popupInner">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4 popLeftDiv">
                    <div className="complain-box">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-10 displayInlineBlock" }}
                        label={{
                          forceLabel: "Chief Complaint",
                          fieldName: "sample"
                        }}
                        selector={{
                          name: "hims_f_episode_chief_complaint_id",
                          className: "select-fld",
                          value: this.state.hims_f_episode_chief_complaint_id,
                          dataSource: {
                            textField: "hpi_description",
                            valueField: "hims_d_hpi_header_id",
                            data:
                              this.state.chiefComplainList.length !== 0
                                ? this.state.chiefComplainList
                                : null
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />
                      <div className="col-lg-2 displayInlineBlock">
                        <i
                          className="fas fa-plus fa-1x"
                          style={{ color: "#00BCB0", cursor: "pointer" }}
                          onClick={this.addChiefComplain}
                        />
                      </div>
                      <div className="col-12">
                        <div className="bordered-layout">
                          <ul>
                            {/* patientChiefComplains */}

                            {patChiefComplain.map((data, index) => (
                              <li
                                key={index}
                                data-cpln-id={
                                  data.hims_f_episode_chief_complaint_id
                                }
                                onClick={this.fillComplainDetails}
                              >
                                <span> {data.chief_complaint_name} </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <br />
                        <h6>Nurse Chief Complaints</h6>
                        <div className="bordered-layout">
                          <ul>
                            <li>
                              <span>Leg Pain</span>
                            </li>
                            <li>
                              <span>Leg Pain</span>
                            </li>
                            <li>
                              <span>Leg Pain</span>
                            </li>
                            <li>
                              <span>Leg Pain</span>
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
                            this.setState({
                              onset_date: selectedDate,
                              duration:
                                moment().diff(selectedDate, "days") < 31
                                  ? moment().diff(selectedDate, "days")
                                  : moment().diff(selectedDate, "months") < 12
                                    ? moment().diff(selectedDate, "months")
                                    : moment().diff(selectedDate, "years")
                            });
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
                            fieldName: "",
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
                              onChange: this.texthandle.bind(this)
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
                          onChangeStart={this.handleChangeStart}
                          onChange={this.handleChange}
                          onChangeComplete={this.handleChangeComplete}
                        />

                        <ul className="pain-scale-ul">
                          <li
                            className="pain-1"
                            paintab="1"
                            onClick={this.setPainScale.bind(this, 0)}
                          />
                          <li
                            className="pain-2"
                            paintab="2"
                            onClick={this.setPainScale.bind(this, 2)}
                          />
                          <li
                            className="pain-3"
                            paintab="3"
                            onClick={this.setPainScale.bind(this, 4)}
                          />
                          <li
                            className="pain-4"
                            paintab="4"
                            onClick={this.setPainScale.bind(this, 6)}
                          />
                          <li
                            className="pain-5"
                            paintab="5"
                            onClick={this.setPainScale.bind(this, 8)}
                          />
                          <li
                            className="pain-6"
                            paintab="6"
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
                            fieldName: "pain",
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
                    {/* <div className="row" style={{ marginTop: "10px" }}>
                    <div className="col-lg-2">
                      <Checkbox color="primary" onChange={() => {}} />
                      <AlgaehLabel
                        label={{
                          forceLabel: "Chronic"
                        }}
                      />
                    </div>
                    
                  </div> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="popupFooter">
              <div className="col">
                <div className="row">
                  <div className="col-lg-12">
                    <button type="button" className="btn btn-primary">
                      Save
                    </button>
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

        <div className="col-lg-12" style={{ marginTop: "15px" }}>
          <div className="row">
            <div className="col-lg-8">
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
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "complaint_name" }}
                          />
                        )
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
                        label: (
                          <AlgaehLabel label={{ fieldName: "severity" }} />
                        ),
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
                        label: (
                          <AlgaehLabel label={{ fieldName: "onset_date" }} />
                        ),
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
                        label: (
                          <AlgaehLabel label={{ fieldName: "interval" }} />
                        ),
                        displayTemplate: data => {
                          return data.interval === "H"
                            ? "Hour(s)"
                            : data.interval === "D"
                              ? "Day(s)"
                              : data.interval === "W"
                                ? "Week(s)"
                                : data.interval === "M"
                                  ? "Month(s)"
                                  : "Year(s)";
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
                                onClick={this.openChiefComplainModal.bind(
                                  this,
                                  data
                                )}
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
                                onClick={this.deleteChiefComplain.bind(
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
                      data:
                        this.state.patientChiefComplains.length !== 0
                          ? this.state.patientChiefComplains
                          : []
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
            </div>

            <div className="col-lg-4">
              {/* BEGIN Portlet PORTLET */}
              <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Allergies</h3>
                  </div>
                  <div className="actions">
                    <a
                      href="javascript:;"
                      className="btn btn-primary btn-circle active"
                      onClick={this.addAllergies}
                    >
                      <i className="fas fa-plus" />
                    </a>
                  </div>
                </div>
                <div
                  className="portlet-body"
                  style={{ maxHeight: "25vh", overflow: "auto" }}
                >
                  {this.state.patientAllergies.map((tables, index) => (
                    <table
                      key={index}
                      className="table table-sm table-bordered customTable"
                    >
                      <thead className="table-primary">
                        <tr>
                          <th> {tables.allergy_type_desc} </th>
                          <th>Onset Date</th>
                          <th>Comment</th>
                          <th>Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tables.allergyList.map((rows, rIndex) => (
                          <tr key={rIndex}>
                            <td> {rows.allergy_name} </td>
                            <td>{rows.onset_date}</td>
                            <td>{rows.comment}</td>
                            <td>
                              {rows.allergy_inactive === "Y" ? "Yes" : "No"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ))}
                </div>
              </div>
              {/* END Portlet PORTLET */}

              {/* BEGIN Portlet PORTLET */}
              <div className="portlet portlet-bordered box-shadow-normal margin-bottom-30">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Review of Systems</h3>
                  </div>
                  <div className="actions">
                    <a
                      href="javascript:;"
                      className="btn btn-primary btn-circle active"
                      onClick={this.addROS.bind(this)}
                    >
                      <i className="fas fa-plus" />
                    </a>
                  </div>
                </div>
                <div className="portlet-body">
                  <table className="table table-sm table-bordered customTable">
                    <thead className="table-primary">
                      <tr>
                        <th>System</th>
                        <th>Symptoms</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.patientROS.map((data, index) => (
                        <tr key={index}>
                          <td>{data.header_description}</td>
                          <td>{data.detail_description}</td>
                          <td>{data.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* END Portlet PORTLET */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allallergies: state.allallergies,
    allros: state.allros
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getReviewOfSystems: AlgaehActions,
      getAllAllergies: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Subjective)
);
