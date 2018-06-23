//PatientDetals

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function getCities(dataValue) {
  // return function(dispatch) {
  //   algaehApiCall({
  //     uri: "/masters/get/city",
  //     method: "GET",
  //     onSuccess: response => {
  //       if (response.data.success == true) {
  //         dispatch({
  //           type: "CITYGET_DATA",
  //           payload: response.data.records
  //         });
  //       } else {
  //       }
  //     },
  //     onFailure: error => {
  //       dispatch({
  //         type: "GET_ERR_DATA",
  //         payload: error
  //       });
  //     }
  //   });
  // };

  return function(dispatch) {
    dispatch({
      type: "CITYGET_DATA",
      payload: dataValue
    });
  };
}
