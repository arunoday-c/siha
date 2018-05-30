//PatientDetals

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";


export function getCities() {
	return function(dispatch) {        

        algaehApiCall({
            uri: "/masters/get/city",                            
            method:"GET",
            onSuccess: response => {
              if (response.data.success == true) {
                dispatch({
                    type: "CITYGET_DATA", payload: response.data.records
                })
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