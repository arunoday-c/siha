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

const AllergyData = [
  { food: "grapes/citrus", active: "Yes" },
  { food: "Pollen", active: "Yes" },
  { food: "Iodine", active: "Yes" }
];

//TODO
//1 Add Grid
//2 Fix Design
//3 MAke some other changes

const complain_data = [
  {
    complaint_name: "Abdominal Pain",
    pain: "Hurts More",
    severity: "Moderate"
  },
  { complaint_name: "Abdominal Pain", pain: "No Hurt", severity: "None" },
  { complaint_name: "Head Pain", pain: "Hurts Less", severity: "Mild" },
  { complaint_name: "Abdominal Pain", pain: "Hurts Worst", severity: "Severe" }
];

class Subjective extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openComplain: false,
      pain: 0,
      patientChiefComplains: []
    };

    this.addChiefComplain = this.addChiefComplain.bind(this);
    this.addAllergies = this.addAllergies.bind(this);
    this.handleClose = this.handleClose.bind(this);
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

  deleteChiefComplain(data, e) {
    debugger;
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
    alert("Add Allergies");
  }

  handleClose() {
    this.setState({ openComplain: false });
  }

  getChiefComplains() {
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

  componentDidMount() {
    this.getChiefComplains();
  }

  render() {
    return (
      <div className="subjective">
        {/* Chief Complain Modal Start */}
        <Modal
          style={{
            margin: "auto"
          }}
          open={this.state.openComplain}
        >
          <div className="algaeh-modal">
            <div className="row popupHeader">
              <h4>Add Chief Complaint</h4>
            </div>
            <div className="col-lg-12 popupInner">
              <div className="row">
                <div className="col-lg-4">
                  <div className="card">
                    <div className="card-body box-shadow-normal">
                      <h6 className="card-subtitle mb-2 text-muted">
                        Doctor Chief Complaints
                      </h6>
                      <div className="complain-box">
                        <AlagehAutoComplete
                          div={{ className: "col" }}
                          label={{
                            fieldName: "search"
                          }}
                          selector={{
                            name: "search",
                            className: "select-fld",
                            // value: this.state.pay_cash,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.PAIN_DURATION
                            }

                            // onChange: texthandle.bind(this, this)
                          }}
                        />
                        <div className="bordered-layout">
                          <ul>
                            <li>
                              <span> Text </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div
                      className="card-body box-shadow-normal"
                      style={{ marginTop: "10px" }}
                    >
                      <h6 className="card-subtitle mb-2 text-muted">
                        Nurse Chief Complaints
                      </h6>
                      <div className="complain-box">
                        {" "}
                        <div className="bordered-layout">HEllo</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-8">
                  <div className="row">
                    <AlgaehDateHandler
                      div={{ className: "col-lg-3" }}
                      label={{ fieldName: "onset_date", isImp: true }}
                      textBox={{
                        className: "txt-fld",
                        name: "onset_date"
                      }}
                      disabled={false}
                      maxDate={new Date()}
                      events={
                        {
                          //  onChange: datehandle.bind(this, this)
                        }
                      }
                      //value={this.state.receipt_date}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-lg-1" }}
                      label={{
                        fieldName: "duration",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "duration",
                        others: {
                          type: "number"
                        },
                        //value: this.state.department_name,
                        events: {
                          //  onChange: this.changeDeptName.bind(this)
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-lg-3 mrgn-tp-auto" }}
                      label={{
                        fieldName: "food"
                      }}
                      selector={{
                        name: "duration_time",
                        className: "select-fld",
                        // value: this.state.pay_cash,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.PAIN_DURATION
                        }

                        // onChange: texthandle.bind(this, this)
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-lg-3 mrgn-tp-auto" }}
                      label={{
                        fieldName: "pain_severity"
                      }}
                      selector={{
                        name: "pain_severity",
                        className: "select-fld",
                        // value: this.state.pay_cash,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.PAIN_SEVERITY
                        }

                        // onChange: texthandle.bind(this, this)
                      }}
                    />
                  </div>
                  <div className="row" style={{ marginTop: "10px" }}>
                    <div className="pain_slider col-lg-5">
                      <Slider
                        step={2}
                        min={0}
                        max={10}
                        value={this.state.pain}
                        onChangeStart={this.handleChangeStart}
                        onChange={this.handleChange}
                        onChangeComplete={this.handleChangeComplete}
                      />
                    </div>
                    <div className="col-lg-2" style={{ marginTop: "25px" }}>
                      <AlagehFormGroup
                        div={{ className: "" }}
                        label={{
                          fieldName: "fffffff",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "duration",
                          others: {
                            type: "number",
                            disabled: true
                          },
                          value: this.state.pain,
                          events: {}
                        }}
                      />
                    </div>
                    <AlagehAutoComplete
                      div={{ className: "col" }}
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
                        onChange: () => {}
                        // onChange: texthandle.bind(this, this)
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="col">
                      <div>
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
                    </div>
                  </div>
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-lg-5" }}
                      label={{
                        fieldName: "comments",
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
                    <div className="col-lg-2">
                      <Checkbox color="primary" onChange={() => {}} />
                      <AlgaehLabel
                        label={{
                          forceLabel: "Inactive"
                        }}
                      />
                    </div>

                    <AlgaehDateHandler
                      div={{ className: "col-lg-5" }}
                      textBox={{
                        className: "txt-fld",
                        name: ""
                      }}
                      maxDate={new Date()}
                      events={{
                        onChange: () => {}
                      }}
                      // value={this.state.card_date}
                    />
                  </div>
                  <div className="row" style={{ marginTop: "10px" }}>
                    <div className="col-lg-2">
                      <Checkbox color="primary" onChange={() => {}} />
                      <AlgaehLabel
                        label={{
                          forceLabel: "Chronic"
                        }}
                      />
                    </div>
                    <AlagehFormGroup
                      div={{ className: "col-lg-4" }}
                      label={{
                        forceLabel: "Tooth from",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "tooth_from",

                        //value: this.state.pain,
                        events: {}
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row popupFooter">
              <div className="col-lg-12">
                <Button
                  variant="raised"
                  color="secondary"
                  style={{ backgroundColor: "#24B256" }}
                  // onClick={        }
                  size="small"
                >
                  Save
                </Button>
                <Button
                  variant="raised"
                  onClick={this.handleClose}
                  style={{ backgroundColor: "#D5D5D5" }}
                  size="small"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Chief Complain Modal End */}

        <div className="col-lg-12" style={{ marginTop: "15px" }}>
          <div className="row">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body box-shadow-normal">
                  <h6 className="card-subtitle mb-2 text-muted">
                    Chief Complaint
                    <span className="float-right">
                      <Button
                        mini
                        variant="fab"
                        color="primary"
                        onClick={this.addChiefComplain}
                      >
                        <i className="fas fa-plus" />
                      </Button>
                    </span>
                  </h6>
                </div>
                <AlgaehDataGrid
                  id="complaint-grid"
                  columns={[
                    {
                      fieldName: "cheif_complaint_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "complaint_name" }} />
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
                                : "Year(s)";
                      }
                    },
                    {
                      fieldName: "actions",
                      label: <AlgaehLabel label={{ fieldName: "actions" }} />,
                      displayTemplate: data => {
                        return (
                          <span>
                            <IconButton color="primary" title="Edit">
                              <Edit
                              // onClick={this.ShowEditModel.bind(this, row)}
                              />
                            </IconButton>

                            <IconButton color="primary" title="Process To Bill">
                              <HPI
                              //onClick={VerifyOrderModel.bind(this, this, row)}
                              />
                            </IconButton>

                            <IconButton color="primary" title="Submit">
                              <Delete
                                onClick={this.deleteChiefComplain.bind(
                                  this,
                                  data
                                )}
                              />
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

            <div className="col-lg-4">
              <div className="card">
                <div className="card-body box-shadow-normal">
                  <h6 className="card-subtitle mb-2 text-muted">
                    Allergies
                    <span className="float-right">
                      <Button
                        mini
                        variant="fab"
                        color="primary"
                        onClick={this.addChiefComplain}
                      >
                        <i className="fas fa-plus" />
                      </Button>
                    </span>
                  </h6>
                </div>

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

              <div className="card">
                <div className="card-body box-shadow-normal">
                  <h6 className="card-subtitle mb-2 text-muted">
                    Review of Systems
                    <span className="float-right">
                      <Button
                        mini
                        variant="fab"
                        color="primary"
                        onClick={this.addChiefComplain}
                      >
                        <i className="fas fa-plus" />
                      </Button>
                    </span>
                  </h6>
                </div>

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
          </div>
        </div>
      </div>
    );
  }
}

export default Subjective;
