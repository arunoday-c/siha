import React from "react";
export default function ({ data }) {
  const {
    account_name,
    ledger_code,
    opening_balance,
    details,
    total_debit,
    total_credit,
    closing_balance,
  } = data;
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Voucher Type</th>
          <th>Voucher No.</th>
          <th>Debit Amt</th>
          <th>Credit Amt</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="5">
            {account_name} / {ledger_code}
          </td>
        </tr>
        <tr>
          <td colspan="4">Opening Balance</td>
          <td>
            <b>{opening_balance}</b>
          </td>
        </tr>
        {Array.isArray(details) &&
          details.map((item, index) => (
            <tr key={index}>
              <td>{item.payment_date}</td>
              <td>{item.voucher_type}</td>
              <td>{item.voucher_no}</td>
              <td>{item.debit_amount}</td>
              <td>{item.credit_amount}</td>
            </tr>
          ))}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3"></td>
          <td>{total_debit}</td>
          <td>{total_credit}</td>
        </tr>
        <tr>
          <td colspan="4">Closing Balance</td>
          <td>
            <b>{closing_balance}</b>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
