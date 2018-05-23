// Options API call

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";


export function getOptions() {
	return function(dispatch) {
        debugger;

        algaehApiCall({
            uri: "/masters/get/autogen",
            method:"GET",
            onSuccess: response => {
              if (response.data.success == true) {
                dispatch({
                    type: "OPTGET_DATA", payload: response.data.records
                })
                console.log("Throwing Options:" ,response.data.records);
              } else {
             
              }
            },
            onFailure: error => {
                dispatch({
                    type: "OPTGET_ERR_DATA", departments: error
                })
            }
        });
	}
}