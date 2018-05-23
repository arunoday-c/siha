//Departments

"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";


export function getDepartments() {
	return function(dispatch) {
        //debugger;

        algaehApiCall({
            uri: "/department/get",            
            method:"GET",
            onSuccess: response => {
              if (response.data.success == true) {
                dispatch({
                    type: "DEPTGET_DATA", payload: response.data.records
                })
                console.log("Take me to Home with:" ,response.data.records);
              } else {
             
              }
            },
            onFailure: error => {
                dispatch({
                    type: "GET_ERR_DATA", departments: error
                })
            }
        });
	}
}


export function getSubDepartments(datavalue) {
	return function(dispatch) {
        debugger;

        algaehApiCall({
            uri: datavalue!=null && datavalue!=""? ("/department/get/subdepartment?department_id="+datavalue) : "/department/get/subdepartment" ,
            method:"GET",
            onSuccess: response => {
              if (response.data.success == true) {
                dispatch({
                    type: "SUBDEPGET_DATA", payload: response.data.records
                })
                console.log("Take me to Home with:" ,response.data.records);
               
              } else {
                console.log("No not now");
              }
            },
            onFailure: error => {
                dispatch({
                    type: "GET_ERR_DATA", subdepartments: error
                })
            }
        });
	}
}