//Visa Types

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function getVisatypes() {
  return function(dispatch) {
    algaehApiCall({
      uri: "/visaType/getVisaMaster",
      module: "masterSettings",
      method: "GET",
      onSuccess: response => {
        if (response.data.success === true) {
          dispatch({
            type: "VISA_GET_DATA",
            payload: response.data.records
          });
        } else {
        }
      },
      onFailure: error => {
        dispatch({
          type: "VISA_GET_ERR_DATA",
          departments: error
        });
      }
    });
  };
}
