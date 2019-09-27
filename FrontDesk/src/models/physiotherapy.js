import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
import moment from "moment";
export default {
  getPhysiotherapyTreatment: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const utilities = new algaehUtilities();

      _mysql
        .executeQuery({
          query:
            "select H.*,D.*, P.full_name,P.patient_code,P.employee_id,E.full_name as doctor_name from hims_f_physiotherapy_header H \
            left join  hims_f_physiotherapy_detail D on H.hims_f_physiotherapy_header_id=D.physiotherapy_header_id \
            inner join hims_f_patient P on P.hims_d_patient_id=H.patient_id \
            inner join hims_d_employee E on E.hims_d_employee_id=H.referred_doctor_id where H.hospital_id=?",
          values: [req.userIdentity.hospital_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  savePhysiotherapyTreatment: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputparam = { ...req.body };
      let strQry = "";
      for (
        let k = 0;
        k < inputparam.physiotherapy_treatment_detail.length;
        k++
      ) {
        if (
          inputparam.physiotherapy_treatment_detail[k]
            .hims_f_physiotherapy_detail_id == null
        ) {
          strQry += mysql.format(
            "INSERT INTO `hims_f_physiotherapy_detail`(`physiotherapy_header_id`, `session_status`,\
            `session_date`, `session_time`, `physiotherapy_type`, `others_specify`, `treatment_remarks`) \
            VALUE(?, ?, ?, ?, ?, ?, ?);",
            [
              inputparam.physiotherapy_treatment_detail[k]
                .physiotherapy_header_id,
              inputparam.physiotherapy_treatment_detail[k].session_status,
              inputparam.physiotherapy_treatment_detail[k].session_date,
              inputparam.physiotherapy_treatment_detail[k].session_time,
              inputparam.physiotherapy_treatment_detail[k].physiotherapy_type,
              inputparam.physiotherapy_treatment_detail[k].others_specify,
              inputparam.physiotherapy_treatment_detail[k].treatment_remarks
            ]
          );
        } else {
          strQry += mysql.format(
            "UPDATE `hims_f_physiotherapy_detail` SET session_status=?, session_date=?,session_time=?,`physiotherapy_type`=?, `others_specify`=?, `treatment_remarks`=? WHERE hims_f_physiotherapy_detail_id=?;",
            [
              inputparam.physiotherapy_treatment_detail[k].session_status,
              inputparam.physiotherapy_treatment_detail[k].session_date,
              inputparam.physiotherapy_treatment_detail[k].session_time,
              inputparam.physiotherapy_treatment_detail[k].physiotherapy_type,
              inputparam.physiotherapy_treatment_detail[k].others_specify,
              inputparam.physiotherapy_treatment_detail[k].treatment_remarks,
              inputparam.physiotherapy_treatment_detail[k]
                .hims_f_physiotherapy_detail_id
            ]
          );
        }
      }

      _mysql
        .executeQuery({
          query:
            "UPDATE hims_f_physiotherapy_header set physioth_diagnosis=?, no_of_session=? , physioth_doctor_id=? \
            where hims_f_physiotherapy_header_id=?;" +
            strQry,
          values: [
            inputparam.physioth_diagnosis,
            inputparam.no_of_session,
            inputparam.physioth_doctor_id,
            inputparam.hims_f_physiotherapy_header_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
