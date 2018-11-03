import moment from "moment";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Insurance from "../../../../Search/Insurance.json";
import { swalMessage } from "../../../../utils/algaehApiCall.js";

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
  }, 1000);
};

const insurancehandle = ($this, context, e) => {
  if (e.selected.network_id === $this.state.secondary_network_id) {
    swalMessage({
      title:
        "Invalid Input. Primary and Secondary Insurance Plan cannot be same.",
      type: "warning"
    });
  } else {
    $this.setState({
      primary_insurance_provider_id: e.selected.insurance_provider_id,
      primary_sub_id: e.selected.sub_insurance_provider_id,
      primary_network_id: e.selected.network_id,
      primary_policy_num: e.selected.policy_number,
      primary_card_number: e.selected.card_number,
      primary_effective_start_date: e.selected.effective_start_date,
      primary_effective_end_date: e.selected.effective_end_date
    });

    if (context != null) {
      context.updateState({
        primary_insurance_provider_id: e.selected.insurance_provider_id,
        primary_sub_id: e.selected.sub_insurance_provider_id,
        primary_network_id: e.selected.network_id,
        primary_policy_num: e.selected.policy_number,
        primary_card_number: e.selected.card_number,
        primary_effective_start_date: e.selected.effective_start_date,
        primary_effective_end_date: e.selected.effective_end_date,
        primary_network_office_id: e.selected.network_id
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
  }, 1000);
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
      if (
        $this.state.secondary_network_id === row.hims_d_insurance_network_id
      ) {
        swalMessage({
          title:
            "Invalid Input. Primary and Secondary Insurance Plan cannot be same.",
          type: "warning"
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

        $this.props.setSelectedInsurance({
          redux: {
            type: "PRIMARY_INSURANCE_DATA",
            mappingName: "primaryinsurance",
            data: [obj]
          },
          afterSuccess: data => {
            $this.setState({
              primary_insurance_provider_id: row.hims_d_insurance_provider_id,
              primary_sub_id: row.hims_d_insurance_sub_id,
              primary_network_id: row.hims_d_insurance_network_id,
              primary_policy_num: row.policy_number,
              primary_network_office_id: row.hims_d_insurance_network_office_id
              // primary_effective_start_date: e.selected.effective_start_date,
              // primary_effective_end_date: e.selected.effective_end_date
            });

            if (context != null) {
              context.updateState({
                primary_insurance_provider_id: row.hims_d_insurance_provider_id,
                primary_sub_id: row.hims_d_insurance_sub_id,
                primary_network_id: row.hims_d_insurance_network_id,
                primary_policy_num: row.policy_number,
                primary_network_office_id:
                  row.hims_d_insurance_network_office_id

                // primary_effective_start_date: e.selected.effective_start_date,
                // primary_effective_end_date: e.selected.effective_end_date
              });
            }
          }
        });
      }
    }
  });
};

const radioChange = ($this, context, e) => {
  if ($this.state.doctor_id !== null) {
    debugger;
    let PatType = null;
    let saveEnable = false;
    let ProcessInsure = false;
    let value = e.target.value;
    let radioNo, radioYes;
    if (value === "Y") {
      PatType = "I";
      saveEnable = true;
      ProcessInsure = false;
      radioNo = false;
      radioYes = true;
    } else {
      PatType = "S";
      saveEnable = false;
      ProcessInsure = true;
      radioNo = true;
      radioYes = false;
    }

    $this.setState({
      [e.target.name]: e.target.value,
      insuranceYes: !$this.state.insuranceYes,
      saveEnable: saveEnable,
      radioNo: radioNo,
      radioYes: radioYes,
      primary_insurance_provider_id: null,
      primary_sub_id: null,
      primary_network_id: null,
      primary_policy_num: null,
      primary_network_office_id: null,
      primary_card_number: null,
      primary_effective_start_date: null,
      primary_effective_end_date: null
    });

    if (context != null) {
      context.updateState({
        [e.target.name]: e.target.value,
        insuranceYes: !$this.state.insuranceYes,
        payment_type: PatType,
        saveEnable: saveEnable,
        ProcessInsure: ProcessInsure,
        radioNo: radioNo,
        radioYes: radioYes,
        primary_insurance_provider_id: null,
        primary_sub_id: null,
        primary_network_id: null,
        primary_policy_num: null,
        primary_network_office_id: null,
        primary_card_number: null,
        primary_effective_start_date: null,
        primary_effective_end_date: null
      });
    }
  } else {
    swalMessage({
      title: "Invalid Input. Please select the consultant doctor.",
      type: "warning"
    });
  }
};
export {
  insurancehandle,
  texthandle,
  datehandle,
  InsuranceDetails,
  radioChange
};
