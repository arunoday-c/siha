import React, { Component } from "react";
import { AlgaehErrorBoundary } from "./Wrapper/algaehWrapper";
import "react-table/react-table.css";
import { algaehApiCall, swalMessage } from "../utils/algaehApiCall";
import AlgaehReport from "./Wrapper/printReports";
import _ from "lodash";
import FrontDesk from "../Search/FrontDesk.json";
import AlgaehAutoSearch from "./Wrapper/autoSearch";
const services = [
  { service_name: "Consultation", sl_no: 1 },
  { service_name: "Procedure", sl_no: 2 }
];

class Experiment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patImg: "",
      openAuth: false,
      name: "i"
    };

    console.log("Chunk:", _.chunk(services, 1));
  }

  texthandle(e) {
    this.setState({
      name: e.target.value
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
            AlgaehReport({
              report: {
                fileName: "haematologyReport"
              },
              data: {
                services: services,
                remarks: 500 + " by Cash",
                total_amount: 500,
                payment_type: "cash",
                patient_code: "PAT-A-00005678",
                full_name: "Allah Bakash",
                advance_amount: "PAT-00000asdfadsf",
                invoice_number: "INV-A-0000989",
                receipt_number: "PAT-00000asdfadsf",
                receipt_date: "13-11-2018",
                doctor_name: "Dr. Norman John",
                bill_details: "PAT-00000asdfadsf"
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
        <div>
          The Above component has a bug so this is how our wrapper handles We
          can still use the other elements apart from the crashed element
        </div>
        <div className="col">
          <AlgaehAutoSearch
            title="Testing Title"
            id="patient_code_search"
            template={result => {
              return <div className="description">{result.full_name}</div>;
            }}
            columns={FrontDesk}
            displayField="full_name"
            //extraParameters={{}}
            searchName="patients"
          />
        </div>
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
      </div>
    );
  }
}

export default Experiment;
