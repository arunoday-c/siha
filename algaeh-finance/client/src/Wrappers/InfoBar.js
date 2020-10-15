import React from "react";
import "./infobar.scss";
import { getAmountFormart } from "../utils/GlobalFunctions";

export default function InfoBar({ data }) {
  const { over_due, total_receivable, past_payments, day_end_pending } = data;
  if (data) {
    return (
      <div className="row infoBar">
        {past_payments ? (
          <div className="col">
            <div className="infoValCntr green">
              <div className="label">Paid Last 30 days</div>
              <h5> {getAmountFormart(past_payments, {
                appendSymbol: false,
              })}</h5>
            </div>
          </div>
        ) : null}
        {total_receivable ? (
          <div className="col">
            <div className="infoValCntr yellow">
              <div className="label">Open Invoices</div>
              <h5>{getAmountFormart(total_receivable, {
                appendSymbol: false,
              })}</h5>
            </div>
          </div>
        ) : null}
        {over_due ? (
          <div className="col">
            <div className="infoValCntr red">
              <div className="label">Overdue</div>
              <h5>{getAmountFormart(over_due, {
                appendSymbol: false,
              })}</h5>
            </div>
          </div>
        ) : null}
        {/* {day_end_pending ? (
          <div className="col ">
            <div className="infoValCntr blue">
              <div className="label">Dayend Pending Transactions</div>
              <h5>{getAmountFormart(day_end_pending, {
                appendSymbol: false,
              })}</h5>
            </div>
          </div>
        ) : null} */}
      </div>
    );
  } else {
    return null;
  }
}
