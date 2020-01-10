import React, { Component } from "react";
import "./PatientHistory.scss";
import { AlgaehModalPopUp, AlgaehLabel } from "../../Wrapper/algaehWrapper";
import {
  algaehApiCall,
  swalMessage,
  maxCharactersLeft
} from "../../../utils/algaehApiCall";
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
      social_history: "",
      surgical_history: "",
      medical_history: "",
      family_history: "",
      birth_history: "",
      openAddModal: false
    };
    this.socialHistoryMaxLength = 1000;
    this.medicalHistoryMaxLength = 1000;
    this.surgeryHistoryMaxLength = 1000;
    this.familyHistoryMaxLength = 1000;
    this.birthHistoryMaxLength = 1000;
    getPatientHistory(this);
  }

  savePatientHistory() {
    let his_array = [];

    // if (
    //   this.state.social_history === "" ||
    //   this.state.surgical_history === "" ||
    //   this.state.medical_history === "" ||
    //   this.state.family_history === "" ||
    //   this.state.birth_history === ""
    // ) {
    //   swalMessage({
    //     title: "Please Enter History to save",
    //     type: "warning"
    //   });
    //   return;
    // }

    if (this.state.social_history) {
      his_array.push({
        history_type: "SOH",
        remarks: this.state.social_history
      });
    }
    if (this.state.surgical_history) {
      his_array.push({
        history_type: "SGH",
        remarks: this.state.surgical_history
      });
    }
    if (this.state.medical_history) {
      his_array.push({
        history_type: "MEH",
        remarks: this.state.medical_history
      });
    }
    if (this.state.family_history) {
      his_array.push({
        history_type: "FMH",
        remarks: this.state.family_history
      });
    }
    if (this.state.birth_history) {
      his_array.push({
        history_type: "BRH",
        remarks: this.state.birth_history
      });
    }

    if (his_array.length === 0) {
      swalMessage({
        title: "Please Enter History to save",
        type: "warning"
      });
      return;
    }
    const { current_patient, provider_id } = this.props.location.state;
    let send_obj = {
      patient_id: current_patient, //Window.global['current_patient'],
      provider_id: provider_id, //Window.global['provider_id'],
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
    const history =
      this.props.patient_history !== undefined
        ? this.props.patient_history
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
              <div
                className="popLeftDiv"
                style={{ paddingTop: 10, paddingBottom: 0 }}
              >
                <div className="row">
                  <div className="col-12 historySepration">
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
                      maxLength={this.socialHistoryMaxLength}
                    />
                    <small className="float-right">
                      Max characters {this.socialHistoryMaxLength}/
                      {maxCharactersLeft(
                        this.socialHistoryMaxLength,
                        this.state.social_history
                      )}
                    </small>
                  </div>
                  <div className="col-12 historySepration">
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
                      maxLength={this.medicalHistoryMaxLength}
                    />
                    <small className="float-right">
                      Max characters {this.medicalHistoryMaxLength}/
                      {maxCharactersLeft(
                        this.medicalHistoryMaxLength,
                        this.state.medical_history
                      )}
                    </small>
                  </div>
                  <div className="col-12 historySepration">
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
                      maxLength={this.surgeryHistoryMaxLength}
                    />
                    <small className="float-right">
                      Max characters {this.surgeryHistoryMaxLength}/
                      {maxCharactersLeft(
                        this.surgeryHistoryMaxLength,
                        this.state.surgical_history
                      )}
                    </small>
                  </div>
                  <div className="col-12 historySepration">
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
                      maxLength={this.familyHistoryMaxLength}
                    />
                    <small className="float-right">
                      Max characters {this.familyHistoryMaxLength}/
                      {maxCharactersLeft(
                        this.familyHistoryMaxLength,
                        this.state.family_history
                      )}
                    </small>
                  </div>
                  <div className="col-12 historySepration">
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
                      maxLength={this.birthHistoryMaxLength}
                    />
                    <small className="float-right">
                      Max characters {this.birthHistoryMaxLength}/
                      {maxCharactersLeft(
                        this.birthHistoryMaxLength,
                        this.state.birth_history
                      )}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-8" style={{ paddingLeft: 0 }}>
              <div className="popRightDiv" style={{ paddingLeft: 0 }}>
                {history.map((item, index) => (
                  <table
                    className="table table-sm table-bordered customTable"
                    key={index}
                  >
                    <thead className="">
                      <tr>
                        <th>{item.groupName}</th>
                        <th>Recorded By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.groupDetail.map((data, dIndex) => (
                        <tr key={dIndex}>
                          <td>{data.remarks}</td>
                          <td>
                            {data.provider_name} on
                            <small> {data.created_date}</small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
                {history.length === 0 ? (
                  <div className="noHistoryRecorded">
                    <i className="fas fa-hourglass-half" />
                    <p>History not recorded yet.</p>
                  </div>
                ) : null}
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
  connect(mapStateToProps, mapDispatchToProps)(PatientHistory)
);
