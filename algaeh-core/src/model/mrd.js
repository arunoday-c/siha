"use strict";
import extend from "extend";
import utils from "../utils";
import moment from "moment";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import logUtils from "../utils/logging";

const { debugLog } = logUtils;
const { whereCondition, releaseDBConnection } = utils;

//created by irfan: to get Patient Mrd List
let getPatientMrdList = (req, res, next) => {
  let selectWhere = {
    patient_code: "ALL",

    arabic_name: "ALL",
    date_of_birth: "ALL",
    contact_number: "ALL",
    hims_d_patient_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let patientName = "";
    if (req.query.full_name != "null" && req.query.full_name != null) {
      patientName = `and full_name like '%${req.query.full_name}%'`;
    }
    delete req.query.full_name;

    let registration_date = "";

    if (
      req.query.registration_date != "null" &&
      req.query.registration_date != null
    ) {
      registration_date = `and date(registration_date)= date('${
        req.query.registration_date
      }')`;
    }

    delete req.query.registration_date;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_patient_id,patient_code,registration_date,first_name,middle_name,\
        last_name,full_name,arabic_name,gender,date_of_birth,age,marital_status,\
        contact_number,nationality_id ,N.nationality,secondary_contact_number,email,emergency_contact_name,emergency_contact_number,\
        relationship_with_patient,postal_code,\
        primary_identity_id,DOC.identity_document_name as primary_document_name,\
        primary_id_no,secondary_id_no,photo_file,primary_id_file,\
        secondary_id_file,advance_amount,patient_type,vat_applicable\
        from hims_f_patient P, hims_d_nationality N,hims_d_identity_document DOC\
        where P.record_status='A' and N.record_status='A' and DOC.record_status='A' and\
        P.nationality_id=N.hims_d_nationality_id and P.primary_identity_id=DOC.hims_d_identity_document_id  " +
          patientName +
          "" +
          registration_date +
          " AND " +
          where.condition +
          "order by registration_date desc",
        where.values,
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get Patient Encounter Details
let getPatientEncounterDetails = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    // select hims_f_patient_encounter_id, PE.patient_id,P.full_name,PE.provider_id,E.full_name as provider_name, visit_id,V.insured,\
    //     V.sub_department_id,\
    //     SD.sub_department_name,PE.episode_id,PE.encounter_id,PE.updated_date as encountered_date\
    //     from hims_f_patient_encounter PE,hims_f_patient P,hims_d_employee E,hims_f_patient_visit V,hims_d_sub_department SD\
    //     where PE.record_status='A' and P.record_status='A' and E.record_status='A' and V.record_status='A' and SD.record_status='A'\
    //      and PE.patient_id=P.hims_d_patient_id and E.hims_d_employee_id=PE.provider_id\
    //      and V.hims_f_patient_visit_id=PE.visit_id and V.sub_department_id=SD.hims_d_sub_department_id and\
    //      encounter_id <>'null' and PE.patient_id=?\
    //      order by encountered_date desc

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_patient_encounter_id, PE.patient_id,P.full_name,PE.provider_id,E.full_name as provider_name, visit_id,\
        V.insured,V.sec_insured,V.sub_department_id,SD.sub_department_name,PE.episode_id,PE.encounter_id,PE.updated_date as encountered_date,\
                primary_insurance_provider_id,IP.insurance_provider_name as pri_insurance_provider_name,\
            secondary_insurance_provider_id,IPR.insurance_provider_name as sec_insurance_provider_name  from hims_f_patient_encounter PE  inner join  hims_f_patient P on\
             PE.patient_id=P.hims_d_patient_id   inner join hims_d_employee E on E.hims_d_employee_id=PE.provider_id  inner join hims_f_patient_visit V on V.hims_f_patient_visit_id=PE.visit_id\
                inner join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id   left join hims_m_patient_insurance_mapping IM on\
                 V.hims_f_patient_visit_id=IM.patient_visit_id  left join hims_d_insurance_provider IP  on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id   left join hims_d_insurance_provider IPR  on \
         IM.secondary_insurance_provider_id=IPR.hims_d_insurance_provider_id   where PE.record_status='A' and P.record_status='A' and E.record_status='A' \
                 and V.record_status='A' and SD.record_status='A'   and encounter_id <>'null' and PE.patient_id=?\
                 order by encountered_date desc;",
        [req.query.patient_id],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get Patient Chief Complaint
let getPatientChiefComplaint = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_episode_chief_complaint_id ,episode_id,chief_complaint_id,HH.hpi_description as chief_complaint\
        from hims_f_episode_chief_complaint ECC,hims_d_hpi_header HH\
        Where ECC.record_status='A' and HH.record_status='A' \
        and ECC.chief_complaint_id=HH.hims_d_hpi_header_id and episode_id=?",
        [req.query.episode_id],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to  get Patient Diagnosis
let getPatientDiagnosis = (req, res, next) => {
  let selectWhere = {
    episode_id: "ALL",
    patient_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_patient_diagnosis_id, patient_id, episode_id, daignosis_id,ICD.icd_code as daignosis_code,\
        ICD.icd_description as daignosis_description  ,diagnosis_type, final_daignosis,\
        PD.created_date as diagnosis_date  from hims_f_patient_diagnosis PD,hims_d_icd ICD\
         where PD.record_status='A' and   ICD.record_status='A'\
         and PD.daignosis_id=ICD.hims_d_icd_id and " +
          where.condition +
          " order by diagnosis_date desc",
        where.values,
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to  get Patient medication
let getPatientMedication = (req, res, next) => {
  let selectWhere = {
    patient_id: "ALL",
    encounter_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select  hims_f_prescription_id, patient_id, encounter_id, provider_id, episode_id,\
        prescription_date, prescription_status , \
        hims_f_prescription_detail_id, prescription_id, item_id,IM.item_description, PD.generic_id, IG.generic_name, \
        dosage, frequency, no_of_days,\
        dispense, frequency_type, frequency_time, start_date, PD.service_id, uom_id, item_category_id, PD.item_status\
         from hims_f_prescription P,hims_f_prescription_detail PD,hims_d_item_master IM,hims_d_item_generic IG\
        where P.record_status='A' and IM.record_status='A' and IG.record_status='A' and \
        P.hims_f_prescription_id=PD.prescription_id and PD.item_id=IM.hims_d_item_master_id \
        and PD.generic_id =IG.hims_d_item_generic_id and " +
          where.condition +
          " order by prescription_date desc",
        where.values,
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to  get Patient Investigation
let getPatientInvestigation = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    // select hims_f_ordered_services_id, OS.patient_id, OS.visit_id,  doctor_id ,services_id,S.service_name,\
    //     L.billed as lab_billed, L.status as lab_ord_status,R.billed as rad_billed, R.status as rad_ord_status \
    //        from hims_f_ordered_services OS inner join hims_d_services S on  OS.services_id=S.hims_d_services_id \
    //        left join hims_f_lab_order L on OS.visit_id=L.visit_id  left join hims_f_rad_order R on OS.visit_id=R.visit_id \
    //                     where OS.record_status='A' and S.record_status='A' and OS.visit_id=?

    let conString = "";

    if (req.query.patient_id != null && req.query.patient_id != "null") {
      conString = "patient_id=" + req.query.patient_id;
    } else if (req.query.visit_id != null && req.query.visit_id != "null") {
      conString = "visit_id=" + req.query.visit_id;
    }

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_ordered_services_id, OS.patient_id, OS.visit_id,visit_date, OS.doctor_id,\
        E.full_name as provider_name, OS.service_type_id,\
                services_id,S.service_name,hims_f_lab_order_id, L.billed as lab_billed, \
        L.status as lab_ord_status,R.hims_f_rad_order_id,R.billed as rad_billed, R.status as rad_ord_status\
        from  hims_f_ordered_services OS \
         inner join hims_d_services S on  OS.services_id=S.hims_d_services_id \
         inner join hims_d_employee  E on OS.doctor_id=E.hims_d_employee_id\
          inner join hims_f_patient_visit V on OS.visit_id=V.hims_f_patient_visit_id\
         left join  hims_f_lab_order L on OS.visit_id=L.visit_id and OS.services_id= L.service_id\
         left join hims_f_rad_order R on OS.visit_id=R.visit_id  and OS.services_id=R.service_id\
         where OS." +
          conString +
          " group by hims_f_ordered_services_id order by OS.visit_id desc",

        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to  getPatientPaymentDetails
let getPatientPaymentDetails = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select distinct  visit_id from hims_f_billing_header where record_status='A' and patient_id=? order by visit_id desc;",
        [req.query.patient_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          let allVisits = new LINQ(result)
            .Where(w => w.visit_id != null)
            .Select(s => s.visit_id)
            .ToArray();

          debugLog("allVisits:", allVisits);

          let outputArray = [];
          if (result.length > 0) {
            //bill for each visit
            for (let i = 0; i < allVisits.length; i++) {
              connection.query(
                "select hims_f_billing_header_id ,bill_number,patient_id,visit_id,E.full_name provider_name,incharge_or_provider,bill_date,receipt_header_id,\
              net_amount,patient_payable,receiveable_amount,credit_amount from hims_f_billing_header BH,hims_d_employee E where BH.record_status='A' and\
               E.record_status='A' and BH.incharge_or_provider=E.hims_d_employee_id and visit_id=? order by bill_date desc;",
                [allVisits[i]],
                (error, billHeadResult) => {
                  if (error) {
                    releaseDBConnection(db, connection);
                    next(error);
                  }
                  debugLog("inside billHeadResult:", billHeadResult);
                  debugLog("zzzzz:", outputArray);
                  if (billHeadResult.length > 0) {
                    for (let k = 0; k < billHeadResult.length; k++) {
                      new Promise((resolve, reject) => {
                        try {
                          if (billHeadResult.length == 0) {
                            debugLog("blank :");
                            return resolve(billHeadResult);
                          } else {
                            connection.query(
                              "select hims_f_receipt_header_id, receipt_number, receipt_date, billing_header_id, total_amount\
                          from hims_f_receipt_header where record_status='A' and hims_f_receipt_header_id=?;",
                              [billHeadResult[k].receipt_header_id],
                              (error, recptResult) => {
                                if (error) {
                                  releaseDBConnection(db, connection);
                                  next(error);
                                }

                                return resolve(recptResult);
                              }
                            );
                          }
                        } catch (e) {
                          reject(e);
                        }
                      }).then(resultRCPT => {
                        connection.query(
                          "select BH.hims_f_billing_header_id,company_payable as pri_company_payble, sec_company_payable,\
                          hims_f_patient_insurance_mapping_id,IM.patient_id,primary_insurance_provider_id,IP.insurance_provider_name as pri_insurance_provider_name,\
                          secondary_insurance_provider_id,IPR.insurance_provider_name as sec_insurance_provider_name \
                          from  hims_f_billing_header BH \
                           left join hims_m_patient_insurance_mapping IM on  BH.visit_id=IM.patient_visit_id and   IM.record_status='A'\
                           left join hims_d_insurance_provider IP  on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id and   IP.record_status='A'  \
                           left join hims_d_insurance_provider IPR  on  IM.secondary_insurance_provider_id=IPR.hims_d_insurance_provider_id   \
                          where BH.record_status='A'  and   BH.hims_f_billing_header_id=?",
                          [billHeadResult[k].hims_f_billing_header_id],
                          (error, insResult) => {
                            if (error) {
                              releaseDBConnection(db, connection);
                              next(error);
                            }
                            debugLog("inside insurance:", insResult);
                            outputArray.push({
                              ...billHeadResult[k],
                              prov_date:
                                moment(billHeadResult[k].bill_date).format(
                                  "DD-MM-YYYY"
                                ) +
                                " " +
                                billHeadResult[k].provider_name,
                              ...insResult[0],
                              receipt: resultRCPT
                            });

                            debugLog("outputArray:", outputArray);
                            if (i == allVisits.length - 1) {
                              releaseDBConnection(db, connection);
                              req.records = outputArray;
                              next();
                            }
                          }
                        );
                      });
                    }
                  } else {
                    if (i == allVisits.length - 1) {
                      debugLog("inside else no bill head:");
                      releaseDBConnection(db, connection);
                      req.records = outputArray;

                      debugLog("eee:", outputArray);
                      next();
                    }
                  }
                }
              );
            }
          } else {
            releaseDBConnection(db, connection);
            req.records = result;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to  get Patient procedures or treatments
let getPatientTreatments = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_service_type_id from hims_d_service_type  where \
        record_status='A' and service_type='Procedure'",
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          if (result.length > 0) {
            connection.query(
              "select hims_f_ordered_services_id,OS.patient_id,OS.doctor_id,E.full_name as doctor_name,OS.service_type_id,V.visit_date,OS.services_id,OS.teeth_number,\
        S.service_name,S.service_desc from hims_f_ordered_services OS ,hims_f_patient_visit V,hims_d_services S,hims_d_employee E\
        where OS.record_status='A' and V.record_status='A' and S.record_status='A' and E.record_status='A' and \
        OS.visit_id=V.hims_f_patient_visit_id and OS.services_id=S.hims_d_services_id and OS.doctor_id=E.hims_d_employee_id \
        and OS.service_type_id=? and OS.patient_id=? order by visit_date desc",
              [result[0].hims_d_service_type_id, req.query.patient_id],

              (error, procResult) => {
                releaseDBConnection(db, connection);
                if (error) {
                  next(error);
                }
                req.records = procResult;
                next();
              }
            );
          } else {
            req.records = result;
            releaseDBConnection(db, connection);
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

export default {
  getPatientMrdList,
  getPatientEncounterDetails,
  getPatientChiefComplaint,
  getPatientDiagnosis,
  getPatientMedication,
  getPatientInvestigation,
  getPatientPaymentDetails,
  getPatientTreatments
};
