import React from "react";
export default function ReportComponets() {
  return {
    APPOINTMENTS: {
      avilabilityReport: () => {
        return (
          <div className="col">
            <label>From Date</label>
            <input type="Date" report-parameter="from_date" />
          </div>
        );
      }
    }
  };
}
