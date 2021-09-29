const axios = require("axios");
const _ = require("lodash");
const patientData = require("./data/report_portal.json");
const { token, url, ...others } = require("./token");
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
        report: {
          reportToPortal: "true",
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
        },
      };
    })
    .value();

  const _data = arrangedDataPatient;
  try {
    //   https://lims.otl.sa/reports/api/v1/report
    if (_data.length > 0) {
      for (let i = 0; i < _data.length; i++) {
        ((data, i) => {
          setTimeout(() => {
            axios
              .get(url, {
                params: {
                  ...data,
                },
                headers: {
                  "x-api-key": token,
                  "x-branch": others["x-branch"],
                  "x-client-ip": others["x-client-ip"],
                },
              })
              .then((result) => {
                console.log("done posting", i, data.report.reportParams[2]);
              })
              .catch((error) => {
                console.error("Error Update====>", error);
              });
          }, 2000 * i + 1);
        })(_data[i], i);
      }
    }
  } catch (e) {
    console.log("error1", e.message);
    return;
  }
}
bulkUpdatePortalSetup();
