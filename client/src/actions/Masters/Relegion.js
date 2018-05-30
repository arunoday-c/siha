//PatientDetals

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";


export function getRelegion() {
	return function(dispatch) {        
        algaehApiCall({
            uri: "/masters/get/relegion",                        
            method:"GET",
            onSuccess: response => {
              if (response.data.success == true) {
                dispatch({
                    type: "RELGE_GET_DATA", payload: response.data.records
                })
                console.log("Take me to Home");
                //window.location.hash("/DeptMaster");
              } else {
                console.log("No not now");
              }
            },
            onFailure: error => {
                dispatch({
                    type: "GET_ERR_DATA", payload: error
                })
            }
        });		
	}
}
