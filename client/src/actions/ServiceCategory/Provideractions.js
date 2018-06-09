"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function getProviderDetails() {
  let full_name = "";
  debugger;
  return function(dispatch) {
    algaehApiCall({
      uri: "/employee/get",
      method: "GET",
      onSuccess: response => {
        if (response.data.success == true) {
          response.data.records[0].first_name +=
            " " +
            response.data.records[0].middle_name +
            " " +
            response.data.records[0].last_name;
          dispatch({
            type: "DOCT_GET_DATA",
            payload: response.data.records
          });
        }
      },
      onFailure: error => {
        // dispatch({
        //     type: "PAT_GET_ERR_DATA", payload: error
        // })
      }
    });
  };
}
