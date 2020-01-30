import moment from "moment";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Insurance from "../../../../Search/Insurance.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall.js";
import swal from "sweetalert2";
import { SetBulkState } from "../../../../utils/GlobalFunctions";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";

let texthandlerInterval = null;
const texthandle = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({ [name]: value });
    }
    clearInterval(texthandlerInterval);
  }, 500);
};

const clearinsurancehandle = ($this, context, e) => {
  let ProcessInsure = false;
  if ($this.state.doctor_id === null) {
    ProcessInsure = true;
  } else {
    ProcessInsure = false;
  }

  $this.setState({
    primary_insurance_provider_id: null,
    primary_sub_id: null,
    primary_network_id: null,
    primary_policy_num: null,
    primary_network_office_id: null,
    primary_card_number: null,
    primary_effective_start_date: null,
    primary_effective_end_date: null,
    card_holder_name: null,
    card_holder_age: null,
    card_holder_gender: null,
    card_class: null,
    ProcessInsure: ProcessInsure
  });

  if (context !== null) {
    context.updateState({
      primary_insurance_provider_id: null,
      primary_sub_id: null,
      primary_network_id: null,
      primary_policy_num: null,
      primary_network_office_id: null,
      primary_card_number: null,
      primary_effective_start_date: null,
      primary_effective_end_date: null,
      card_holder_name: null,
      card_holder_age: null,
      card_holder_gender: null,
      card_class: null,
      ProcessInsure: ProcessInsure
    });
  }
};
const insurancehandle = ($this, context, e) => {
  let ProcessInsure = false;
  if ($this.state.doctor_id === null) {
    ProcessInsure = true;
  } else {
    ProcessInsure = false;
  }

  if (e.selected.network_id === $this.state.secondary_network_id) {
    swalMessage({
      title: "Primary and Secondary Insurance Plan cannot be same.",
      type: "warning"
    });
  } else {
    $this.setState(
      {
        primary_insurance_provider_id: e.selected.insurance_provider_id,
        primary_sub_id: e.selected.sub_insurance_provider_id,
        primary_network_id: e.selected.network_id,
        primary_policy_num: e.selected.policy_number,
        primary_network_office_id:
          e.selected.hims_d_insurance_network_office_id,
        primary_card_number: e.selected.card_number,
        primary_effective_start_date: e.selected.primary_effective_start_date,
        primary_effective_end_date: e.selected.primary_effective_end_date,
        card_holder_name: e.selected.card_holder_name,
        ProcessInsure: ProcessInsure
      },
      () => {
        if ($this.state.doctor_id !== null) {
          ProcessInsurance($this, context);
        }
      }
    );

    if (context !== null) {
      context.updateState({
        primary_insurance_provider_id: e.selected.insurance_provider_id,
        primary_sub_id: e.selected.sub_insurance_provider_id,
        primary_network_id: e.selected.network_id,
        primary_policy_num: e.selected.policy_number,
        primary_card_number: e.selected.card_number,
        primary_effective_start_date: e.selected.primary_effective_start_date,
        primary_effective_end_date: e.selected.primary_effective_end_date,
        primary_network_office_id:
          e.selected.hims_d_insurance_network_office_id,
        card_holder_name: e.selected.card_holder_name,
        ProcessInsure: ProcessInsure
      });
    }
  }
};

const datehandle = ($this, context, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({ [e]: moment(ctrl)._d });
    }
    clearInterval(texthandlerInterval);
  }, 500);
};

const enddatehandle = ($this, context, ctrl, e) => {
  if (
    Date.parse(moment(ctrl)._d) >
    Date.parse($this.state.insurance_effective_end_date)
  ) {
    swal({
      title:
        "Selected Date is more than insurance Expiry date Do you want to continue?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willProceed => {
      if (willProceed.value) {
        $this.setState({
          [e]: moment(ctrl)._d
        });

        clearInterval(texthandlerInterval);
        texthandlerInterval = setInterval(() => {
          if (context !== undefined) {
            context.updateState({ [e]: moment(ctrl)._d });
          }
          clearInterval(texthandlerInterval);
        }, 500);
      }
    });
  } else {
    $this.setState({
      [e]: moment(ctrl)._d
    });

    clearInterval(texthandlerInterval);
    texthandlerInterval = setInterval(() => {
      if (context !== undefined) {
        context.updateState({ [e]: moment(ctrl)._d });
      }
      clearInterval(texthandlerInterval);
    }, 500);
  }
};

const InsuranceDetails = ($this, context, e) => {
  let ProcessInsure = false;
  if ($this.state.doctor_id === null) {
    ProcessInsure = true;
  } else {
    ProcessInsure = false;
  }
  AlgaehSearch({
    searchGrid: {
      columns: Insurance
    },
    searchName: "insurance",
    uri: "/gloabelSearch/get",
    inputs: "netoff.hospital_id = " + $this.state.hims_d_hospital_id,
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      if (
        $this.state.secondary_network_id === row.hims_d_insurance_network_id
      ) {
        swalMessage({
          title: "Primary and Secondary Insurance Plan cannot be same.",
          type: "warning"
        });
      } else {
        if (
          Date.parse(row.net_effective_end_date) >
          Date.parse(row.effective_end_date)
        ) {
          swal({
            title:
              "Policy Date is more than insurance Expiry date Do you want to continue?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            confirmButtonColor: "#44b8bd",
            cancelButtonColor: "#d33",
            cancelButtonText: "No"
          }).then(willProceed => {
            if (willProceed.value) {
              let mappingName = "";

              let obj = {
                insurance_provider_id: row.hims_d_insurance_provider_id,
                insurance_provider_name: row.insurance_provider_name,

                sub_insurance_provider_id: row.hims_d_insurance_sub_id,
                sub_insurance_provider_name: row.insurance_sub_name,

                network_id: row.hims_d_insurance_network_id,
                network_office_id: row.hims_d_insurance_network_office_id,
                hims_d_insurance_network_office_id:
                  row.hims_d_insurance_network_office_id,
                network_type: row.network_type,

                policy_number: row.policy_number,
                primary_card_number: row.card_number,
                primary_effective_start_date: row.net_effective_start_date,
                // primary_effective_end_date: row.net_effective_end_date,
                primary_effective_end_date: row.effective_end_date
              };

              let insObj = $this.props.existinsurance || [];
              if (
                $this.props.existinsurance === undefined ||
                $this.props.existinsurance.length === 0
              ) {
                mappingName = "primaryinsurance";
                insObj.push(obj);
              } else {
                mappingName = "existinsurance";
                insObj.push(obj);
              }

              $this.props.setSelectedInsurance({
                redux: {
                  type: "PRIMARY_INSURANCE_DATA",
                  mappingName: mappingName,
                  data: insObj
                },
                afterSuccess: data => {
                  $this.setState(
                    {
                      primary_insurance_provider_id:
                        row.hims_d_insurance_provider_id,
                      primary_sub_id: row.hims_d_insurance_sub_id,
                      primary_network_id: row.hims_d_insurance_network_id,
                      primary_policy_num: row.policy_number,
                      primary_card_number: row.card_number,
                      primary_network_office_id:
                        row.hims_d_insurance_network_office_id,
                      primary_effective_start_date:
                        row.primary_effective_start_date,
                      primary_effective_end_date: row.net_effective_start_date,
                      insurance_effective_end_date: row.effective_end_date,
                      ProcessInsure: ProcessInsure
                    },
                    () => {
                      if ($this.state.doctor_id !== null) {
                        ProcessInsurance($this, context);
                      }
                    }
                  );

                  if (context !== null) {
                    context.updateState({
                      primary_insurance_provider_id:
                        row.hims_d_insurance_provider_id,
                      primary_sub_id: row.hims_d_insurance_sub_id,
                      primary_network_id: row.hims_d_insurance_network_id,
                      primary_policy_num: row.policy_number,
                      primary_card_number: row.card_number,
                      primary_network_office_id:
                        row.hims_d_insurance_network_office_id,
                      primary_effective_start_date:
                        row.net_effective_start_date,
                      primary_effective_end_date: row.net_effective_end_date,
                      insurance_effective_end_date: row.effective_end_date,
                      ProcessInsure: ProcessInsure
                    });
                  }
                }
              });
            }
          });
        } else {
          let mappingName = "";
          let obj = {
            insurance_provider_id: row.hims_d_insurance_provider_id,
            insurance_provider_name: row.insurance_provider_name,

            sub_insurance_provider_id: row.hims_d_insurance_sub_id,
            sub_insurance_provider_name: row.insurance_sub_name,

            network_id: row.hims_d_insurance_network_id,
            network_office_id: row.hims_d_insurance_network_office_id,
            hims_d_insurance_network_office_id:
              row.hims_d_insurance_network_office_id,
            network_type: row.network_type,
            primary_effective_start_date: row.net_effective_start_date,
            primary_effective_end_date: row.net_effective_end_date,
            insurance_effective_end_date: row.effective_end_date,
            primary_card_number: row.card_number,
            policy_number: row.policy_number
          };
          let insObj = $this.props.existinsurance || [];
          if (
            $this.props.existinsurance === undefined ||
            $this.props.existinsurance.length === 0
          ) {
            mappingName = "primaryinsurance";
            insObj.push(obj);
          } else {
            mappingName = "existinsurance";
            insObj.push(obj);
          }

          $this.props.setSelectedInsurance({
            redux: {
              type: "PRIMARY_INSURANCE_DATA",
              mappingName: mappingName,
              data: insObj
            },
            afterSuccess: data => {
              $this.setState(
                {
                  primary_insurance_provider_id:
                    row.hims_d_insurance_provider_id,
                  primary_sub_id: row.hims_d_insurance_sub_id,
                  primary_network_id: row.hims_d_insurance_network_id,
                  primary_policy_num: row.policy_number,
                  primary_network_office_id:
                    row.hims_d_insurance_network_office_id,
                  primary_card_number: row.card_number,
                  primary_effective_start_date: row.net_effective_start_date,
                  primary_effective_end_date: row.net_effective_end_date,
                  insurance_effective_end_date: row.effective_end_date,
                  ProcessInsure: ProcessInsure
                },
                () => {
                  if ($this.state.doctor_id !== null) {
                    ProcessInsurance($this, context);
                  }
                }
              );

              if (context !== null) {
                context.updateState({
                  primary_insurance_provider_id:
                    row.hims_d_insurance_provider_id,
                  primary_sub_id: row.hims_d_insurance_sub_id,
                  primary_network_id: row.hims_d_insurance_network_id,
                  primary_policy_num: row.policy_number,
                  primary_network_office_id:
                    row.hims_d_insurance_network_office_id,
                  primary_card_number: row.card_number,
                  primary_effective_start_date: row.net_effective_start_date,
                  primary_effective_end_date: row.net_effective_end_date,
                  insurance_effective_end_date: row.effective_end_date,
                  ProcessInsure: ProcessInsure
                });
              }
            }
          });
        }
      }
    }
  });
};

const ProcessInsurance = ($this, context) => {
  if (
    $this.state.insured === "Y" &&
    ($this.state.primary_insurance_provider_id == null ||
      $this.state.primary_network_office_id == null ||
      $this.state.primary_network_id == null)
  ) {
    swalMessage({
      title: "Please select the primary insurance details properly.",
      type: "error"
    });
  } else if (
    $this.state.sec_insured === "Y" &&
    ($this.state.secondary_insurance_provider_id == null ||
      $this.state.secondary_network_office_id == null ||
      $this.state.secondary_network_id == null)
  ) {
    swalMessage({
      title: "Please select the secondary insurance details properly.",
      type: "error"
    });
  } else {
    let serviceInput = [
      {
        insured: $this.state.insured,
        vat_applicable: $this.state.vat_applicable,
        hims_d_services_id: $this.state.hims_d_services_id,
        primary_insurance_provider_id:
          $this.state.primary_insurance_provider_id,
        primary_network_office_id: $this.state.primary_network_office_id,
        primary_network_id: $this.state.primary_network_id,
        sec_insured: $this.state.sec_insured,
        secondary_insurance_provider_id:
          $this.state.secondary_insurance_provider_id,
        secondary_network_id: $this.state.secondary_network_id,
        secondary_network_office_id: $this.state.secondary_network_office_id,
        FollowUp: $this.state.follow_up
      }
    ];

    AlgaehLoader({ show: true });
    algaehApiCall({
      uri: "/billing/getBillDetails",
      module: "billing",
      method: "POST",
      data: serviceInput,
      onSuccess: response => {
        if (response.data.success) {
          // response.data.records.billdetails[0].insured =
          //   response.data.records.billdetails[0].insurance_yesno;
          $this.setState({ ...response.data.records });
          if (context !== null) {
            context.updateState({ ...response.data.records });
          }

          algaehApiCall({
            uri: "/billing/billingCalculations",
            module: "billing",
            method: "POST",
            data: response.data.records,
            onSuccess: response => {
              if (response.data.success) {
                response.data.records.saveEnable = false;
                response.data.records.ProcessInsure = true;
                $this.setState({ ...response.data.records });
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
};

const radioChange = ($this, context, e) => {
  let value = e.target.value;
  // let name = e.target.name;
  SetBulkState({
    state: $this,
    callback: () => {
      if (
        $this.state.full_name === null ||
        $this.state.full_name === "" ||
        ($this.state.arabic_name === null || $this.state.arabic_name === "") ||
        $this.state.title_id === null ||
        $this.state.gender === null ||
        $this.state.primary_identity_id === null ||
        ($this.state.primary_id_no === null ||
          $this.state.primary_id_no === "") ||
        $this.state.nationality_id === null ||
        $this.state.country_id === null ||
        $this.state.contact_number === null ||
        $this.state.age === null
      ) {
        swalMessage({
          type: "warning",
          title: "Enter the Demographic Details."
        });

        return;
      }
      let PatType = null;
      let saveEnable = false;
      let ProcessInsure = false;

      if (value === "Y") {
        PatType = "I";
        saveEnable = true;
        if ($this.state.doctor_id === null) {
          ProcessInsure = true;
        } else {
          ProcessInsure = false;
        }
        if ($this.state.hims_d_patient_id !== null) {
          $this.props.getPatientInsurance({
            // uri: "/insurance/getPatientInsurance",
            uri: "/patientRegistration/getPatientInsurance",
            module: "frontDesk",
            method: "GET",
            data: {
              patient_id: $this.state.hims_d_patient_id
            },
            redux: {
              type: "EXIT_INSURANCE_GET_DATA",
              mappingName: "existinsurance"
            }
          });
        }
      } else {
        PatType = "S";
        if ($this.state.doctor_id === null) {
          saveEnable = true;
        }
        $this.props.setSelectedInsurance({
          redux: {
            type: "PRIMARY_INSURANCE_DATA",
            mappingName: "primaryinsurance",
            data: []
          }
        });

        $this.props.setSelectedInsurance({
          redux: {
            type: "EXIT_INSURANCE_GET_DATA",
            mappingName: "existinsurance",
            data: []
          }
        });
      }

      $this.setState(
        {
          insured: value,
          insuranceYes: !$this.state.insuranceYes,
          saveEnable: saveEnable,

          primary_insurance_provider_id: null,
          primary_sub_id: null,
          primary_network_id: null,
          primary_policy_num: null,
          primary_network_office_id: null,
          primary_card_number: null,
          primary_effective_start_date: null,
          primary_effective_end_date: null,
          patInsuranceFrontImg: undefined
        },
        () => {
          if (value !== "Y") {
            if ($this.state.doctor_id !== null) {
              ProcessInsurance($this, context);
            }
          }
        }
      );

      if (context !== null) {
        context.updateState({
          ...$this.state,
          insured: value,
          insuranceYes: !$this.state.insuranceYes,
          payment_type: PatType,
          saveEnable: saveEnable,
          ProcessInsure: ProcessInsure,
          primary_insurance_provider_id: null,
          primary_sub_id: null,
          primary_network_id: null,
          primary_policy_num: null,
          primary_network_office_id: null,
          primary_card_number: null,
          primary_effective_start_date: null,
          primary_effective_end_date: null,
          patInsuranceFrontImg: undefined,
          eligible: "N",
          eligible_reference_number: null,
          checked_eligible: false
        });
      }
    }
  });
};

const getInsuranceCardClass = $this => {
  $this.props.getInsuranceCardClass({
    uri: "/InsuranceCardClass/getInsuranceCardClass",
    module: "masterSettings",
    method: "GET",
    redux: {
      type: "INSURSNCE_CARD_CLASS_GET_DATA",
      mappingName: "insurancecardclass"
    }
  });
};
export {
  insurancehandle,
  texthandle,
  datehandle,
  InsuranceDetails,
  radioChange,
  enddatehandle,
  getInsuranceCardClass,
  clearinsurancehandle
};
