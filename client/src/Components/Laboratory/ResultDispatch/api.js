import { newAlgaehApi } from "../../../hooks";

export async function loadPatientRecords({
  patient_id,
}: {
  patient_id: Number,
}) {
  try {
    const result = await newAlgaehApi({
      uri: "/laboratory/labResultDispatch",
      module: "laboratory",
      method: "GET",
      data: { patient_id },
    });
    console.log("result.data", result.data);
    return result.data.records;
  } catch (e) {
    throw e;
  }
}
