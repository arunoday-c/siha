import Enumerable from "linq";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall.js";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

const handleChange = ($this, row, context, e) => {
  //   let $this = this;
  let mode_of_pay = "Self";
  let applydiscount = false;
  let x = Enumerable.from($this.state.visitDetails)
    .where(w => w.radioselect === 1)
    .toArray();
  var index;

  let doctor_name = "";

  let employee_list = Enumerable.from($this.props.deptanddoctors.doctors)
    .where(w => w.employee_id === row.doctor_id)
    .toArray();
  if (employee_list !== null && employee_list.length > 0) {
    doctor_name = employee_list[0].full_name;
  }

  if (x !== null && x.length > 0) {
    index = $this.state.visitDetails.indexOf(x[0]);
    if (index > -1) {
      $this.state.visitDetails[index]["radioselect"] = 0;
    }
  }
  index = $this.state.visitDetails.indexOf(row);
  $this.state.visitDetails[index]["radioselect"] = 1;
  if (row.insured === "Y") {
    mode_of_pay = "Insurance";
    applydiscount = true;
  }
  $this.setState(
    {
      incharge_or_provider: row.doctor_id,
      visit_id: row.hims_f_patient_visit_id,
      insured: row.insured,
      sec_insured: row.sec_insured,
      mode_of_pay: mode_of_pay,
      doctor_name: doctor_name
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
        uri: "/orderAndPreApproval/selectOrderServices",
        method: "GET",
        data: {
          visit_id: $this.state.visit_id
        },
        onSuccess: response => {
          if (response.data.success) {
            AlgaehLoader({ show: false });
            // if (context !==null) {
            //   context.updateState({ ...response.data.records });
            // }
            let data = response.data.records;

            if (data.length > 0) {
              let pre_approval_Required = Enumerable.from(data)
                .where(w => w.pre_approval === "Y" && w.apprv_status === "NR")
                .toArray();
              for (let i = 0; i < data.length; i++) {
                data[i].ordered_date = data[i].created_date;
              }

              if (pre_approval_Required.length > 0) {
                swalMessage({
                  title:
                    "Some of the service is Pre-Approval required, Please wait for Approval.",
                  type: "warning"
                });
              } else {
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

                      if ($this.state.default_pay_type === "CD") {
                        response.data.records.card_amount = response.data.records.receiveable_amount
                        response.data.records.cash_amount = 0
                      }
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
      incharge_or_provider: row.doctor_id,
      visit_id: row.hims_f_patient_visit_id,
      insured: row.insured,
      sec_insured: row.sec_insured,
      mode_of_pay: mode_of_pay,
      doctor_name: doctor_name,
      addNewService: false
    });
  }
};

export { handleChange };
