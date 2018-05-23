//PatientDetals

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";


export function getCountries() {
	return function(dispatch) {
        //debugger;
        algaehApiCall({
            uri: "/masters/get/country",                        
            method:"GET",
            onSuccess: response => {
              if (response.data.success == true) {
                dispatch({
                    type: "CTRYGET_DATA", payload: response.data.records
                })
                
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
