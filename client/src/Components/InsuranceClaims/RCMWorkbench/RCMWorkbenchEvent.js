import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

export function texthandle(e) {
  let name = e.target.name;
  let value = e.target.value;
  this.validatedClaims = []
  this.setState({
    [name]: value,
    claims: []
  });
}

export function ClaimSearch(e) {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Insurance.InsuranceStatement,
    },
    searchName: "InsuranceStatement",
    uri: "/gloabelSearch/get",
    // inputs: input,
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      debugger
      algaehApiCall({
        uri: "/insurance/getInsuranceStatement",
        module: "insurance",
        data: { hims_f_insurance_statement_id: row.hims_f_insurance_statement_id },
        method: "GET",
        onSuccess: (response) => {
          if (response.data.success) {
            this.setState({
              ...response.data.records,
            });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    },
  });
}

