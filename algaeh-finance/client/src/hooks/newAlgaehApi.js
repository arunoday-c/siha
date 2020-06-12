import { getNewLocalIp, getCookie } from "../utils/algaehApiCall";
import { getItem } from "algaeh-react-components/storage";
import axios from "axios";
import config from "../utils/config.json";

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
    url = `${protocol}//${hostname}${path}${baseUrl}${uri}`;
  }
  return url;
}

export default async function newAlgaehApi(
  inputs = {
    uri: "",
    method: "",
    module: "",
    data: {},
    extraHeaders: {},
    options: {}
  }
) {
  const token = await getItem("token");
  const headers = {
    "x-api-key": token,
    "x-client-ip": getNewLocalIp(),
    "x-app-user-identity": getCookie("keyResources"),
    "x-branch": getCookie("HospitalId"),
    ...inputs.extraHeaders
  };
  try {
    let response;
    let responseObj = {
      url: createUrl(inputs),
      method: inputs.method,
      headers,
      ...inputs.options
    };
    if (inputs.method === "GET" || !inputs.method) {
      responseObj.params = inputs.data;
    } else {
      responseObj.data = inputs.data;
    }
    response = await axios(responseObj);
    return response;
  } catch (e) {
    throw new Error(e.response.data.message || e.message);
  }
}
