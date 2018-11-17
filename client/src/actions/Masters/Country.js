//PatientDetals

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function getCountries() {
  return function(dispatch) {
    algaehApiCall({
      // uri: "/masters/get/country",
      uri: "/masters/get/countryStateCity",
      method: "GET",
      onSuccess: response => {
        if (response.data.success === true) {
          dispatch({
            type: "CTRY_GET_DATA",
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
