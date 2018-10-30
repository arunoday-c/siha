"use strict";
import extend from "extend";
import {
 
  whereCondition,
  releaseDBConnection
} from "../utils";
import moment from "moment";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import { debugLog } from "../utils/logging";




//created by irfan: to get 
let getPatientUCAF = (req, res, next) => {
    try {
      if (req.db == null) {
        next(httpStatus.dataBaseNotInitilizedError());
      }
      let db = req.db;
  
      
  
      db.getConnection((error, connection) => {
        connection.query(
          "select   hims_d_hospital_id,H.hospital_name,H.arabic_hospital_name,P.patient_code,P.full_name as patient_name,\
          P.arabic_name,P.marital_status,V.visit_date,V.visit_code, V.sub_department_id,SD.sub_department_name,\
          SD.arabic_sub_department_name,V.appointment_patient,V.new_visit_patient,V.doctor_id,E.full_name as doctor_name,\
          primary_insurance_provider_id as pri_TPA_id ,IP.insurance_provider_name as pri_TPA_company_name,\
          IM.primary_sub_id,SI.insurance_sub_name as pri_insurance_company,\
          secondary_insurance_provider_id as sec_TPA_id,IPR.insurance_provider_name as sec_TPA_company_name ,\
          IM.secondary_sub_id,SIN.insurance_sub_name as sec_insurance_company from  \
           hims_f_patient P inner join hims_f_patient_visit V on P.hims_d_patient_id=V.patient_id  and P.record_status='A' \
          inner join  hims_d_hospital H on V.hospital_id=H.hims_d_hospital_id and H.record_status='A'\
          inner join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id and V.record_status='A' and SD.record_status='A'\
          inner join hims_d_employee E on E.hims_d_employee_id=V.doctor_id and E.record_status='A'\
          left join hims_m_patient_insurance_mapping IM on V.hims_f_patient_visit_id=IM.patient_visit_id  and IM.record_status='A'\
          left join hims_d_insurance_provider IP  on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id  and IP.record_status='A'\
          left join hims_d_insurance_provider IPR  on IM.secondary_insurance_provider_id=IPR.hims_d_insurance_provider_id and IPR.record_status='A'\
          left join hims_d_insurance_sub SI on IM.primary_sub_id=SI.hims_d_insurance_sub_id and SI.record_status='A'\
          left join hims_d_insurance_sub SIN on IM.secondary_sub_id=SIN.hims_d_insurance_sub_id and SIN.record_status='A' \
           where P.hims_d_patient_id=? and V.visit_date=?;",
          [req.query.patient_id,req.query.visit_date],
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

module.exports = {
 
    getPatientUCAF
    
  };