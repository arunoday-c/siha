import { newAlgaehApi } from "../../../hooks";
import axios from "axios";
export async function nationality() {
  const { data } = await newAlgaehApi({
    uri: "masters/get/nationality",
    method: "GET",
  }).catch((e) => {
    throw e;
  });
  return data["records"];
}
export async function getPatientDetails(options) {
  const { data } = await axios
    .get("http://localhost:3025/api/v1/patient/details", {
      params: {
        ...options,
      },
    })
    .catch((e) => {
      throw e;
    });
  return data;
}
