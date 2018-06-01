//Visa Types

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";


export function getVisittypes() {
	return function(dispatch) {

        algaehApiCall({
            uri: "/visitType/get",                        
            method:"GET",
            onSuccess: response => {
              if (response.data.success == true) {
                dispatch({
                    type: "VISITTYPE_GET_DATA", payload: response.data.records
                })
                console.log("Take me to Home with:" ,response.data.records);
              } else {
             
              }
            },
            onFailure: error => {
                dispatch({
                    type: "VISITTYPE_GET_ERR_DATA", departments: error
                })
            }
        });
	}
}