import { newAlgaehApi } from "../../../hooks";

export async function getProviders() {
  const res = await newAlgaehApi({
    uri: "/insurance/getListOfInsuranceProvider",
    module: "insurance",
    method: "GET",
  });
  return res?.data?.records;
}
