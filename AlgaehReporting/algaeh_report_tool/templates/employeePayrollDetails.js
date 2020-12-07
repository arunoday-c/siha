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

      if (input.hospital_id > 0) {
        str += ` and E.hospital_id= ${input.hospital_id} `;
      }
      if (input.employee_group_id > 0) {
        str += ` and E.employee_group_id= ${input.employee_group_id} `;
      }

      if (input.sub_department_id > 0) {
        str += ` and E.sub_department_id= ${input.sub_department_id} `;
      }

      if (input.department_id > 0) {
        str += ` and SD.department_id=${input.department_id} `;
      }

      options.mysql
        .executeQuery({
          query: `select hims_d_earning_deduction_id,earning_deduction_description,short_desc,component_category, print_order_by, 
          nationality_id from hims_d_earning_deduction where record_status='A' and print_report='Y' order by print_order_by ;
          select H.hims_d_hospital_id,H.hospital_name,E.hims_d_employee_id,E.employee_code,E.full_name,E.employee_designation_id,E.identity_no,EDoc.identity_document_name,Edoc.arabic_identity_document_name,EG.group_description,E.sub_department_id,E.date_of_joining,
          E.nationality,E.mode_of_payment,E.hospital_id,E.employee_group_id,D.designation,EG.group_description,
          N.nationality,E.net_salary,E.total_earnings,E.total_deductions
          from hims_d_employee E
          left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id
          left join hims_d_hospital H  on E.hospital_id=H.hims_d_hospital_id
          left join hims_d_designation D on E.employee_designation_id=D.hims_d_designation_id 
          left join hims_d_employee_group EG on E.employee_group_id=EG.hims_d_employee_group_id
          left join hims_d_nationality N on E.nationality=N.hims_d_nationality_id
          left join hims_d_identity_document EDoc on EDoc.hims_d_identity_document_id = E.identity_type_id 
          where E.employee_status='A' ${is_local} ${str} and E.record_status<>'I'  order by H.hims_d_hospital_id ASC;`,
          // values: [input.hospital_id, input.employee_group_id],
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

            const employee_ids = [];
            salary.forEach((s) => {
              employee_ids.push(s.hims_d_employee_id);
            });

            //--------first part------

            options.mysql
              .executeQuery({
                query: `select employee_id, hims_d_employee_earnings_id,earnings_id,amount 
                  from hims_d_employee_earnings SE 
                  inner join hims_d_earning_deduction ED on SE.earnings_id=ED.hims_d_earning_deduction_id and ED.print_report='Y'
                  where employee_id in (${employee_ids});
                  select employee_id, hims_d_employee_deductions_id,deductions_id,amount 
                  from hims_d_employee_deductions SD 
                  inner join hims_d_earning_deduction ED on SD.hims_d_employee_deductions_id=ED.hims_d_earning_deduction_id and ED.print_report='Y' 
                  where employee_id in (${employee_ids});
                  select employee_id, hims_d_employee_contributions_id,contributions_id,amount 
                  from hims_d_employee_contributions SC 
                  inner join hims_d_earning_deduction ED on SC.hims_d_employee_contributions_id=ED.hims_d_earning_deduction_id and ED.print_report='Y' 
                  where employee_id in (${employee_ids});
                  select basic_earning_component from hims_d_hrms_options`,
                printQuery: true,
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
                let contributions = results[2];
                let basic_id = results[3][0]["basic_earning_component"];

                let sum_basic = 0;
                let sum_employe_plus_emplyr = 0;
                for (let i = 0; i < salary.length; i++) {
                  const earning_obj = earnings.filter(
                    (item) =>
                      item.employee_id == salary[i]["hims_d_employee_id"]
                  );

                  let employee_earning = earning_component.map((m) => {
                    const obj = earning_obj.find((f) => {
                      return f.earnings_id == m.hims_d_earning_deduction_id;
                    });

                    if (obj) {
                      return obj;
                    } else {
                      return {
                        earnings_id: m.hims_d_earning_deduction_id,
                        amount: "-",
                      };
                    }
                  });

                  const deduction_obj = deductions.filter(
                    (item) =>
                      item.employee_id == salary[i]["hims_d_employee_id"]
                  );

                  const employee_deduction = deduction_component.map((m) => {
                    const obj = deduction_obj.find((f) => {
                      return f.deductions_id == m.hims_d_earning_deduction_id;
                    });

                    if (obj) {
                      return obj;
                    } else {
                      return {
                        deductions_id: m.hims_d_earning_deduction_id,
                        amount: "-",
                      };
                    }
                  });

                  const contributions_obj = contributions.filter(
                    (item) =>
                      item.employee_id == salary[i]["hims_d_employee_id"]
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
                          contributions_id: m.hims_d_earning_deduction_id,
                          amount: "-",
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

                  outputArray.push({
                    ...salary[i],
                    employee_earning: employee_earning,
                    employee_deduction: employee_deduction,
                    employee_contributions: employee_contributions,
                    employe_plus_employr: employe_plus_employr.toFixed(
                      decimal_places
                    ),
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
