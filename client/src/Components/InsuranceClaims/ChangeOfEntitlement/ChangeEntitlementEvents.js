import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { newAlgaehApi } from "../../../hooks";

export const VisitSearch = (setState, setGenerateEnable) => {
  let input = `pv.invoice_generated='N'`;
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.VisitDetails.VisitList,
    },
    searchName: "invoice_visit",
    uri: "/gloabelSearch/get",
    inputs: input,
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      setState({
        visit_code: row.visit_code,
        patient_code: row.patient_code,
        full_name: row.full_name,
        patient_id: row.patient_id,
        visit_id: row.hims_f_patient_visit_id,
        nationality_id: row.nationality_id,
        sub_department_id: row.sub_department_id,
      });
      setGenerateEnable(false);
    },
  });
};

export const getVisitWiseBillDetailS = async (
  key,
  { visit_id, isInsurance = "Y" }
) => {
  const res = await newAlgaehApi({
    uri: "/invoiceGeneration/getVisitWiseBillDetailS",
    module: "insurance",
    method: "GET",
    data: {
      visit_id,
      insurance_yesno: isInsurance,
    },
  });
  return res.data?.records;
};

export const getPatientInsurance = async (key, { patient_id, visit_id }) => {
  const res = await newAlgaehApi({
    uri: "/patientRegistration/getPatientInsurance",
    module: "frontDesk",
    method: "GET",
    data: {
      patient_id: patient_id,
      patient_visit_id: visit_id,
    },
  });
  return res.data?.records;
};

export const getBillsForVisit = async (key, { visit_id }) => {
  const res = await newAlgaehApi({
    uri: "/billing/getBillsForVisit",
    module: "billing",
    method: "GET",
    data: {
      visit_id,
    },
  });
  return res.data?.records;
};
export const generateBills = async (PatientData) => {
  // data.ScreenCode = "BL0002";
  const result = await newAlgaehApi({
    uri: "/changeofEntitle/addChangeOfEntitlement",
    module: "billing",
    data: PatientData,
    method: "POST",
  });
  return result.data?.success ? result.data?.records : result.data;
};
