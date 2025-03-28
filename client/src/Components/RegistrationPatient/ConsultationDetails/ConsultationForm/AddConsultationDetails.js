import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import Enumerable from "linq";
import {
  SetBulkState,
  AlgaehValidation,
} from "../../../../utils/GlobalFunctions";
import moment from "moment";

const DeptselectedHandeler = ($this, context, e) => {
  let primary_policy_num = $this.state.primary_policy_num;
  SetBulkState({
    state: $this,
    callback: () => {
      AlgaehValidation({
        alertTypeIcon: "warning",
        querySelector: "data-validate='demographicDetails'",
        onSuccess: () => {
          if ($this.state.visit_type === null) {
            context.updateState({
              [e.name]: null,
            });
            swalMessage({
              title: "Please select Visit Type.",
              type: "error",
            });
            document.querySelector("[name='visit_type']").focus();
            return;
          }
          if (
            $this.state.insured === "Y" &&
            ($this.state.primary_insurance_provider_id === null ||
              $this.state.primary_network_office_id === null ||
              $this.state.primary_network_id === null ||
              $this.state.primary_card_number === null ||
              $this.state.primary_card_number === "")
          ) {
            context.updateState({
              [e.name]: null,
            });
            swalMessage({
              title: "Please select the insurance details properly.",
              type: "error",
            });
          } else {
            let dept = Enumerable.from($this.props.deptanddoctors.departmets)
              .where((w) => w.sub_department_id === e.value)
              .firstOrDefault();

            $this.setState({
              [e.name]: e.value,
              department_id: e.selected.department_id,
              department_type: e.selected.department_type,
              doctors: dept.doctors,
              doctor_id: null,
              primary_policy_num: primary_policy_num,
            });
            if (context !== null) {
              context.updateState({
                ...$this.state,
                [e.name]: e.value,
                department_id: e.selected.department_id,
                department_type: e.selected.department_type,
                doctors: dept.doctors,
                primary_policy_num: primary_policy_num,
                doctor_id: null,

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
                unbalanced_amount: 0,
              });
            }
          }
        },
        onCatch: () => {
          $this.setState({
            [e.name]: null,
          });
          if (context !== null) {
            context.updateState({
              ...$this.state,
              [e.name]: null,
            });
          }
        },
      });
    },
  });
};

export const clearBillDetails = (context, ...args) => {
  //Takes context and field names as arguements, pass whatever fields you want to keep in the state.
  const removeObj = {
    // visit_type: null,
    doctor_id: null,
    sub_department_id: null,
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
    unbalanced_amount: 0,
  };

  args.forEach((arg) => {
    delete removeObj[arg];
  });

  context.updateState(removeObj);
};

const selectedHandeler = ($this, context, e) => {
  let primary_policy_num = $this.state.primary_policy_num;
  SetBulkState({
    state: $this,
    callback: () => {
      AlgaehValidation({
        alertTypeIcon: "warning",
        querySelector: "data-validate='demographicDetails'",
        onSuccess: () => {
          if (
            $this.state.insured === "Y" &&
            ($this.state.primary_insurance_provider_id === null ||
              $this.state.primary_network_office_id === null ||
              $this.state.primary_network_id === null ||
              $this.state.primary_card_number === null ||
              $this.state.primary_card_number === "")
          ) {
            context.updateState({
              [e.name]: null,
            });
            swalMessage({
              title: "Please select the insurance details properly.",
              type: "error",
            });
          } else {
            if (e.value === undefined) {
              $this.setState(
                {
                  visit_type: null,
                  sub_department_id: null,
                  doctor_id: null,
                  visittypeselect: true
                },
                () => {
                  if (context !== null) {
                    context.updateState({
                      ...$this.state,
                      visit_type: null,
                      primary_policy_num: primary_policy_num,
                      unbalanced_amount: 0,
                    });
                  }
                  clearBillDetails(context);
                }
              );
            } else {
              $this.setState(
                {
                  [e.name]: e.value,
                  visittypeselect: false,
                  consultation: e.selected.consultation,
                  primary_policy_num: primary_policy_num,
                  unbalanced_amount: 0,
                  sub_department_id: null,
                  doctor_id: null
                },
                () => {
                  if (context !== null) {
                    context.updateState({
                      ...$this.state,
                      primary_policy_num: primary_policy_num,
                      unbalanced_amount: 0,
                    });
                  }
                  clearBillDetails(context);

                  $this.props.getDepartmentsandDoctors({
                    uri: "/department/get/get_All_Doctors_DepartmentWise",
                    module: "masterSettings",
                    method: "GET",
                    redux: {
                      type: "DEPT_DOCTOR_GET_DATA",
                      mappingName: "deptanddoctors",
                    },
                  });
                }
              );
            }
          }
        },
        onCatch: () => {
          $this.setState({
            [e.name]: null,
          });
          if (context !== null) {
            context.updateState({
              ...$this.state,
              [e.name]: null,
              primary_policy_num: primary_policy_num,
              unbalanced_amount: 0,
            });
          }
        },
      });
    },
  });
};

const doctorselectedHandeler = ($this, context, e) => {
  let primary_policy_num = $this.state.primary_policy_num;
  SetBulkState({
    state: $this,
    callback: () => {
      AlgaehValidation({
        alertTypeIcon: "warning",
        querySelector: "data-validate='demographicDetails'",
        onSuccess: () => {
          if ($this.state.visit_type === null) {
            context.updateState({
              [e.name]: null,
            });
            swalMessage({
              title: "Please select Visit Type.",
              type: "error",
            });
            document.querySelector("[name='visit_type']").focus();
            return;
          }
          if (
            $this.state.insured === "Y" &&
            ($this.state.primary_insurance_provider_id == null ||
              $this.state.primary_network_office_id == null ||
              $this.state.primary_network_id == null ||
              $this.state.primary_card_number === null ||
              $this.state.primary_card_number === "")
          ) {
            $this.setState(
              {
                [e.name]: null,
              },
              () => {
                context.updateState({
                  [e.name]: null,
                  primary_policy_num: primary_policy_num,
                });
                swalMessage({
                  title:
                    "Please select the insurance details properly.",
                  type: "error",
                });
              }
            );

            return;
          }

          let sub_department_id = "";
          let department_type = "";
          let department_id = "";
          sub_department_id = e.selected.sub_department_id;
          department_type = e.selected.department_type;
          department_id = e.selected.department_id;

          let doctor_name = e.selected.full_name;

          if ($this.state.hims_d_patient_id != null) {
            if (e.selected.services_id !== null) {
              let intputObj = {
                sub_department_id: sub_department_id,
                doctor_id: e.value,
                patient_id: $this.state.patient_id,
              };
              algaehApiCall({
                uri: "/visit/checkVisitExists",
                module: "frontDesk",
                method: "get",
                data: intputObj,
                onSuccess: (response) => {
                  if (response.data.success === true) {
                    if (response.data.records.length > 0) {
                      swalMessage({
                        title: "Visit already exists for select Doctor",
                        type: "warning",
                      });
                    } else {
                      $this.setState(
                        {
                          [e.name]: e.value,
                          visittypeselect: false,
                          hims_d_services_id: e.selected.services_id,
                          incharge_or_provider: e.value,
                          provider_id: e.value,
                          doctor_name: doctor_name,
                          saveEnable: false,
                          billdetail: false,
                          sub_department_id: sub_department_id,
                          department_type: department_type,
                          department_id: department_id,
                          primary_policy_num: primary_policy_num,
                        },
                        () => {
                          if (
                            $this.state.existing_plan !== "Y" &&
                            $this.state.consultation !== "N"
                          ) {
                            generateBillDetails($this, context);
                          }
                        }
                      );
                      if (context !== null) {
                        context.updateState({
                          ...$this.state,
                          [e.name]: e.value,
                          hims_d_services_id: e.selected.services_id,
                          incharge_or_provider: e.value,
                          provider_id: e.value,
                          doctor_name: doctor_name,
                          saveEnable: false,
                          billdetail: false,
                          sub_department_id: sub_department_id,
                          department_type: department_type,
                          department_id: department_id,
                          primary_policy_num: primary_policy_num,
                        });
                      }
                    }
                  } else {
                    $this.setState(
                      {
                        [e.name]: null,
                      },
                      () => {
                        swalMessage({
                          title: response.data.message,
                          type: "warning",
                        });
                      }
                    );
                  }
                },
                onFailure: (error) => {
                  swalMessage({
                    title: error.message,
                    type: "error",
                  });
                },
              });
            } else {
              $this.setState({
                [e.name]: null,
              });
              swalMessage({
                title: "No Service defined for the selected doctor.",
                type: "warning",
              });
            }
          } else {
            if (e.selected.services_id !== null) {
              $this.setState(
                {
                  [e.name]: e.value,
                  visittypeselect: false,
                  hims_d_services_id: e.selected.services_id,
                  incharge_or_provider: e.value,
                  provider_id: e.value,
                  doctor_name: doctor_name,
                  saveEnable: false,
                  billdetail: false,
                  sub_department_id: sub_department_id,
                  department_type: department_type,
                  department_id: department_id,
                  primary_policy_num: primary_policy_num,
                },
                () => {
                  if ($this.state.consultation !== "N") {
                    generateBillDetails($this, context);
                  }
                }
              );
              if (context !== null) {
                context.updateState({
                  ...$this.state,
                  [e.name]: e.value,
                  hims_d_services_id: e.selected.services_id,
                  incharge_or_provider: e.value,
                  provider_id: e.value,
                  doctor_name: doctor_name,
                  saveEnable: false,
                  billdetail: false,
                  sub_department_id: sub_department_id,
                  department_type: department_type,
                  department_id: department_id,
                  primary_policy_num: primary_policy_num,
                });
              }
            } else {
              $this.setState({
                [e.name]: null,
              });
              if (context !== null) {
                context.updateState({
                  [e.name]: e.value,
                  primary_policy_num: primary_policy_num,
                });
              }
              swalMessage({
                title: "No Service defined for the selected doctor.",
                type: "warning",
              });
            }
          }
        },
        onCatch: () => {
          $this.setState({
            [e.name]: null,
          });
          if (context !== null) {
            context.updateState({
              ...$this.state,
              [e.name]: null,
            });
          }
        },
      });
    },
  });
};

const generateBillDetails = ($this, context) => {
  let zeroBill = false;
  let DoctorVisits = Enumerable.from($this.state.visitDetails)
    .where((w) => w.doctor_id === $this.state.doctor_id)
    .toArray();

  let FollowUp = false;
  let currentDate = moment(new Date()).format("YYYY-MM-DD");
  let expiryDate = 0;
  if (DoctorVisits.length > 0) {
    expiryDate = Enumerable.from(DoctorVisits).max((s) => s.visit_expiery_date);
  }

  if (
    ($this.state.department_type === "D" &&
      $this.state.existing_plan === "Y") ||
    $this.state.from_package === true
  ) {
    zeroBill = true;
  } else {
    if (expiryDate > currentDate) {
      FollowUp = true;
    }
  }

  let serviceInput = [
    {
      zeroBill: zeroBill,
      FollowUp: FollowUp,
      insured: $this.state.insured,
      vat_applicable: $this.state.vat_applicable,
      hims_d_services_id: $this.state.hims_d_services_id,
      service_type_id: $this.state.service_type_id,
      primary_insurance_provider_id: $this.state.primary_insurance_provider_id,
      primary_network_office_id: $this.state.primary_network_office_id,
      primary_network_id: $this.state.primary_network_id,
      sec_insured: $this.state.sec_insured,
      secondary_insurance_provider_id:
        $this.state.secondary_insurance_provider_id,
      secondary_network_id: $this.state.secondary_network_id,
      secondary_network_office_id: $this.state.secondary_network_office_id,
    },
  ];

  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/billing/getBillDetails",
    module: "billing",
    method: "POST",
    data: serviceInput,
    onSuccess: (response) => {
      if (response.data.success) {
        response.data.records.follow_up = FollowUp;
        response.data.records.existing_treat = zeroBill;

        if (context !== null) {
          context.updateState({ ...response.data.records });
        }

        algaehApiCall({
          uri: "/billing/billingCalculations",
          module: "billing",
          method: "POST",
          data: response.data.records,
          onSuccess: (response) => {
            if (response.data.success) {
              if ($this.state.default_pay_type === "CD") {
                response.data.records.card_amount =
                  response.data.records.receiveable_amount;
                response.data.records.cash_amount = 0;
              }
              // response.data.records.Cashchecked =
              //   $this.state.default_pay_type.default_pay_type === "CH" ? true : false
              // response.data.records.Cardchecked =
              //   $this.state.default_pay_type.default_pay_type === "CD" ? true : false
              if (context !== null) {
                context.updateState({ ...response.data.records });
              }
            }

            AlgaehLoader({ show: false });
          },
          onFailure: (error) => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.message,
              type: "error",
            });
          },
        });
      }
    },
    onFailure: (error) => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
};

const radioChange = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = "N";
  if (name === "maternity_patient_yes") {
    $this.setState({
      maternity_patient: value,
      checked_maternity_patient: !$this.state.checked_maternity_patient,
    });
    if (context !== null) {
      context.updateState({
        maternity_patient: value,
        checked_maternity_patient: !$this.state.checked_maternity_patient,
      });
    }
  } else if (name === "existing_plan") {
    if ($this.state.doctor_id === null) {
      swalMessage({
        title: "Select The doctor...",
        type: "warning",
      });
      return;
    }
    let checked_existing_plan = false;
    if ($this.state.checked_existing_plan === false) {
      checked_existing_plan = true;
      value = "Y";
    }
    $this.setState(
      {
        [name]: value,
        checked_existing_plan: checked_existing_plan,
      },
      () => {
        getTreatementPlans($this);
        // if ($this.state.doctor_id !== null) {
        //   generateBillDetails($this, context);
        // }
      }
    );
    if (context !== null) {
      context.updateState({
        [name]: value,
        checked_existing_plan: checked_existing_plan,
      });
    }
  } else if (name === "eligible") {
    let checked_eligible = false;
    if ($this.state.checked_eligible === false) {
      checked_eligible = true;
      value = "Y";
    }
    $this.setState({
      eligible: value,
      checked_eligible: checked_eligible,
    });
    if (context !== null) {
      context.updateState({
        eligible: value,
        checked_eligible: checked_eligible,
      });
    }
  }
};

const getTreatementPlans = ($this) => {
  $this.props.getTreatmentPlan({
    uri: "/dental/getTreatmentPlan",
    method: "GET",
    data: {
      patient_id: $this.state.hims_d_patient_id,
      plan_status: "O",
    },
    redux: {
      type: "DENTAL_PLAN_DATA",
      mappingName: "dentalplans",
    },
  });
};

const texthandle = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
  });

  if (context !== null) {
    context.updateState({
      [name]: value,
    });
  }
};

export {
  DeptselectedHandeler,
  selectedHandeler,
  doctorselectedHandeler,
  radioChange,
  texthandle,
  generateBillDetails,
};
