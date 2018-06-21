"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function getProviderDetails() {
  return function(dispatch) {
    algaehApiCall({
      uri: "/employee/get",
      method: "GET",
      onSuccess: response => {
        if (response.data.success == true) {
          dispatch({
            type: "DOCT_GET_DATA",
            payload: response.data.records
          });
        }
      },
      onFailure: error => {
        // dispatch({
        //   type: "DOCT_GET_ERR_DATA",
        //   payload: error
        // });
      }
    });
  };
}
