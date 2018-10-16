import React, { Component } from "react";
import "./historical_data.css";
import { AlgaehDataGrid } from "../../../Wrapper/algaehWrapper";
import ReactTable from "react-table";
import "react-table/react-table.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import algaehLoader from "../../../Wrapper/fullPageLoader";
import moment from "moment";

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
    this.state = {};
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
          console.log("Vitals: ", response.data.records);
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
          console.log("Diagnosis: ", response.data.records);
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

  componentDidMount() {
    this.getPatientVitals();
    this.getPatientDiagnosis();
    this.getPatientMedication();
  }

  render() {
    return (
      <div className="historical-data">
        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Vitals</h3>
            </div>
          </div>
          <div className="portlet-body">
            <TreeTable
              //Most recent 3 rows are expanded
              //expanded={{ 0: true }}
              data={this.state.patientVitals}
              pivotBy={["visit_date"]}
              columns={[
                {
                  accessor: "visit_date",
                  Cell: props => (
                    <span>{moment(props.visit_date).format("DD-MM-YYYY")}</span>
                  )
                },
                {
                  Header: "Recorded Time",
                  accessor: "visit_time"
                  // Cell: row => {
                  //   return (
                  //     <span>
                  //       {moment(row.visit_time, "HH:MM:SS").format("HH:MM A")}
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
                <TreeTable
                  //Most recent 3 rows are expanded
                  //expanded={{ 0: true, 1: true, 2: true, 3: true }}
                  data={this.state.patientDiagnosis}
                  pivotBy={["diagnosis_date"]}
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
                      Header: "Diagnosis Type",
                      accessor: "diagnosis_type"
                    },
                    {
                      Header: "Final Diagnosis",
                      accessor: "final_daignosis"
                    }
                  ]}
                  defaultPageSize={5}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Treatement</h3>
                </div>
              </div>
              <div className="portlet-body">
                <TreeTable
                  //Most recent 3 rows are expanded
                  //expanded={{ 0: true, 1: true, 2: true, 3: true }}
                  data={_data}
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
                <TreeTable
                  //Most recent 3 rows are expanded
                  //expanded={{ 0: true, 1: true, 2: true, 3: true }}
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
          <div className="col-lg-6">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Nurse's Notes</h3>
                </div>
              </div>
              <div className="portlet-body">
                <TreeTable
                  //Most recent 3 rows are expanded
                  //expanded={{ 0: true, 1: true, 2: true, 3: true }}
                  data={_data}
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
                <TreeTable
                  //Most recent 3 rows are expanded
                  //expanded={{ 0: true, 1: true, 2: true, 3: true }}
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
          <div className="col-lg-6">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Investigations</h3>
                </div>
              </div>
              <div className="portlet-body">
                <TreeTable
                  //Most recent 3 rows are expanded
                  //expanded={{ 0: true, 1: true, 2: true, 3: true }}
                  data={_data}
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

        {/* Third Two Sections End */}

        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Payment History</h3>
            </div>
          </div>
          <div className="portlet-body">
            <ReactTable
              data={_data}
              //pivotBy={["date"]}
              columns={[
                {
                  Header: "Visit Date",
                  accessor: "date"
                },
                {
                  Header: "Gross Amount",
                  //accessor: "net_amount"
                  accessor: "pulse"
                },
                {
                  Header: "Patient Share",
                  //accessor: "patient_payable"
                  accessor: "pulse"
                },
                {
                  Header: "Amount Paid",
                  // accessor: "receivable"
                  accessor: "pulse"
                },
                {
                  Header: "Due",
                  // accessor: "credit_amt"
                  accessor: "pulse"
                },
                {
                  Header: "Primary Insurance",
                  columns: [
                    {
                      Header: "Name"
                      // accessor: "doctor"
                    },
                    {
                      Header: "Amount"
                      //accessor: "height"
                      // accessor: d => d.height
                    }
                  ]
                },
                {
                  Header: "Secondary Insurance",
                  columns: [
                    {
                      Header: "Name"
                      // accessor: "doctor"
                    },
                    {
                      Header: "Amount"
                      //accessor: "height"
                      // accessor: d => d.height
                    }
                  ]
                }
              ]}
              defaultPageSize={5}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default HistoricalData;
