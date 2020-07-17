import React, { memo, useContext } from "react";
import { OrganizationContext } from "../context";

export default memo(function ({ title }) {
  const { organizationDetail } = useContext(OrganizationContext);
  const {
    organization_name,
    address1,
    address2,
    full_name,
  } = organizationDetail;
  return (
    <div className="col financeReportHeader">
      <div>{organization_name}</div>
      <div>
        {address1}, {address2}
      </div>
      <hr></hr>
      <h3>{title}</h3>
    </div>
  );
});
