import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";

export function getAccounts(account_head_id, callBack) {
    algaehApiCall({
        uri: "/finance/getAccountHeads",
        data: { account_level: "0", finance_account_head_id: account_head_id },
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
