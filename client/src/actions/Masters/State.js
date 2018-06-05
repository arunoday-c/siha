//PatientDetals

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function getStates() {
  return function(dispatch, getState) {
    algaehApiCall({
      uri: "/masters/get/state",
      method: "GET",
      onSuccess: response => {
        if (response.data.success == true) {
          dispatch({
            type: "STATEGET_DATA",
            payload: response.data.records
          });

          //window.location.hash("/DeptMaster");
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
