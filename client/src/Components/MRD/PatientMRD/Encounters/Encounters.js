import React, { Component } from "react";
import "./encounters.css";
import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import algaehLoader from "../../../Wrapper/fullPageLoader";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";

class Encounters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientEncounters: [],
      patientComplaints: [],
      patientDiagnosis: [],
      patientMedications: [],
      patientInvestigations: [],
      patientProcedures: [],
      patientVital: {}
    };
  }

  setEncounterDetails(e) {
    const enc_id = e.currentTarget.getAttribute("enc-id");
    const episode_id = e.currentTarget.getAttribute("epi-id");
    const visit_id = e.currentTarget.getAttribute("visit-id");

    this.getPatientChiefComplaint(episode_id);
    this.getPatientDiagnosis(episode_id);
    this.getPatientMedication(enc_id);
    this.getPatientInvestigation(visit_id);
    this.getPatientVitals(Window.global["mrd_patient"], visit_id);

    const general_info = Enumerable.from(this.state.patientEncounters)
      .where(w => w.hims_f_patient_encounter_id === parseInt(enc_id))
      .firstOrDefault();

    this.setState({
      generalInfo: general_info
    });
  }

  getPatientVitals(patient_id, visit_id) {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientVitals",
      method: "GET",
      data: {
        patient_id: patient_id,
        visit_id: visit_id
      },
      cancelRequestId: "getPatientVitals",
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success && response.data.records.length !== 0) {
          console.log("Vital: ", response.data.records[0]);
          this.setState({ patientVital: response.data.records[0] });
        }
      },
      onFailure: error => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getPatientChiefComplaint(episode_id) {
    algaehApiCall({
      uri: "/mrd/getPatientChiefComplaint",
      method: "GET",
      data: {
        episode_id: episode_id
      },
      cancelRequestId: "getPatientChiefComplaint",
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          console.log("ChiefComplaints:", response.data.records);
          this.setState({ patientComplaints: response.data.records });
        }
      },
      onFailure: error => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getPatientDiagnosis(episode_id) {
    algaehApiCall({
      uri: "/mrd/getPatientDiagnosis",
      method: "GET",
      data: {
        episode_id: episode_id
      },
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ patientDiagnosis: response.data.records });
          console.log("Diagnosis:", response.data.records);
        }
      },
      onFailure: error => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }
  getPatientMedication(enc_id) {
    algaehApiCall({
      uri: "/mrd/getPatientMedication",
      method: "GET",
      data: {
        encounter_id: enc_id
        //encounter_id: 54
      },
      cancelRequestId: "getPatientMedication",
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ patientMedications: response.data.records });
          console.log("Medications:", response.data.records);
        }
      },
      onFailure: error => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }
  getPatientInvestigation(visit_id) {
    algaehApiCall({
      uri: "/mrd/getPatientInvestigation",
      method: "GET",
      data: {
        //visit_id: 502
        visit_id: visit_id
      },
      cancelRequestId: "getPatientInvestigation",
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ patientInvestigations: response.data.records });
          console.log("Investigations:", response.data.records);
        }
      },
      onFailure: error => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getPatientEncounterDetails() {
    algaehLoader({ show: true });

    algaehApiCall({
      uri: "/mrd/getPatientEncounterDetails",
      method: "GET",
      data: {
        patient_id: Window.global["mrd_patient"]
      },
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ patientEncounters: response.data.records });
        }
      },
      onFailure: error => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  componentDidMount() {
    this.getPatientEncounterDetails();
  }

  render() {
    return (
      <div className="encounters">
        <div className="row">
          <div className="col-lg-4">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">OP Encounter List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <AlgaehDataGrid
                  id="index"
                  columns={[
                    {
                      fieldName: "encountered_date",
                      label: "Consult Date & Time",
                      displayTemplate: row => {
                        return (
                          <span
                            enc-id={row.hims_f_patient_encounter_id}
                            epi-id={row.episode_id}
                            visit-id={row.visit_id}
                            onClick={this.setEncounterDetails.bind(this)}
                            className="pat-code"
                          >
                            {moment(row.encountered_date).format(
                              "DD-MM-YYYY HH:MM A"
                            )}
                          </span>
                        );
                      },
                      others: {
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "provider_name",
                      label: "Doctor Name",
                      others: {
                        style: { textAlign: "center" }
                      }
                    }
                  ]}
                  // rowClassName={row => {
                  //   return "cursor-pointer";
                  // }}
                  keyId="index"
                  dataSource={{
                    data: this.state.patientEncounters
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

          <div className="col-lg-8">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">OP Encounter Details </h3>
                </div>
              </div>

              <div className="portlet-body">
                <div className="row generalInfo">
                  <div className="col-lg-12">
                    <h6 className="smallh6">General Information</h6>
                    <div className="row">
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Consult Date & Time"
                          }}
                        />
                        <h6>
                          {this.state.generalInfo !== undefined
                            ? moment(
                                this.state.generalInfo.encountered_date
                              ).format("DD-MM-YYYY HH:mm A")
                            : "----------"}
                        </h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Doctor Name"
                          }}
                        />
                        <h6>
                          {this.state.generalInfo !== undefined
                            ? "Dr. " + this.state.generalInfo.provider_name
                            : "----------"}
                        </h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Visit Type"
                          }}
                        />
                        <h6>----------</h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Department"
                          }}
                        />
                        <h6>
                          {this.state.generalInfo !== undefined
                            ? this.state.generalInfo.sub_department_name
                            : "----------"}
                        </h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Primary Insurance"
                          }}
                        />
                        <h6>
                          {this.state.generalInfo !== undefined
                            ? this.state.generalInfo.pri_insurance_provider_name
                            : "----------"}
                        </h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Sec. Insurance"
                          }}
                        />
                        <h6>
                          {" "}
                          {this.state.generalInfo !== undefined &&
                          this.state.generalInfo.sec_insurance_provider_name !==
                            null
                            ? this.state.generalInfo.sec_insurance_provider_name
                            : "----------"}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row chiefComplaint">
                  <div className="col-lg-12">
                    <h6 className="smallh6">Chief Complaint(s)</h6>
                    <div className="row">
                      <div className="col">
                        <h6 className="danger">
                          {this.state.patientComplaints.map(
                            (data, index) =>
                              data.chief_complaint !== ""
                                ? data.chief_complaint
                                : "----------"
                          )}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row vitals">
                  <div className="col-lg-12">
                    <h6 className="smallh6">Vitals</h6>
                    <div className="row">
                      <div className="col borderVitals">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Weight"
                          }}
                        />
                        <h6>
                          {this.state.patientVital.weight !== undefined
                            ? this.state.patientVital.weight
                            : 0}
                          <span>
                            {this.state.patientVital.weight_uom !== undefined
                              ? this.state.patientVital.weight_uom
                              : ""}
                          </span>
                        </h6>
                      </div>

                      <div className="col borderVitals">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Height"
                          }}
                        />
                        <h6>
                          {this.state.patientVital.height !== undefined
                            ? this.state.patientVital.height
                            : 0}
                          <span>
                            {" "}
                            {this.state.patientVital.height_uom !== undefined
                              ? this.state.patientVital.height_uom
                              : ""}
                          </span>
                        </h6>
                      </div>

                      <div className="col borderVitals">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Blood Pressure"
                          }}
                        />
                        <h6>
                          {this.state.patientVital.systolic !== undefined
                            ? this.state.patientVital.systolic
                            : 0}{" "}
                          /{" "}
                          {this.state.patientVital.diastolic !== undefined
                            ? this.state.patientVital.diastolic
                            : 0}
                          <span />
                        </h6>
                      </div>

                      <div className="col borderVitals">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Temperature"
                          }}
                        />
                        <h6>
                          {this.state.patientVital.temperature_celsisus !==
                          undefined
                            ? this.state.patientVital.temperature_celsisus
                            : 0}{" "}
                          ({" "}
                          {this.state.patientVital.temperature_from !==
                          undefined
                            ? this.state.patientVital.temperature_from
                            : "O"}
                          )<span>&deg;C</span>
                        </h6>
                      </div>

                      <div className="col borderVitals">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Heart Rate"
                          }}
                        />
                        <h6>
                          {this.state.patientVital.heart_rate !== undefined
                            ? this.state.patientVital.heart_rate
                            : 0}
                          <span>kg</span>
                        </h6>
                      </div>

                      <div className="col borderVitals">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Respiratory Rate"
                          }}
                        />
                        <h6>
                          {this.state.patientVital.respiratory_rate !==
                          undefined
                            ? this.state.patientVital.respiratory_rate
                            : 0}
                          <span>kg</span>
                        </h6>
                      </div>

                      <div className="col borderVitals">
                        <AlgaehLabel
                          label={{
                            forceLabel: "O2 Stat"
                          }}
                        />
                        <h6>
                          {this.state.patientVital.oxysat !== undefined
                            ? this.state.patientVital.oxysat
                            : 0}
                          <span>kg</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row diagnosis">
                  <div className="col-lg-12">
                    <h6 className="smallh6">Diagnosis</h6>
                    <div className="row">
                      <div className="col">
                        <h6 className="danger">
                          {this.state.patientDiagnosis.map(
                            (data, index) =>
                              data.diagnosis_type === "P"
                                ? "Primary: " + data.daignosis_description
                                : "----------"
                          )}

                          {/* Primary: History of Convlusion with fever (Febrile
                          Convlusion) */}
                        </h6>
                      </div>

                      <div className="col">
                        <h6 className="">
                          {this.state.patientDiagnosis.map(
                            (data, index) =>
                              data.diagnosis_type === "S"
                                ? "Secondary: " + data.daignosis_description
                                : "Secondary : ----------"
                          )}
                          {/* Secondary: History of Convlusion with fever (Febrile
                          Convlusion) */}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                {this.state.patientInvestigations.length !== 0 ? (
                  <div className="row investigation">
                    <div className="col-lg-12">
                      <h6 className="smallh6">Investigation</h6>
                      <div className="row">
                        <div className="col-lg-12">
                          <AlgaehDataGrid
                            id="investigation-grid"
                            columns={[
                              {
                                fieldName: "service_name",
                                label: "Service Name"
                              },
                              {
                                fieldName: "lab_ord_status",
                                label: "Lab Order Status",
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {row.lab_ord_status === "O"
                                        ? "Ordered"
                                        : row.lab_ord_status === "CL"
                                          ? "Sample Collected"
                                          : row.lab_ord_status === "CN"
                                            ? "Test Cancelled"
                                            : row.lab_ord_status === "CF"
                                              ? "Result Confirmed "
                                              : row.lab_ord_status === "V"
                                                ? "Result Validated"
                                                : "----"}
                                    </span>
                                  );
                                }
                              },
                              {
                                fieldName: "lab_billed",
                                label: "Lab Billed",
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {row.lab_billed === "Y" ? "Yes" : "----"}
                                    </span>
                                  );
                                }
                              },
                              {
                                fieldName: "rad_ord_status",
                                label: "Radiology Order Status",
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {row.rad_ord_status === "O"
                                        ? "Ordered"
                                        : row.rad_ord_status === "S"
                                          ? "Scheduled"
                                          : row.rad_ord_status === "UP"
                                            ? "Under Process"
                                            : row.rad_ord_status === "CN"
                                              ? "Cancelled"
                                              : row.rad_ord_status === "RC"
                                                ? "Result Confirmed"
                                                : row.rad_ord_status === "RA"
                                                  ? "Result Avaiable"
                                                  : "----"}
                                    </span>
                                  );
                                }
                              },
                              {
                                fieldName: "rad_billed",
                                label: "Radiology Billed",
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {row.rad_billed === "Y" ? "Yes" : "----"}
                                    </span>
                                  );
                                }
                              },
                              {
                                fieldName: "hims_f_ordered_services_id",
                                label: "View Report",
                                displayTemplate: row => {
                                  return (
                                    <span
                                      className="pat-code"
                                      style={{ color: "#006699" }}
                                    >
                                      View Report
                                    </span>
                                  );
                                }
                              }
                            ]}
                            keyId="index"
                            dataSource={{
                              data: this.state.patientInvestigations
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
                ) : null}
                {this.state.patientMedications.length !== 0 ? (
                  <div className="row medication">
                    <div className="col-lg-12">
                      <h6 className="smallh6">Medication</h6>
                      <div className="row">
                        <div className="col-lg-12">
                          <AlgaehDataGrid
                            id="medication-grid"
                            columns={[
                              {
                                fieldName: "generic_name",
                                label: "Generic Name"
                              },
                              {
                                fieldName: "item_description",
                                label: "Item Description"
                              },

                              {
                                fieldName: "dosage",
                                label: "Dosage"
                              },
                              {
                                fieldName: "frequency",
                                label: "Frequency"
                              },
                              {
                                fieldName: "no_of_days",
                                label: "No. of Days"
                              },
                              {
                                fieldName: "start_date",
                                label: "Start date",
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {moment(row.start_date).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </span>
                                  );
                                }
                              }
                            ]}
                            keyId="index"
                            dataSource={{
                              data: this.state.patientMedications
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
                ) : null}
                {this.state.patientProcedures.length !== 0 ? (
                  <div className="row procedures">
                    <div className="col-lg-12">
                      <h6 className="smallh6">Procedures</h6>
                      <div className="row">
                        <div className="col-lg-12">
                          <AlgaehDataGrid
                            id="procedure-grid"
                            columns={[
                              {
                                fieldName: "index",
                                label: "Sl. No."
                              },
                              {
                                fieldName: "c_d_t",
                                label: "Consult Date & Time"
                              },
                              {
                                fieldName: "doc_name",
                                label: "Doctor Name"
                              }
                            ]}
                            keyId="index"
                            dataSource={{
                              data: [
                                {
                                  c_d_t: "May 22 13:00:00",
                                  doc_name: "Norman John",
                                  index: "1"
                                },
                                {
                                  c_d_t: "May 23 13:00:00",
                                  doc_name: "John Morgan",
                                  index: "2"
                                }
                              ]
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
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Encounters;
