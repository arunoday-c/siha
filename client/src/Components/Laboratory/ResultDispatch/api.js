import _ from "lodash";
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

    return _.orderBy(result.data.records, (o) => o.visit_date, "desc");
  } catch (e) {
    throw e;
  }
}
