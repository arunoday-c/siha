import React, { Component } from "react";
import "./PatientHistory.css";
import { AlgaehModalPopUp, AlgaehLabel } from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { getPatientHistory } from "../PatientProfileHandlers";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";

class PatientHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patHistory: [],
      social_history: null,
      surgical_history: null,
      medical_history: null,
      family_history: null,
      birth_history: null,
      openAddModal: false
    };
    getPatientHistory(this);
  }

  savePatientHistory() {
    debugger;
    let his_array = [];

    if (
      (this.state.social_history === null ||
        this.state.social_history === "") &&
      (this.state.surgical_history === null ||
        this.state.surgical_history === "") &&
      (this.state.medical_history === null ||
        this.state.medical_history === "") &&
      (this.state.family_history === null ||
        this.state.family_history === "") &&
      (this.state.birth_history === null || this.state.birth_history === "")
    ) {
      swalMessage({
        title: "Please Enter History to save",
        type: "warning"
      });
      return;
    }

    if (this.state.social_history !== null) {
      his_array.push({
        history_type: "SOH",
        remarks: this.state.social_history
      });
    }
    if (this.state.surgical_history !== null) {
      his_array.push({
        history_type: "SGH",
        remarks: this.state.surgical_history
      });
    }
    if (this.state.medical_history !== null) {
      his_array.push({
        history_type: "MEH",
        remarks: this.state.medical_history
      });
    }
    if (this.state.family_history !== null) {
      his_array.push({
        history_type: "FMH",
        remarks: this.state.family_history
      });
    }
    if (this.state.birth_history !== null) {
      his_array.push({
        history_type: "BRH",
        remarks: this.state.birth_history
      });
    }

    let send_obj = {
      patient_id: Window.global["current_patient"],
      provider_id: Window.global["provider_id"],
      patient_history: his_array
    };

    algaehApiCall({
      uri: "/doctorsWorkBench/addPatientHistory",
      method: "POST",
      data: send_obj,
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record added successfully",
            type: "success"
          });
          debugger;

          this.setState(
            {
              social_history: "",
              surgical_history: "",
              medical_history: "",
              family_history: "",
              birth_history: ""
            },
            () => {
              getPatientHistory(this);
            }
          );
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

  textHandle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    this.accordianHistory();
  }

  accordianHistory() {
    const acc = document.getElementsByClassName("accordion-btn");
    let i;
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }

  // addHistory(type) {
  //   this.setState({
  //     type: type,
  //     openAddModal: true
  //   });
  // }

  onClose = e => {
    this.setState(
      {
        patHistory: [],
        social_history: null,
        surgical_history: null,
        medical_history: null,
        family_history: null,
        birth_history: null
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };
  render() {
    let _pat_socialHistory =
      this.props.patient_history !== undefined
        ? this.props.patient_history.social
        : [];

    let _pat_medicalHistory =
      this.props.patient_history !== undefined
        ? this.props.patient_history.medical
        : [];

    let _pat_surgicalHistory =
      this.props.patient_history !== undefined
        ? this.props.patient_history.surgical
        : [];

    let _pat_familyHistory =
      this.props.patient_history !== undefined
        ? this.props.patient_history.family
        : [];

    let _pat_birthHistory =
      this.props.patient_history !== undefined
        ? this.props.patient_history.birth
        : [];

    return (
      <AlgaehModalPopUp
        openPopup={this.props.openAddModal}
        title={"Patient History"}
        events={{
          onClose: this.onClose.bind(this)
        }}
      >
        <div className="popupInner">
          <div className="row">
            <div className="col-4">
              <div className="popLeftDiv">
                <AlgaehLabel
                  label={{
                    forceLabel: "Social History"
                  }}
                />
                <textarea
                  style={{ height: "17vh" }}
                  value={this.state.social_history}
                  name="social_history"
                  onChange={this.textHandle.bind(this)}
                >
                  {this.state.social_history}
                </textarea>

                <AlgaehLabel
                  label={{
                    forceLabel: "Medical History"
                  }}
                />
                <textarea
                  style={{ height: "17vh" }}
                  value={this.state.medical_history}
                  name="medical_history"
                  onChange={this.textHandle.bind(this)}
                >
                  {this.state.medical_history}
                </textarea>

                <AlgaehLabel
                  label={{
                    forceLabel: "Surgical History"
                  }}
                />
                <textarea
                  style={{ height: "17vh" }}
                  value={this.state.surgical_history}
                  name="surgical_history"
                  onChange={this.textHandle.bind(this)}
                >
                  {this.state.surgical_history}
                </textarea>

                <AlgaehLabel
                  label={{
                    forceLabel: "Family History"
                  }}
                />
                <textarea
                  style={{ height: "17vh" }}
                  value={this.state.family_history}
                  name="family_history"
                  onChange={this.textHandle.bind(this)}
                >
                  {this.state.family_history}
                </textarea>

                <AlgaehLabel
                  label={{
                    forceLabel: "Birth History"
                  }}
                />
                <textarea
                  style={{ height: "17vh" }}
                  value={this.state.birth_history}
                  name="birth_history"
                  onChange={this.textHandle.bind(this)}
                >
                  {this.state.birth_history}
                </textarea>
              </div>
            </div>
            <div className="col-8" style={{paddingLeft:0}}>
              <div className="popRightDiv" style={{paddingLeft:0}}>
                <table className="table table-sm table-bordered customTable">
                  <thead className="">
                    <tr>
                      <th>Social History</th>
                      <th>Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_pat_socialHistory.map((data, index) => (
                      <tr key={index}>
                        <td>{data.remarks}</td>
                        <td>{"Dr. " + data.provider_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className="table table-sm table-bordered customTable">
                  <thead className="">
                    <tr>
                      <th>Medical History</th>
                      <th>Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_pat_medicalHistory.map((data, index) => (
                      <tr key={index}>
                        <td>{data.remarks}</td>
                        <td>{"Dr. " + data.provider_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className="table table-sm table-bordered customTable">
                  <thead className="">
                    <tr>
                      <th>Surgical History</th>
                      <th>Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_pat_surgicalHistory.map((data, index) => (
                      <tr key={index}>
                        <td>{data.remarks}</td>
                        <td>{"Dr " + data.provider_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <table className="table table-sm table-bordered customTable">
                  <thead className="">
                    <tr>
                      <th>Family History</th>
                      <th>Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_pat_familyHistory.map((data, index) => (
                      <tr key={index}>
                        <td>{data.remarks}</td>
                        <td>{"Dr. " + data.provider_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <table className="table table-sm table-bordered customTable">
                  <thead className="">
                    <tr>
                      <th>Birth History</th>  
                      <th>Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_pat_birthHistory.map((data, index) => (
                      <tr key={index}>
                        <td>{data.remarks}</td>
                        <td>{"Dr. " + data.provider_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="popupFooter">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.savePatientHistory.bind(this)}
              >
                Save
              </button>{" "}
              <button
                type="button"
                className="btn btn-default"
                onClick={e => {
                  this.onClose(e);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient_history: state.patient_history
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientHistory: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientHistory)
);
