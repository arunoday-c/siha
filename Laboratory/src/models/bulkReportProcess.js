import axios from "axios";
export async function reportPCR(input) {
  try {
    const {
      patient_identity,
      visit_code,
      service_id,
      hims_f_lab_order_id,
      patient_id,
      visit_id,
    } = input;
    await axios.get("http://localhost:3018/api/v1/report", {
      headers: {
        Accept: "blob",
        responseType: "blob",
        "x-bypass-user": "algaeh",
        "x-bypass-password": "alg_hea2018",
      },
      params: {
        report: {
          reportToPortal: "true",
          reportParams: [
            {
              name: "hims_d_patient_id",
              value: patient_id,
            },
            {
              name: "visit_id",
              value: visit_id,
            },
            {
              name: "hims_f_lab_order_id",
              value: hims_f_lab_order_id,
            },
            {
              name: "visit_code",
              value: visit_code,
            },
            {
              name: "patient_identity",
              value: patient_identity,
            },
            {
              name: "service_id",
              value: service_id,
            },
          ],
          reportName: "pcrTestReport",
          qrCodeReport: true,
          outputFileType: "PDF",
        },
      },
    });
  } catch (e) {
    console.error(`Report error ${new Date().toLocaleString()} :===>`, e);
  }
}
