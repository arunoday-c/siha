import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

export function getAssetsAccounts(callBack) {
  algaehApiCall({
    uri: "/finance/getAccountHeads",
    data: { account_level: "0", finance_account_head_id: "1" },
    method: "GET",
    module: "finance",
    onSuccess: response => {
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

export function AddNewAccountDetails(data, error, result) {
  debugger
  algaehApiCall({
    uri: "/finance/addAccountHeads",
    method: "POST",
    data: data,
    module: "finance",
    onSuccess: res => {
      debugger
      if (res.data.success) {
        result(res.data.result);
      } else {
        error(res.data.result.message);
      }
    }
  });
}
