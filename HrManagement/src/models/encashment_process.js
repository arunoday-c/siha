import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import utilities from "algaeh-utilities";

module.exports = {
  getEncashmentToProcess: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _EncashDetails = req.query;

    /* Select statemwnt  */

    _mysql
      .executeQuery({
        query:
          "select hims_f_employee_monthly_leave_id,leave_id,hims_f_employee_monthly_leave.employee_id,`year`,close_balance,encashment_leave, \
          leaEncash.earnings_id, leaEncash.percent, empEarn.amount,\
          CASE when close_balance < encashment_leave then sum( ((empEarn.amount *12/365)*(leaEncash.percent/100))*close_balance) else \
          sum(((empEarn.amount *12/365)*(leaEncash.percent/100))*encashment_leave)  end leave_amount , case when close_balance < encashment_leave then\
          close_balance else encashment_leave end leave_days from \
          hims_f_employee_monthly_leave, hims_d_leave lea, hims_d_leave_encashment leaEncash, hims_d_employee_earnings empEarn where \
          hims_f_employee_monthly_leave.employee_id=? and `year`=? and hims_f_employee_monthly_leave.leave_id = lea.hims_d_leave_id and lea.leave_encash='Y' and\
          hims_f_employee_monthly_leave.leave_id = leaEncash.leave_header_id and leaEncash.earnings_id = empEarn.earnings_id and \
          empEarn.employee_id=hims_f_employee_monthly_leave.employee_id group by leave_id ;",
        values: [_EncashDetails.employee_id, _EncashDetails.year]
        // printQuery: true
      })
      .then(monthlyLeaves => {
        _mysql.releaseConnection();
        utilities
          .AlgaehUtilities()
          .logger()
          .log("monthlyLeaves: ", monthlyLeaves);

        req.records = monthlyLeaves;
        next();

        utilities
          .AlgaehUtilities()
          .logger()
          .log("monthlyLeaves: ", monthlyLeaves);
      })
      .catch(e => {
        next(e);
      });
  },

  getLeaveEncashLevels: (req, res, next) => {
    try {
      let userPrivilege = req.userIdentity.loan_authorize_privilege;

      let auth_levels = [];
      switch (userPrivilege) {
        case "AL1":
          auth_levels.push({ name: "Level 1", value: 1 });
          break;
        case "AL2":
          auth_levels.push(
            { name: "Level 2", value: 2 },
            { name: "Level 1", value: 1 }
          );
          break;
      }

      req.records = { auth_levels };
      next();
    } catch (e) {
      next(e);
    }
  }
};
