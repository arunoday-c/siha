import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Enumerable from "linq";
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
      <ReactTable
        columns={[
          {
            Header: "Date",
            accessor: "bill_date"
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
                              <div key={index}>{m.receipt_date}</div>
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
                              <div key={index}>{m.receipt_number}</div>
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
          }
        ]}
        data={_groupData}
      />
    );
  }
}

export default Experiment;
