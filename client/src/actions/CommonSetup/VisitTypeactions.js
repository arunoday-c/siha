//Visa Types

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";


export function getVisittypes() {
	return function(dispatch) {
        //debugger;

        algaehApiCall({
            uri: "/visitType/get",            
            //token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjU5NDYzNzksImV4cCI6MTUyODUzODM3OX0.lsaxoGo5NxcUrFMsrv_D3zCC1BaZ6m97PxCbysgP698",
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjU3ODI5MzcsImV4cCI6MTUyODM3NDkzN30.GwmNV2vAIi2N6HWGhhjAxAg0vUrnpb1vgmArwceUi34",
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