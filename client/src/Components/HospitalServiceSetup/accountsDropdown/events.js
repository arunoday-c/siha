import {algaehApiCall,swalMessage} from "../../../utils/algaehApiCall";

export function getHeaders(input) {
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
                    swalMessage({
                        type:"error",
                        title:error
                    });
                    reject(error);

                }
            });
        }
        catch(e){
            swalMessage({
                type:"error",
                title:e
            });
            reject(e);
        }
    });
}