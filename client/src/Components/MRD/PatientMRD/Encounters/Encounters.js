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
      patientVital: []
    };
  }

  setEncounterDetails(row, e) {
    const enc_id = e.currentTarget.getAttribute("enc-id");
    const episode_id = e.currentTarget.getAttribute("epi-id");
    const visit_id = e.currentTarget.getAttribute("visit-id");

    this.getPatientChiefComplaint(episode_id);
    this.getPatientDiagnosis(episode_id);
    this.getPatientMedication(enc_id);
    this.getPatientInvestigation(visit_id);
    this.getPatientVitals(Window.global["mrd_patient"], visit_id);

    const general_info = Enumerable.from(this.state.patientEncounters)
      .where(w => w.hims_f_patient_encounter_id === parseInt(enc_id, 10))
      .firstOrDefault();

    this.setState({
      generalInfo: general_info,
      significant_signs: row.significant_signs
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
          const _Vitals =
            response.data.records !== undefined &&
            response.data.records.length > 0
              ? Enumerable.from(response.data.records)
                  .groupBy("$.visit_date", null, (k, g) => {
                    return g.getSource();
                  })
                  .orderBy(g => g.visit_date)
                  .lastOrDefault()
              : [];

          this.setState({ patientVital: _Vitals });
        } else if (response.data.records.length === 0) {
          this.setState({
            patientVital: []
          });
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
      module: "MRD",
      cancelRequestId: "getPatientChiefComplaint",
      onSuccess: response => {
        debugger;
        if (response.data.success) {
          this.setState({ patientComplaints: response.data.records });
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

  getPatientDiagnosis(episode_id) {
    algaehApiCall({
      uri: "/mrd/getPatientDiagnosis",
      module: "MRD",
      method: "GET",
      data: {
        episode_id: episode_id
      },
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ patientDiagnosis: response.data.records });
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
      module: "MRD",
      method: "GET",
      data: {
        encounter_id: enc_id
      },
      cancelRequestId: "getPatientMedication",
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ patientMedications: response.data.records });
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
      module: "MRD",
      method: "GET",
      data: {
        visit_id: visit_id
      },
      cancelRequestId: "getPatientInvestigation",
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ patientInvestigations: response.data.records });
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
      module: "MRD",
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          debugger;
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
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">OP Encounter List</h3>
                </div>
              </div>
              <div className="portlet-body encounterListCntr">
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
                            onClick={this.setEncounterDetails.bind(this, row)}
                            className="pat-code"
                          >
                            {moment(row.encountered_date).format(
                              "DD-MM-YYYY HH:mm A"
                            )}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" }
                      },
                      className: drow => {
                        return "greenCell";
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
                  paging={{ page: 0, rowsPerPage: 10 }}
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
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">OP Encounter Details </h3>
                </div>
              </div>

              <div className="portlet-body encounterDetailCntr">
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
                    </div>
                  </div>
                </div>

                <div className="row chiefComplaint">
                  <div className="col-lg-12">
                    <h6 className="smallh6">Chief Complaint(s)</h6>
                    <div className="row">
                      <div className="col">
                        <h6 className="">
                          {this.state.patientComplaints.map((data, index) => {
                            debugger;
                            return data.chief_complaint
                              ? data.chief_complaint
                              : data.comment
                              ? data.comment
                              : "-------";
                          })}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row chiefComplaint">
                  <div className="col-lg-12">
                    <h6 className="smallh6">Significant Signs</h6>
                    <div className="row">
                      <div className="col">
                        <h6 className="">
                          {this.state.significant_signs}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VITALS START */}
                <div className="row vitals">
                  <div className="col-lg-12">
                    <h6 className="smallh6">Vitals</h6>
                    <div className="row">
                      {this.state.patientVital.length > 0 ? (
                        this.state.patientVital.map((row, index) => (
                          <div key={index} className="col borderVitals">
                            <AlgaehLabel
                              label={{
                                forceLabel: row.vitals_name
                              }}
                            />
                            <h6>
                              {row.vital_value}
                              <span>{row.uom}</span>
                            </h6>
                          </div>
                        ))
                      ) : (
                        <span className="col">----------</span>
                      )}
                    </div>
                  </div>
                </div>
                {/* VITALS END */}

                <div className="row diagnosis">
                  <div className="col-lg-12">
                    <h6 className="smallh6">Diagnosis</h6>
                    <div className="row">
                      <div className="col">
                        <h6 className="danger">
                          {this.state.patientDiagnosis.map((data, index) =>
                            data.diagnosis_type === "P"
                              ? "Primary: " + data.daignosis_description
                              : null
                          )}
                        </h6>
                      </div>

                      <div className="col">
                        <h6 className="">
                          {this.state.patientDiagnosis.map((data, index) =>
                            data.diagnosis_type === "S"
                              ? "Secondary: " + data.daignosis_description
                              : null
                          )}
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
                                        ? "Specimen Collected"
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
                                        ? "Result Available"
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
