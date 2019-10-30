import {algaehApiCall} from "../../utils/algaehApiCall";

export function getHeaders(input){
    return new Promise((resolve,reject)=>{
        try{
            algaehApiCall({
                uri: "/finance/getAccountHeads",
                data: input,
                method: "GET",
                module: "finance",
                onSuccess: response => {
                    if (response.data.success === true) {
                        resolve(response.data.result);
                    }
                },
              onCatch:(error)=>{
                    reject(error);
              }
            });
        }
        catch(e){
            reject(e);
        }
    });
}

export function updateFinanceAccountsMaping(input){
    return new Promise((resolve,reject)=>{
        try{
            algaehApiCall({
                uri: "/finance/updateFinanceAccountsMaping",
                data: input,
                method: "POST",
                module: "finance",
                onSuccess: response => {
                    if (response.data.success === true) {
                        resolve(response.data.result);
                    }
                },
                onCatch:(error)=>{
                    reject(error);
                }
            });
        }
        catch(e){
            reject(e);
        }
    });
}
