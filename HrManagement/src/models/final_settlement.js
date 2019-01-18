import utlities from "algaeh-utilities";
import algaehMysql from "algaeh-mysql";
import _ from "lodash";
module.exports = {
  finalSettlement: (req, res, next) => {
    const _input = req.query;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select employee_id,loan_id,application_reason,hims_f_loan_application_id,approved_amount, loan_amount,\
            installment_amount,pending_loan,loan_tenure,start_month,start_year,loan_application_date,L.loan_description \
            from hims_f_loan_application,hims_d_loan L where loan_authorized = 'APR' and loan_closed='N' and loan_amount >0 \
            and employee_id=? and L.hims_d_loan_id=hims_f_loan_application.loan_id; \
            select gratuity_in_final_settle from hims_d_hrms_options;\
            select sum(net_salary)total_salary from hims_f_salary where employee_id=? \
            and salary_settled='N' and salary_paid='N' group by employee_id; \
            SELECT sum(total_amount)total_leave_amount FROM hims_f_leave_encash_header \
            where employee_id =? and authorized='APR' group by employee_id; \
            select  E.date_of_joining,E.hims_d_employee_id,E.date_of_resignation,E.employee_status,\
E.employee_code,E.full_name,E.arabic_name,E.sex,E.employee_type ,E.title_id,T.title ,T.arabic_title,\
  E.sub_department_id,E.employee_designation_id,E.date_of_birth,SD.sub_department_name,SD.arabic_sub_department_name \
  from hims_d_employee E Left join hims_d_sub_department SD \
 on SD.hims_d_sub_department_id = E.sub_department_id \
 left join hims_d_title T \
 on T.his_d_title_id = E.title_id \
 where E.hims_d_employee_id=? ",
          values: [
            _input.employee_id,
            _input.employee_id,
            _input.employee_id,
            _input.employee_id
          ]
        })
        .then(result => {
          const _loanList = result[0];
          const _options = result[1];
          const _total_salary_amount =
            result[2].length === 0 ? 0 : result[2][0]["total_salary"];
          const _total_leave_encash =
            result[3].length === 0 ? 0 : result[3][0]["total_leave_amount"];
          endOfServiceDicession({
            result: _options[0],
            employee_id: _input.employee_id,
            mysql: _mysql
          })
            .then(data => {
              const _total_loan_amount = _.chain(_loanList).sumBy(
                s => s.pending_loan
              );
              let _gratuity = 0;
              if (data !== null) {
                _gratuity =
                  data.length === 0 ? 0 : data[0].calculated_gratutity_amount;
              }
              req.records = {
                ..._.first(result[4], 0),
                loans: _loanList,
                total_loan_amount: _total_loan_amount,
                gratuity_amount: _gratuity,
                total_salary: _total_salary_amount,
                total_leave_encash_amount: _total_leave_encash
              };
              next();
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
function endOfServiceDicession(options) {
  const _mysql = options.mysql;
  return new Promise((resolve, reject) => {
    if (options.result.gratuity_in_final_settle === "Y") {
      _mysql
        .executeQuery({
          query:
            "select end_of_service_number,calculated_gratutity_amount,payable_amount\
             from hims_f_end_of_service where employee_id=? and gratuity_status != 'PAI'",
          values: [options.employee_id]
        })
        .then(endofServiceResult => {
          resolve(endofServiceResult);
        })
        .catch(e => {
          reject(e);
        });
    } else {
      resolve(null);
    }
  });
}
