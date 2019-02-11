import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import { LINQ } from "node-linq";
import _ from "lodash";
module.exports = {
  //created by irfan: to
  getHrmsOptions: (req, res, next) => {
    const _mysql = new algaehMysql();

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
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to
  updateHrmsOptions: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };

    _mysql
      .executeQuery({
        query:
          "update hims_d_hrms_options set salary_process_date=?,salary_pay_before_end_date=?,payroll_payment_date=?,\
          salary_calendar=?,salary_calendar_fixed_days=?,attendance_type=?,fetch_punch_data_reporting=?,\
          leave_level=?,loan_level=?,leave_encash_level=?,review_auth_level=?,\
          yearly_working_days=?,advance_deduction=?,overtime_type=?,overtime_payment=?,overtime_calculation=?,\
          overtime_hourly_calculation=?,standard_intime=?,standard_outime=?,standard_working_hours=?,\
          standard_break_hours=?,biometric_database=?,biometric_server_name=?,biometric_port_no=?,\
          biometric_database_name=?,biometric_database_login=?,biometric_database_password=?,biometric_swipe_id=?,\
          updated_date=?,updated_by=? where hims_d_hrms_options_id=?",
        values: [
          input.salary_process_date,
          input.salary_pay_before_end_date,
          input.payroll_payment_date,
          input.salary_calendar,
          input.salary_calendar_fixed_days,
          input.attendance_type,
          input.fetch_punch_data_reporting,
          input.leave_level,
          input.loan_level,
          input.leave_encash_level,
          input.review_auth_level,
          input.yearly_working_days,
          input.advance_deduction,
          input.overtime_type,
          input.overtime_payment,
          input.overtime_calculation,
          input.overtime_hourly_calculation,
          input.standard_intime,
          input.standard_outime,
          input.standard_working_hours,
          input.standard_break_hours,
          input.biometric_database,
          input.biometric_server_name,
          input.biometric_port_no,
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
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to
  getEosOptions: (req, res, next) => {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query: "select * from hims_d_end_of_service_options;",

        printQuery: true
      })
      .then(result => {
        let componentArray = [];
        let fromServiceArray = [];
        let eligibleDaysArray = [];

        componentArray.push(
          result[0]["end_of_service_component1"],
          result[0]["end_of_service_component2"],
          result[0]["end_of_service_component3"],
          result[0]["end_of_service_component4"]
        );

        fromServiceArray.push(
          result[0]["from_service_range1"],
          result[0]["from_service_range2"],
          result[0]["from_service_range3"],
          result[0]["from_service_range4"],
          result[0]["from_service_range5"]
        );

        eligibleDaysArray.push(
          result[0]["eligible_days1"],
          result[0]["eligible_days2"],
          result[0]["eligible_days3"],
          result[0]["eligible_days4"],
          result[0]["eligible_days5"]
        );

        if (result.length > 0) {
          _mysql
            .executeQuery({
              query:
                "select hims_d_earning_deduction_id, earning_deduction_code, earning_deduction_description from \
                        hims_d_earning_deduction where hims_d_earning_deduction_id  in (?)",
              values: [componentArray],

              printQuery: true
            })
            .then(earning_comp => {
              _mysql.releaseConnection();
              req.records = {
                ...result[0],
                earning_comp,
                fromServiceArray,
                eligibleDaysArray
              };
              next();
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "no data found"
          };

          next();
          return;
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to
  updateEosOptions: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };

    _mysql
      .executeQuery({
        query:
          "update hims_d_end_of_service_options  set end_of_service_component1=?,end_of_service_component2=?,end_of_service_component3=?,\
          end_of_service_component4=?,from_service_range1=?,from_service_range2=?,from_service_range3=?,\
          from_service_range4=?,from_service_range5=?,eligible_days1=?,eligible_days2=?,eligible_days3=?,\
          eligible_days4=?,eligible_days5=?,end_of_service_calculation=?,end_of_service_days=?,\
          end_of_service_type=?,gratuity_in_final_settle=?,round_off_nearest_year=?, terminate_salary=?,end_of_service_payment=?,\
          end_of_service_years=?, pending_salary_with_final=?, limited_years=?,updated_by=?,updated_date=? \
                   where hims_d_end_of_service_options_id=?",
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
          input.gratuity_in_final_settle,
          input.round_off_nearest_year,
          input.terminate_salary,
          input.end_of_service_payment,
          input.end_of_service_years,
          input.pending_salary_with_final,
          input.limited_years,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          1
        ],

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
  },

  getSalarySetUp: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT hims_d_earning_deduction_id,earning_deduction_description,earning_deduction_code,short_desc FROM algaeh_hims_db.hims_d_earning_deduction where component_category='E' and miscellaneous_component='N' and record_status='A';"
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        });
    } catch (error) {
      _mysql.releaseConnection();
      next(error);
    }
  },

  getLeaveSalaryOptions: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT basic_earning_component,airfare_factor,annual_leave_process_separately,airfare_percentage FROM algaeh_hims_db.hims_d_hrms_options;"
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        });
    } catch (error) {
      _mysql.releaseConnection();
      next(error);
    }
  },

  //created by Adnan: to
  updateLeaveSalaryOptions: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };

    _mysql
      .executeQuery({
        query:
          "update hims_d_hrms_options set \
          annual_leave_process_separately=?,airfare_factor=?,basic_earning_component=?,airfare_percentage=?,\
          updated_date=?,updated_by=? where hims_d_hrms_options_id=?",
        values: [
          input.annual_leave_process_separately,
          input.airfare_factor,
          input.basic_earning_component,
          input.airfare_percentage,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          1
        ],

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
  }
};
