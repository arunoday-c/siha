// const axios = require("axios");
const _ = require("lodash");
const patientData = require("./report_portal.json");
function bulkUpdatePortalSetup() {
  const arrangedDataPatient = _.chain(patientData)
    .map((details, key) => {
      const {
        reportName,
        visit_id,
        hims_f_lab_order_id,
        visit_code,
        service_id,
        patient_identity,
        hims_d_patient_id,
      } = details;
      return {
        reportToPortal: true,
        reportName: reportName,
        reportParams: [
          { name: "hims_d_patient_id", value: hims_d_patient_id },
          { name: "visit_id", value: visit_id },
          { name: "hims_f_lab_order_id", value: hims_f_lab_order_id },
          { name: "visit_code", value: visit_code },
          { name: "service_id", value: service_id },
          { name: "patient_identity", value: patient_identity },
        ],
        qrCodeReport: true,
        outputFileType: "PDF",
      };
    })
    .value();
  console.log("arrangedDataPatient", JSON.stringify(arrangedDataPatient));

  //   try {
  //   https://lims.otl.sa/reports/api/v1/report
  // if (arrangedDataPatient.length > 0) {
  //   for (let i = 0; i < arrangedDataPatient.length; i++) {
  //     ((data, i) => {
  //       setTimeout(async () => {
  //         await axios
  //           .get("https://lims.otl.sa/reports/api/v1/report", {
  //             params: {
  //               ...data,
  //             },
  //             headers: {
  //               "x-api-key": "",
  //               "x-branch": "",
  //               "x-client-ip": "",
  //             },
  //           })
  //           .then(async (result) => {
  //             console.log("done posting");
  //           })
  //           .catch((error) => {
  //             console.error("Error Update====>", error);
  //           });
  //       }, 20000 * i + 1);
  //     })(arrangedDataPatient[i], i);
  //   }
  //     }
  //   } catch (e) {
  //     console.log("error1", e);
  //     return;
  //   }
}
bulkUpdatePortalSetup();
