import { newAlgaehApi } from "../../../hooks";
export async function getValidatedResult(name, input) {
  if (input.from_date && input.to_date && input.status) {
    const result = await newAlgaehApi({
      uri: "/laboratory/getValidatedResults",
      module: "laboratory",
      method: "GET",
      data: { ...input },
    });
    console.log("result.data====>", result.data);
    if (result.data.success === true) return result.data.records;
    else throw new Error(result.data.message);
  } else {
    return [];
  }
}
export async function processSMS(input) {
  const result = await newAlgaehApi({
    uri: "/laboratory/processLabSMS",
    module: "laboratory",
    method: "POST",
    data: input,
  }).catch((error) => {
    throw error;
  });
  return result.data;
}
