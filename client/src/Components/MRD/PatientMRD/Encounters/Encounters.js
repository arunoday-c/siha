import React, { Component } from "react";
import "./encounters.css";
import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import algaehLoader from "../../../Wrapper/fullPageLoader";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

class Encounters extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getPatientEncounterDetails() {
    algaehLoader({ show: true });

    algaehApiCall({
      uri: "/mrd/getPatientEncounterDetails",
      method: "GET",
      data: {
        patient_id: 588
      },
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          if (response.data.records.length === 0) {
            swalMessage({
              title: "No records Found",
              type: "warning"
            });
          }

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
                      label: "Consult Date & Time"
                    },
                    {
                      fieldName: "provider_name",
                      label: "Doctor Name"
                    }
                  ]}
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
                        <h6>May 22, 2018 - 12:15 PM</h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Doctor Name"
                          }}
                        />
                        <h6>Amina Nazir Hussain</h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Visit Type"
                          }}
                        />
                        <h6>New Visit</h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Department"
                          }}
                        />
                        <h6>General Medicine</h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Insurance"
                          }}
                        />
                        <h6>Max Bupa - Family Plan</h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row chiefComplaint">
                  <div className="col-lg-12">
                    <h6 className="smallh6">Chief Complaint</h6>
                    <div className="row">
                      <div className="col">
                        <h6 className="danger">
                          History of Convlusion with fever (Febrile Convlusion)
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row vitals">
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

                <div class="row diagnosis">
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
                <div class="row investigation">
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
                <div class="row medication">
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
                <div class="row procedures">
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
