import React, { Component } from "react";
import "./historical_data.css";
import { AlgaehDataGrid } from "../../../Wrapper/algaehWrapper";
import ReactTable from "react-table";
import "react-table/react-table.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import algaehLoader from "../../../Wrapper/fullPageLoader";
import moment from "moment";
import Enumerable from "linq";

const TreeTable = treeTableHOC(ReactTable);

const _data = [
  {
    date: "2018-01-01 06:00 AM",
    oral: 36.8,
    bpSystole: 120,
    bpdyastole: 70,
    pulse: 84,
    resp: 20,
    bloodsugar: 98.81,
    height: 78,
    weight: 87,
    bmi: 36.3,
    duration: "2 week agao",
    doctor: "Dr. Amina Nazir Hussain",
    date_doctor: "2018-01-01 06:00 AM - Dr. Amina Nazir Hussain"
  },
  {
    date: "2018-01-01 07:00 AM",
    oral: 36.8,
    bpSystole: 120,
    bpdyastole: 70,
    pulse: 70,
    resp: 22,
    bloodsugar: 100,
    height: 78,
    weight: 87,
    bmi: 36,
    duration: "2 week agao",
    doctor: "Dr. Amina Nazir Hussain",
    date_doctor: "2018-01-01 07:00 AM - Dr. Amina Nazir Hussain"
  },
  {
    date: "2018-01-01 12:00 PM",
    oral: 36,
    bpSystole: 100,
    bpdyastole: 33,
    pulse: 87,
    resp: 21,
    bloodsugar: 60,
    height: 78,
    weight: 87,
    bmi: 36,
    duration: "2 week agao",
    doctor: "Dr. Ahmad Mustafa",
    date_doctor: "2018-01-01 12:00 PM - Dr. Ahmad Mustafa"
  }
];

class HistoricalData extends Component {
  constructor(props) {
    super(props);
    this.getPatientVitals();
    this.getPatientDiagnosis();
    this.getPatientMedication();
    this.getPatientPaymentDetails();
    this.getPatientInvestigation();
    this.getPatientTreatments();
    this.state = {
      patientVitals: [],
      patientDiagnosis: [],
      patientMedication: [],
      patientPayments: [],
      patientInvestigations: [],
      patientTreatements: []
    };
  }

  getPatientVitals() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientVitals",
      method: "GET",
      data: {
        patient_id: Window.global["mrd_patient"]
      },
      cancelRequestId: "getPatientVitals",
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ patientVitals: response.data.records });
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

  getPatientTreatments() {
    algaehApiCall({
      uri: "/mrd/getPatientTreatments",
      method: "GET",
      data: {
        patient_id: Window.global["mrd_patient"]
      },
      cancelRequestId: "getPatientTreatments",
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ patientTreatements: response.data.records });
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

  //

  getPatientDiagnosis() {
    algaehApiCall({
      uri: "/mrd/getPatientDiagnosis",
      method: "GET",
      data: {
        patient_id: Window.global["mrd_patient"]
      },
      cancelRequestId: "getPatientDiagnosis",
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

  getPatientMedication() {
    algaehApiCall({
      uri: "/mrd/getPatientMedication",
      method: "GET",
      data: {
        patient_id: Window.global["mrd_patient"]
      },
      cancelRequestId: "getPatientMedication",
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          console.log("patientMedication: ", response.data.records);
          this.setState({ patientMedication: response.data.records });
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

  getPatientPaymentDetails() {
    algaehApiCall({
      uri: "/mrd/getPatientPaymentDetails",
      method: "GET",
      data: {
        patient_id: Window.global["mrd_patient"]
      },
      cancelRequestId: "getPatientPaymentDetails",
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          console.log("patientMedication: ", response.data.records);
          this.setState({ patientPayments: response.data.records });
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

  getPatientInvestigation() {
    algaehApiCall({
      uri: "/mrd/getPatientInvestigation",
      method: "GET",
      data: {
        patient_id: Window.global["mrd_patient"]
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

  render() {
    const _patientVitals = this.state.patientVitals;
    const _groupData = Enumerable.from(this.state.patientPayments)
      .groupBy("$.prov_date", null, (k, g) => {
        const _get = Enumerable.from(g.getSource()).firstOrDefault();
        return {
          bill_date: _get.bill_date,
          provider_name: _get.provider_name,
          pri_insurance_provider_name: _get.pri_insurance_provider_name,
          pri_company_payble: _get.pri_company_payble,
          sec_insurance_provider_name: _get.sec_insurance_provider_name,
          sec_company_payable: _get.sec_company_payable,
          list: g.getSource()
        };
      })
      .toArray();

    return (
      <div className="historical-data">
        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Vitals</h3>
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12">
                <TreeTable
                  //Expand All rows
                  expanded={this.state.patientVitals.map((data, index) => {
                    return { index: true };
                  })}
                  data={_patientVitals}
                  pivotBy={["visit_date"]}
                  noDataText="No Vitals Captured"
                  columns={[
                    {
                      accessor: "visit_date",
                      Cell: props => (
                        <span>
                          {moment(props.visit_date).format("DD-MM-YYYY")}
                        </span>
                      )
                    },
                    {
                      Header: "Recorded Time",
                      accessor: "visit_time"
                      // Cell: row => {
                      //   
                      //   return (
                      //     <span>
                      //       {moment(row.value, "HH:MM:SS").format("HH:MM A")}
                      //     </span>
                      //   );
                      // }
                    },
                    {
                      Header: "Temp. Oral",
                      accessor: "temperature_celsisus"
                    },
                    {
                      Header: "BP Systole",
                      accessor: "systolic"
                    },
                    {
                      Header: "bp Dyastole",
                      accessor: "diastolic"
                    },
                    {
                      Header: "Heart Rate",
                      accessor: "heart_rate"
                    },
                    {
                      Header: "Respiratory Rate",
                      accessor: "respiratory_rate"
                    },
                    {
                      Header: "Height",
                      accessor: "height"
                    },
                    {
                      Header: "Weight",
                      accessor: "weight"
                    },
                    {
                      Header: "BMI",
                      accessor: "bmi"
                    },
                    {
                      Header: "BSA",
                      accessor: "bsa"
                    }
                  ]}
                  defaultPageSize={5}
                />
              </div>
            </div>
          </div>
        </div>
        {/* First Two Sections Start*/}
        <div className="row">
          <div className="col-lg-6">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Diagnosis</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12">
                    <TreeTable
                      expanded={this.state.patientDiagnosis.map(
                        (data, index) => {
                          return { index: true };
                        }
                      )}
                      data={this.state.patientDiagnosis}
                      pivotBy={["diagnosis_date"]}
                      noDataText="No Diagnosis Found"
                      columns={[
                        {
                          accessor: "diagnosis_date",
                          Cell: props => (
                            <span>{props.diagnosis_date + "HAllalalal"}</span>
                          )
                        },
                        {
                          Header: "Diagnosis",
                          accessor: "daignosis_description"
                        },
                        {
                          Header: "Diagnosis Code",
                          accessor: "daignosis_code"
                        },

                        {
                          id: "diagnosis_type",
                          Header: "Diagnosis Type",
                          accessor: d =>
                            d.diagnosis_type === "S" ? "Secondary" : "Primary"
                        },
                        {
                          id: "final_daignosis",
                          Header: "Final Diagnosis",
                          accessor: f =>
                            f.final_daignosis === "Y" ? "Yes" : "No"
                        }
                      ]}
                      defaultPageSize={5}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Treatements</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12">
                    <TreeTable
                      //Most recent 3 rows are expanded
                      //expanded={{ 0: true, 1: true, 2: true, 3: true }}
                      expanded={this.state.patientTreatements.map(
                        (data, index) => {
                          return { index: true };
                        }
                      )}
                      data={this.state.patientTreatements}
                      pivotBy={["visit_date"]}
                      columns={[
                        {
                          accessor: "visit_date"
                        },

                        {
                          Header: "Doctor Name",
                          accessor: "doctor_name"
                        },
                        {
                          Header: "Service Name",
                          accessor: "service_name"
                        },
                        {
                          Header: "Service Description",
                          accessor: "service_desc"
                        }
                      ]}
                      defaultPageSize={5}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* First Two Sections End */}

        {/* Second Two Sections Start */}
        <div className="row">
          <div className="col-lg-6">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Medical History</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12">
                    <TreeTable
                      //Most recent 3 rows are expanded
                      expanded={this.state.patientMedication.map(
                        (data, index) => {
                          return { index: true };
                        }
                      )}
                      data={this.state.patientMedication}
                      pivotBy={["prescription_date"]}
                      columns={[
                        {
                          accessor: "prescription_date"
                        },
                        {
                          accessor: "start_date",
                          Header: "Start Date"
                        },
                        {
                          accessor: "generic_name",
                          Header: "Generic Name"
                        },
                        {
                          accessor: "item_description",
                          Header: "Item Description"
                        },

                        {
                          accessor: "dosage",
                          Header: "Dosage"
                        },
                        {
                          accessor: "frequency",
                          Header: "Frequency"
                        },
                        {
                          accessor: "no_of_days",
                          Header: "No. of Days"
                        }
                      ]}
                      defaultPageSize={5}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Nurse's Notes</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12">
                    <TreeTable
                      //Most recent 3 rows are expanded
                      //expanded={{ 0: true, 1: true, 2: true, 3: true }}
                      expanded={_data.map((data, index) => {
                        return { index: true };
                      })}
                      //data={_data}
                      data={[]}
                      pivotBy={["date_doctor"]}
                      columns={[
                        {
                          accessor: "date_doctor"
                        },
                        {
                          Header: "Temp. Oral",
                          accessor: "oral"
                        },
                        {
                          Header: "BP Systole",
                          accessor: "bpSystole"
                        },
                        {
                          Header: "bp Dyastole",
                          accessor: "bpdyastole"
                        },
                        {
                          Header: "Pulse",
                          accessor: "pulse"
                        },
                        {
                          Header: "Respiratory",
                          accessor: "resp"
                        },
                        {
                          Header: "Blood Sugar",
                          accessor: "bloodsugar"
                        },
                        {
                          Header: "Height",
                          accessor: "height"
                        },
                        {
                          Header: "Weight",
                          accessor: "weight"
                        },
                        {
                          Header: "BMI",
                          accessor: "bmi"
                        },
                        {
                          Header: "Duration",
                          accessor: "duration"
                        }
                      ]}
                      defaultPageSize={5}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Second Two Sections End */}

        {/* Third Two Sections Start */}

        <div className="row">
          <div className="col-lg-6">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Attachments</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12">
                    <TreeTable
                      //Most recent 3 rows are expanded
                      //expanded={{ 0: true, 1: true, 2: true, 3: true }}
                      expanded={this.state.patientMedication.map(
                        (data, index) => {
                          return { index: true };
                        }
                      )}
                      //data={this.state.patientMedication}
                      data={[]}
                      pivotBy={["prescription_date"]}
                      columns={[
                        {
                          accessor: "prescription_date"
                        },
                        {
                          accessor: "start_date",
                          Header: "Start Date"
                        },
                        {
                          accessor: "generic_name",
                          Header: "Generic Name"
                        },
                        {
                          accessor: "item_description",
                          Header: "Item Description"
                        },

                        {
                          accessor: "dosage",
                          Header: "Dosage"
                        },
                        {
                          accessor: "frequency",
                          Header: "Frequency"
                        },
                        {
                          accessor: "no_of_days",
                          Header: "No. of Days"
                        }
                      ]}
                      defaultPageSize={5}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Investigations</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12">
                    <TreeTable
                      //Most recent 3 rows are expanded
                      //expanded={{ 0: true, 1: true, 2: true, 3: true }}
                      expanded={this.state.patientInvestigations.map(
                        (data, index) => {
                          return { index: true };
                        }
                      )}
                      data={this.state.patientInvestigations}
                      pivotBy={["visit_date"]}
                      columns={[
                        {
                          accessor: "visit_date"
                        },

                        {
                          Header: "Service Name",
                          accessor: "service_name"
                        },
                        {
                          Header: "Doctor Name",
                          accessor: "provider_name"
                        },
                        {
                          Header: "Lab Order Status",
                          accessor: "lab_ord_status"
                        },
                        {
                          Header: "Lab Billed",
                          accessor: "lab_billed"
                        },
                        {
                          Header: "Radiology Order Status",
                          accessor: "rad_ord_status"
                        },
                        {
                          Header: "Radiology Billed",
                          accessor: "rad_billed"
                        }
                      ]}
                      defaultPageSize={5}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Third Two Sections End */}

        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Payment History</h3>
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12">
                <ReactTable
                  columns={[
                    {
                      Header: "Date",
                      accessor: "bill_date",
                      Cell: row => (
                        <span>
                          {moment(row.bill_date).format("DD-MM-YYYY")}
                        </span>
                      )
                    },
                    {
                      Header: "Doctor",
                      accessor: "provider_name"
                    },
                    {
                      Header: "Bill Details",
                      columns: [
                        {
                          Header: "Bill No.",
                          id: "bill_number",
                          accessor: acc => {
                            return (
                              <React.Fragment>
                                {acc.list.map((r, index) => (
                                  <div key={index}>{r.bill_number}</div>
                                ))}
                              </React.Fragment>
                            );
                          }
                        },
                        {
                          Header: "Gross Amt.",
                          id: "net_amount",
                          accessor: acc => {
                            return (
                              <React.Fragment>
                                {acc.list.map((r, index) => (
                                  <div key={index}>{r.net_amount}</div>
                                ))}
                              </React.Fragment>
                            );
                          }
                        },
                        {
                          Header: "Amount Paid",
                          id: "receiveable_amount",
                          accessor: acc => {
                            return (
                              <React.Fragment>
                                {acc.list.map((r, index) => (
                                  <div key={index}>{r.receiveable_amount}</div>
                                ))}
                              </React.Fragment>
                            );
                          }
                        },
                        {
                          Header: "Due",
                          id: "credit_amount",
                          accessor: acc => {
                            return (
                              <React.Fragment>
                                {acc.list.map((r, index) => (
                                  <div key={index}>{r.credit_amount}</div>
                                ))}
                              </React.Fragment>
                            );
                          }
                        }
                      ]
                    },
                    {
                      Header: "Receipt Details",
                      columns: [
                        {
                          Header: "Receipt Date",
                          id: "receipt_date",
                          accessor: acc => {
                            return (
                              <React.Fragment>
                                {acc.list.map((r, i) => {
                                  return (
                                    <React.Fragment key={i}>
                                      {r.receipt.map((m, index) => (
                                        <div key={index}>
                                          {moment(m.receipt_date).format(
                                            "DD-MM-YYYY"
                                          )}
                                        </div>
                                      ))}
                                    </React.Fragment>
                                  );
                                })}
                              </React.Fragment>
                            );
                          }
                        },
                        {
                          Header: "Receipt No.",
                          id: "receipt_number",
                          accessor: acc => {
                            return (
                              <React.Fragment>
                                {acc.list.map((r, i) => {
                                  return (
                                    <React.Fragment key={i}>
                                      {r.receipt.map((m, index) => (
                                        <div key={index}>
                                          {m.receipt_number}
                                        </div>
                                      ))}
                                    </React.Fragment>
                                  );
                                })}
                              </React.Fragment>
                            );
                          }
                        },
                        {
                          Header: "Total Amt.",
                          id: "total_amount",
                          accessor: acc => {
                            return (
                              <React.Fragment>
                                {acc.list.map((r, i) => {
                                  return (
                                    <React.Fragment key={i}>
                                      {r.receipt.map((m, index) => (
                                        <div key={index}>{m.total_amount}</div>
                                      ))}
                                    </React.Fragment>
                                  );
                                })}
                              </React.Fragment>
                            );
                          }
                        },
                        {
                          Header: "Amount Paid",
                          id: "receiveable_amount",
                          accessor: acc => {
                            return (
                              <React.Fragment>
                                {acc.list.map((r, i) => {
                                  return (
                                    <React.Fragment key={i}>
                                      {r.receipt.map((m, index) => (
                                        <div key={index}>{m.total_amount}</div>
                                      ))}
                                    </React.Fragment>
                                  );
                                })}
                              </React.Fragment>
                            );
                          }
                        }
                      ]
                    },
                    {
                      Header: "Primary Insurar",
                      columns: [
                        {
                          Header: "Name",
                          accessor: "pri_insurance_provider_name"
                        },
                        {
                          Header: "Amt.",
                          accessor: "pri_company_payble"
                        }
                      ]
                    },
                    {
                      Header: "Secondary Insurar",
                      columns: [
                        {
                          Header: "Name",
                          accessor: "sec_insurance_provider_name"
                        },
                        {
                          Header: "Amt.",
                          accessor: "sec_company_payable"
                        }
                      ]
                    }
                  ]}
                  data={_groupData}
                  defaultPageSize={5}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HistoricalData;
