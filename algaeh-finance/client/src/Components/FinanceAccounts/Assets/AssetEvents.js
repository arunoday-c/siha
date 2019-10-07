import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

export function getAssetsAccounts(callBack) {
  debugger;
  algaehApiCall({
    uri: "/finance/getAccountHeads",
    data: { account_level: "0", finance_account_head_id: "1" },
    method: "GET",
    module: "finance",
    onSuccess: response => {
      debugger;
      if (response.data.success === true) {
        callBack(response.data.result);
      }
    },
    onFailure: error => {
      swalMessage({
        type: "error",
        title: error.response.data.message || error.message
      });
    }
  });
}
