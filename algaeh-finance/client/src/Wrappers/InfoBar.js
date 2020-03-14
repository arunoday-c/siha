import React from "react";
import "./infobar.scss";

export default function InfoBar({ data }) {
  const { over_due, total_receivable, past_payments } = data;
  if (data) {
    return (
      <div className="row infoBar">
        {" "}
        {past_payments ? (
          <div className="col">
            <div className="infoValCntr green">
              <div className="label">Paid Last 30 days</div>
              <h5> {past_payments}</h5>
            </div>
          </div>
        ) : null}
        {total_receivable ? (
          <div className="col">
            <div className="infoValCntr yellow">
              <div className="label">Open Invoices</div>
              <h5>{total_receivable}</h5>
            </div>
          </div>
        ) : null}
        {over_due ? (
          <div className="col">
            <div className="infoValCntr red">
              <div className="label">Overdue</div>
              <h5>{over_due}</h5>
            </div>
          </div>
        ) : null}
        <div className="col ">
          <div className="infoValCntr blue">
            <div className="label">Day & Process</div>
            <h5>{over_due}</h5>
          </div>
        </div>
        <div className="col ">
          <div className="infoValCntr purple">
            <div className="label">Not Posted</div>
            <h5>{over_due}</h5>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
