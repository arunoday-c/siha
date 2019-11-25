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

export function removeAccount(input){
    return new Promise((resolve,reject)=>{
        try{
            algaehApiCall({
                uri: "/finance/removeAccountHead",
                data: input,
                method: "DELETE",
                module: "finance",
                onSuccess: response => {
                    if (response.data.success === true) {
                        resolve();
                    }else{
                        reject(response.data.message);
                    }
                },
                onCatch: error => {
                    reject(error);
                }
            });
        }
        catch(e){
            reject(e);
        }
    })
}

export function isPositive(value){
    if(parseFloat(value) >=0) {
        return "";
    }
    else{
        return " negitive";
    }
}
export function getChartData(input) {
    return new Promise((resolve,reject)=>{
        try{
            algaehApiCall({
                uri: "/finance/getLedgerDataForChart",
                data:input,
                method: "GET",
                module: "finance",
                onSuccess: response => {
                    if (response.data.success === true) {
                      resolve(response.data.result);
                    }
                },
                onCatch: error => {
                 reject(error);
                }
            });
        }
        catch (e) {
            reject(e);
        }
    })

}