import React, { useState } from "react";
import { Spin } from "algaeh-react-components";
import _ from "lodash";
export default function ({ aging, data, generateReport }) {
  const {
    account_name,
    ledger_code,
    opening_balance,
    details,
    closing_balance,
    total_amount,
  } = data;
  const [loading, setLoading] = useState(false);
  async function onGeneratingReport(input) {
    try {
      const {
        voucher_no,
        voucher_type,
        finance_voucher_header_id,
        from_screen,
        day_end_header_id,
      } = input;
      setLoading(true);

      await generateReport({
        voucher_no,
        voucher_type,
        finance_voucher_header_id,
        from_screen,
        day_end_header_id,
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }
  return (
    <Spin spinning={loading}>
      <h4 style={{ marginTop: "25px" }}>
        {account_name} / {ledger_code}
      </h4>
      <table className="tableBrdrDrillDown">
        <thead>
          <tr>
            <th>Date</th>
            <th>Voucher Type</th>
            <th>Voucher No.</th>
            {aging === true ? <th>Amount</th> : <th>Credit Amt</th>}
            {aging === true ? null : <th>Credit Amt</th>}
          </tr>
        </thead>
        <tbody>
          {aging === true ? null : (
            <tr>
              <td colSpan="3" className="numberFld">
                Previous Balance
              </td>
              <td colSpan="2" className="numberFld">
                <b>{opening_balance}</b>
              </td>
            </tr>
          )}

          {Array.isArray(details) &&
            details.map((item, index) => (
              <tr key={index}>
                <td>{aging === true ? item.due_date : item.payment_date}</td>
                <td>{_.startCase(item.voucher_type)}</td>
                <td>
                  {item.voucher_no ? (
                    <a
                      href="void(0);"
                      className="underLine"
                      onClick={(e) => {
                        e.preventDefault();
                        onGeneratingReport(item);
                      }}
                    >
                      {item.voucher_no}
                    </a>
                  ) : (
                    ""
                  )}
                </td>
                <td className="numberFld">{item.debit_amount}</td>
                {aging === true ? null : (
                  <td className="numberFld">{item.credit_amount}</td>
                )}
              </tr>
            ))}
          {aging === true ? (
            <tr>
              <td colSpan="3" className="numberFld">
                Total Amount
              </td>
              <td colSpan="2" className="numberFld">
                <b>{total_amount}</b>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="3" className="numberFld">
                Closing Balance
              </td>
              <td colSpan="2" className="numberFld">
                <b>{closing_balance}</b>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Spin>
  );
}
