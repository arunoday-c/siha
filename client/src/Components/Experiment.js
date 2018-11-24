import React, { Component } from "react";
import { AlgaehErrorBoundary } from "./Wrapper/algaehWrapper";
import "react-table/react-table.css";
import { algaehApiCall } from "../utils/algaehApiCall";
import AlgaehReport from "./Wrapper/printReports";

const services = [
  { service_name: "Consultation", sl_no: 1 },
  { service_name: "Procedure", sl_no: 2 }
];

class Experiment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patImg: ""
    };

    // displayFileFromServer({
    //   uri: "/masters/getFile",
    //   fileType: "PAT-A-0000530",
    //   destinationName: "PAT-A-0000530",
    //   fileName: "PAT-A-0000530.png",
    //   resize: { width: 100, height: 100 },
    //   onFileSuccess: data => {
    //     this.setState({ patImg: data });
    //   }
    // });
  }

  render() {
    // const _groupData = Enumerable.from(_data)
    //   .groupBy("$.prov_date", null, (k, g) => {
    //     const _get = Enumerable.from(g.getSource()).firstOrDefault();
    //     return {
    //       bill_date: _get.bill_date,
    //       provider_name: _get.provider_name,
    //       list: g.getSource()
    //     };
    //   })
    //   .toArray();
    return (
      <div style={{ textAlign: "center" }}>
        <br />
        <br />
        <br />
        Kill the connections by clicking on this button
        <br />
        <br />
        <br />
        <br />
        <br />
        <button
          className="btn btn-primary"
          //style={{ marginLeft: "200px", marginRight: "auto" }}
          onClick={() => {
            algaehApiCall({
              uri: "/masters/killDbConnections",
              method: "GET"
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
      </div>
    );
  }
}

export default Experiment;
