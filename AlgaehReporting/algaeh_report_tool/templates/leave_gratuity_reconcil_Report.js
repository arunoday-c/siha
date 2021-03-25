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

      // const strMonth =
      //   input.month === 1
      //     ? "january"
      //     : input.month === 2
      //     ? "february"
      //     : input.month === 3
      //     ? "march"
      //     : input.month === 4
      //     ? "april"
      //     : input.month === 5
      //     ? "may"
      //     : input.month === 6
      //     ? "june"
      //     : input.month === 7
      //     ? "july"
      //     : input.month === 8
      //     ? "august"
      //     : input.month === 9
      //     ? "september"
      //     : input.month === 10
      //     ? "october"
      //     : input.month === 11
      //     ? "november"
      //     : "december";

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
          
COALESCE(sum(LDD.leave_salary_amount),0) as last_leave_salary_amount,
COALESCE(sum(LDD.leave_days),0) as last_leave_days,
COALESCE(sum(LDD.airticket_amount),0) as last_airticket_amount,
          LH.opening_leave_days,
          LH.opening_leave_salary,
          LH.opening_airticket,
          LH.utilized_leave_days,
          LH.utilized_leave_salary_amount,
          LH.utilized_airticket_amount,  
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
-- LEC.leave_days as enc_leave_days,LEC.leave_amount as enc_leave_amount,LEC.airfare_amount as enc_airfare_amount
          FROM hims_f_employee_leave_salary_header LH
          left join hims_f_employee_leave_salary_detail LD on LD.employee_leave_salary_header_id = LH.hims_f_employee_leave_salary_header_id 
          and LD.year = ?  and LD.month <= ?
          left join hims_f_employee_leave_salary_detail LDD on LDD.employee_leave_salary_header_id = LH.hims_f_employee_leave_salary_header_id 
          and LDD.year < ?
          left join hims_d_employee as EM on LH.employee_id = EM.hims_d_employee_id
          left join hims_d_designation as DS on DS.hims_d_designation_id = EM.employee_designation_id
          left join hims_f_salary as SL on SL.employee_id = LH.employee_id and SL.year=? and SL.month=? and salary_paid='Y'
          left join hims_d_employee_earnings as EE on EE.employee_id = EM.hims_d_employee_id and earnings_id=(select basic_earning_component from hims_d_hrms_options limit 1)
          -- left join hims_f_leave_encash_header LEC on LEC.year=? and MONTH(CONCAT(LEC.encashment_date))=? and LEC.leave_id = (select hims_d_leave_id from hims_d_leave where leave_category='A')
          left join hims_f_employee_monthly_leave as ML on ML.employee_id = EM.hims_d_employee_id and ML.year=? and ML.leave_id=(select hims_d_leave_id from hims_d_leave where leave_category='A')
          where EM.employee_status <> 'I'  ${str}
          group by LD.month, LD.leave_salary_amount,LD.leave_days,LD.airticket_amount, LH.employee_id, LH.hims_f_employee_leave_salary_header_id
          -- ,LH.utilized_leave_days,LH.utilized_leave_salary_amount,LH.utilized_airticket_amount
          -- ,LH.opening_leave_days,LH.opening_leave_salary,LH.opening_airticket
          order by LH.employee_id,LD.month;
          `,

          values: [
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

          const newResult = _.chain(result)
            .groupBy((g) => g.employee_id)
            .map((item) => {
              const {
                opening_leave_salary,
                opening_airticket,
                opening_leave_days,
                last_leave_salary_amount,
                last_leave_days,
                last_airticket_amount,
                // enc_leave_days,
                // ml_month,
                // utilized_leave_days,
                // utilized_leave_salary_amount,
                // utilized_airticket_amount,
              } = _.head(item);

              const lastObject = _.maxBy(item, (m) => parseInt(m.month));

              const year_open_leave_salary_amount =
                parseFloat(last_leave_salary_amount) +
                parseFloat(opening_leave_salary);

              const year_open_leave_days =
                parseFloat(last_leave_days) + parseFloat(opening_leave_days);

              const year_open_airticket_amount =
                parseFloat(last_airticket_amount) +
                parseFloat(opening_airticket);

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
                parseFloat(year_open_leave_days) -
                parseFloat(lastObject.leave_days) -
                _.sumBy(item, (s) => parseFloat(s.ml_month));

              const total_leave_salary_amount =
                _.sumBy(item, (s) => parseFloat(s.leave_salary_amount)) +
                parseFloat(opening_leave_salary);

              const total_airticket_amount =
                _.sumBy(item, (s) => parseFloat(s.airticket_amount)) +
                parseFloat(opening_airticket);

              const total_leave_days =
                parseFloat(lastObject.leave_days) +
                parseFloat(leavedays_opening_balance) -
                parseFloat(lastObject.ml_month);

              const utilized_leave_days = parseFloat(lastObject.ml_month);

              return {
                ...lastObject,
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
