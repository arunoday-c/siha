import { algaehApiCall } from "../../../utils/algaehApiCall";


export function AddNewAccountDetails(data, error, result) {

    algaehApiCall({
        uri: "/finance/addAccountHeads",
        method: "POST",
        data: data,
        module: "finance",
        onSuccess: res => {
            if (res.data.success) {
                result(res.data.result);
            } else {
                error(res.data.result.message);
            }
        }
    });
}
