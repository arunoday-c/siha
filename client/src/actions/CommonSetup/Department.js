//Departments

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function getDepartments() {
  return function(dispatch) {
    algaehApiCall({
      uri: "/department/get",
      method: "GET",
      onSuccess: response => {
        if (response.data.success === true) {
          dispatch({
            type: "DEPTGET_DATA",
            payload: response.data.records
          });
        } else {
        }
      },
      onFailure: error => {
        dispatch({
          type: "GET_ERR_DATA",
          departments: error
        });
      }
    });
  };
}

export function getSubDepartments(datavalue) {
  return function(dispatch) {
    algaehApiCall({
      uri:
        datavalue != null && datavalue != ""
          ? "/department/get/subdepartment?department_id=" + datavalue
          : "/department/get/subdepartment",
      method: "GET",
      onSuccess: response => {
        if (response.data.success === true) {
          dispatch({
            type: "SUBDEPGET_DATA",
            payload: response.data.records
          });
        } else {
        }
      },
      onFailure: error => {
        dispatch({
          type: "GET_ERR_DATA",
          subdepartments: error
        });
      }
    });
  };
}

export function getDepartmentsClinicalNon(datavalue) {
  return function(dispatch) {
    algaehApiCall({
      uri:
        datavalue != null && datavalue != ""
          ? "/masters/get/subDeptClinicalNonClinicalAll?department_type=" +
            datavalue
          : "/masters/get/subDeptClinicalNonClinicalAll",
      method: "GET",
      onSuccess: response => {
        if (response.data.success === true) {
          dispatch({
            type: "SUBDEP_NCL_GET_DATA",
            payload: response.data.records
          });
        } else {
        }
      },
      onFailure: error => {
        dispatch({
          type: "GET_ERR_DATA",
          subdepartments: error
        });
      }
    });
  };
}
