import moment from "moment";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Insurance from "../../../../Search/Insurance.json";

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
// const texthandle = ($this, context, e) => {
//   let name;
//   let value;
//   if (e.name != null) {
//     name = e.name;
//     value = e.value;
//   } else {
//     name = e.target.name;
//     value = e.target.value;
//   }

//   $this.setState({
//     [name]: value
//   });

//   if (context != null) {
//     context.updateState({ [name]: value });
//   }
// };

const insurancehandle = ($this, context, e) => {
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
          type: "PRIMARY_INSURANCE_DATA",
          mappingName: "primaryinsurance",
          data: [obj]
        }
      });

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
          primary_network_office_id: row.hims_d_insurance_network_office_id

          // primary_effective_start_date: e.selected.effective_start_date,
          // primary_effective_end_date: e.selected.effective_end_date
        });
      }
    }
  });
};

export { insurancehandle, texthandle, datehandle, InsuranceDetails };
