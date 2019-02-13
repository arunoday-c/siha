import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import extend from "extend";
import moment from "moment";
import { LINQ } from "node-linq";
//import utilities from "algaeh-utilities";
import algaehUtilities from "algaeh-utilities/utilities";
//import { getMaxAuth } from "../../../src/utils";
// import Sync from "sync";

module.exports = {
  //created by irfan: to
  getEmployeesForShiftRoster: (req, res, next) => {
    const _mysql = new algaehMysql();

    let subdept = "";
    let employee = "";

    if (req.query.sub_department_id > 0) {
      subdept = ` and E.sub_department_id=${req.query.sub_department_id} `;
    }
    if (req.query.hims_d_employee_id > 0) {
      employee = ` and E.hims_d_employee_id=${req.query.hims_d_employee_id} `;
    }
    _mysql
      .executeQuery({
        query: `select hims_d_employee_id,employee_code,full_name as employee_name,sub_department_id,\
         date_of_joining,exit_date , SD.sub_department_code,SD.sub_department_name ,D.designation_code,D.designation\
         from hims_d_employee E inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
         left join hims_d_designation D on E.employee_designation_id=D.hims_d_designation_id\
         where E.record_status='A' and E.employee_status='A' and E.hospital_id=? ${subdept} ${employee} `,
        values: [req.query.hospital_id]
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
  }
};
