import React, { Component } from "react";
import { AlgaehErrorBoundary } from "./Wrapper/algaehWrapper";
import "react-table/react-table.css";
import { algaehApiCall, swalMessage } from "../utils/algaehApiCall";
import FileViewer from "react-file-viewer";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehModalPopUp
} from "./Wrapper/algaehWrapper";
import ButtonType from "./Wrapper/algaehButton";
class Experiment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patImg: "",
      openAuth: false,
      name: "i",
      image: undefined,
      report: undefined,
      progressPercentage: ""
    };

    // console.log("Chunk:", _.chunk(services, 1));
  }

  texthandle(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value
    });

    // Example for functional setState below.
    // this.setState((prevState, props) => ({
    //   to_leave_session: prevState.to_leave_session + 1
    // }));
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <br />
        <br />
        <br />
        Kill the connections by clicking on this button
        <br />
        <br />
        <ButtonType
          label={{
            fieldName: "btn_clear",
            forceLabel: "Clear All",
            returnText: true
          }}
          reportparam={{
            reportname: "Cash Receipt"
          }}
        />
        <button
          className="btn btn-primary"
          //style={{ marginLeft: "200px", marginRight: "auto" }}
          onClick={() => {
            algaehApiCall({
              uri: "/masters/killDbConnections",
              method: "GET",
              onSuccess: res => {
                swalMessage({
                  title: "Killed It !!",
                  type: "success"
                });
              }
            });
          }}
        >
          KILL CONNECTIONS
        </button>
        <div>
          After the click the request will crash , Don't worry .. It Works that
          way!!
        </div>
        {/* <div>
          <img src={this.state.patImg} />
        </div> */}
        <button
          className="btn btn-primary"
          onClick={() => {
            let that = this;
            algaehApiCall({
              uri: "/excelReport", //"/report",
              method: "GET",
              module: "reports",
              headers: {
                Accept: "blob"
              },
              others: { responseType: "blob" },
              data: {
                report: {
                  reportName: "ClaimsSummary-PatientSQ",
                  reportParams: [
                    { name: "insurance_provider_id", value: 167 },
                    {
                      name: "invoice_from_date",
                      value: new Date("2018-12-01")
                    },
                    { name: "invoice_to_date", value: new Date("2018-12-31") }
                  ],
                  outputFileType: "EXCEL" //"EXCEL", //"PDF",
                }
              },
              onSuccess: res => {
                const url = URL.createObjectURL(res.data);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", "Aexcel.xlsx");
                link.click();
              }
            });
          }}
        >
          View Report
        </button>
        <div
          style={{
            marginTop: "30px"
          }}
        >
          <AlgaehErrorBoundary>
            <button
              className="btn btn-primary"
              onClick={() => {
                throw new Error("I crashed!");
              }}
            >
              Click me to Crash me
            </button>
          </AlgaehErrorBoundary>
        </div>
        <div className="row">
          <AlagehFormGroup
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "Enter Amount",
              isImp: false
            }}
            textBox={{
              className: "txt-fld",
              name: "amount",
              value: this.state.amount,
              events: {
                onChange: this.texthandle.bind(this)
              },
              option: {
                type: "text"
              }
            }}
          />
          <div className="col">
            <button
              className="btn btn-primary"
              onClick={() => {
                algaehApiCall({
                  uri: "/algaehMasters/method1",
                  method: "POST",
                  data: { amount: this.state.amount },
                  onSuccess: res => {
                    swalMessage({
                      title: "Killed It !!",
                      type: "success"
                    });
                  }
                });
              }}
            >
              Submit
            </button>
          </div>
        </div>
        <div>
          The Above component has a bug so this is how our wrapper handles We
          can still use the other elements apart from the crashed element
        </div>
        <p>Percentage {this.state.progressPercentage}</p>
        <embed src={this.state.report} width="800" height="500" />
        <div className="col">
          <button
            onClick={() => {
              algaehApiCall({
                uri: "/excel/create",
                method: "POST",
                headers: {
                  Accept: "blob"
                },
                others: { responseType: "blob" },
                module: "hrManagement",
                onSuccess: response => {
                  let reader = new FileReader();
                  reader.onloadend = () => {
                    var anchor = document.createElement("a");
                    anchor.setAttribute("href", encodeURI(reader.result));
                    anchor.setAttribute("download", "DailyTimeSheet");
                    anchor.click();
                  };
                  reader.readAsDataURL(response.data);
                }
              });
            }}
          >
            Generate Excel File
          </button>
        </div>
        <br />
        <br />
        <br />
        <button
          className="btn btn-primary"
          onClick={() => {
            let that = this;
            algaehApiCall({
              uri: "/multireports", //"/report",
              method: "GET",
              module: "reports",
              headers: {
                Accept: "blob"
              },
              timeout: 120000,
              others: {
                responseType: "blob",
                onDownloadProgress: progressEvent => {
                  let percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                  if (percentCompleted >= 100) {
                    that.setState({ progressPercentage: 100 });
                  } else {
                    that.setState({ progressPercentage: percentCompleted });
                  }
                }
              },
              data: {
                report: {
                  reportName: ["creditInvoice", "ucaf", "haematologyReport"],
                  reportParams: [
                    [
                      { name: "hims_d_patient_id", value: 245 },
                      {
                        name: "visit_id",
                        value: 553
                      },
                      {
                        name: "visit_date",
                        value: null
                      }
                    ],
                    [
                      { name: "hims_d_patient_id", value: 267 },
                      {
                        name: "visit_id",
                        value: 580
                      },
                      {
                        name: "visit_date",
                        value: null
                      }
                    ],
                    [
                      { name: "hims_d_patient_id", value: 101 },
                      {
                        name: "visit_id",
                        value: 300
                      },
                      {
                        name: "visit_date",
                        value: null
                      }
                    ]
                  ],
                  outputFileType: "PDF" //"EXCEL", //"PDF",
                }
              },
              onSuccess: res => {
                const url = URL.createObjectURL(res.data);
                let myWindow = window.open(
                  "{{ product.metafields.google.custom_label_0 }}",
                  "_blank"
                );

                myWindow.document.write(
                  "<iframe src= '" + url + "' width='100%' height='100%' />"
                );
                myWindow.document.title = "Algaeh Merdge";
              }
            });
          }}
        >
          Credit Invoice Report
        </button>
      </div>
    );
  }
}

export default Experiment;
