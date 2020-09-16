import React, { useState } from "react";
// import moment from "moment";
import { useQuery } from "react-query";
import { AlgaehLabel, Spin } from "algaeh-react-components";
import {
  VisitSearch,
  getPatientInsurance,
  getVisitWiseBillDetailS,
} from "./ChangeEntitlementEvents";
import { InvoiceDetails } from "./InvoiceDetails";
import "./InvoiceGeneration.scss";

export default function ChangeEntitlement(props) {
  const [insured, setInsured] = useState("N");
  const [visit, setVisit] = useState(null);

  const { data: insurance, isLoading: insLoading } = useQuery(
    ["patient-insurance", { ...visit }],
    getPatientInsurance,
    {
      initialData: {},
      initialStale: true,
      enabled: !!visit,
    }
  );
  const { data: invoice, isLoading: invLoading } = useQuery(
    ["patient-invoice", { visit_id: visit?.visit_id, isInurance: insured }],
    getVisitWiseBillDetailS,
    {
      initialData: [],
      initialStale: true,
      enabled: !!visit,
    }
  );

  return (
    <Spin spinning={insLoading || invLoading}>
      <div>
        <div className="row  inner-top-search">
          {/* Visit code */}

          <div className="col-2">
            <label>Invoice Type</label>
            <div className="customRadio">
              <label className="radio inline">
                <input
                  type="radio"
                  name="insured"
                  value={"N"}
                  onChange={(e) => setInsured(e.target.value)}
                />
                <span>Cash</span>
              </label>

              <label className="radio inline">
                <input
                  type="radio"
                  name="insured"
                  value={"Y"}
                  onChange={(e) => setInsured(e.target.value)}
                />
                <span>Insurance</span>
              </label>
            </div>
          </div>

          <div className="col-2 globalSearchCntr form-group">
            <AlgaehLabel label={{ forceLabel: "Search Visit Code" }} />
            <h6 onClick={() => VisitSearch(insured, setVisit)}>
              {visit?.visit_code ?? "Search Visit"}
              <i className="fas fa-search fa-lg"></i>
            </h6>
          </div>

          <div className="col-2">
            <AlgaehLabel
              label={{
                forceLabel: "Patient Code",
              }}
            />
            <h6>{visit?.patient_code ?? "Patient Code"}</h6>
          </div>
          <div className="col">
            <AlgaehLabel
              label={{
                forceLabel: "Patient Name",
              }}
            />
            <h6>{visit?.full_name ?? "Patient Name"}</h6>
          </div>
        </div>
        <InvoiceDetails details={invoice} patientInsurance={insurance} />
        <div className="hptl-phase1-footer"></div>
      </div>
    </Spin>
  );
}
