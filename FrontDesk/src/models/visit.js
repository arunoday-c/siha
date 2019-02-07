import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

module.exports = {
  closeVisit: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        const inputParam = req.body;
        const utilities = new algaehUtilities();
        /* Select statemwnt  */

        utilities.logger().log("inputParam: ", inputParam);

        let qry = "";
        for (let i = 0; i < inputParam.length; i++) {
          utilities
            .logger()
            .log("inputParam: ", inputParam[i].hims_f_patient_visit_id);
          qry += mysql.format(
            "UPDATE `hims_f_patient_visit` SET visit_status='C' WHERE hims_f_patient_visit_id=?;",
            [inputParam[i].hims_f_patient_visit_id]
          );
        }
        utilities.logger().log("qry: ", qry);
        if (qry != "") {
          _mysql
            .executeQuery({
              query: qry,
              printQuery: true
            })
            .then(patient_details => {
              _mysql.releaseConnection();
              req.records = patient_details;
              resolve(patient_details);
              next();
            })
            .catch(e => {
              reject(e);
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = [];
          resolve([]);
          next();
        }
      } catch (e) {
        next(e);
        reject(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  checkVisitExists: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        let inputParam = req.query;

        const utilities = new algaehUtilities();
        /* Select statemwnt  */

        utilities.logger().log("inputParam: ", inputParam);

        _mysql
          .executeQuery({
            query:
              "select visit_code from hims_d_sub_department,hims_f_patient_visit where \
          hims_f_patient_visit.sub_department_id=hims_d_sub_department.hims_d_sub_department_id \
          and hims_d_sub_department.record_status='A' and hims_f_patient_visit.record_status='A' \
          and hims_f_patient_visit.visit_date =DATE(now()) and hims_d_sub_department.hims_d_sub_department_id=?\
          and hims_f_patient_visit.doctor_id=? and patient_id =? ",
            values: [
              inputParam.sub_department_id,
              inputParam.doctor_id,
              inputParam.patient_id
            ],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(e => {
            reject(e);
            next(e);
          });
      } catch (e) {
        next(e);
        reject(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  }
};
