const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // console.log("INPUT:", input);
      // if (input.department_id) {
      //   str += ` and EM.department_id= '${input.department_id}'`;
      // }

      if (input.hospital_id > 0) {
        str += ` and EM.hospital_id= ${input.hospital_id}`;
      }

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
          SELECT LH.employee_id, opening_leave_salary, opening_airticket, opening_leave_days, LD.leave_days, 
          LD.leave_salary_amount, LD.airticket_amount,
          EM.employee_code, EM.full_name,DS.designation,
        EM.date_of_joining,
          case when 
          LD.month ='1' then ML.january when
          LD.month ='2' then ML.february when
          LD.month ='3' then ML.march when
          LD.month ='4' then ML.april when
          LD.month ='5' then ML.may when
          LD.month ='6' then ML.june when
          LD.month ='7' then ML.july when
          LD.month ='8' then ML.august when
          LD.month ='9' then ML.september when
          LD.month ='10' then ML.october when
          LD.month ='11' then ML.november
          else ML.december end as ml_month, EE.amount as basic_salary
          FROM hims_f_employee_leave_salary_header LH 
          INNER JOIN hims_f_employee_leave_salary_detail LD ON LH.hims_f_employee_leave_salary_header_id=LD.employee_leave_salary_header_id
          INNER JOIN hims_f_employee_monthly_leave ML ON ML.employee_id = LH.employee_id and ML.year=? 
          INNER JOIN hims_d_employee as EM on LH.employee_id = EM.hims_d_employee_id
          INNER JOIN hims_d_designation as DS on DS.hims_d_designation_id = EM.employee_designation_id
          INNER JOIN hims_d_employee_earnings as EE on EE.employee_id = EM.hims_d_employee_id and earnings_id=(select basic_earning_component from hims_d_hrms_options limit 1)
          and ML.leave_id=(select hims_d_leave_id from hims_d_leave where leave_category='A')
          where LD.year=? and LD.month < ? and EM.leave_salary_process='Y' ${str};
          SELECT LH.employee_id,LD.leave_days,LD.leave_salary_amount, LD.airticket_amount,
          case when 
          LD.month ='1' then ML.january when
          LD.month ='2' then ML.february when
          LD.month ='3' then ML.march when
          LD.month ='4' then ML.april when
          LD.month ='5' then ML.may when
          LD.month ='6' then ML.june when
          LD.month ='7' then ML.july when
          LD.month ='8' then ML.august when
          LD.month ='9' then ML.september when
          LD.month ='10' then ML.october when
          LD.month ='11' then ML.november
          else ML.december end as ml_month
          FROM hims_f_employee_leave_salary_header LH 
          INNER JOIN hims_f_employee_leave_salary_detail LD ON LH.hims_f_employee_leave_salary_header_id=LD.employee_leave_salary_header_id
          INNER JOIN hims_d_employee as EM on LH.employee_id = EM.hims_d_employee_id          
          INNER JOIN hims_f_employee_monthly_leave ML ON ML.employee_id = LH.employee_id and ML.year=? 
          and ML.leave_id=(select hims_d_leave_id from hims_d_leave where leave_category='A')
          where LD.year=? and LD.month = ? and EM.leave_salary_process='Y' ${str};
          SELECT employee_id,leave_days,leave_amount,airfare_amount FROM hims_f_leave_encash_header LH 
          INNER JOIN hims_d_employee as EM on LH.employee_id = EM.hims_d_employee_id 
          where LH.authorized='APR' and year=? and MONTH(CONCAT(encashment_date))<=?
          and leave_id=(select hims_d_leave_id from hims_d_leave where leave_category='A') and EM.leave_salary_process='Y' ${str};
          SELECT LH.employee_id, SUM(LD.leave_days) as leave_days,
          SUM(LD.leave_salary_amount) as leave_salary_amount, SUM(LD.airticket_amount) as airticket_amount
          FROM hims_f_employee_leave_salary_header LH
          INNER JOIN hims_f_employee_leave_salary_detail LD ON LH.hims_f_employee_leave_salary_header_id=LD.employee_leave_salary_header_id
          INNER JOIN hims_d_employee as EM on LH.employee_id = EM.hims_d_employee_id
          where LD.year<? and EM.leave_salary_process='Y' ${str} GROUP BY LH.employee_id;`,

          values: [
            input.year,
            input.year,
            parseInt(input.month),
            input.year,
            input.year,
            parseInt(input.month),
            input.year,
            parseInt(input.month),
            input.year,
          ],
          printQuery: true,
        })
        .then((result) => {
          // const header = result.length ? result[0] : {};

          const opening_balance = result[0];
          const current_balance = result[1];
          const leave_encash = result[2];
          const last_year_balance = result[3];

          // console.log("result", result);
          // consol.log("result", result);
          const newResult = _.chain(opening_balance)
            .groupBy((g) => g.employee_id)
            .map((item) => {
              const {
                opening_leave_salary,
                opening_airticket,
                opening_leave_days,
                employee_id,
                employee_code,
                full_name,
                designation,
                date_of_joining,
                basic_salary,
              } = _.head(item);
              // console.log("start", employee_code);
              let last_year_emp_bal = last_year_balance.find(
                (f) => f.employee_id === employee_id
              );
              // console.log("last_year_emp_bal", last_year_emp_bal);
              let current_month = current_balance.find(
                (f) => f.employee_id === employee_id
              );
              current_month = current_month === undefined ? 0 : current_month;
              const current_month_encash = leave_encash.filter(
                (f) => f.employee_id === employee_id
              );

              console.log(
                "item",
                _.sumBy(item, (s) => parseFloat(s.ml_month)),
                current_month === undefined
                  ? 0
                  : parseFloat(current_month.ml_month),
                _.sumBy(current_month_encash, (s) => parseFloat(s.leave_days))
              );
              // const lastObject = _.maxBy(item, (m) => parseInt(m.month));
              // console.log("current_month", current_month);
              const utilized_leave_days =
                current_month === undefined
                  ? 0
                  : parseFloat(current_month.ml_month) +
                    _.sumBy(item, (s) => parseFloat(s.ml_month)) +
                    _.sumBy(current_month_encash, (s) =>
                      parseFloat(s.leave_days)
                    );

              console.log("utilized_leave_days", utilized_leave_days);
              // console.log("22");
              // Leave Days
              const year_open_leave_days =
                last_year_emp_bal === undefined
                  ? 0
                  : parseFloat(last_year_emp_bal.leave_days) +
                    parseFloat(opening_leave_days);

              // console.log("year_open_leave_days", year_open_leave_days);
              // console.log(
              //   "leave_days",
              //   _.sumBy(item, (s) => parseFloat(s.leave_days))
              // );
              // console.log("current_month", current_month.leave_days);
              // console.log(
              //   "ml_month",
              //   _.sumBy(item, (s) => parseFloat(s.ml_month))
              // );
              // console.log("13");
              const leavedays_opening_balance =
                _.sumBy(item, (s) => parseFloat(s.leave_days)) +
                parseFloat(year_open_leave_days);

              const total_leave_days =
                current_month === undefined
                  ? 0
                  : parseFloat(current_month.leave_days) +
                    parseFloat(leavedays_opening_balance) -
                    parseFloat(utilized_leave_days);

              // Leave Salary
              const year_open_leave_salary_amount =
                last_year_emp_bal === undefined
                  ? 0
                  : parseFloat(last_year_emp_bal.leave_salary_amount) +
                    parseFloat(opening_leave_salary);
              // console.log("14");
              const leavesalary_opening_balance =
                _.sumBy(item, (s) => parseFloat(s.leave_salary_amount)) +
                parseFloat(opening_leave_salary) -
                parseFloat(current_month.leave_salary_amount);
              // console.log("15");
              const total_leave_salary_amount =
                _.sumBy(item, (s) => parseFloat(s.leave_salary_amount)) +
                parseFloat(opening_leave_salary) -
                _.sumBy(current_month_encash, (s) =>
                  parseFloat(s.leave_amount)
                );

              // Airfare
              // console.log("16");
              const year_open_airticket_amount =
                last_year_emp_bal === undefined
                  ? 0
                  : parseFloat(last_year_emp_bal.airticket_amount) +
                    parseFloat(opening_airticket);

              const airefare_opening_balance =
                _.sumBy(item, (s) => parseFloat(s.airticket_amount)) +
                  parseFloat(opening_airticket) -
                  current_month ===
                undefined
                  ? 0
                  : parseFloat(current_month.airticket_amount);
              // console.log("17");
              const total_airticket_amount =
                _.sumBy(item, (s) => parseFloat(s.airticket_amount)) +
                parseFloat(opening_airticket) -
                _.sumBy(current_month_encash, (s) =>
                  parseFloat(s.airfare_amount)
                );
              return {
                ...current_month,
                employee_code,
                full_name,
                designation,
                date_of_joining,
                basic_salary,
                leavesalary_opening_balance,
                leavedays_opening_balance,
                airefare_opening_balance,
                total_leave_salary_amount,
                total_airticket_amount,
                total_leave_days,
                year_open_leave_salary_amount,
                year_open_airticket_amount,
                year_open_leave_days,
                utilized_leave_days,
                // total_utilized_leave_days,
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
