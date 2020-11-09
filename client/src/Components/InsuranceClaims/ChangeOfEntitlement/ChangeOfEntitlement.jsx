import React, { useState } from "react";
import "./ChangeOfEntitlement.scss";
import moment from "moment";
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
      <div className="ChangeOfEntitlementScreen">
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
          <div className="col-9">
            <div className="row">
              <div className="col-12 ">
                <div className="col insurance-sec">
                  <h6 style={{ marginTop: 10 }}>Selected Insurance Details</h6>
                  <div className="row">
                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "insurance_company",
                        }}
                      />
                      <h6>
                        {insurance?.[0]?.insurance_provider_name ?? "---"}
                      </h6>
                    </div>

                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "sub_insurance_company",
                        }}
                      />
                      <h6>
                        {insurance?.[0]?.sub_insurance_provider_name ?? "---"}
                      </h6>
                    </div>
                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "plan_desc",
                        }}
                      />
                      <h6>{insurance?.[0]?.network_type ?? "---"}</h6>
                    </div>

                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "policy_no",
                        }}
                      />
                      <h6>{insurance?.[0]?.policy_number ?? "---"}</h6>
                    </div>
                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "card_no",
                        }}
                      />
                      <h6>{insurance?.[0]?.card_number ?? "---"}</h6>
                    </div>

                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "ins_expiry_date",
                        }}
                      />
                      <h6>
                        {insurance?.[0]?.effective_end_date
                          ? moment(insurance?.[0]?.effective_end_date).format(
                            "DD/MM/YYYY"
                          )
                          : "---"}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div className="col-12">
                <InsuranceForm patientInsurance={insurance} selected_visit={visit} />
              </div>
            </div>
          </div>
          <div className="col-3" id="InvoiceGen">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <AlgaehDataGrid
                  className="BillDetailGrid"
                  columns={[
                    // billed
                    {
                      fieldName: "bill_number",
                      label: (
                        <AlgaehLabel label={{ fieldName: "bill_number" }} />
                      ),
                    },
                    // {
                    //   fieldName: "bill_date",
                    //   label: <AlgaehLabel label={{ fieldName: "bill_date" }} />,
                    // },

                    {
                      fieldName: "sub_total_amount",
                      label: (
                        <AlgaehLabel label={{ fieldName: "total_amount" }} />
                      ),
                      disabled: true,
                    },
                  ]}
                  keyId="hims_f_billing_header_id"
                  data={bills}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>{" "}
            </div>{" "}
          </div>
        </div>

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
