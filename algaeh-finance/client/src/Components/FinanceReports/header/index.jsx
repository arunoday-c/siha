import React, { memo, useContext } from "react";
import moment from "moment";
import { OrganizationContext } from "../context";

export default memo(function ({ title, dates }) {
  const { organizationDetail } = useContext(OrganizationContext);
  const {
    organization_name,
    address1,
    address2,
    // full_name,
  } = organizationDetail;
  return (
    <div id="finance_report_header" className="col financeReportHeader">
      <div>{organization_name}</div>
      <div>
        {address1}, {address2}
      </div>
      <hr></hr>
      <h3>{title}</h3>
      {dates && Array.isArray(dates)
        ? dates
            .map((date) => {
              return moment(date).format("DD/MM/YYYY");
            })
            .join(" - ")
        : dates}
    </div>
  );
});
