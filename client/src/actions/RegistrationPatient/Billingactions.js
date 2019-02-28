import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function postAdvance(dataValue, callback) {
  callback = callback || null;

  return function(dispatch) {
    algaehApiCall({
      uri: "/billing/patientAdvanceRefund",
      module: "billing",
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
