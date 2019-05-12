const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      const patients = options.result[0];
      const vitals = options.result[1];
      const chiefComplaints = options.result[2];
      const encounterNotes = options.result[3];
      const vitalHeader = options.result[4];
      const billing = options.result[5];
      let missingPatientDetails = [];
      for (let i = 0; i < patients.length; i++) {
        let hasError = false;
        let missingVitals = "";
        let missingChiefComplaint = false;
        let missingSignificatSigns = false;
        let missingOtherSigns = false;
        let missingBilling = false;
        const validateVitals = _.filter(
          vitals,
          f =>
            f.patient_id == patients[i]["patient_id"] &&
            f.visit_id == patients[i]["hims_f_patient_visit_id"]
        );
        if (validateVitals.length != 6) {
          hasError = true;
          for (let v = 0; v < vitalHeader.length; v++) {
            const row = vitalHeader[v];
            const vitalExists = _.find(
              row["hims_d_vitals_header_id"],
              f => f.vital_id == v
            );
            if (vitalExists === undefined) {
              const splitString = String(row["vital_short_name"]).split(" ");
              missingVitals += splitString[splitString.length - 1].charAt(0);
            }
            if (v < vitalHeader.length - 1) {
              missingVitals += ",";
            }
          }
        }

        const validateChiefComplaint = _.find(
          chiefComplaints,
          f =>
            f.hims_f_patient_visit_id ==
              patients[i]["hims_f_patient_visit_id"] &&
            f.patient_id == patients[i]["patient_id"]
        );
        if (validateChiefComplaint === undefined) {
          hasError = true;
          missingChiefComplaint = true;
        }

        const vlidateEncounterNotes = _.find(
          encounterNotes,
          f =>
            f.visit_id == patients[i]["hims_f_patient_visit_id"] &&
            f.patient_id == patients[i]["patient_id"]
        );
        if (vlidateEncounterNotes == undefined) {
          hasError = true;
          missingSignificatSigns = true;
          missingOtherSigns = true;
        } else {
          if (vlidateEncounterNotes.significant_signs == "") {
            hasError = true;
            missingSignificatSigns = true;
          }
          if (vlidateEncounterNotes.other_signs == "") {
            hasError = true;
            missingOtherSigns = true;
          }
        }
        const validateBilling = _.find(
          billing,
          f =>
            f.visit_id == patients[i]["hims_f_patient_visit_id"] &&
            f.patient_id == patients[i]["patient_id"]
        );
        if (validateBilling === undefined) {
          hasError = true;
          missingBilling = true;
        }
        if (hasError) {
          missingPatientDetails.push({
            seq_no: missingPatientDetails.length + 1,
            patient_code: patients[i]["patient_code"],
            patient_name: patients[i]["full_name"],
            visit_code: patients[i]["visit_code"],
            missing_vitals: missingVitals,
            missing_chief_complient: !missingChiefComplaint
              ? "<span>&#10004;</span>"
              : "<span>&#10008;</span>",
            missing_significant_signs: !missingSignificatSigns
              ? "<span>&#10004;</span>"
              : "<span>&#10008;</span>",
            missing_other_signs: !missingOtherSigns
              ? "<span>&#10004;</span>"
              : "<span>&#10008;</span>",
            missing_billing: !missingBilling
              ? "<span>&#10004;</span>"
              : "<span>&#10008;</span>"
          });
        }
      }
      resolve({ pateints: missingPatientDetails });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
