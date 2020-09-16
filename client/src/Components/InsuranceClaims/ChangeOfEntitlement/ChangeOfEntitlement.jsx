import React, { useState } from "react";
// import moment from "moment";
import { useQuery } from "react-query";
import { AlgaehLabel, Spin, AlgaehDataGrid } from "algaeh-react-components";
import {
  VisitSearch,
  getPatientInsurance,
  getBillsForVisit,
  // getVisitWiseBillDetailS,
} from "./ChangeEntitlementEvents";
import { InsuranceForm } from "./InsuranceForm";
import "./InvoiceGeneration.scss";

export default function ChangeEntitlement(props) {
  const [visit, setVisit] = useState(null);

  const {
    data: insurance,
    isLoading: insLoading,
    clear: clearInsurance,
  } = useQuery(["patient-insurance", { ...visit }], getPatientInsurance, {
    initialData: {},
    initialStale: true,
    enabled: !!visit,
  });

  const { data: bills, isLoading: billLoadin, clear: clearBills } = useQuery(
    ["patient-bills", { ...visit }],
    getBillsForVisit,
    {
      initialData: [],
      initialStale: true,
      enabled: !!visit,
    }
  );

  const clearPage = () => {
    clearBills();
    clearInsurance();
    setVisit(null);
  };

  return (
    <Spin spinning={insLoading || billLoadin}>
      <div>
        <div className="row  inner-top-search">
          <div className="col-2 globalSearchCntr form-group">
            <AlgaehLabel label={{ forceLabel: "Search Visit Code" }} />
            <h6 onClick={() => VisitSearch(setVisit)}>
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
        <div className="row">
          <div
            className="col-lg-12"
            id="InvoiceGen"
            style={{ paddingTop: "15px" }}
          >
            <AlgaehDataGrid
              id="InvoiceGenGrid"
              columns={[
                // billed
                {
                  fieldName: "bill_number",
                  label: <AlgaehLabel label={{ fieldName: "bill_number" }} />,
                },
                {
                  fieldName: "bill_date",
                  label: <AlgaehLabel label={{ fieldName: "bill_date" }} />,
                },

                {
                  fieldName: "sub_total_amount",
                  label: <AlgaehLabel label={{ fieldName: "total_amount" }} />,
                  disabled: true,
                },
              ]}
              keyId="hims_f_billing_header_id"
              data={bills}
              paging={{ page: 0, rowsPerPage: 10 }}
            />
          </div>
        </div>
        <InsuranceForm patientInsurance={insurance} />
        <div className="hptl-phase1-footer">
          <button
            className="btn btn-default"
            onClick={clearPage}
            disabled={!visit}
          >
            Clear
          </button>
        </div>
      </div>
    </Spin>
  );
}
