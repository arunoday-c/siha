//PatientDetals

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";


export function getStates() {
    // debugger;
	return function(dispatch, getState) {
        
        algaehApiCall({
            uri: "/masters/get/state",                        
            method:"GET",
            onSuccess: response => {
              if (response.data.success == true) {
                dispatch({
                    type: "STATEGET_DATA", payload: response.data.records
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
        console.log("State",getState());
	}
}
