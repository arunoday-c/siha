//PatientDetals

import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function postPatientDetails(dataValue, callback) {
  callback = callback || null;

  return function(dispatch) {
    if (callback === null) {
      dispatch({
        type: "PAT_GET_DATA",
        payload: dataValue
      });
    } else {
      algaehApiCall({
        uri: "/frontDesk/add",
        method: "POST",
        data: dataValue,
        onSuccess: response => {
          if (response.data.success === true) {
          } else {
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
    }
  };
}

export function postVisitDetails(dataValue, callback) {
  callback = callback || null;

  return function(dispatch) {
    algaehApiCall({
      uri: "/frontDesk/update",
      method: "POST",
      data: dataValue,
      onSuccess: response => {
        if (response.data.success === true) {
          if (typeof callback === "function") {
            callback(response.data.records);
          }
        } else {
        }
      },
      onFailure: error => {
        dispatch({
          type: "VISIT_GET_ERR_DATA",
          payload: error
        });
      }
    });
  };
}

export function getPatientDetails(dataValue, callback) {
  callback = callback || null;
  return function(dispatch) {
    algaehApiCall({
      //uri: "v1/frontDesk/get",
      uri:
        dataValue !== null && dataValue !== ""
          ? "/frontDesk/get?patient_code=" + dataValue
          : "/frontDesk/get",
      // module: "frontDesk",
      method: "GET",
      onSuccess: response => {
        if (response.data.success === true) {
          dispatch({
            type: "PAT_GET_DATA",
            payload: response.data.records.patientRegistration
          });

          if (typeof callback === "function") {
            callback(response.data.records);
          }
        }
      },
      onFailure: error => {
        dispatch({
          type: "PAT_GET_ERR_DATA",
          payload: error
        });
      }
    });
  };
}

export function initialStatePatientData() {
  return function(dispatch) {
    dispatch({
      type: "INIT_PAT_DATA",
      payload: {}
    });
  };
}
