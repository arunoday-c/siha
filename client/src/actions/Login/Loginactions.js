//PatientDetals

"use strict";
import axios from "axios";
import { setToken, getToken } from "../../utils/algaehApiCall";

export function getTokenDetals() {
  var auth_url = "/api/v1/apiAuth";
  var username = "devteam";
  var password = "devteam";
  var basicAuth = "Basic " + btoa(username + ":" + password);

  return function(dispatch) {
    axios({
      method: "GET",
      url: auth_url,
      headers: { Authorization: basicAuth }
    })
      .then(response => {
        console.log("Response :" + response.data.token);
        setToken(response.data.token);
        dispatch({
          type: "GET_DATA",
          payload: response.data.token
        });
        console.log("Get Token: ", getToken());
      })
      .catch(err => {
        dispatch({
          type: "GET_ERR_DATA",
          payload: "err"
        });
      });
  };
}
