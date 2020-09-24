import { newAlgaehApi } from "../../../hooks";

export async function getVitalsMaster() {
  const res = await newAlgaehApi({
    uri: "/doctorsWorkBench/getVitalsHeaderMaster",
    method: "GET",
  });
  debugger;
  return res.data?.records;
}

export async function getVitalDetails() {
  const res = await newAlgaehApi({
    uri: "/workBenchSetup/getVitalMasterDetail",
    method: "GET",
  });
  return res.data?.records;
}

export async function getInvestigations(key, { patient_id }) {
  const res = await newAlgaehApi({
    uri: "/laboratory/getLabOrderedServices",
    method: "GET",
    module: "laboratory",
    data: { patient_id },
  });
  return res.data?.records;
}

export async function getAnalytes(key, { test_id }) {
  const res = await newAlgaehApi({
    uri: "/laboratory/getAnalytesByTestID",
    method: "GET",
    module: "laboratory",
    data: { test_id },
  });
  return res.data?.records;
}

export async function getPatientVitals(key, { patient_id }) {
  const res = await newAlgaehApi({
    uri: "/doctorsWorkBench/getPatientVitals",
    method: "GET",
    data: { patient_id },
  });
  return res.data?.records;
}

export async function getPatientTestResults(key, { patient_id, test_id }) {
  const res = await newAlgaehApi({
    uri: "/laboratory/getInvestigationResult",
    method: "GET",
    module: "laboratory",
    data: { patient_id, test_id },
  });
  return res.data?.records;
}
