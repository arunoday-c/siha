import React from "react";

export default function Expense() {
  return (
    <div className="col ExpenseTransactionScreen">
      <div
        className="portlet portlet-bordered margin-bottom-15"
        style={{ marginTop: 15 }}
      >
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">
              All expenses between October 1, 2019 and October 31, 2019
            </h3>
          </div>
          <div className="actions">
            <a className="btn btn-primary btn-circle active">
              <i className="fas fa-plus" />
            </a>
          </div>
        </div>
        <div className="portlet-body">Grid</div>
      </div>
    </div>
  );
}
