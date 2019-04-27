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
class Experiment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patImg: "",
      openAuth: false,
      name: "i",
      image: undefined,
      report: undefined
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
              uri: "/report",
              method: "GET",
              module: "reports",
              headers: {
                Accept: "blob"
              },
              others: { responseType: "blob" },
              data: {
                rep: {
                  reportName: "CustomerReport.prpt",
                  reportParams: [{ name: "hims_d_employee_id", value: 3 }],
                  outputFileType: "EXCEL", //"EXCEL", //"PDF",
                  outputFileName: "CustomerReport$outputFileName",
                  printDetails: false,
                  reportLocation: "$reportLocation"
                }
              },
              onSuccess: res => {
                debugger;
                let reader = new FileReader();
                reader.onloadend = () => {
                  debugger;
                  that.setState({ report: reader.result });
                };

                reader.readAsDataURL(res.data);
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
        {this.state.report !== undefined ? (
          <embed src={this.state.report} width="800" height="500" />
        ) : null}
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
              uri: "/report",
              method: "GET",
              module: "reports",
              headers: {
                Accept: "blob"
              },
              others: { responseType: "blob" },
              data: {
                report: {
                  reportName: "ucaf",
                  reportParams: [
                    { name: "hims_d_patient_id", value: 18 },
                    {
                      name: "visit_date",
                      value: new Date("2018-10-31 00:00:00")
                    }
                  ],
                  outputFileType: "PDF", //"EXCEL", //"PDF",
                  outputFileName: "CustomerReport$outputFileName",
                  printDetails: false,
                  reportLocation: "$reportLocation"
                }
              },
              onSuccess: res => {
                debugger;
                let reader = new FileReader();
                reader.onloadend = () => {
                  debugger;
                  that.setState({ report: reader.result });
                };

                reader.readAsDataURL(res.data);
              }
            });
          }}
        >
          UCAF Report
        </button>
      </div>
    );
  }
}

export default Experiment;
