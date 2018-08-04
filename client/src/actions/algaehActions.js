import { algaehApiCall } from "../utils/algaehApiCall";
//import swal from "sweetalert";

export const AlgaehActions = options => dispatch => {
  let settings = {
    ...{
      uri: null,
      method: "",
      data: null,
      redux: {
        type: null,
        mappingName: null
      },
      schema: {
        successField: "response.data.success === true",
        data: "response.data.records"
      }
    },
    ...options
  };

  if (settings.redux.data === undefined) {
    settings.onSuccess = response => {
      if (eval(settings.schema.successField)) {
        dispatch({
          type: "ALGAEH_" + settings.redux.type,
          payload: eval(settings.schema.data),
          mappingName: settings.redux.mappingName
        });
        if (typeof settings.afterSuccess === "function")
          settings.afterSuccess(eval(settings.schema.data));
      } else {
        console.error(
          "Error in redux type :" + settings.redux.type + " : ",
          response
        );
      }
    };
    algaehApiCall(settings);
  } else {
    dispatch({
      type: "ALGAEH_" + settings.redux.type,
      payload: settings.redux.data,
      mappingName: settings.redux.mappingName
    });
    if (typeof settings.afterSuccess === "function")
      settings.afterSuccess(eval(settings.redux.data));
  }
};
