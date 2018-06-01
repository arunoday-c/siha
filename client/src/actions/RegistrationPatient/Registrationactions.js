//PatientDetals

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";


export function postPatientDetails(dataValue, callback) {
    callback = callback || null;
    
    return function(dispatch) {
        debugger;
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
                    console.log("Id Types", response.data);
                
                } else {
                    console.log("Id Types", response.data);
                }
                if (typeof callback === "function") {
                    callback(response.data.records);
                }
                },
                onFailure: error => {
                    console.log(error);
                }
            });
        }
    }    
        
}

export function getPatientDetails(dataValue) {
    debugger;
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
          }
        },
        onFailure: error => {
            // dispatch({
            //     type: "PAT_GET_ERR_DATA", payload: err
            // })
        }
    })
}
}
