import { algaehApiCall } from "../../../utils/algaehApiCall";

export function AddLisMachineConfiguration(data, error, result) {
    debugger
    algaehApiCall({
        uri: "/algaehMasters/addLisMachineConfiguration",
        method: "POST",
        data: data,
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

