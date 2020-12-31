const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // console.log("INPUT:", input);
      // if (input.department_id) {
      //   str += ` and EM.department_id= '${input.department_id}'`;
      // }
      if (input.sub_department_id) {
        str += ` and EM.sub_department_id= '${input.sub_department_id}'`;
      }
      // if (input.designation_id) {
      //   str += ` and EM.designation_id= '${input.designation_id}'`;
      // }
      if (input.hims_d_employee_id) {
        // str += ` and EM.employee_id= '${input.hims_d_employee_id}'`;
        str += ` and EM.hims_d_employee_id= '${input.hims_d_employee_id}'`;
      }
      if (input.group_id) {
        str += ` and EM.employee_group_id= '${input.group_id}'`;
      }

      options.mysql
        .executeQuery({
          query: `
          SELECT LH.employee_id,EM.employee_code, EM.full_name,DS.designation, 
          EM.date_of_joining,EE.amount as basic_salary, max(LD.year) as year, 
          MONTHNAME(CONCAT('2011-',LD.month,'-01')) as deducting_month, 
          LD.leave_salary_amount, 
          LD.leave_days, 
          LD.airticket_amount,
          LD.month,
          LH.opening_leave_days,
          LH.opening_leave_salary,
          LH.opening_airticket,
          LH.utilized_leave_days,
          LH.utilized_leave_salary_amount,
          LH.utilized_airticket_amount
          FROM hims_f_employee_leave_salary_header LH
          inner join hims_f_employee_leave_salary_detail LD on LD.employee_leave_salary_header_id = LH.hims_f_employee_leave_salary_header_id
          inner join hims_d_employee as EM on LH.employee_id = EM.hims_d_employee_id
          inner join hims_d_designation as DS on DS.hims_d_designation_id = EM.employee_designation_id
          inner join hims_f_salary as SL on SL.employee_id = LH.employee_id and SL.year=? and SL.month=? and salary_paid='Y'
          inner join hims_d_employee_earnings as EE on EE.employee_id = EM.hims_d_employee_id and earnings_id=(select basic_earning_component from hims_d_hrms_options limit 1)
          where EM.employee_status <> 'I' and EM.hospital_id=?  and LD.year=?  and LD.month <= ? ${str}
          group by LD.month, LD.leave_salary_amount,LD.leave_days,LD.airticket_amount, LH.employee_id, LH.hims_f_employee_leave_salary_header_id
          -- ,LH.utilized_leave_days,LH.utilized_leave_salary_amount,LH.utilized_airticket_amount
          -- ,LH.opening_leave_days,LH.opening_leave_salary,LH.opening_airticket
          order by LH.employee_id,LD.month;`,
          values: [
            input.year,
            parseInt(input.month),
            input.hospital_id,
            input.year,
            parseInt(input.month),
          ],
          printQuery: true,
        })
        .then((result) => {
          // const header = result.length ? result[0] : {};

          const newResult = _.chain(result)
            .groupBy((g) => g.employee_id)
            .map((item) => {
              const {
                opening_leave_salary,
                opening_airticket,
                opening_leave_days,
                utilized_leave_days,
                utilized_leave_salary_amount,
                utilized_airticket_amount,
              } = _.head(item);

              const lastObject = _.maxBy(item, (m) => parseInt(m.month));

              const total_leave_salary_amount =
                _.sumBy(item, (s) => parseFloat(s.leave_salary_amount)) +
                parseFloat(opening_leave_salary) -
                parseFloat(utilized_leave_salary_amount);

              const total_airticket_amount =
                _.sumBy(item, (s) => parseFloat(s.airticket_amount)) +
                parseFloat(opening_airticket) -
                parseFloat(utilized_airticket_amount);

              const total_leave_days =
                _.sumBy(item, (s) => parseFloat(s.leave_days)) +
                parseFloat(opening_leave_days) -
                parseFloat(utilized_leave_days);

              const leavesalary_opening_balance =
                _.sumBy(item, (s) => parseFloat(s.leave_salary_amount)) +
                parseFloat(opening_leave_salary) -
                parseFloat(lastObject.leave_salary_amount);

              const airefare_opening_balance =
                _.sumBy(item, (s) => parseFloat(s.airticket_amount)) +
                parseFloat(opening_airticket) -
                parseFloat(lastObject.airticket_amount);

              const leavedays_opening_balance =
                _.sumBy(item, (s) => parseFloat(s.leave_days)) +
                parseFloat(opening_leave_days) -
                parseFloat(lastObject.leave_days);

              return {
                ...lastObject,
                leavesalary_opening_balance,
                leavedays_opening_balance,
                airefare_opening_balance,
                total_leave_salary_amount,
                total_airticket_amount,
                total_leave_days,
              };
            })
            .value();
          const grand_total_basic_salary = _.sumBy(newResult, (s) =>
            parseFloat(s.basic_salary)
          );
          const grand_total_opening_leave = _.sumBy(newResult, (s) =>
            parseFloat(s.leavedays_opening_balance)
          );
          const grand_total_utilized_leave_days = _.sumBy(newResult, (s) =>
            parseFloat(s.utilized_leave_days)
          );
          const grand_total_accured_leave = _.sumBy(newResult, (s) =>
            parseFloat(s.leave_days)
          );
          const grand_total_leave_days = _.sumBy(newResult, (s) =>
            parseFloat(s.total_leave_days)
          );
          const grand_opening_leave_salary = _.sumBy(newResult, (s) =>
            parseFloat(s.leavesalary_opening_balance)
          );
          const grand_total_utilized_leave_salary_amount = _.sumBy(
            newResult,
            (s) => parseFloat(s.utilized_leave_salary_amount)
          );
          const grand_total_accured_leave_salary = _.sumBy(newResult, (s) =>
            parseFloat(s.leave_salary_amount)
          );
          const grand_total_leave_salary = _.sumBy(newResult, (s) =>
            parseFloat(s.total_leave_salary_amount)
          );
          const grand_total_airfare_opening_balance = _.sumBy(newResult, (s) =>
            parseFloat(s.airefare_opening_balance)
          );
          const grand_total_utilized_airticket_amount = _.sumBy(
            newResult,
            (s) => parseFloat(s.utilized_airticket_amount)
          );
          const grand_total_airticket_amount = _.sumBy(newResult, (s) =>
            parseFloat(s.airticket_amount)
          );
          const grand_total_balance_airticket_amount = _.sumBy(newResult, (s) =>
            parseFloat(s.total_airticket_amount)
          );

          resolve({
            result: newResult, //result,
            // header,
            deducting_month: moment.months(parseInt(input.month) - 1),
            year: input.year,
            grand_total_basic_salary,
            grand_total_opening_leave,
            grand_total_utilized_leave_days,
            grand_total_accured_leave,
            grand_total_leave_days,
            grand_opening_leave_salary,
            grand_total_utilized_leave_salary_amount,
            grand_total_accured_leave_salary,
            grand_total_airfare_opening_balance,
            grand_total_utilized_airticket_amount,
            grand_total_leave_salary,
            grand_total_airticket_amount,
            grand_total_balance_airticket_amount,
            decimalOnly: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
            currencyOnly: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
          });
        })
        .catch((error) => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
