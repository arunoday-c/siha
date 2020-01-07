import React from "react";
import { getIdentity, getCookie, getToken } from "../utils/algaehApiCall";
import axios from "axios";
import config from "../utils/config.json";

export default function useAlgaehApi() {
  // const [ip, setIp] = useState("");

  function createUrl(inputs) {
    const { protocol, hostname } = window.location;
    const { baseUrl, routersAndPorts } = config;
    const { uri, module: moduleName } = inputs;
    let url;
    if (window.location.port) {
      const port = moduleName
        ? routersAndPorts[moduleName].port
        : routersAndPorts["default"].port;
      url = `${protocol}//${hostname}:${port}${baseUrl}${uri}`;
    } else {
      const path = moduleName
        ? routersAndPorts[moduleName].path
        : routersAndPorts["default"].path;
    }
    return url;
  }

  async function action(
    inputs = { uri: "", method: "", module: "", data: {} }
  ) {
    console.log(inputs);
    const identity = getIdentity();
    const headers = {
      "x-api-key": getToken(),
      "x-client-ip": identity,
      "x-app-user-identity": getCookie("keyRources")
    };
    try {
      // setLoading(true);
      let response;
      let responseObj = {
        url: createUrl(inputs),
        method: inputs.method,
        headers
      };
      console.log(responseObj, "response");
      if (inputs.method === "GET" || !inputs.method) {
        responseObj.params = inputs.data;
      } else {
        responseObj.data = inputs.data;
      }
      response = await axios(responseObj);
      return response;
    } catch (e) {
      return e;
    }
  }

  // return [action, { data, loading, error }];
  return [action];
}
