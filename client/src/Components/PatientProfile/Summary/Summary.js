import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./summary.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import Enumerable from "linq";
import { getPatientHistory } from "../PatientProfileHandlers";
import { algaehApiCall } from "../../../utils/algaehApiCall";

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientMedications: [],
      patientEpisode: []
    };

    this.props.patient_history === undefined ||
    this.props.patient_history.length === 0
      ? getPatientHistory(this)
      : null;

    this.getPatientMedication();
    this.getEpisodeSummary();
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
        debugger;
        if (response.data.success) {
          this.setState({ patientEpisode: response.data.records });
        }
      },
      onFailure: error => {
        // swalMessage({
        //   title: error.message,
        //   type: "error"
        // });
      }
    });
  }

  getPatientMedication() {
    algaehApiCall({
      uri: "/mrd/getPatientMedication",
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
        // swalMessage({
        //   title: error.message,
        //   type: "error"
        // });
      }
    });
  }

  render() {
    const _pat_profile =
      this.props.patient_profile !== undefined &&
      this.props.patient_profile.length > 0
        ? this.props.patient_profile[0]
        : {};

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
        ? Enumerable.from(this.props.patient_vitals)
            .groupBy("$.visit_date", null, (k, g) => {
              return g.getSource();
            })
            .orderBy(g => g.visit_date)
            .lastOrDefault()
        : [];

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

    let _pat_patientDiagnosis =
      this.props.patient_diagnosis !== undefined
        ? this.props.patient_diagnosis
        : [];

    debugger;
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
                  Patient {_pat_episode.patient_name} ,{_pat_episode.gender}{" "}
                  aged {_pat_episode.age} Yrs Visited{" "}
                  {_pat_episode.sub_department_name} Department on{" "}
                  {_pat_episode.visit_date} for the chief complaint of{" "}
                  {_pat_episode.chief_complaint}, from {_pat_episode.onset_date}
                  .
                </p>
              )}
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
                            {" "}
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
              <h6>Family History</h6>
              <ul>
                {_pat_familyHistory.map((data, index) => (
                  <li key={index}>{data.remarks}</li>
                ))}
              </ul>
            </div>

            <div className="bd-callout bd-callout-theme">
              <h6>Social Hitory</h6>
              <ul>
                {_pat_socialHistory.map((data, index) => (
                  <li key={index}>
                    {data.remarks + " (Dr. " + data.provider_name + ")"}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bd-callout bd-callout-theme">
              <h6>Medical History</h6>

              <ul>
                {_pat_medicalHistory.map((data, index) => (
                  <li key={index}>
                    {data.remarks + " (Dr. " + data.provider_name + ")"}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bd-callout bd-callout-theme">
              <h6>Surgical History</h6>

              <ul>
                {_pat_surgicalHistory.map((data, index) => (
                  <li key={index}>
                    {data.remarks + " (Dr. " + data.provider_name + ")"}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bd-callout bd-callout-theme">
              <h6>Birth History</h6>

              <ul>
                {_pat_birthHistory.map((data, index) => (
                  <li key={index}>
                    {data.remarks + " (Dr. " + data.provider_name + ")"}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bd-callout bd-callout-theme">
              <h6>Medication</h6>
              <table className="table table-sm table-bordered customTable">
                <thead className="table-primary">
                  <tr>
                    <th>Sl. No.</th>
                    <th>Generic Name</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration(days)</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.patientMedications.length > 0
                    ? this.state.patientMedications.map((data, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data.generic_name}</td>
                          <td>{data.dosage}</td>
                          <td>{data.frequency_type}</td>
                          <td>{data.no_of_days}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
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
