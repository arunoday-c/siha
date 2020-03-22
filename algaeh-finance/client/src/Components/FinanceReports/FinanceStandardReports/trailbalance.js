import React, { useRef } from "react";
import { AlgaehTable } from "algaeh-react-components";

export default function TrailBalaceReport({
  style,
  data,
  nonZero = true,
  layout
}) {
  const { asset, expense, liability, capital, income } = data;
  const accounts = [asset, expense, liability, capital, income];
  if (data.asset) {
    return (
      <>
        <div>
          <div className="financeReportHeader">
            <div>Twareat Medical Centre</div>
            <div>
              Al Fanar Mall، 1 Street, Ar Rawabi, Al Khobar 34421, Saudi Arabia
            </div>
            <hr></hr>
            <h3>Trail Balance</h3>
            <p>
              As on: <b>12/02/2020</b>
            </p>
          </div>
          <div className="reportTableStyle" style={{ border: "none" }}>
            <AlgaehTable
              data={accounts || []}
              columns={[
                {
                  fieldName: "label",
                  label: "Paticulars",
                  filterable: true
                },
                {
                  fieldName: "op_amount",
                  label: "Opening Balance"
                },
                {
                  fieldName: "tr_debit_amount",
                  label: "Transactions Debit"
                },
                {
                  fieldName: "tr_credit_amount",
                  label: "Transaction Credit"
                },
                {
                  fieldName: "cb_amount",
                  label: "Closing Balance"
                }
              ]}
              isFilterable={true}
              row_unique_id="label"
              expandAll={layout.expand}
            />
          </div>
        </div>
      </>
    );
  }
  return null;
}
