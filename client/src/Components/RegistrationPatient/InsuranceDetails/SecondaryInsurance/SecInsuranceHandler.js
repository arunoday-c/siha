import moment from "moment";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Insurance from "../../../../Search/Insurance.json";
import { swalMessage } from "../../../../utils/algaehApiCall.js";

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

  if (context != null) {
    context.updateState({ [name]: value });
  }
};

const insurancehandle = ($this, context, e) => {
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

  if (context != null) {
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
};

const datehandle = ($this, context, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });

  if (context != null) {
    context.updateState({ [e]: moment(ctrl)._d });
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
          type: "SECONDARY_INSURANCE_DATA",
          mappingName: "secondaryinsurance",
          data: [obj]
        }
      });

      $this.setState({
        secondary_insurance_provider_id: row.hims_d_insurance_provider_id,
        secondary_sub_id: row.hims_d_insurance_sub_id,
        secondary_network_id: row.hims_d_insurance_network_id,
        secondary_policy_num: row.policy_number,
        secondary_network_office_id: row.hims_d_insurance_network_office_id
        // secondary_effective_start_date: e.selected.effective_start_date,
        // secondary_effective_end_date: e.selected.effective_end_date
      });

      if (context != null) {
        context.updateState({
          secondary_insurance_provider_id: row.hims_d_insurance_provider_id,
          secondary_sub_id: row.hims_d_insurance_sub_id,
          secondary_network_id: row.hims_d_insurance_network_id,
          secondary_policy_num: row.policy_number,
          secondary_network_office_id: row.hims_d_insurance_network_office_id
          // secondary_card_number: e.selected.card_number
          // secondary_effective_start_date: e.selected.effective_start_date,
          // secondary_effective_end_date: e.selected.effective_end_date
        });
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
      radioSecYes: radioSecYes
    });

    if (context != null) {
      context.updateState({
        [e.target.name]: e.target.value,
        sec_insuranceYes: !$this.state.sec_insuranceYes,
        saveEnable: saveEnable,
        ProcessInsure: ProcessInsure,
        radioSecNo: radioSecNo,
        radioSecYes: radioSecYes
      });
    }
  } else {
    swalMessage({
      title:
        "Invalid Input. With out primary insurance cannot select secondary insurance",
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
