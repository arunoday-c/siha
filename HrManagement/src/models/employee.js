import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import utilities from "algaeh-utilities";
import moment from "moment";
module.exports = {
  addMisEarnDedcToEmployee: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };
    _mysql
      .executeQuery({
        values: input.employees,
        includeValues: ["employee_id", "amount"],
        extraValues: {
          earning_deductions_id: input.earning_deduction_id,
          year: input.year,
          month: input.month,
          category: input.category,

          created_by: req.userIdentity.algaeh_d_app_user_id,
          created_date: new Date(),
          updated_by: req.userIdentity.algaeh_d_app_user_id,
          updated_date: new Date()
        },

        query:
          "insert into  hims_f_miscellaneous_earning_deduction (??) values ? ON DUPLICATE KEY UPDATE ?",
        printQuery: query => {
          utilities
            .AlgaehUtilities()
            .logger()
            .log("Query ", query);
        },
        bulkInsertOrUpdate: true
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
