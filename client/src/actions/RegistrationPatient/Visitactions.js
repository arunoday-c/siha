//PatientDetals
"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function postVisitDetails(dataValue, callback) {
  callback = callback || null;

  return function(dispatch) {
    algaehApiCall({
      uri: "/frontDesk/update",
      method: "POST",
      data: dataValue,
      onSuccess: response => {
        if (response.data.success === true) {
          if (typeof callback === "function") {
            callback(response.data.records);
          }
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
