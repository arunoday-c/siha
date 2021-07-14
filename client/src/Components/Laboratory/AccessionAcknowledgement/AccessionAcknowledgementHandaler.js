import { newAlgaehApi } from "../../../hooks";

export async function AcceptandRejectSample(inputobj) {
  debugger;
  const result = await newAlgaehApi({
    uri: "/laboratory/updateLabSampleStatus",
    module: "laboratory",
    data: inputobj,
    method: "PUT",
  });
  return result.data?.success ? result.data?.records : result.data;
}
