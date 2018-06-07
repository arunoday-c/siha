//PatientDetals

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";


export function postPatientDetails(dataValue, callback) {
    callback = callback || null;
    
    return function(dispatch) {

        if(callback === null)
        {
            dispatch({
                type: "PAT_GET_DATA", payload: dataValue
            })
        }
        else{
            algaehApiCall({
                uri: "/frontDesk/add",                    
                method:"POST",
                data : dataValue,
                onSuccess: response => {
                if (response.data.success === true) {

                
                } else {

                }
                if (typeof callback === "function") {
                    callback(response.data.records);
                }
                },
                onFailure: error => {

                }
            });
        }
    }    
        
}

export function getPatientDetails(dataValue, callback) {
    
    callback = callback || null;
    return function(dispatch) {
    algaehApiCall({
        //uri: "v1/frontDesk/get",
        uri: dataValue!==null && dataValue!==""? ("/frontDesk/get?patient_code="+dataValue) : "/frontDesk/get" ,            
        method:"GET",
        onSuccess: response => {
          if (response.data.success == true) {
            dispatch({
                type: "PAT_GET_DATA", payload: response.data.records.patientRegistration
            }) 
            
            dispatch({
                type: "PREVIST_GET_DATA", payload: response.data.records.patientRegistration
            })
          }
        },
        onFailure: error => {
            // dispatch({
            //     type: "PAT_GET_ERR_DATA", payload: error
            // })
        }
    })
}
}
