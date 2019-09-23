import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./summary.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import Enumerable from "linq";
import { getPatientHistory } from "../PatientProfileHandlers";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
// import moment from "moment";
import _ from "lodash";

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientMedications: [],
      patientEpisode: [],
      patientFollowUp: []
    };

    if (
      this.props.patient_history === undefined ||
      this.props.patient_history.length === 0
    ) {
      getPatientHistory(this);
    }

    this.getPatientMedication();
    this.getEpisodeSummary();

    this.getSummaryFollowUp();
    this.getPatientEncounterDetails();
  }

  getPatientEncounterDetails() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientEncounter",
      method: "GET",
      data: {
        encounter_id: Window.global.encounter_id
      },
      onSuccess: response => {
        let data = response.data.records[0];
        if (response.data.success) {
          this.setState({
            significant_signs: data.significant_signs,
            other_signs: data.other_signs
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

  getEpisodeSummary() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientEpisodeSummary",
      method: "GET",
      data: {
        episode_id: Window.global["episode_id"]
      },
      cancelRequestId: "getPatientMedication1",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ patientEpisode: response.data.records });
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

  getPatientMedication() {
    algaehApiCall({
      uri: "/mrd/getPatientMedication",
      module: "MRD",
      method: "GET",
      data: {
        episode_id: Window.global["episode_id"]
      },
      cancelRequestId: "getPatientMedication11",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ patientMedications: response.data.records });
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

  getSummaryFollowUp() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getSummaryFollowUp",
      method: "GET",
      data: {
        episode_id: Window.global["episode_id"]
      },
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ patientFollowUp: response.data.records });
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

  render() {
    const _pat_allergies =
      this.props.patient_allergies !== undefined &&
      this.props.patient_allergies.length > 0
        ? this.props.patient_allergies
        : [];

    const _pat_diet =
      this.props.patient_diet !== undefined &&
      this.props.patient_diet.length > 0
        ? this.props.patient_diet
        : [];

    const _pat_vitals =
      this.props.patient_vitals !== undefined &&
      this.props.patient_vitals.length > 0
        ? _.chain(this.props.patient_vitals)
            .uniqBy(u => u.vital_id)
            .orderBy(o => o.sequence_order)
            .value()
        : [];

    let _pat_socialHistory =
      this.props.patient_history !== undefined
        ? this.props.patient_history.social
        : [];

    // let _pat_medicalHistory =
    //   this.props.patient_history !== undefined
    //     ? this.props.patient_history.medical
    //     : [];
    //
    // let _pat_surgicalHistory =
    //   this.props.patient_history !== undefined
    //     ? this.props.patient_history.surgical
    //     : [];
    //
    // let _pat_familyHistory =
    //   this.props.patient_history !== undefined
    //     ? this.props.patient_history.family
    //     : [];
    //
    // let _pat_birthHistory =
    //   this.props.patient_history !== undefined
    //     ? this.props.patient_history.birth
    //     : [];
    //
    let _pat_patientDiagnosis =
      this.props.patient_diagnosis !== undefined
        ? this.props.patient_diagnosis
        : [];
    const history =
      this.props.patient_history !== undefined
        ? this.props.patient_history
        : [];

    let _pat_episode =
      Enumerable.from(this.state.patientEpisode).firstOrDefault() !== undefined
        ? Enumerable.from(this.state.patientEpisode).firstOrDefault()
        : {};

    return (
      <div id="patientSummary">
        <div className="row">
          <div className="col-md-9 col-lg-9">
            <div className="bd-callout bd-callout-theme">
              <h6>Chief Complaints</h6>
              {_pat_episode.patient_name === undefined ? (
                <p>Not recorded</p>
              ) : (
                <p>
                  Patient {_pat_episode.patient_name}, {_pat_episode.age} Yrs/
                  {_pat_episode.gender},<br />
                  visited {_pat_episode.sub_department_name} Department on{" "}
                  {_pat_episode.visit_date} for the chief complaint of{" "}
                  <b>{_pat_episode.comment}</b> from {_pat_episode.onset_date}.
                </p>
              )}
              <br />
              <h6>Significant Signs</h6>
              <p>
                {this.state.significant_signs
                  ? this.state.significant_signs
                  : "Not Recorder"}
              </p>

              <br />
              <h6>Other Signs</h6>
              {this.state.other_signs ? this.state.other_signs : "Not Recorder"}
            </div>

            <div className="bd-callout bd-callout-theme">
              <h6>Vitals</h6>
              <div className="col-md-12 col-lg-12">
                <div className="row text-center">
                  {_pat_vitals.length > 0 ? (
                    _pat_vitals.map((row, index) => (
                      <div key={index} className="col vitals-sec">
                        <div className="counter">
                          <h4 className="timer count-title count-number">
                            {row.vital_value}
                          </h4>
                          <p className="count-text ">{row.vitals_name}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="col">Not Recorded</span>
                  )}
                </div>
              </div>
            </div>
            <div className="bd-callout bd-callout-theme">
              <h6>Diagnosis</h6>
              <div className="row">
                <div className="col">
                  <h6 className="danger">
                    {_pat_patientDiagnosis.length > 0
                      ? _pat_patientDiagnosis.map((data, index) =>
                          data.diagnosis_type === "P"
                            ? "Primary: " + data.icd_description
                            : null
                        )
                      : "No Diagnosis added"}
                  </h6>
                </div>

                <div className="col">
                  <h6 className="">
                    {_pat_patientDiagnosis.map((data, index) =>
                      data.diagnosis_type === "S"
                        ? "Secondary: " + data.icd_description
                        : null
                    )}
                  </h6>
                </div>
              </div>
            </div>
            <div className="bd-callout bd-callout-theme">
              <h6>Medication</h6>
              <table className="table table-sm table-bordered customTable">
                <thead className="table-primary">
                  <tr>
                    <th style={{ width: 30 }}>Sl. No.</th>
                    <th style={{ width: "45%" }}>Item Name</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration(days)</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.patientMedications.length > 0
                    ? this.state.patientMedications.map((data, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data.item_description}</td>
                          <td>{data.dosage}</td>
                          <td>
                            {data.frequency_type === "PD"
                              ? "Per Day"
                              : data.frequency_type === "PH"
                              ? "Per Hour"
                              : data.frequency_type === "PW"
                              ? "Per Week"
                              : data.frequency_type === "PM"
                              ? "Per Month"
                              : data.frequency_type === "AD"
                              ? "Alternate Day"
                              : ""}
                          </td>
                          <td>{data.no_of_days}</td>
                          <td>{data.instructions}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
            {history.map((patientHistory, index) => (
              <div className="bd-callout bd-callout-theme" key={index}>
                <h6>{patientHistory.groupName}</h6>
                <table
                  className="table table-sm table-bordered customTable"
                  style={{ marginTop: 10 }}
                >
                  <thead className="table-primary">
                    <tr>
                      <th>History</th>
                      <th>Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientHistory.groupDetail.map((data, dIndex) => (
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
              </div>
            ))}
            {history.length === 0 ? (
              <div class="bd-callout bd-callout-theme">
                <i class="fas fa-hourglass-half" />
                <p>History not recorded yet.</p>
              </div>
            ) : null}
          </div>
          <div className="col-md-3 col-lg-3">
            <div className="card">
              <div className="card-header">Allergies</div>
              <ul className="list-group list-group-flush">
                {_pat_allergies.map((data, index) => (
                  <li key={index} className="list-group-item">
                    {data.allergy_name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <div className="card-header">Diet Advice</div>
              <ul className="list-group list-group-flush">
                {_pat_diet.map((data, index) => (
                  <li key={index} className="list-group-item">
                    {data.hims_d_diet_description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient_summary: state.patient_summary,
    patient_profile: state.patient_profile,
    patient_allergies: state.patient_allergies,
    patient_diet: state.patient_diet,
    patient_vitals: state.patient_vitals,
    patient_history: state.patient_history,
    patient_diagnosis: state.patient_diagnosis
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientSummary: AlgaehActions,
      getVitalHistory: AlgaehActions,
      getPatientHistory: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Summary)
);
