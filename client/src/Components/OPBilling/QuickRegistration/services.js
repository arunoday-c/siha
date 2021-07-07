import { newAlgaehApi } from "../../../hooks";
import axios from "axios";
const BASE_URL =
  process.env.REACT_APP_QUICK_PATIENT_SERVER ?? "http://localhost:3025/api/v1";
console.log(BASE_URL);
export async function getPatientDetails(options) {
  const { data } = await axios
    .get("/patient/details", {
      baseURL: BASE_URL,
      // baseURL: "http://localhost:3025/api/v1",
      params: {
        ...options,
      },
    })
    .catch((e) => {
      throw e;
    });
  return data;
}

export async function updatePatientDetails(options) {
  const { data } = await axios
    .put("/patient/updatePatient", options, {
      baseURL: BASE_URL,
      // baseURL: "http://localhost:3025/api/v1",
    })
    .catch((e) => {
      throw e;
    });
  return data;
}

export async function getDefaults() {
  const { data } = await newAlgaehApi({
    uri: "/shiftAndCounter/getDefaults",
    module: "masterSettings",
    method: "GET",
  }).catch((e) => {
    throw e;
  });
  return data["records"];
}
export async function updatePatient(data) {
  data.ScreenCode = "BL0001";
  const { data: dta } = await newAlgaehApi({
    uri: "/frontDesk/update",
    data,
    module: "frontDesk",
    method: "POST",
  }).catch((e) => {
    throw e;
  });
  return dta.records;
}
export async function addPatient(data) {
  data.ScreenCode = "BL0002";
  const { data: dta } = await newAlgaehApi({
    uri: "/frontDesk/add",
    data,
    module: "frontDesk",
    method: "POST",
  }).catch((e) => {
    throw e;
  });
  return dta.records;
}
