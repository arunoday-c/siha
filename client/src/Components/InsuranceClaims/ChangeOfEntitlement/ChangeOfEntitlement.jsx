import React, { useState, useReducer, createContext, useContext } from "react";
import "./ChangeOfEntitlement.scss";
import moment from "moment";
import { useQuery } from "react-query";
import {
  AlgaehLabel,
  Spin,
  AlgaehDataGrid,
  MainContext,
  AlgaehMessagePop,
} from "algaeh-react-components";
import {
  VisitSearch,
  getPatientInsurance,
  getBillsForVisit,
  generateBills,
  // getVisitWiseBillDetailS,
} from "./ChangeEntitlementEvents";
import { InsuranceForm } from "./InsuranceForm";
import "./InvoiceGeneration.scss";
import axios from "axios";

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "setNewInsurance":
      return { ...state, dropdownData: { ...state.dropdownData, ...payload } };
    default:
      return state;
  }
};

export const InsuranceData = createContext(undefined);

export default function ChangeEntitlement(props) {
  const { userToken } = useContext(MainContext);
  const { default_nationality, local_vat_applicable } = userToken;

  const [visit, setVisit] = useState(null);
  const [generateEnable, setGenerateEnable] = useState(true);
  const [state, dispatch] = useReducer(reducer, {});
  const dispacher = {
    setNewInsurance(data) {
      dispatch({ type: "setNewInsurance", payload: data });
    },
  };
  const {
    data: insurance,
    isLoading: insLoading,
    clear: clearInsurance,
  } = useQuery(["patient-insurance", { ...visit }], getPatientInsurance, {
    initialData: {},
    initialStale: true,
    enabled: !!visit,
  });

  // const {
  //   data: bills,
  //   isLoading: billLoadin,
  //   clear: clearBills,
  // } = useQuery(["patient-bills", { ...visit }], getBillsForVisit, {
  //   initialData: [],
  //   initialStale: true,
  //   enabled: !!visit,
  // });

  const { data: bills, isLoading: billLoadin, clear: clearBills } = useQuery(
    ["patient-bills", { ...visit }],
    getBillsForVisit,
    {
      initialData: [],
      initialStale: true,
      enabled: !!visit,
    }
  );

  const PORTAL_HOST = process.env.REACT_APP_PORTAL_HOST;

  const clearPage = () => {
    clearBills();
    clearInsurance();
    setVisit(null);
    setGenerateEnable(true);
  };

  const onSubmit = async (e) => {
    try {
      const insurance_data = state.dropdownData;

      if (insurance_data.insured === "Y") {
        if (
          insurance_data.primary_card_number === "" ||
          insurance_data.primary_card_number === undefined ||
          insurance_data.primary_insurance_provider_id === undefined ||
          insurance_data.primary_network_office_id === undefined ||
          insurance_data.primary_network_id === undefined
        ) {
          AlgaehMessagePop({
            type: "warning",
            display: "Enter Insurance Details.",
          });
          return;
        }
      }
      const inpit_data = {
        ...visit,
        ...insurance_data,
        vat_applicable:
          default_nationality == visit.nationality_id
            ? local_vat_applicable
            : "Y",
        visit_bills: bills,
      };

      const after_generate = await generateBills(inpit_data).catch((error) => {
        throw error;
      });
      setGenerateEnable(true);
      console.log("after_generate", after_generate);
      try {
        const data = {
          visit_code: visit?.visit_code,
          corporate_id: insurance_data.user_id,
        };
        axios
          .post(`${PORTAL_HOST}/info/updatepatientVisit`, data)
          .then(function (response) {
            //handle success
            console.log(response);
          })
          .catch(function (response) {
            //handle error
            console.log(response);
          });
      } catch (error) {
        AlgaehMessagePop({
          display: error,
          type: "error",
        });
      }
      AlgaehMessagePop({
        type: "success",
        display: "Done Succesfully",
      });
    } catch (error) {
      AlgaehMessagePop({
        type: "error",
        display: error.message,
      });
    }
  };

  return (
    <Spin spinning={insLoading || billLoadin}>
      <div className="ChangeOfEntitlementScreen">
        <div className="row  inner-top-search">
          <div className="col-2 globalSearchCntr form-group">
            <AlgaehLabel label={{ forceLabel: "Search Visit Code" }} />
            <h6 onClick={() => VisitSearch(setVisit, setGenerateEnable)}>
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
          <div className="col-3" id="InvoiceGen">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    List of Bills in this visits
                  </h3>
                </div>
              </div>
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
              </div>
            </div>
          </div>
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
              </div>
              <div className="col-12">
                <InsuranceData.Provider value={{ ...state, ...dispacher }}>
                  <InsuranceForm
                    patientInsurance={insurance}
                    selected_visit={visit}
                  />
                </InsuranceData.Provider>
              </div>
            </div>
          </div>
        </div>

        <div className="hptl-phase1-footer">
          <button
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={generateEnable}
          >
            Generate
          </button>
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
