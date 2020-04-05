// const { MONTHS } = require("./GlobalVariables.json");
// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const MONTHS = [
        { name: "January", value: "1" },
        { name: "February", value: "2" },
        { name: "March", value: "3" },
        { name: "April", value: "4" },
        { name: "May", value: "5" },
        { name: "June", value: "6" },
        { name: "July", value: "7" },
        { name: "August", value: "8" },
        { name: "September", value: "9" },
        { name: "October", value: "10" },
        { name: "November", value: "11" },
        { name: "December", value: "12" },
      ];
      const utilities = options.utilitites();
      let input = {};

      const params = options.args.reportParams;
      const default_nationality = options.args.crypto.default_nationality;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let outputArray = [];
      let str = "";

      let is_local = "";

      if (input.is_local === "Y") {
        is_local = " and H.default_nationality=E.nationality ";
      } else if (input.is_local === "N") {
        is_local = " and H.default_nationality<>E.nationality ";
      }

      if (input.employee_group_id > 0) {
        str += ` and E.employee_group_id= ${input.employee_group_id}`;
      }
      if (input.sub_department_id > 0) {
        str += ` and E.sub_department_id= ${input.sub_department_id}`;
      }

      if (input.department_id > 0) {
        str += ` and SD.department_id=${input.department_id}`;
      }

      options.mysql
        .executeQuery({
          query: `select hims_d_earning_deduction_id,earning_deduction_description,short_desc,component_category, print_order_by, \
				nationality_id from hims_d_earning_deduction where record_status='A' and print_report='Y' order by print_order_by ;\
				select E.employee_code,E.full_name,E.employee_designation_id,S.employee_id,E.sub_department_id,E.date_of_joining,E.nationality,E.mode_of_payment,\
				E.hospital_id,E.employee_group_id,D.designation,EG.group_description,N.nationality,\
				S.hims_f_salary_id,S.salary_number,S.salary_date,S.present_days,S.total_days,S.display_present_days,S.total_paid_days,S.net_salary,S.total_earnings,S.total_deductions,S.salary_paid_date, case when S.salary_paid then 'Paid' else 'Unpaid' end as payment_status,
case when S.salary_processed then 'Finalized' else 'Not Finalized' end as processed_status,\
        S.total_contributions,coalesce(S.ot_work_hours,0.0) as ot_work_hours,    coalesce(S.ot_weekoff_hours,0.0) as ot_weekoff_hours,\
        coalesce(S.ot_holiday_hours,0.0) as ot_holiday_hours,H.hospital_name,SD.sub_department_name
				from hims_d_employee E\
				left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
				left join hims_d_hospital H  on E.hospital_id=H.hims_d_hospital_id  \
				left join hims_d_designation D on E.employee_designation_id=D.hims_d_designation_id\
				left join hims_d_employee_group EG on E.employee_group_id=EG.hims_d_employee_group_id\
				left join hims_d_nationality N on E.nationality=N.hims_d_nationality_id\
				left join  hims_f_salary S on E.hims_d_employee_id=S.employee_id\
				where  E.hospital_id=?  and E.suspend_salary ='N' and S.salary_type <>'LS' and E.record_status='A' and E.employee_group_id=? and S.month=? and S.year=?  ${is_local} ${str}`,
          values: [
            input.hospital_id,
            input.employee_group_id,
            input.month,
            input.year,
          ],
          printQuery: true,
        })
        .then((result) => {
          const components = result[0];
          const salary = result[1];

          const earning_component = _.filter(components, (f) => {
            return f.component_category === "E";
          });
          const deduction_component = _.filter(components, (f) => {
            return f.component_category === "D";
          });

          const contributions_component = _.filter(components, (f) => {
            return f.component_category === "C";
          });

          let sum_earnings = 0;
          let sum_deductions = 0;
          let sum_contributions = 0;
          let sum_net_salary = 0;

          if (salary.length > 0) {
            //--------first part------

            sum_earnings = _.sumBy(salary, (s) => parseFloat(s.total_earnings));

            sum_deductions = _.sumBy(salary, (s) =>
              parseFloat(s.total_deductions)
            );

            sum_contributions = _.sumBy(salary, (s) =>
              parseFloat(s.total_contributions)
            );

            sum_net_salary = _.sumBy(salary, (s) => parseFloat(s.net_salary));

            const salary_header_ids = salary.map((s) => s.hims_f_salary_id);

            //--------first part------

            options.mysql
              .executeQuery({
                query:
                  "select hims_f_salary_earnings_id,salary_header_id,earnings_id,amount,per_day_salary,ED.nationality_id from \
					  hims_f_salary_earnings SE inner join hims_d_earning_deduction ED on \
					  SE.earnings_id=ED.hims_d_earning_deduction_id  and ED.print_report='Y' where salary_header_id in (" +
                  salary_header_ids +
                  ");\
					  select hims_f_salary_deductions_id,salary_header_id,deductions_id,amount,per_day_salary,ED.nationality_id from \
					  hims_f_salary_deductions SD inner join hims_d_earning_deduction ED on \
					  SD.deductions_id=ED.hims_d_earning_deduction_id  and ED.print_report='Y' \
					  where salary_header_id in ( " +
                  salary_header_ids +
                  ");select basic_earning_component from hims_d_hrms_options;\
						select employee_id,gratuity_amount from hims_f_gratuity_provision where year=? and month=?;\
						select employee_id,leave_days,leave_salary,airfare_amount from hims_f_leave_salary_accrual_detail\
						where year=? and month=?;\
						select hims_f_salary_contributions_id,salary_header_id,contributions_id,amount,Ed.nationality_id from \
						hims_f_salary_contributions SC inner join hims_d_earning_deduction ED on \
						SC.contributions_id=ED.hims_d_earning_deduction_id  and ED.print_report='Y' \
						where salary_header_id in ( " +
                  salary_header_ids +
                  ");",
                values: [input.year, input.month, input.year, input.month],
                printQuery: false,
              })
              .then((results) => {
                //ST print inputs in report
                if (salary.length > 0) {
                  input["hospital_name"] = salary[0]["hospital_name"];
                  input["group_description"] = salary[0]["group_description"];
                  MONTHS.forEach((month) => {
                    if (month.value == input.month) input["month"] = month.name;
                  });

                  if (input.is_local == "Y") {
                    input["type"] = "Localite";
                  } else if (input.is_local == "N") {
                    input["type"] = "Expatriate";
                  } else {
                    input["type"] = "";
                  }
                }
                //END print inputs in report

                let earnings = results[0];
                let deductions = results[1];
                let basic_id = results[2][0]["basic_earning_component"];
                let gratuity = results[3];
                let accrual = results[4];
                let contributions = results[5];

                let sum_basic = 0;
                let sum_employe_plus_emplyr = 0;
                let sum_gratuity = 0;
                let sum_leave_salary = 0;
                let sum_airfare_amount = 0;

                for (let i = 0; i < salary.length; i++) {
                  //ST-complete OVER-Time (ot,wot,hot all togather sum)  calculation
                  let ot_hours = 0;
                  let ot_min = 0;

                  ot_hours += parseInt(
                    salary[i]["ot_work_hours"].toString().split(".")[0]
                  );
                  ot_min += parseInt(
                    salary[i]["ot_work_hours"].toString().split(".")[1]
                  );

                  ot_hours += parseInt(
                    salary[i]["ot_weekoff_hours"].toString().split(".")[0]
                  );
                  ot_min += parseInt(
                    salary[i]["ot_weekoff_hours"].toString().split(".")[1]
                  );

                  ot_hours += parseInt(
                    salary[i]["ot_holiday_hours"].toString().split(".")[0]
                  );
                  ot_min += parseInt(
                    salary[i]["ot_holiday_hours"].toString().split(".")[1]
                  );

                  ot_hours += parseInt(parseInt(ot_min) / parseInt(60));

                  let complete_ot =
                    ot_hours + "." + (parseInt(ot_min) % parseInt(60));
                  //EN-complete OVER-Time  calculation

                  const earning_obj = earnings.filter(
                    (item) =>
                      item.salary_header_id == salary[i]["hims_f_salary_id"]
                  );

                  let employee_earning = earning_component.map((m) => {
                    const obj = earning_obj.find((f) => {
                      return f.earnings_id == m.hims_d_earning_deduction_id;
                    });

                    if (obj) {
                      return obj;
                    } else {
                      return {
                        hims_f_salary_earnings_id: null,
                        earnings_id: m.hims_d_earning_deduction_id,
                        amount: "-",
                        nationality_id: null,
                      };
                    }
                  });

                  const deduction_obj = deductions.filter(
                    (item) =>
                      item.salary_header_id == salary[i]["hims_f_salary_id"]
                  );

                  const employee_deduction = deduction_component.map((m) => {
                    const obj = deduction_obj.find((f) => {
                      return f.deductions_id == m.hims_d_earning_deduction_id;
                    });

                    if (obj) {
                      return obj;
                    } else {
                      return {
                        hims_f_salary_deductions_id: null,
                        deductions_id: m.hims_d_earning_deduction_id,
                        amount: "-",
                        nationality_id: null,
                      };
                    }
                  });

                  const contributions_obj = contributions.filter(
                    (item) =>
                      item.salary_header_id == salary[i]["hims_f_salary_id"]
                  );

                  const employee_contributions = contributions_component.map(
                    (m) => {
                      const obj = contributions_obj.find((f) => {
                        return (
                          f.contributions_id == m.hims_d_earning_deduction_id
                        );
                      });

                      if (obj) {
                        return obj;
                      } else {
                        return {
                          hims_f_salary_earnings_id: null,
                          contributions_id: m.hims_d_earning_deduction_id,
                          amount: "-",
                          nationality_id: null,
                        };
                      }
                    }
                  );

                  //ST------ calculating employee_pasi plus employer_pasi
                  let employe_plus_employr = 0;
                  let employee_pasi = 0;
                  let employr_pasi = 0;

                  //employee_pasi
                  employee_deduction.forEach((item) => {
                    if (item.nationality_id == default_nationality) {
                      employee_pasi += parseFloat(item.amount);
                    }
                  });
                  //employer_pasi
                  employee_contributions.forEach((item) => {
                    if (item.nationality_id == default_nationality) {
                      employr_pasi += parseFloat(item.amount);
                    }
                  });

                  employe_plus_employr =
                    parseFloat(employee_pasi) + parseFloat(employr_pasi);

                  sum_employe_plus_emplyr += parseFloat(employe_plus_employr);
                  //EN------ calculating employee_pasi plus employer_pasi

                  const basic = employee_earning.find(
                    (item) => item.earnings_id == basic_id
                  );
                  sum_basic += basic ? parseFloat(basic.amount) : parseFloat(0);

                  const grat = gratuity.find(
                    (item) => item.employee_id == salary[i]["employee_id"]
                  );
                  sum_gratuity += grat
                    ? parseFloat(grat.gratuity_amount)
                    : parseFloat(0);

                  const accu = accrual.find(
                    (item) => item.employee_id == salary[i]["employee_id"]
                  );
                  sum_leave_salary += accu ? parseFloat(accu.leave_salary) : 0;

                  sum_airfare_amount += accu
                    ? parseFloat(accu.airfare_amount)
                    : parseFloat(0);

                  let emp_gratuity = grat
                    ? parseFloat(grat.gratuity_amount)
                    : "-";

                  let emp_accural = accu
                    ? {
                        leave_days: accu.leave_days,
                        leave_salary: accu.leave_salary,
                        airfare_amount: accu.airfare_amount,
                      }
                    : {
                        leave_days: 0,
                        leave_salary: 0,
                        airfare_amount: 0,
                      };

                  //  utilities.logger().log("salary[i]: ", salary[i]);

                  //console.log("outputArray: ", outputArray);

                  outputArray.push({
                    ...salary[i],
                    gratuity_amount: emp_gratuity,
                    ...emp_accural,
                    employee_earning: employee_earning,
                    employee_deduction: employee_deduction,
                    employee_contributions: employee_contributions,
                    employe_plus_employr: employe_plus_employr.toFixed(
                      decimal_places
                    ),
                    complete_ot: complete_ot,
                  });
                }
                // console.log("outputArray: ", outputArray);
                const result = {
                  ...input,
                  components: components,
                  earning_component: earning_component,
                  deduction_component: deduction_component,
                  contributions_component: contributions_component,
                  employees: _.sortBy(outputArray, (s) => s.employee_code),
                  sum_basic: sum_basic,
                  sum_earnings: sum_earnings.toFixed(decimal_places),
                  sum_deductions: sum_deductions.toFixed(decimal_places),
                  sum_contributions: sum_contributions.toFixed(decimal_places),
                  sum_net_salary: sum_net_salary.toFixed(decimal_places),
                  sum_employe_plus_emplyr: sum_employe_plus_emplyr,
                  sum_gratuity: sum_gratuity,
                  sum_leave_salary: sum_leave_salary,
                  sum_airfare_amount: sum_airfare_amount,
                  span_earning: earning_component.length,
                  span_deduction: deduction_component.length,
                  span_contribution: contributions_component.length,
                };
                utilities.logger().log("outputArray: ", outputArray);
                resolve(result);
              })
              .catch((e) => {
                options.mysql.releaseConnection();
                reject(e);
              });
          } else {
            options.mysql.releaseConnection();

            const result = { employees: [] };
            resolve(result);
          }
        })
        .catch((e) => {
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
