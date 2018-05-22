"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";


export function getIDTypes() {
	return function(dispatch) {
        //debugger;

        algaehApiCall({
            uri: "/identity/get",            
            //token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjU3ODI5MzcsImV4cCI6MTUyODM3NDkzN30.GwmNV2vAIi2N6HWGhhjAxAg0vUrnpb1vgmArwceUi34",
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjU3ODI5MzcsImV4cCI6MTUyODM3NDkzN30.GwmNV2vAIi2N6HWGhhjAxAg0vUrnpb1vgmArwceUi34",
            method:"GET",
            onSuccess: response => {
              if (response.data.success == true) {
                dispatch({
                    type: "IDTYPE_GET_DATA", payload: response.data.records
                })

              } else {
             
              }
            },
            onFailure: error => {
                dispatch({
                    type: "IDTYPE_GET_ERR_DATA", idtypes: error
                })
            }
        });
	}
}

export function addIDType(data) {
	return function(dispatch) {
        debugger;

        algaehApiCall({
            uri: "/department/get",            
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjU5NDYzNzksImV4cCI6MTUyODUzODM3OX0.lsaxoGo5NxcUrFMsrv_D3zCC1BaZ6m97PxCbysgP698",
            method:"POST",
            data : data,
            onSuccess: response => {
              if (response.data.success == true) {
                dispatch({
                    type: "IDTYPE_POST_DATA", payload: response.data.records
                })
              } else {
             
              }
            },
            onFailure: error => {
                dispatch({
                    type: "IDTYPE_POST_ERR_DATA", departments: error
                })
            }
        });
	}
}

