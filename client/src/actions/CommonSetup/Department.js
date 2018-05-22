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
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjU3ODI5MzcsImV4cCI6MTUyODM3NDkzN30.GwmNV2vAIi2N6HWGhhjAxAg0vUrnpb1vgmArwceUi34",
            //token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjU3ODM1MTQsImV4cCI6MTUyODM3NTUxNH0.7j3qmIAm9e_GwTbOfPv9wNKKS2BY4V56SsAWokTmr18",
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