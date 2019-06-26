import moment from "moment";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Insurance from "../../../../Search/Insurance.json";
import { swalMessage } from "../../../../utils/algaehApiCall.js";
import swal from "sweetalert2";

let texthandlerInterval = null;

const texthandle = ($this, context, e) => {
  let name;
  let value;
  if (e.name != null) {
    name = e.name;
    value = e.value;
  } else {
    name = e.target.name;
    value = e.target.value;
  }

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

const insurancehandle = ($this, context, e) => {
  if (e.selected.network_id === $this.state.primary_network_id) {
    swalMessage({
      title: "Primary and Secondary Insurance Plan cannot be same.",
      type: "warning"
    });
  } else {
    $this.setState({
      secondary_insurance_provider_id: e.selected.insurance_provider_id,
      secondary_sub_id: e.selected.sub_insurance_provider_id,
      secondary_network_id: e.selected.network_id,
      secondary_policy_num: e.selected.policy_number,
      secondary_card_number: e.selected.card_number,
      secondary_effective_start_date: e.selected.effective_start_date,
      secondary_effective_end_date: e.selected.effective_end_date,
      secondary_network_office_id: e.selected.network_id
    });

    if (context !== null) {
      context.updateState({
        secondary_insurance_provider_id: e.selected.insurance_provider_id,
        secondary_sub_id: e.selected.sub_insurance_provider_id,
        secondary_network_id: e.selected.network_id,
        secondary_policy_num: e.selected.policy_number,
        secondary_card_number: e.selected.card_number,
        secondary_effective_start_date: e.selected.effective_start_date,
        secondary_effective_end_date: e.selected.effective_end_date,
        secondary_network_office_id: e.selected.network_id
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
    Date.parse($this.state.sec_insurance_effective_end_date)
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
  AlgaehSearch({
    searchGrid: {
      columns: Insurance
    },
    searchName: "insurance",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      if (row.hims_d_insurance_network_id === $this.state.primary_network_id) {
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
              let obj = {
                insurance_provider_id: row.hims_d_insurance_provider_id,
                insurance_provider_name: row.insurance_provider_name,

                sub_insurance_provider_id: row.hims_d_insurance_sub_id,
                sub_insurance_provider_name: row.insurance_sub_name,

                network_id: row.hims_d_insurance_network_id,
                network_type: row.network_type,

                policy_number: row.policy_number
              };

              let mappingName = "";
              let insObj = $this.props.existinsurance || [];
              if (
                $this.props.existinsurance === undefined ||
                $this.props.existinsurance.length === 0
              ) {
                mappingName = "secondaryinsurance";
                insObj.push(obj);
              } else {
                mappingName = "existinsurance";
                insObj.push(obj);
              }

              $this.props.setSelectedInsurance({
                redux: {
                  type: "SECONDARY_INSURANCE_DATA",
                  mappingName: mappingName,
                  data: insObj
                }
              });

              $this.props.setSelectedInsurance({
                redux: {
                  type: "SECONDARY_INSURANCE_DATA",
                  mappingName: mappingName,
                  data: [obj]
                }
              });

              $this.setState({
                secondary_insurance_provider_id:
                  row.hims_d_insurance_provider_id,
                secondary_sub_id: row.hims_d_insurance_sub_id,
                secondary_network_id: row.hims_d_insurance_network_id,
                secondary_policy_num: row.policy_number,
                secondary_network_office_id:
                  row.hims_d_insurance_network_office_id,
                secondary_effective_start_date: row.net_effective_start_date,
                secondary_effective_end_date: row.net_effective_end_date,
                sec_insurance_effective_end_date: row.net_effective_end_date
              });

              if (context !== null) {
                context.updateState({
                  secondary_insurance_provider_id:
                    row.hims_d_insurance_provider_id,
                  secondary_sub_id: row.hims_d_insurance_sub_id,
                  secondary_network_id: row.hims_d_insurance_network_id,
                  secondary_policy_num: row.policy_number,
                  secondary_network_office_id:
                    row.hims_d_insurance_network_office_id,

                  secondary_effective_start_date: row.net_effective_start_date,
                  secondary_effective_end_date: row.net_effective_end_date,
                  sec_insurance_effective_end_date: row.net_effective_end_date
                });
              }
            }
          });
        } else {
          let obj = {
            insurance_provider_id: row.hims_d_insurance_provider_id,
            insurance_provider_name: row.insurance_provider_name,

            sub_insurance_provider_id: row.hims_d_insurance_sub_id,
            sub_insurance_provider_name: row.insurance_sub_name,

            network_id: row.hims_d_insurance_network_id,
            network_type: row.network_type,

            policy_number: row.policy_number
          };

          let mappingName = "";
          let insObj = $this.props.existinsurance || [];
          if (
            $this.props.existinsurance === undefined ||
            $this.props.existinsurance.length === 0
          ) {
            mappingName = "secondaryinsurance";
            insObj.push(obj);
          } else {
            mappingName = "existinsurance";
            insObj.push(obj);
          }

          $this.props.setSelectedInsurance({
            redux: {
              type: "SECONDARY_INSURANCE_DATA",
              mappingName: mappingName,
              data: insObj
            }
          });

          $this.setState({
            secondary_insurance_provider_id: row.hims_d_insurance_provider_id,
            secondary_sub_id: row.hims_d_insurance_sub_id,
            secondary_network_id: row.hims_d_insurance_network_id,
            secondary_policy_num: row.policy_number,
            secondary_network_office_id: row.hims_d_insurance_network_office_id,
            secondary_effective_start_date: row.net_effective_start_date,
            secondary_effective_end_date: row.net_effective_end_date,
            sec_insurance_effective_end_date: row.net_effective_end_date
          });

          if (context !== null) {
            context.updateState({
              secondary_insurance_provider_id: row.hims_d_insurance_provider_id,
              secondary_sub_id: row.hims_d_insurance_sub_id,
              secondary_network_id: row.hims_d_insurance_network_id,
              secondary_policy_num: row.policy_number,
              secondary_network_office_id:
                row.hims_d_insurance_network_office_id,

              secondary_effective_start_date: row.net_effective_start_date,
              secondary_effective_end_date: row.net_effective_end_date,
              sec_insurance_effective_end_date: row.net_effective_end_date
            });
          }
        }
      }
    }
  });
};

const radioChange = ($this, context, e) => {
  if ($this.state.insured === "Y") {
    let saveEnable = false;
    let ProcessInsure = false;
    let value = e.target.value;
    let radioSecNo, radioSecYes;

    // this.state.saveEnable === false &&
    if (value === "Y") {
      saveEnable = true;
      ProcessInsure = false;
      radioSecNo = false;
      radioSecYes = true;
    } else {
      saveEnable = false;
      ProcessInsure = true;
      radioSecNo = true;
      radioSecYes = false;
    }
    $this.setState({
      [e.target.name]: e.target.value,
      sec_insuranceYes: !$this.state.sec_insuranceYes,
      saveEnable: saveEnable,
      radioSecNo: radioSecNo,
      radioSecYes: radioSecYes,
      secondary_insurance_provider_id: null,
      secondary_sub_id: null,
      secondary_network_id: null,
      secondary_policy_num: null,
      secondary_network_office_id: null,
      secondary_card_number: null,
      secondary_effective_start_date: null,
      secondary_effective_end_date: null
    });

    if (context !== null) {
      context.updateState({
        [e.target.name]: e.target.value,
        sec_insuranceYes: !$this.state.sec_insuranceYes,
        saveEnable: saveEnable,
        ProcessInsure: ProcessInsure,
        radioSecNo: radioSecNo,
        radioSecYes: radioSecYes,
        secondary_insurance_provider_id: null,
        secondary_sub_id: null,
        secondary_network_id: null,
        secondary_policy_num: null,
        secondary_network_office_id: null,
        secondary_card_number: null,
        secondary_effective_start_date: null,
        secondary_effective_end_date: null
      });
    }
  } else {
    swalMessage({
      title: "With out primary insurance cannot select secondary insurance",
      type: "warning"
    });
  }
};

export {
  insurancehandle,
  texthandle,
  datehandle,
  InsuranceDetails,
  radioChange,
  enddatehandle
};
