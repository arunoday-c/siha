("use strict");
import { algaehApiCall } from "../../utils/algaehApiCall.js";

export function getServices(dataValue) {
  debugger;
  return function(dispatch) {
    algaehApiCall({
      uri:
        dataValue !== null && dataValue !== ""
          ? "/serviceType/getService?service_type_id=" + dataValue
          : "/serviceType/getService",
      method: "GET",
      onSuccess: response => {
        if (response.data.success == true) {
          dispatch({
            type: "SERVICES_GET_DATA",
            payload: response.data.records
          });
        }
      },
      onFailure: error => {
        dispatch({
          type: "SERVICES_GET_ERR_DATA",
          payload: error
        });
      }
    });
  };
}
