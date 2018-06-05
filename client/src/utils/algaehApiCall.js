import axios from "axios";
import extend from "extend";
import moment from "moment";

export function algaehApiCall(options) {
  // const baseUrl = "http://159.89.163.148:3000/api/";
  // const baseUrl = "http://192.168.0.129:3000/api/v1";
  // const baseUrl = "http://localhost:3003/api/";
  const baseUrl = "/api/v1";
  var settings = extend(
    {
      uri: null,
      data: null,
      method: "POST",
      token: null,
      onSuccess: null,
      onFailure: null
    },
    options
  );

  if (settings.uri != null || settings.uri != "") {
    axios({
      method: settings.method,
      url: baseUrl + settings.uri,
      headers: { "x-api-key": getToken() },
      data: settings.data
    })
      .then(response => {
        if (typeof settings.onSuccess == "function")
          settings.onSuccess(response);
      })
      .catch(err => {
        if (typeof settings.onFailure == "function") settings.onFailure(err);
      });
  }
}

export function SelectFiledData(options) {
  let settings = extend(
    {
      textField: "",
      valueField: "",
      selectedFiled: "",
      payload: null
    },
    options
  );
  let Data = [];

  if (settings.textField != "" && settings.valueField != "") {
    {
      settings.payload.map((row, index) =>
        Data.push({
          name: row[settings.textField],
          value: row[settings.valueField]
        })
      );
    }
  }
  return Data;
}

export function isDateFormat(options, isSend) {
  isSend = isSend || false;
  var returnString = "";
  var defOpt = defaultOptions();
  var settings = extend(
    {
      date: null,
      isTime: false,
      usedefaultFarmats: true,
      format: !isSend ? defOpt.clientDateFormat : defOpt.serverDateFromat,
      existFormat: !isSend ? defOpt.serverDateFromat : defOpt.clientDateFormat
    },
    options
  );
  if (settings.isTime && settings.usedefaultFarmats) {
    settings.format = !isSend
      ? defOpt.ClientTimeFormat
      : defOpt.serverTimeFormat;
    settings.existFormat = !isSend
      ? defOpt.ClientTimeFormat
      : defOpt.serverTimeFormat;
  }
  if (settings.date !== null && settings.date !== "") {
    var dateasString = String(settings.date);
    if (dateasString !== "0") {
      returnString = moment(settings.date, settings.existFormat).format(
        settings.format
      );
    }
  }

  return returnString;
}

export function defaultOptions() {
  var output = {
    clientDateFormat: "YYYY-MM-DD",
    ClientTimeFormat: "HH:MM",
    serverDateFromat: "YYYYMMDD",
    serverTimeFormat: "HHMMSS"
  };
  return output;
}

export function getToken() {
  return getCookie("authToken");
}
export function setToken(token) {
  setCookie("authToken", token, 30);
}

export function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
