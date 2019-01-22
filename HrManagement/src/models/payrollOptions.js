import algaehMysql from "algaeh-mysql";
// import _ from "lodash";
// import moment from "moment";
//import { LINQ } from "node-linq";
import utilities from "algaeh-utilities";
//import Sync from "sync";
module.exports = {
  //created by irfan: to

  getHrmsOptions: (req, res, next) => {
    console.log("First Hit");
    const _mysql = new algaehMysql();

    console.log("im here");

    _mysql
      .executeQuery({
        query:
          "select hims_d_hrms_options_id,salary_process_date,salary_calendar,salary_calendar_fixed_days,\
        attendance_type,gratuity_in_final_settle,leave_level,loan_level,leave_encash_level,\
        yearly_working_days,end_of_service_calculation ,review_auth_level,advance_deduction from hims_d_hrms_options",

        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        next(e);
      });
  },
  updateHrmsOptions: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };

    _mysql
      .executeQuery({
        query:
          "update hims_d_hrms_options set salary_process_date=?,salary_calendar=?,salary_calendar_fixed_days=?,\
          attendance_type=?,gratuity_in_final_settle=?,leave_level=?,loan_level=?,leave_encash_level=?,\
          review_auth_level=?,yearly_working_days=?,end_of_service_calculation =?,advance_deduction=?,updated_date=?,updated_by=? where hims_d_hrms_options_id=?",
        values: [
          input.salary_process_date,
          input.salary_calendar,
          input.salary_calendar_fixed_days,
          input.attendance_type,
          input.gratuity_in_final_settle,
          input.leave_level,
          input.loan_level,
          input.leave_encash_level,
          input.review_auth_level,
          input.yearly_working_days,
          input.end_of_service_calculation,
          input.advance_deduction,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.hims_d_hrms_options_id
        ],

        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        next(e);
      });
  }
};
