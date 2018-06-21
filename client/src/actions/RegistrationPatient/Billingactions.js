"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function postBillDetsils(dataValue, callback) {
  callback = callback || null;

  return function(dispatch) {
    if (callback === null) {
      dispatch({
        type: "BILL_GET_DATA",
        payload: dataValue
      });
    } else {
      algaehApiCall({
        uri: "/save",
        method: "POST",
        data: dataValue,
        onSuccess: response => {
          if (response.data.success === true) {
          } else {
          }
          if (typeof callback === "function") {
            callback(response.data.records);
          }
        },
        onFailure: error => {
          dispatch({
            type: "GET_ERR_DATA",
            departments: error
          });
        }
      });
    }
  };
}
