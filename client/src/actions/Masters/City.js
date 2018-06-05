//PatientDetals

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function getCities() {
  return function(dispatch) {
    algaehApiCall({
      uri: "/masters/get/city",
      method: "GET",
      onSuccess: response => {
        if (response.data.success == true) {
          dispatch({
            type: "CITYGET_DATA",
            payload: response.data.records
          });
        } else {
        }
      },
      onFailure: error => {
        dispatch({
          type: "GET_ERR_DATA",
          payload: error
        });
      }
    });
  };
}
