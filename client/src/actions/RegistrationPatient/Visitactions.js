//PatientDetals
"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function postVisitDetails(dataValue, callback) {
  callback = callback || null;

  return function(dispatch) {
    algaehApiCall({
      uri: "/visit/addVisit",
      method: "POST",
      data: dataValue,
      onSuccess: response => {
        if (response.data.success == true) {
        } else {
        }
      },
      onFailure: error => {
        onFailure: error => {
          dispatch({
            type: "VISIT_GET_ERR_DATA",
            payload: error
          });
        };
      }
    });
  };
}
