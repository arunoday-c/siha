import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import Enumerable from "linq";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

const PatientSearch = ($this, context, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.frontDesk.patients
    },
    searchName: "patients",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState({ patient_code: row.patient_code });

      if (context !== null) {
        context.updateState({ patient_code: row.patient_code });
      }
    }
  });
};

const selectVisit = ($this, context, e) => {
  //   let $this = this;
  AlgaehLoader({ show: true });
  let mode_of_pay = "Self";
  let applydiscount = false;

  if (e.selected.insured === "Y") {
    mode_of_pay = "Insurance";
    applydiscount = true;
  }
  $this.setState(
    {
      incharge_or_provider: e.selected.doctor_id,
      visit_id: e.selected.hims_f_patient_visit_id,
      insured: e.selected.insured,
      insurance_yesno: e.selected.insured,
      sec_insured: e.selected.sec_insured,
      mode_of_pay: mode_of_pay,
      sub_department_id: e.selected.sub_department_id
    },
    () => {
      if ($this.state.insured === "Y") {
        $this.props.getPatientInsurance({
          uri: "/patientRegistration/getPatientInsurance",
          module: "frontDesk",
          method: "GET",
          data: {
            patient_id: $this.state.hims_d_patient_id,
            patient_visit_id: $this.state.visit_id
          },
          redux: {
            type: "EXIT_INSURANCE_GET_DATA",
            mappingName: "existinsurance"
          }
        });
      }

      algaehApiCall({
        uri: "/orderAndPreApproval/load_orders_for_bill",
        method: "GET",
        data: {
          visit_id: $this.state.visit_id
        },
        onSuccess: response => {
          if (response.data.success) {
            // AlgaehLoader({ show: false });

            let data = response.data.records;

            if (data.length > 0) {
              let pre_approval_Required = Enumerable.from(data)
                .where(w => w.pre_approval === "Y" && w.apprv_status === "NR")
                .toArray();
              for (let i = 0; i < data.length; i++) {
                data[i].ordered_date = data[i].created_date;
              }

              for (let j = 0; j < pre_approval_Required.length; j++) {
                var index = data.indexOf(pre_approval_Required[j]);
                data.splice(index, 1);
              }

              if (data.length > 0) {
                if (pre_approval_Required.length > 0) {
                  swalMessage({
                    title: "Some of the service is Pre-Approval required.",
                    type: "warning"
                  });
                }

                if (context !== null) {
                  context.updateState({
                    billdetails: data
                  });
                }

                algaehApiCall({
                  uri: "/billing/billingCalculations",
                  module: "billing",
                  method: "POST",
                  data: { billdetails: data },
                  onSuccess: response => {
                    if (response.data.success) {
                      response.data.records.patient_payable_h =
                        response.data.records.patient_payable ||
                        $this.state.patient_payable;

                      response.data.records.saveEnable = false;
                      response.data.records.billDetails = false;
                      response.data.records.applydiscount = applydiscount;
                      if (context !== null) {
                        context.updateState({ ...response.data.records });
                      }
                    }
                    AlgaehLoader({ show: false });
                  },
                  onFailure: error => {
                    AlgaehLoader({ show: false });
                    swalMessage({
                      title: error.message,
                      type: "error"
                    });
                  }
                });
              } else {
                swalMessage({
                  title:
                    "All service is Pre-Approval required, Please wait for Approval.",
                  type: "warning"
                });
              }
            } else {
              AlgaehLoader({ show: false });
              if (context !== null) {
                context.updateState({
                  billdetails: data,
                  applydiscount: applydiscount,
                  saveEnable: true,

                  advance_adjust: null,
                  card_amount: null,
                  cash_amount: null,
                  cheque_amount: null,
                  company_payble: null,
                  company_res: null,
                  company_tax: null,
                  copay_amount: null,
                  deductable_amount: null,
                  discount_amount: null,
                  gross_total: null,
                  net_amount: null,
                  net_total: null,
                  patient_payable: null,
                  patient_payable_h: null,
                  patient_res: null,
                  patient_tax: null,
                  receiveable_amount: null,
                  sec_company_paybale: null,
                  sec_company_res: null,
                  sec_company_tax: null,
                  sec_copay_amount: null,
                  sec_deductable_amount: null,
                  sheet_discount_amount: null,
                  sheet_discount_percentage: null,
                  sub_total_amount: null,
                  total_amount: null,
                  total_tax: null,
                  unbalanced_amount: null,
                  billDetails: true
                });
              }
            }
          }
        },
        onFailure: error => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    }
  );

  if (context !== null) {
    context.updateState({
      incharge_or_provider: e.selected.doctor_id,
      visit_id: e.selected.hims_f_patient_visit_id,
      insured: e.selected.insured,
      sec_insured: e.selected.sec_insured,
      mode_of_pay: mode_of_pay,
      addNewService: false,
      sub_department_id: e.selected.sub_department_id
    });
  }
};
export { PatientSearch, selectVisit };
