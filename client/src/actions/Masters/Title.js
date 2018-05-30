//PatientDetals

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";


export function getTitles() {    
	return function(dispatch) {

        algaehApiCall({
            uri: "/masters/get/title",                        
            method:"GET",
            onSuccess: response => {
              if (response.data.success == true) {
                dispatch({
                    type: "TITLE_GET_DATA", payload: response.data.records
                })               
                console.log("Take me to Home");
                //window.location.hash("/DeptMaster");
              } else {
                console.log("No not now");
              }
            },
            onFailure: error => {
                dispatch({
                    type: "TITLE_GET_ERR_DATA", payload: error
                })
            }
        });		
	}
}
