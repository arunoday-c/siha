"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";


export function getIDTypes() {
	return function(dispatch) {
        //debugger;

        algaehApiCall({
            uri: "/identity/get",
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

