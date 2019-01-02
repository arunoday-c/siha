import React, { Component } from "react";
import {
  AlgaehErrorBoundary,
  AlgaehModalPopUp,
  AlgaehDataGrid,
  AlgaehLabel
} from "./Wrapper/algaehWrapper";
import "react-table/react-table.css";
import { algaehApiCall } from "../utils/algaehApiCall";
import AlgaehReport from "./Wrapper/printReports";

const services = [
  { service_name: "Consultation", sl_no: 1 },
  { service_name: "Procedure", sl_no: 2 }
];

const myArray = [
  {
    hims_f_leave_application_id: 2,
    employee_id: 94,
    leave_application_code: "leav00000002",
    from_leave_session: "FD",
    from_date: "2018-12-10",
    to_leave_session: "FH",
    to_date: "2018-12-20"
  },
  {
    hims_f_leave_application_id: 9,
    employee_id: 94,
    leave_application_code: "leav00000003",
    from_leave_session: "FD",
    from_date: "2018-12-24",
    to_leave_session: "FH",
    to_date: "2018-12-25"
  }
];

class Experiment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patImg: "",
      openAuth: false,
      name: "i"
    };
    console.log("Im Constructor");
  }

  componentWillMount() {
    console.log("I'm Will Mount");
  }

  componentDidMount() {
    console.log("Did Mount");
  }

  componentWillReceiveProps(props) {
    console.log("Will Receive Props");
  }

  componentWillUnmount() {
    console.log("Un Mount");
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("Will Update");
    if (this.state.name === "i" && nextState === "i") {
      console.log("Same Input");
    }
  }

  texthandle(e) {
    this.setState({
      name: e.target.value
    });
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <input value={this.state.name} onChange={this.texthandle.bind(this)} />
        <AlgaehModalPopUp
          openPopup={this.state.openAuth}
          events={{
            onClose: () => {
              this.setState({
                openAuth: false
              });
            }
          }}
        >
          <div className="row">
            <div className="col-lg-2">
              <AlgaehLabel label={{ forceLabel: "Application No." }} />
              <h6>{"LOAN-123"}</h6>
            </div>

            <div className="col-lg-2">
              <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
              <h6>{"Adnan"}</h6>
            </div>

            <div className="col-lg-2">
              <AlgaehLabel label={{ forceLabel: "Loan Type" }} />
              <h6>{"loan_description"}</h6>
            </div>

            <div className="col-lg-2">
              <AlgaehLabel label={{ forceLabel: "Loan Amount" }} />
              <h6>{"loan_amount"}</h6>
            </div>

            <div className="col-lg-2">
              <AlgaehLabel label={{ forceLabel: "Start Month" }} />
              <h6>{"start_month"}</h6>
            </div>

            <div className="col-lg-2">
              <AlgaehLabel label={{ forceLabel: "Start Year" }} />
              <h6>{"start_year"}</h6>
            </div>
          </div>
          <div className="col-12" id="requestedLoanAppGrid_Cntr">
            <AlgaehDataGrid
              id="requestedLoanAppGrid"
              datavalidate="requestedLoanAppGrid"
              columns={[
                {
                  fieldName: "Amount",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Requested Amount" }} />
                  )
                },
                {
                  fieldName: "InterestPercentage",
                  label: (
                    <AlgaehLabel
                      label={{ forceLabel: "Interest Percentage" }}
                    />
                  )
                },
                {
                  fieldName: "loan_tenure",
                  label: <AlgaehLabel label={{ forceLabel: "No. of EMI" }} />
                },
                {
                  fieldName: "installment_amount",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Installment Amount" }} />
                  )
                },
                {
                  fieldName: "balance_due",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Pending Amount" }} />
                  )
                },
                {
                  fieldName: "start_year",
                  label: <AlgaehLabel label={{ forceLabel: "Start Year" }} />
                },
                {
                  fieldName: "start_month",
                  label: <AlgaehLabel label={{ forceLabel: "Start Month" }} />
                },
                {
                  fieldName: "remarks",
                  label: <AlgaehLabel label={{ forceLabel: "Remakrs" }} />
                },
                {
                  fieldName: "loan_authorized",
                  label: <AlgaehLabel label={{ forceLabel: "Loan Status" }} />
                }
              ]}
              keyId=""
              dataSource={{ data: [] }}
              isEditable={false}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{}}
              others={{}}
            />
          </div>
          <div className="popupFooter">
            <button>SAVE</button>
          </div>
        </AlgaehModalPopUp>
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
        <div>
          <button
            className="btn btn-primary"
            onClick={() => {
              this.setState({
                openAuth: true
              });
            }}
          >
            Open Modal
          </button>
        </div>
      </div>
    );
  }
}

export default Experiment;
