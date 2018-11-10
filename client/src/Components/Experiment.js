import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Enumerable from "linq";
import { algaehApiCall } from "../utils/algaehApiCall";
import AlgaehReport from "./Wrapper/printReports";

const services = [
  { service_name: "Consultation", sl_no: 1 },
  { service_name: "Procedure", sl_no: 2 }
];

const _data = [
  {
    hims_f_billing_header_id: 626,
    bill_number: "BILL-A-000503",
    patient_id: 580,
    visit_id: 539,
    prov_date: "2018-09-18 Norman John",
    provider_name: "Norman John",
    incharge_or_provider: 2,
    bill_date: "2018-09-18",
    net_amount: 240,
    patient_payable: 240,
    receiveable_amount: 240,
    credit_amount: 0,
    pri_company_payble: 0,
    sec_company_payable: 0,
    hims_f_patient_insurance_mapping_id: 35,
    primary_insurance_provider_id: 1,
    pri_insurance_provider_name: "TCS",
    secondary_insurance_provider_id: null,
    sec_insurance_provider_name: null,
    receipt: [
      {
        hims_f_receipt_header_id: 486,
        receipt_number: "RCPT-A-000487",
        receipt_date: "2018-09-18",
        billing_header_id: 626,
        total_amount: 240
      }
    ]
  },
  {
    hims_f_billing_header_id: 625,
    bill_number: "BILL-A-000502",
    patient_id: 580,
    visit_id: 539,
    provider_name: "Norman John",
    prov_date: "2018-09-18 Norman John",
    incharge_or_provider: 2,
    bill_date: "2018-09-18",
    net_amount: 60,
    patient_payable: 60,
    receiveable_amount: 60,
    credit_amount: 0,
    pri_company_payble: 0,
    sec_company_payable: 0,
    hims_f_patient_insurance_mapping_id: 35,
    primary_insurance_provider_id: 1,
    pri_insurance_provider_name: "TCS",
    secondary_insurance_provider_id: null,
    sec_insurance_provider_name: null,
    receipt: [
      {
        hims_f_receipt_header_id: 485,
        receipt_number: "RCPT-A-000486",
        receipt_date: "2018-09-18 08:07:19",
        billing_header_id: 625,
        total_amount: 60
      },
      {
        hims_f_receipt_header_id: 486,
        receipt_number: "RCPT-A-000487",
        receipt_date: "2018-09-18 08:07:19",
        billing_header_id: 625,
        total_amount: 60
      }
    ]
  },
  {
    hims_f_billing_header_id: 618,
    bill_number: "BILL-A-000495",
    patient_id: 580,
    visit_id: 532,
    provider_name: "Norman John",
    incharge_or_provider: 2,
    prov_date: "2018-09-15 Norman John",
    bill_date: "2018-09-15",
    net_amount: 60,
    patient_payable: 60,
    receiveable_amount: 60,
    credit_amount: 0,
    pri_company_payble: 0,
    sec_company_payable: 0,
    hims_f_patient_insurance_mapping_id: 34,
    primary_insurance_provider_id: 1,
    pri_insurance_provider_name: "TCS",
    secondary_insurance_provider_id: 13,
    sec_insurance_provider_name: "MEDNET",
    receipt: [
      {
        hims_f_receipt_header_id: 478,
        receipt_number: "RCPT-A-000479",
        receipt_date: "2018-09-15 13:22:42",
        billing_header_id: 618,
        total_amount: 60
      }
    ]
  }
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
    const _groupData = Enumerable.from(_data)
      .groupBy("$.prov_date", null, (k, g) => {
        const _get = Enumerable.from(g.getSource()).firstOrDefault();
        return {
          bill_date: _get.bill_date,
          provider_name: _get.provider_name,
          list: g.getSource()
        };
      })
      .toArray();
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
                fileName: "cashInvoice"
              },
              data: {
                services: services,
                remarks: 500 + " by Cash",
                total_amount: 500,
                payment_type: "cash",
                patient_code: "PAT-00000asdfadsf",
                full_name: "Allah Bakash",
                advance_amount: "PAT-00000asdfadsf",
                invoice_number: "INV-A-0000989",
                receipt_number: "PAT-00000asdfadsf",
                receipt_date: "11-11-2018",
                doctor_name: "Dr. Norman John",
                bill_details: "PAT-00000asdfadsf"
              }
            });
          }}
        >
          View Report
        </button>
      </div>
    );
  }
}

export default Experiment;
