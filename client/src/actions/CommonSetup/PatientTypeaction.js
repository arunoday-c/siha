//Visa Types

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function getDepartmentsandDoctors() {
  return function(dispatch) {
    algaehApiCall({
      uri: "/patientType/get",
      method: "GET",
      onSuccess: response => {
        if (response.data.success == true) {
          dispatch({
            type: "PATTYPE_GET_DATA",
            payload: response.data.records
          });
        } else {
        }
      },
      onFailure: error => {
        dispatch({
          type: "PATTYPE_GET_ERR_DATA",
          departments: error
        });
      }
    });
  };
}
