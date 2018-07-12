"use strict";
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function postBillDetsils(dataValue, callback) {
  callback = callback || null;

  return function(dispatch) {
    algaehApiCall({
      uri: "/opBilling/addOpBIlling",
      method: "POST",
      data: dataValue,
      onSuccess: response => {
        if (response.data.success === true) {
        }
        if (typeof callback === "function") {
          callback(response.data.records);
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

export function generateBill(dataValue, callback) {
  callback = callback || null;

  return function(dispatch) {
    algaehApiCall({
      uri: "/billing/getBillDetails",
      method: "POST",
      data: dataValue,
      onSuccess: response => {
        if (response.data.success === true) {
          dispatch({
            type: "BILL_GEN_GET_DATA",
            payload: response.data.records
          });
        }
        if (typeof callback === "function") {
          callback(response.data.records);
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

export function initialStateBilldata() {
  return function(dispatch) {
    dispatch({
      type: "BILL_GEN_INIT_DATA",
      payload: {}
    });
  };
}

export function postAdvance(dataValue, callback) {
  callback = callback || null;

  return function(dispatch) {
    algaehApiCall({
      uri: "/billing/patientAdvanceRefund",
      method: "POST",
      data: dataValue,
      onSuccess: response => {
        if (response.data.success === true) {
          if (typeof callback === "function") {
            callback(response.data.records);
          }
        }
      },
      onFailure: error => {
        dispatch({
          type: "ADVANCE_GET_ERR_DATA",
          departments: error
        });
      }
    });
  };
}
