"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function getServiceTypes() {
  return function(dispatch) {
    algaehApiCall({
      uri: "/serviceType",
      method: "GET",
      onSuccess: response => {
        if (response.data.success === true) {
          dispatch({
            type: "SERVIES_TYPES_GET_DATA",
            payload: response.data.records
          });
        }
      },
      onFailure: error => {
        dispatch({
          type: "SERVIES_TYPES_GET_ERR_DATA",
          payload: error
        });
      }
    });
  };
}
