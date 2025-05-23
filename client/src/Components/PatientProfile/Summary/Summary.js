import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./summary.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import Enumerable from "linq";
import { getPatientHistory, getPatientVitals } from "../PatientProfileHandlers";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
// import moment from "moment";
import PrescriptionHistory from "../../MRD/PatientMRD/HistoricalData/PrescriptionHistoryTable";
import _ from "lodash";

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientMedications: [],
      patientEpisode: [],
      patientFollowUp: [],
      // patientSummary: {},
    };

    if (
      this.props.patient_history === undefined ||
      this.props.patient_history.length === 0
    ) {
      getPatientHistory(this);
    }

    if (
      this.props.patient_vitals === undefined ||
      this.props.patient_vitals.length === 0
    ) {
      getPatientVitals(this);
    }

    this.getPatientMedication();
    this.getEpisodeSummary();
    this.getPatientSummary();
    this.getSummaryFollowUp();
    this.getPatientEncounterDetails();
  }

  getPatientEncounterDetails() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientEncounter",
      method: "GET",
      data: {
        encounter_id: Window.global.encounter_id,
      },
      onSuccess: (response) => {
        let data = response.data.records[0];
        if (response.data.success) {
          this.setState({
            significant_signs: data.significant_signs,
            other_signs: data.other_signs,
          });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  getEpisodeSummary() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientEpisodeSummary",
      method: "GET",
      data: {
        episode_id: Window.global["episode_id"],
      },
      cancelRequestId: "getPatientMedication1",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({ patientEpisode: response.data.records });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  getPatientSummary() {
    // debugger;
    const { current_patient, episode_id, visit_id } = Window.global;
    algaehApiCall({
      uri: "/mrd/getPatientSummary",
      module: "MRD",
      method: "GET",
      data: {
        patient_id: current_patient,
        visit_id: visit_id,
        episode_id: episode_id,
      },
      cancelRequestId: "getPatientSummary",
      onSuccess: (response) => {
        if (response.data.success) {
          debugger;
          this.setState({ patientSummary: response.data.records });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  getPatientMedication() {
    algaehApiCall({
      uri: "/mrd/getPatientMedication",
      module: "MRD",
      method: "GET",
      data: {
        episode_id: Window.global["episode_id"],
      },
      cancelRequestId: "getPatientMedication11",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({ patientMedications: response.data.records });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  getSummaryFollowUp() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getSummaryFollowUp",
      method: "GET",
      data: {
        episode_id: Window.global["episode_id"],
      },
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({ patientFollowUp: response.data.records });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
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
    const patVitalList = this.props.patient_vitals.map((item) => item.list);
    const _pat_vitals =
      this.props.patient_vitals !== undefined &&
      this.props.patient_vitals.length > 0
        ? _.chain(patVitalList)
            .uniqBy((u) => u.vital_id)
            .orderBy((o) => o.sequence_order)
            .value()
        : [];

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

    // console.log("patient details=== ", this.state.patientEpisode, _pat_episode);

    return (
      <div id="patientSummary">
        <div className="row">
          <div className="col-md-9 col-lg-9">
            <div className="bd-callout bd-callout-theme">
              <h6>Patient Information</h6>
              {_pat_episode.patient_name === undefined ? (
                <p>Not recorded</p>
              ) : (
                <p>
                  {_pat_episode.patient_code} /{" "}
                  <b>{_pat_episode.patient_name}</b> /{" "}
                  {_pat_episode.primary_id_no} - ( {_pat_episode.age}Y{" "}
                  {_pat_episode.age_in_months}m {_pat_episode.age_in_days}d/
                  {_pat_episode.gender}), visited{" "}
                  {_pat_episode.sub_department_name} Department on{" "}
                  <b>{_pat_episode.visit_date}</b>.
                </p>
              )}
              <br />
              <h6>Chief Complaints</h6>
              {_pat_episode.patient_name === undefined ? (
                <p>Not recorded</p>
              ) : (
                <p>
                  {_pat_episode.comment} from {_pat_episode.onset_date}.
                </p>
              )}
              <br />
              <h6>Significant Signs</h6>
              <p>
                {this.state.significant_signs
                  ? this.state.significant_signs
                  : "Not Recorded"}
              </p>

              <br />
              <h6>Other Signs</h6>
              {this.state.other_signs ? this.state.other_signs : "Not Recorded"}
            </div>

            <div className="bd-callout bd-callout-theme">
              <h6>Vitals</h6>
              <div className="col-md-12 col-lg-12">
                <div className="row text-center">
                  {_pat_vitals.length > 0 ? (
                    _pat_vitals.map((row) =>
                      row.map((item, index) => (
                        <div key={index} className="col vitals-sec">
                          <div className="counter">
                            <h4 className="timer count-title count-number">
                              {item.vital_value}
                            </h4>
                            <p className="count-text ">{item.vitals_name}</p>
                          </div>
                        </div>
                      ))
                    )
                  ) : (
                    <span className="col">Not Recorded</span>
                  )}
                </div>
              </div>
            </div>
            <div className="bd-callout bd-callout-theme">
              <h6>Diagnosis</h6>
              <div className="row">
                <div className="col-12">
                  <p className="danger">
                    Primary:
                    <b>
                      {" "}
                      {_pat_patientDiagnosis.length > 0
                        ? _pat_patientDiagnosis.map((data, index) =>
                            data.diagnosis_type === "P"
                              ? data.icd_description
                              : null
                          )
                        : "No Diagnosis added"}
                    </b>
                  </p>
                </div>

                <div className="col-12">
                  <p className="">
                    Secondary:
                    <b>
                      {" "}
                      {_pat_patientDiagnosis.map((data, index) =>
                        data.diagnosis_type === "S"
                          ? data.icd_description
                          : null
                      )}
                    </b>
                  </p>
                </div>
              </div>
            </div>
            {this.state.patientMedications.length > 0 ? (
              <div className="bd-callout bd-callout-theme">
                <h6>Medication</h6>
                <PrescriptionHistory
                  columnsArray={[
                    { name: "Start Date" },
                    { name: "Generic Name" },
                    { name: "Item Desc." },
                    // { name: "Dosage" },
                    // { name: "Unit" },
                    // { name: "Frequency" },
                    { name: "Instructions" },
                  ]}
                  columnData={this.state.patientMedications}
                />

                {/* <table className="table table-sm table-bordered customTable">
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
                         <td width="50">{index + 1}</td>
                          <td>{data.item_description}</td>
                          <td>{data.dosage}</td>
                          <td>
                            {data.frequency_type === "AD"
                              ? "Alternate Day"
                              : data.frequency_type === "PD"
                              ? "Per Day"
                              : data.frequency_type === "PH"
                              ? "Per Hour"
                              : data.frequency_type === "PW"
                              ? "Per Week"
                              : data.frequency_type === "PM"
                              ? "Per Month"
                              : data.frequency_type === "2W"
                              ? "Every 2 weeks"
                              : data.frequency_type === "2M"
                              ? "Every 2 months"
                              : data.frequency_type === "3M"
                              ? "Every 3 months"
                              : data.frequency_type === "4M"
                              ? "Every 4 Months"
                              : data.frequency_type === "6M"
                              ? "Every 6 Months"
                              : ""}
                          </td>
                          <td>{data.no_of_days}</td>
                          <td>{data.instructions}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table> */}
              </div>
            ) : null}
            {this.state.patientSummary?.lab ? (
              this.state.patientSummary.lab?.length > 0 ? (
                <div className="bd-callout bd-callout-theme">
                  <h6>Lab Order:-</h6>
                  <table className="accrTable">
                    <thead>
                      <tr>
                        <th>SL No.</th>
                        <th>Service Name</th>
                      </tr>
                    </thead>
                    {this.state.patientSummary?.lab.map((item, index) => {
                      const { service_name } = item;
                      return (
                        <tbody>
                          <tr>
                            <td width="50">{index + 1}</td>
                            <td
                              style={{ textAlign: "left", fontWeight: "bold" }}
                            >
                              {service_name}
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </table>
                </div>
              ) : null
            ) : null}
            {this.state.patientSummary?.rad ? (
              this.state.patientSummary.rad?.length > 0 ? (
                <div className="bd-callout bd-callout-theme">
                  <h6>Radiology Order:-</h6>
                  <table className="accrTable">
                    <thead>
                      <tr>
                        <th>SL No.</th>
                        <th>Service Name</th>
                      </tr>
                    </thead>
                    {this.state.patientSummary?.rad.map((item, index) => {
                      const { service_name } = item;
                      return (
                        <tbody>
                          <tr>
                            <td width="50">{index + 1}</td>
                            <td
                              style={{ textAlign: "left", fontWeight: "bold" }}
                            >
                              {service_name}
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </table>
                </div>
              ) : null
            ) : null}
            {this.state.patientSummary?.consumableList ? (
              this.state.patientSummary.consumableList?.length > 0 ? (
                <div className="bd-callout bd-callout-theme">
                  <h6>Consumable Order:-</h6>
                  <table className="accrTable">
                    <thead>
                      <tr>
                        <th>SL No.</th>
                        <th>Service Name</th>
                        <th>Instructions</th>
                      </tr>
                    </thead>
                    {this.state.patientSummary?.consumableList.map(
                      (item, index) => {
                        const { service_name, instructions } = item;
                        return (
                          <tbody>
                            <tr>
                              <td width="50">{index + 1}</td>
                              <td
                                style={{
                                  textAlign: "left",
                                  fontWeight: "bold",
                                }}
                              >
                                {service_name}
                              </td>
                              <td style={{ textAlign: "left" }}>
                                {instructions}
                              </td>
                            </tr>
                          </tbody>
                        );
                      }
                    )}
                  </table>
                </div>
              ) : null
            ) : null}
            {this.state.patientSummary?.packageList ? (
              this.state.patientSummary.packageList?.length > 0 ? (
                <div className="bd-callout bd-callout-theme">
                  <h6>Package Order:-</h6>
                  <table className="accrTable">
                    <thead>
                      <tr>
                        <th>SL No.</th>
                        <th>Service Name</th>
                      </tr>
                    </thead>
                    {this.state.patientSummary?.packageList.map(
                      (item, index) => {
                        const { service_name } = item;
                        return (
                          <tbody>
                            <tr>
                              <td width="50">{index + 1}</td>
                              <td
                                style={{
                                  textAlign: "left",
                                  fontWeight: "bold",
                                }}
                              >
                                {service_name}
                              </td>
                            </tr>
                          </tbody>
                        );
                      }
                    )}
                  </table>
                </div>
              ) : null
            ) : null}
            {this.state.patientSummary?.examinationList ? (
              this.state.patientSummary.examinationList?.length > 0 ? (
                <div className="bd-callout bd-callout-theme">
                  <h6>Physical Examination:-</h6>
                  <table className="accrTable">
                    <thead>
                      <tr>
                        <th>SL No.</th>
                        <th>DESCRIPTION</th>
                        <th>TYPE</th>
                        <th>Severity</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    {this.state.patientSummary?.examinationList.map(
                      (item, index) => {
                        const { ex_desc, ex_type, ex_severity, comments } =
                          item;
                        return (
                          <tbody>
                            <tr>
                              <td width="50">{index + 1}</td>
                              <td
                                style={{
                                  textAlign: "left",
                                  fontWeight: "bold",
                                }}
                              >
                                {ex_desc}
                              </td>
                              <td>{ex_type}</td>
                              <td>{ex_severity}</td>
                              <td style={{ textAlign: "left" }}>{comments}</td>
                            </tr>
                          </tbody>
                        );
                      }
                    )}
                  </table>
                </div>
              ) : null
            ) : null}
            {this.state.patientSummary?.procedureList ? (
              this.state.patientSummary.procedureList?.length > 0 ? (
                <div className="bd-callout bd-callout-theme">
                  <h6>Procedure Order:-</h6>
                  <table className="accrTable">
                    <thead>
                      <tr>
                        <th>SL No.</th>
                        <th>Service Name</th>
                      </tr>
                    </thead>
                    {this.state.patientSummary?.procedureList.map(
                      (item, index) => {
                        const { service_name } = item;
                        return (
                          <tbody>
                            <tr>
                              <td width="50">{index + 1}</td>
                              <td
                                style={{
                                  textAlign: "left",
                                  fontWeight: "bold",
                                }}
                              >
                                {service_name}
                              </td>
                            </tr>
                          </tbody>
                        );
                      }
                    )}
                  </table>
                </div>
              ) : null
            ) : null}
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
    patient_diagnosis: state.patient_diagnosis,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientSummary: AlgaehActions,
      getVitalHistory: AlgaehActions,
      getPatientHistory: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Summary)
);
