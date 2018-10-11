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
      patientEncounters: []
    };
  }

  setEncounterDetails(e) {
    debugger;
    const enc_id = e.currentTarget.getAttribute("enc-id");
    const episode_id = e.currentTarget.getAttribute("epi-id");
    const visit_id = e.currentTarget.getAttribute("visit-id");

    this.getPatientChiefComplaint(episode_id);
    this.getPatientDiagnosis(episode_id);
    this.getPatientMedication(enc_id);
    this.getPatientInvestigation(visit_id);

    const general_info = Enumerable.from(this.state.patientEncounters)
      .where(w => w.hims_f_patient_encounter_id === parseInt(enc_id))
      .firstOrDefault();

    this.setState({
      generalInfo: general_info
    });
  }

  getPatientChiefComplaint(episode_id) {
    algaehApiCall({
      uri: "/mrd/getPatientChiefComplaint",
      method: "GET",
      data: {
        episode_id: episode_id
      },
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
      },
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
        visit_id: visit_id
      },
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
                              "DD-MM-YYYY HH:mm a"
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
                        <h6>----------</h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Secondary Insurance"
                          }}
                        />
                        <h6>----------</h6>
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
                          History of Convlusion with fever (Febrile Convlusion)
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
                          89
                          <span>kg</span>
                        </h6>
                      </div>

                      <div className="col borderVitals">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Weight"
                          }}
                        />
                        <h6>
                          89
                          <span>kg</span>
                        </h6>
                      </div>

                      <div className="col borderVitals">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Weight"
                          }}
                        />
                        <h6>
                          89
                          <span>kg</span>
                        </h6>
                      </div>

                      <div className="col borderVitals">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Weight"
                          }}
                        />
                        <h6>
                          89
                          <span>kg</span>
                        </h6>
                      </div>

                      <div className="col borderVitals">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Weight"
                          }}
                        />
                        <h6>
                          89
                          <span>kg</span>
                        </h6>
                      </div>

                      <div className="col borderVitals">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Weight"
                          }}
                        />
                        <h6>
                          89
                          <span>kg</span>
                        </h6>
                      </div>

                      <div className="col borderVitals">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Weight"
                          }}
                        />
                        <h6>
                          89
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
                          Primary: History of Convlusion with fever (Febrile
                          Convlusion)
                        </h6>
                      </div>

                      <div className="col">
                        <h6 className="">
                          Secondary: History of Convlusion with fever (Febrile
                          Convlusion)
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row investigation">
                  <div className="col-lg-12">
                    <h6 className="smallh6">Investigation</h6>
                    <div className="row">
                      <div className="col-lg-12">
                        <h6 className="">
                          History of Convlusion with fever (Febrile Convlusion)
                          <span>View Report</span>
                        </h6>
                      </div>

                      <div className="col-lg-12">
                        <h6 className="">
                          History of Convlusion with fever (Febrile Convlusion)
                          <span>View Report</span>
                        </h6>
                      </div>
                      <div className="col-lg-12">
                        <h6 className="">
                          History of Convlusion with fever (Febrile Convlusion)
                          <span>View Report</span>
                        </h6>
                      </div>
                      <div className="col-lg-12">
                        <h6 className="">
                          History of Convlusion with fever (Febrile Convlusion)
                          <span>View Report</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row medication">
                  <div className="col-lg-12">
                    <h6 className="smallh6">Medication</h6>
                    <div className="row">
                      <div className="col-lg-12">
                        <AlgaehDataGrid
                          id="index"
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
                <div className="row procedures">
                  <div className="col-lg-12">
                    <h6 className="smallh6">Procedures</h6>
                    <div className="row">
                      <div className="col-lg-12">
                        <AlgaehDataGrid
                          id="index"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Encounters;
