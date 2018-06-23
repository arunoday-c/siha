//PatientDetals

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function getStates(dataValue, callback) {
  callback = callback || null;
  return function(dispatch) {
    dispatch({
      type: "STATEGET_DATA",
      payload: dataValue
    });
    if (typeof callback === "function") {
      callback(dataValue);
    }
  };
}
