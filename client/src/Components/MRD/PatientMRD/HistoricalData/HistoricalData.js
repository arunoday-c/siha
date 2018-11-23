import React, { Component } from "react";
import "./historical_data.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import algaehLoader from "../../../Wrapper/fullPageLoader";
import moment from "moment";
import Enumerable from "linq";
import config from "../../../../utils/config.json";
import { Line } from "react-chartjs-2";

const TreeTable = treeTableHOC(ReactTable);

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
      cancelRequestId: "getPatientVitals1",
      onSuccess: response => {
        debugger;
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

  generateVitalColumns(data) {
    debugger;
    let x = Enumerable.from(data)
      .groupBy("$.vital_id", null, (k, g) => {
        return g.getSource();
      })
      .toArray();

    return [
      {
        accessor: "visit_date",
        Cell: props => (
          <span>{moment(props.visit_date).format("DD-MM-YYYY")}</span>
        )
      },
      {
        Header: "Recorded Time",
        accessor: "visit_time"
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
    ];
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

    let _chartLabels = [];
    let _yAxes = [];
    let _plotGraph = [];

    const _vitalsGroup =
      this.state.patientVitals !== undefined
        ? Enumerable.from(this.state.patientVitals)
            .groupBy("$.visit_date", null, (key, g) => {
              //_chartLabels.push(key);
              return {
                dateTime: key,
                list: g.getSource()
              };
            })
            .orderByDescending(g => g.visit_date)
            .toArray()
            .sort((a, b) => {
              debugger;
              b > a;
            })
        : [];

    Enumerable.from(
      this.state.patientVitals !== undefined ? this.state.patientVitals : []
    )
      .groupBy("$.vital_id", null, (k, gg) => {
        if (k === 1 || k === 3 || k === 4 || k === 7 || k === 8 || k === 9) {
          let _gId = Enumerable.from(gg.getSource())
            .where(w => w.vital_id === k)
            .firstOrDefault();
          let _names = String(_gId.vital_short_name).replace(/\" "/g, "_");

          let row = Enumerable.from(_yAxes)
            .where(w => w.id === _names)
            .firstOrDefault();
          const _index = _yAxes.indexOf(row);
          if (_index > -1) {
            _yAxes.splice(_index, 1);
          }
          _yAxes.push({
            id: _names
          });

          let _bground = "";
          let _borderColor = "";
          switch (k) {
            case 1:
              _bground = config.colors.weight.backgroundColor;
              _borderColor = config.colors.weight.borderColor;
              break;
            case 3:
              _bground = config.colors.bmi.backgroundColor;
              _borderColor = config.colors.bmi.borderColor;
              break;
            case 4:
              _bground = config.colors.temperature.backgroundColor;
              _borderColor = config.colors.temperature.borderColor;
              break;
            case 6:
              _bground = config.colors.heart_rate.backgroundColor;
              _borderColor = config.colors.heart_rate.borderColor;
              break;
            case 7:
              _bground = config.colors.resp_rate.backgroundColor;
              _borderColor = config.colors.resp_rate.borderColor;
              break;
            case 8:
              _bground = config.colors.bp.sys.backgroundColor;
              _borderColor = config.colors.bp.sys.borderColor;
              break;
            case 9:
              _bground = config.colors.bp.dia.backgroundColor;
              _borderColor = config.colors.bp.dia.borderColor;
              break;
          }

          _plotGraph.push({
            label: _gId.vital_short_name,
            fill: false,
            lineTension: 0.9,
            backgroundColor: _bground,
            borderColor: _borderColor,
            yAxisID: _names,
            data: Enumerable.from(gg.getSource())
              .where(w => w.vital_id === k)
              .select(s => s.vital_value)
              .toArray()
          });
        }
      })
      .toArray();

    return (
      <div className="historical-data">
        <div className="row">
          <div className="col-lg-3">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Vitals</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div
                      className="timeline"
                      style={{
                        overflowY: "auto",
                        overflowX: "hidden",
                        maxHeight: "40vh"
                      }}
                    >
                      {_vitalsGroup.map((data, index) => (
                        <div key={index} className="timelineContainer right">
                          <div className="content">
                            <p className="dateStamp">{data.dateTime}</p>
                            <div className="vitalsCntr">
                              <ul className="vitals-box">
                                {data.list.map((vitals, ind) => (
                                  <li className="each-vitals-box" key={ind}>
                                    <p>{vitals.vitals_name}</p>
                                    <span>{vitals.vital_value}</span>
                                    <span>{vitals.formula_value}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Vitals Charts</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <Line
                    options={{
                      scales: {
                        yAxes: _yAxes
                      }
                    }}
                    data={{
                      datasets: _plotGraph,
                      labels: _chartLabels
                    }}
                  />
                </div>
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
        {/* Second Two Sections End */}

        {/* Third Two Sections Start */}

        {/* <div className="row">
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
 */}
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
