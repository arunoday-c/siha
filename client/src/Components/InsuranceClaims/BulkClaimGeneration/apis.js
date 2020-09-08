import { newAlgaehApi } from "../../../hooks";

export async function getVisits(key, data) {
  const res = await newAlgaehApi({
    uri: "/invoiceGeneration/getVisitsForGeneration",
    module: "insurance",
    method: "GET",
    data: data,
  });
  return res?.data?.records;
}

export async function getInsuranceProviders() {
  const res = await newAlgaehApi({
    uri: "/insurance/getInsuranceProviders",
    module: "insurance",
    method: "GET",
  });
  return res?.data?.records;
}

export async function getSubInsurance(key, { insurance_provider_id }) {
  const res = await newAlgaehApi({
    uri: "/insurance/getSubInsurance",
    module: "insurance",
    method: "GET",
    data: {
      insurance_provider_id,
    },
  });
  return res?.data?.records;
}
