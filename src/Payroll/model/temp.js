if (salary.length > 0) {
  sum_earnings = new LINQ(salary).Sum(s => parseFloat(s.total_earnings));
  sum_deductions = new LINQ(salary).Sum(s => parseFloat(s.total_deductions));
  sum_contributions = new LINQ(salary).Sum(s =>
    parseFloat(s.total_contributions)
  );
  sum_net_salary = new LINQ(salary).Sum(s => parseFloat(s.net_salary));

  let salary_header_ids = new LINQ(salary)
    .Select(s => s.hims_f_salary_id)
    .ToArray();

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
      printQuery: false
    })
    .then(results => {
      //ST print inputs in report
      if (salary.length > 0) {
        input["hospital_name"] = salary[0]["hospital_name"];
        input["group_description"] = salary[0]["group_description"];
        MONTHS.forEach(month => {
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
      //   console.log("accrual:",accrual);

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
        ot_min += parseInt(salary[i]["ot_work_hours"].toString().split(".")[1]);

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

        let complete_ot = ot_hours + "." + (parseInt(ot_min) % parseInt(60));
        //EN-complete OVER-Time  calculation

        const employee_earning = new LINQ(earnings)
          .Where(w => w.salary_header_id == salary[i]["hims_f_salary_id"])
          .Select(s => {
            return {
              hims_f_salary_earnings_id: s.hims_f_salary_earnings_id,
              earnings_id: s.earnings_id,
              amount: s.amount,
              nationality_id: s.nationality_id
            };
          })
          .ToArray();

        const employee_deduction = new LINQ(deductions)
          .Where(w => w.salary_header_id == salary[i]["hims_f_salary_id"])
          .Select(s => {
            return {
              hims_f_salary_deductions_id: s.hims_f_salary_deductions_id,
              deductions_id: s.deductions_id,
              amount: s.amount,
              nationality_id: s.nationality_id
            };
          })
          .ToArray();

        const employee_contributions = new LINQ(contributions)
          .Where(w => w.salary_header_id == salary[i]["hims_f_salary_id"])
          .Select(s => {
            return {
              hims_f_salary_contributions_id: s.hims_f_salary_contributions_id,
              contributions_id: s.contributions_id,
              amount: s.amount,
              nationality_id: s.nationality_id
            };
          })
          .ToArray();
        //ST------ calculating employee_pasi plus employer_pasi
        let employe_plus_employr = 0;
        let employee_pasi = 0;
        let employr_pasi = 0;

        //employee_pasi
        employee_deduction.forEach(item => {
          if (item.nationality_id == crypto.default_nationality) {
            employee_pasi += parseFloat(item.amount);
          }
        });
        //employer_pasi
        employee_contributions.forEach(item => {
          if (item.nationality_id == crypto.default_nationality) {
            employr_pasi += parseFloat(item.amount);
          }
        });

        employe_plus_employr =
          parseFloat(employee_pasi) + parseFloat(employr_pasi);

        sum_employe_plus_emplyr += parseFloat(employe_plus_employr);
        //EN------ calculating employee_pasi plus employer_pasi

        sum_basic += new LINQ(employee_earning)
          .Where(w => w.earnings_id == basic_id)
          .Select(s => parseFloat(s.amount))
          .FirstOrDefault(0);

        sum_gratuity += new LINQ(gratuity)
          .Where(w => w.employee_id == salary[i]["employee_id"])
          .Select(s => parseFloat(s.gratuity_amount))
          .FirstOrDefault(0);

        sum_leave_salary += new LINQ(accrual)
          .Where(w => w.employee_id == salary[i]["employee_id"])
          .Select(s => parseFloat(s.leave_salary))
          .FirstOrDefault(0);

        sum_airfare_amount += new LINQ(accrual)
          .Where(w => w.employee_id == salary[i]["employee_id"])
          .Select(s => parseFloat(s.airfare_amount))
          .FirstOrDefault(0);

        let emp_gratuity = new LINQ(gratuity)
          .Where(w => w.employee_id == salary[i]["employee_id"])
          .Select(s => {
            return {
              gratuity_amount: s.gratuity_amount
            };
          })
          .FirstOrDefault({ gratuity_amount: 0 });

        let emp_accural = new LINQ(accrual)
          .Where(w => w.employee_id == salary[i]["employee_id"])
          .Select(s => {
            return {
              leave_days: s.leave_days,
              leave_salary: s.leave_salary,
              airfare_amount: s.airfare_amount
            };
          })
          .FirstOrDefault({
            leave_days: 0,
            leave_salary: 0,
            airfare_amount: 0
          });

        outputArray.push({
          ...salary[i],
          ...emp_gratuity,
          ...emp_accural,
          employee_earning: employee_earning,
          employee_deduction: employee_deduction,
          employee_contributions: employee_contributions,
          employe_plus_employr: employe_plus_employr,
          complete_ot: complete_ot
        });
      }

      const result = {
        ...input,
        components: components,
        earning_component: earning_component,
        deduction_component: deduction_component,
        contributions_component: contributions_component,
        employees: outputArray,
        sum_basic: sum_basic,
        sum_earnings: sum_earnings,
        sum_deductions: sum_deductions,
        sum_contributions: sum_contributions,
        sum_net_salary: sum_net_salary,
        sum_employe_plus_emplyr: sum_employe_plus_emplyr,
        sum_gratuity: sum_gratuity,
        sum_leave_salary: sum_leave_salary,
        sum_airfare_amount: sum_airfare_amount
      };
      //utilities.logger().log("result: ", result);
      resolve(result);
    })
    .catch(e => {
      options.mysql.releaseConnection();
      reject(e);
    });
}
