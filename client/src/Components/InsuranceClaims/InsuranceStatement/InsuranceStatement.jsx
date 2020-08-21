import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AlgaehLabel } from "algaeh-react-components";
import "./InsuranceStatement.scss";
import { ClaimSearch } from "../RCMWorkbench/RCMWorkbenchEvent";
import { useQueryParams } from "../../../hooks";
import { StatementTable } from "./StatementTable";

export default function InsuranceStatement() {
  const history = useHistory();
  const location = useLocation();
  const params = useQueryParams();
  const insurance_statement_number = params.get("insurance_statement_number");
  return (
    <div className="row InsuranceStatementScreen">
      <div className="col-12">
        <div className="row inner-top-search">
          <div className="col-3 globalSearchCntr form-group">
            <AlgaehLabel label={{ forceLabel: "Search Statement No." }} />
            <h6 onClick={() => ClaimSearch(history, location?.pathname)}>
              {insurance_statement_number ?? "Search Statement No."}
              <i className="fas fa-search fa-lg"></i>
            </h6>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <StatementTable />
          </div>
        </div>
      </div>
    </div>
  );
}
