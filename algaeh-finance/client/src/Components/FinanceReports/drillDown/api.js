import newAlgaehApi from "../../../hooks/newAlgaehApi";

export async function loadData(input) {
  try {
    const result = await newAlgaehApi({
      module: "finance",
      method: "GET",
      data: { ...input },
      uri: "/financeReports/generationLedger",
    });
    return result.data;
  } catch (e) {
    throw e;
  }
}
