import React, { Component } from "react";
import "./historical_data.css";
import { AlgaehDataGrid } from "../../../Wrapper/algaehWrapper";
import ReactTable from "react-table";
import "react-table/react-table.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import algaehLoader from "../../../Wrapper/fullPageLoader";

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

  getPatientVitals(patient_id, visit_id) {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientVitals",
      method: "GET",
      data: {
        patient_id: Window.global["mrd_patient"]
        // visit_id: visit_id
      },
      cancelRequestId: "getPatientVitals",
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          console.log("Vital: ", response.data.records);
          // this.setState({ patientVital: response.data.records[0] });
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
      </div>
    );
  }
}

export default HistoricalData;
