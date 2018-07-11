//PatientDetals

"use strict";
import axios from "axios";
import { setToken, setCookie } from "../../utils/algaehApiCall";
import config from "../../utils/config.json";

export function getTokenDetals() {
  var auth_url = "/api/v1/apiAuth";
  var username = config.apiAuth.user;
  var password = config.apiAuth.password;
  var basicAuth = "Basic " + btoa(username + ":" + password);

  axios({
    method: "GET",
    url: auth_url,
    headers: { Authorization: basicAuth }
  })
    .then(response => {
      setToken(response.data.token);
      setCookie("Language", "en", 30);
    })
    .catch(err => {
      console.error("Error : ", err);
    });
}
