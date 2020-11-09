import React from "react";
import moment from "moment";
import { AlgaehDataGrid, AlgaehLabel } from "../../Wrapper/algaehWrapper";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import Options from "../../../Options.json";

export function InvoiceDetails({ details = [], data = {} }) {
  return (
    <div className="hptl-phase1-invoice-generation-form">
      <div className="col-lg-12">
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
                  fieldName: "trans_from",
                  label: <AlgaehLabel label={{ fieldName: "trans_from" }} />,
                  displayTemplate: (row) => {
                    return row.trans_from === "OP"
                      ? "OP Billing"
                      : "Point of Sale";
                  },
                },
                {
                  fieldName: "billed",
                  label: <AlgaehLabel label={{ fieldName: "billed" }} />,
                  displayTemplate: (row) => {
                    return row.billed === "N" ? "No" : "Yes";
                  },
                },
                {
                  fieldName: "service_type",
                  label: (
                    <AlgaehLabel label={{ fieldName: "service_type_id" }} />
                  ),
                },
                {
                  fieldName: "service_name",
                  label: <AlgaehLabel label={{ fieldName: "services_id" }} />,
                },

                {
                  fieldName: "unit_cost",
                  label: <AlgaehLabel label={{ fieldName: "unit_cost" }} />,
                  disabled: true,
                },

                {
                  fieldName: "quantity",
                  label: <AlgaehLabel label={{ fieldName: "quantity" }} />,
                },

                {
                  fieldName: "gross_amount",
                  label: <AlgaehLabel label={{ fieldName: "gross_amount" }} />,
                  disabled: true,
                },

                {
                  fieldName: "discount_amout",
                  label: (
                    <AlgaehLabel label={{ fieldName: "discount_amount" }} />
                  ),
                },

                {
                  fieldName: "net_amout",
                  label: <AlgaehLabel label={{ fieldName: "net_amount" }} />,
                  disabled: true,
                },
                {
                  fieldName: "patient_resp",
                  label: <AlgaehLabel label={{ fieldName: "patient_resp" }} />,
                  disabled: true,
                },
                {
                  fieldName: "patient_tax",
                  label: <AlgaehLabel label={{ fieldName: "patient_tax" }} />,
                  disabled: true,
                },
                {
                  fieldName: "patient_payable",
                  label: (
                    <AlgaehLabel label={{ fieldName: "patient_payable" }} />
                  ),
                  disabled: true,
                },
                {
                  fieldName: "comapany_resp",
                  label: <AlgaehLabel label={{ fieldName: "comapany_resp" }} />,
                  disabled: true,
                },
                {
                  fieldName: "company_tax",
                  label: <AlgaehLabel label={{ fieldName: "company_tax" }} />,
                  disabled: true,
                },
                {
                  fieldName: "company_payble",
                  label: (
                    <AlgaehLabel label={{ fieldName: "company_payble" }} />
                  ),
                  disabled: true,
                },
              ]}
              keyId="service_type_id"
              dataSource={{
                data: details,
              }}
              paging={{ page: 0, rowsPerPage: 10 }}
            />
          </div>
        </div>

        {/* Insurance */}
        <div className="col-12">
          <div className="row">
            <div className="col-7 insurance-sec">
              <div className="row">
                <div className="col-12">
                  <h6 style={{ marginTop: 10 }}>Insurance Details</h6>
                  <div className="row">
                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "insurance_company",
                        }}
                      />
                      <h6>{data?.insurance_provider_name ?? "---"}</h6>
                    </div>

                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "sub_insurance_company",
                        }}
                      />
                      <h6>{data?.sub_insurance_provider_name ?? "---"}</h6>
                    </div>
                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "plan_desc",
                        }}
                      />
                      <h6>{data?.network_type ?? "---"}</h6>
                    </div>

                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "policy_no",
                        }}
                      />
                      <h6>{data?.policy_number ?? "---"}</h6>
                    </div>
                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "card_no",
                        }}
                      />
                      <h6>{data?.card_number ?? "---"}</h6>
                    </div>

                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "ins_expiry_date",
                        }}
                      />
                      <h6>
                        {data?.effective_end_date
                          ? moment(data?.effective_end_date).format(
                            Options.dateFormat
                          )
                          : "---"}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Values */}
            <div className="col-5 amount-sec">
              <div className="row">
                <div className="col-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Gross Total",
                    }}
                  />
                  <h6>{GetAmountFormart(data?.gross_amount)}</h6>
                </div>
                <div className="col-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Discount Total",
                    }}
                  />
                  <h6>{GetAmountFormart(data?.discount_amount)}</h6>
                </div>

                <div className="col-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Net Total",
                    }}
                  />
                  <h6>{GetAmountFormart(data?.net_amout)}</h6>
                </div>

                <div className="col-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Patient Resp.",
                    }}
                  />
                  <h6>{GetAmountFormart(data?.patient_res)}</h6>
                </div>

                <div className="col-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Patient Tax",
                    }}
                  />
                  <h6>{GetAmountFormart(data?.patient_tax)}</h6>
                </div>

                <div className="col-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Patient Payable",
                    }}
                  />
                  <h6>{GetAmountFormart(data?.patient_payable)}</h6>
                </div>

                <div className="col-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Company Resp.",
                    }}
                  />
                  <h6>{GetAmountFormart(data?.company_res)}</h6>
                </div>
                <div className="col-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Company Tax",
                    }}
                  />
                  <h6>{GetAmountFormart(data?.company_tax)}</h6>
                </div>
                <div className="col-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Company Payable",
                    }}
                  />
                  <h6>{GetAmountFormart(data?.company_payble)}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
