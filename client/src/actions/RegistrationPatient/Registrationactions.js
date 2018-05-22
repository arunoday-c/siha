//PatientDetals

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";


export function postPatientDetails(dataValue, callback) {
    callback = callback || null;
	return function(dispatch) {
        debugger;

        algaehApiCall({
            uri: "/frontDesk/add",            
            //token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjU5NDYzNzksImV4cCI6MTUyODUzODM3OX0.lsaxoGo5NxcUrFMsrv_D3zCC1BaZ6m97PxCbysgP698",
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjU3ODI5MzcsImV4cCI6MTUyODM3NDkzN30.GwmNV2vAIi2N6HWGhhjAxAg0vUrnpb1vgmArwceUi34",
            method:"POST",
            data : dataValue,
            onSuccess: response => {
              if (response.data.success == true) {
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

export function getPatientDetails(dataValue) {
    debugger;
    return function(dispatch) {
    algaehApiCall({
        //uri: "v1/frontDesk/get",
        uri: dataValue!=null && dataValue!=""? ("/frontDesk/get?patient_code="+dataValue) : "/frontDesk/get" ,
        //token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjU5NDYzNzksImV4cCI6MTUyODUzODM3OX0.lsaxoGo5NxcUrFMsrv_D3zCC1BaZ6m97PxCbysgP698",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjU3ODI5MzcsImV4cCI6MTUyODM3NDkzN30.GwmNV2vAIi2N6HWGhhjAxAg0vUrnpb1vgmArwceUi34",
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
