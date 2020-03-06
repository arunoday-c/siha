import React from "react";
import "./infobar.scss";

export default function InfoBar({ data }) {
  const { over_due, total_receivable, last_paid } = data;
  if (data) {
    return (
      <div className="row infoBar">
        {over_due ? (
          <div className="col danger">
            <div className="text">
              <p>Overdue</p>
              {over_due}
            </div>
          </div>
        ) : null}

        {total_receivable ? (
          <div className="col">
            <div className="text">
              <p>Open Invoices</p>
              {total_receivable}
            </div>
          </div>
        ) : null}

        {last_paid ? (
          <div className="col">
            <div className="text">
              <p>Paid Last 30 days</p>
              {last_paid}
            </div>
          </div>
        ) : null}
      </div>
    );
  } else {
    return null;
  }
}
