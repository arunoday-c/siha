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
        query: "select * from hims_d_hrms_options",

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
          "update hims_d_hrms_options set salary_process_date=?,salary_pay_before_end_date=?, payroll_payment_date=?,salary_calendar=?,salary_calendar_fixed_days=?,\
          attendance_type=?, fetch_punch_data_reporting=?,gratuity_in_final_settle=?,leave_level=?,loan_level=?,leave_encash_level=?,\
          review_auth_level=?,yearly_working_days=?,end_of_service_calculation =?,advance_deduction=?, overtime_payment=? , overtime_calculation=?,\
          overtime_hourly_calculation=?, standard_intime=? , standard_outime=?, standard_working_hours=?, standard_break_hours=?,\
          biometric_database=?, biometric_server_name=?, biometric_database_name=?, biometric_database_login=?, biometric_database_password=?, biometric_swipe_id=?, updated_date=?,updated_by=? where hims_d_hrms_options_id=?",
        values: [
          input.salary_process_date,
          input.salary_pay_before_end_date,
          input.payroll_payment_date,
          input.salary_calendar,
          input.salary_calendar_fixed_days,
          input.attendance_type,
          input.fetch_punch_data_reporting,
          input.gratuity_in_final_settle,
          input.leave_level,
          input.loan_level,
          input.leave_encash_level,
          input.review_auth_level,
          input.yearly_working_days,
          input.end_of_service_calculation,
          input.advance_deduction,
          input.overtime_payment,
          input.overtime_calculation,
          input.overtime_hourly_calculation,
          input.standard_intime,
          input.standard_outime,
          input.standard_working_hours,
          input.standard_break_hours,
          input.biometric_database,
          input.biometric_server_name,
          input.biometric_database_name,
          input.biometric_database_login,
          input.biometric_database_password,
          input.biometric_swipe_id,
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
  },

  getEosOptions: (req, res, next) => {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query: "select * from hims_d_end_of_service_options",

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
  updateEosOptions: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };

    _mysql
      .executeQuery({
        query:
          "update hims_d_end_of_service_options  set end_of_service_component1=?,end_of_service_component2=?,\
          end_of_service_component3=?,end_of_service_component4=?,from_service_range1=?,from_service_range2=?,\
          from_service_range3=?,from_service_range4=?,from_service_range5=?,eligible_days1=?,eligible_days2=?,eligible_days3=?,\
          eligible_days4=?,eligible_days5=?,end_of_service_calculation=?,end_of_service_days=?,end_of_service_type=?\
          ,updated_date=?,updated_by=? where hims_d_end_of_service_options_id=?",
        values: [
          input.end_of_service_component1,
          input.end_of_service_component2,
          input.end_of_service_component3,
          input.end_of_service_component4,
          input.from_service_range1,
          input.from_service_range2,
          input.from_service_range3,
          input.from_service_range4,
          input.from_service_range5,
          input.eligible_days1,
          input.eligible_days2,
          input.eligible_days3,
          input.eligible_days4,
          input.eligible_days5,
          input.end_of_service_calculation,
          input.end_of_service_days,
          input.end_of_service_type,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.hims_d_end_of_service_options_id
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
