//Visa Types

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function getDepartmentsandDoctors() {
  return function(dispatch) {
    algaehApiCall({
      uri: "/department/get/get_All_Doctors_DepartmentWise",
      method: "GET",
      onSuccess: response => {
        if (response.data.success == true) {
          dispatch({
            type: "DEPT_DOCTOR_GET_DATA",
            payload: response.data.records
          });
        } else {
        }
      },
      onFailure: error => {
        dispatch({
          type: "DEPT_DOCTOR_GET_ERR_DATA",
          departments: error
        });
      }
    });
  };
}
