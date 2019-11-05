import { algaehApiCall } from "../../../utils/algaehApiCall";

export function AddLisMachineConfiguration(data, error, result) {
    debugger
    if (data.hims_d_lis_configuration_id === "") {
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
    } else {
        algaehApiCall({
            uri: "/algaehMasters/updateLisMachineConfiguration",
            method: "PUT",
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
}

export function getLisMachineConfiguration(callBack) {
    algaehApiCall({
        uri: "/algaehMasters/getLisMachineConfiguration",
        method: "GET",
        onSuccess: res => {
            if (res.data.success) {
                callBack(res.data.records);
            }
        }
    });
}

export function getOrganizations(callBack) {
    algaehApiCall({
        uri: "/organization/getOrganization",
        method: "GET",
        onSuccess: res => {
            if (res.data.success) {
                callBack(res.data.records);
            }
        }
    });
}

