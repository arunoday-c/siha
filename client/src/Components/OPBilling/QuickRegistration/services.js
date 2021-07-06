import { newAlgaehApi } from "../../../hooks";
import axios from "axios";
export async function getPatientDetails(options) {
  const BASE_URL =
    process.env.QUICK_PATIENT_SERVER ?? "http://localhost:3025/api/v1";
  const { data } = await axios
    .get("/patient/details", {
      baseURL: BASE_URL,
      params: {
        ...options,
      },
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
