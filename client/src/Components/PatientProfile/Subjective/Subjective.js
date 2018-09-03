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

const AllergyData = [
  { food: "grapes/citrus", active: "Yes" },
  { food: "Pollen", active: "Yes" },
  { food: "Iodine", active: "Yes" }
];

let patChiefComplain = [];

class Subjective extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openComplain: false,
      pain: 0,
      patientChiefComplains: [],
      chiefComplainList: [],
      openHpiModal: false,
      openAllergyModal: false
    };

    this.addChiefComplain = this.addChiefComplain.bind(this);
    this.addAllergies = this.addAllergies.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.openHPIAddModal = this.openHPIAddModal.bind(this);
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
              this.getChiefComplains();
              swal("Record deleted successfully . .", {
                icon: "success",
                buttons: false,
                timer: 2000
              });
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
      pain: pain
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
    this.setState({ pain: pain_number });
  }

  addChiefComplain() {
    this.setState({ openComplain: true });
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
      openAllergyModal: false
    });
  }

  getPatientChiefComplains() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientChiefComplaints",
      data: {
        patient_id: Window.global["current_patient"],
        episode_id: Window.global["episode_id"]
      },
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          console.log("Patient chief complains:", response.data.records);
          this.setState({ patientChiefComplains: response.data.records });
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

  componentDidMount() {
    this.getPatientChiefComplains();
    this.getChiefComplainsList();
  }

  openHPIAddModal() {
    this.setState({
      openHpiModal: true
    });
  }

  fillComplainDetails(e) {
    const id = e.currentTarget.getAttribute("data-cpln-id");
  }

  render() {
    patChiefComplain = this.state.patientChiefComplains
      ? this.state.patientChiefComplains
      : [];
    return (
      <div className="subjective">
        {/* Allergy Modal Start*/}
        <Modal open={this.state.openAllergyModal}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Add Allergy</h4>
            </div>
            <div className="col-lg-12 popupInner">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{
                    forceLabel: "Allergy Type"
                  }}
                  selector={{
                    name: "allergy_type",
                    className: "select-fld",
                    value: this.state.allergy_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.ALLERGY_TYPES
                    },
                    onChange: this.dropDownHandle.bind(this)
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    forceLabel: "Search",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "search",

                    //value: this.state.pain,
                    events: {}
                  }}
                />
              </div>
            </div>
            <div className="row popupFooter">
              <div className="col-lg-4">
                <Button variant="raised" color="primary" size="small">
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
                  size="small"
                >
                  Close
                </Button>
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
                            name: "hpi_chief_complains",
                            className: "select-fld",
                            value: this.state.hpi_chief_complains,
                            dataSource: {
                              textField: "cheif_complaint_name",
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
                          forceLabel: ""
                        }}
                        selector={{
                          name: "hims_d_hpi_header_id",
                          className: "select-fld",
                          value: this.state.hims_d_hpi_header_id,
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
                          class="fas fa-plus fa-1x"
                          style={{ color: "#00BCB0" }}
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
                                <span> {data.cheif_complaint_name} </span>
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
                    <h6> Chief Complaint: Leg Pain</h6>
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
                          <span class="imp">&nbsp;*</span>
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
                          value={this.state.pain}
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
                            value: this.state.pain,
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
                      onClick={this.addChiefComplain}
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
                        fieldName: "cheif_complaint_name",
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
                                onClick={this.addChiefComplain}
                              >
                                <Edit />
                              </IconButton>

                              <IconButton
                                color="primary"
                                title="HPI"
                                onClick={this.openHPIAddModal}
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
                <div className="portlet-body">

<AlgaehDataGrid
  id="patient_chart_grd"
  columns={[
    {
      fieldName: "food",
      label: "Food",
      disabled: true
    },
    {
      fieldName: "date",
      label: "On Set Date"
    },
    {
      fieldName: "first_name",
      label: "Comment"
    },
    {
      fieldName: "active",
      label: "Active"
    }
  ]}
  keyId="code"
  dataSource={{
    data: AllergyData
  }}
  isEditable={false}
  paging={{ page: 0, rowsPerPage: 3 }}
  events={
    {
      // onDelete: this.deleteVisaType.bind(this),
      // onEdit: row => {},
      // onDone: row => {
      //   alert(JSON.stringify(row));
      // }
      // onDone: this.updateVisaTypes.bind(this)
    }
  }
/>
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
                      
                      onClick={this.addAllergies}
                    >
                      <i className="fas fa-plus" />
                    </a>
                  </div>
                </div>
                <div className="portlet-body">
                <AlgaehDataGrid
                  id="patient_chart_grd"
                  columns={[
                    {
                      fieldName: "food",
                      label: "Food",
                      disabled: true
                    },
                    {
                      fieldName: "date",
                      label: "On Set Date"
                    },
                    {
                      fieldName: "first_name",
                      label: "Comment"
                    },
                    {
                      fieldName: "active",
                      label: "Active"
                    }
                  ]}
                  keyId="code"
                  dataSource={{
                    data: AllergyData
                  }}
                  isEditable={false}
                  paging={{ page: 0, rowsPerPage: 3 }}
                  events={
                    {
                      // onDelete: this.deleteVisaType.bind(this),
                      // onEdit: row => {},
                      // onDone: row => {
                      //   alert(JSON.stringify(row));
                      // }
                      // onDone: this.updateVisaTypes.bind(this)
                    }
                  }
                />
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

export default Subjective;
