const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;

      const utilities = new algaehUtilities();
      // let str = "";
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      let employee = "";
      let project = "";
      let groupBy = " PWP.employee_id ";

      if (input.employee_id > 0) {
        employee = " and employee_id=" + input.employee_id;
        groupBy = " PWP.project_id ";
      }

      if (input.project_id > 0) {
        project = " and project_id=" + input.project_id;
      }

      options.mysql
        .executeQuery({
          query: `select hims_f_project_wise_payroll_id,employee_id,E.employee_code,E.full_name,d.designation,project_id,\
          P.project_code,P.project_desc,month,year,sum(worked_hours) as worked_hours,sum(worked_minutes) as worked_minutes,\
          sum(cost) as project_cost,PWP.hospital_id\
          from hims_f_project_wise_payroll PWP inner join hims_d_employee  E on PWP.employee_id=E.hims_d_employee_id\
          inner join hims_d_project  P on PWP.project_id=P.hims_d_project_id left join hims_d_designation d on E.employee_designation_id = d.hims_d_designation_id \
          where PWP.hospital_id=? \
          and year=? and month=?  ${employee} ${project} group by ${groupBy} ;`,
          values: [input.hospital_id, input.year, input.month],
          printQuery: true
        })
        .then(result => {
          let total_worked_hours = 0;
          let minutes = 0;
          let total_cost = 0;

          let outputArray = [];
          for (let i = 0; i < result.length; i++) {
            let complete_hours = parseInt(result[i]["worked_hours"]);

            let worked_minutes = result[i]["worked_minutes"];

            complete_hours += parseInt(worked_minutes / 60);
            let mins = String("0" + parseInt(worked_minutes % 60)).slice(-2);
            outputArray.push({
              ...result[i],
              complete_hours: complete_hours + "." + mins
            });
          }

          // total_cost = new LINQ(result).Sum(s => parseFloat(s.project_cost));
          total_cost = _.sumBy(result, s => parseFloat(s.project_cost)).toFixed(
            decimal_places
          );

          //ST---time calculation
          total_worked_hours = _.sumBy(result, s => parseInt(s.worked_hours));

          const worked_minutes = _.sumBy(result, s =>
            parseInt(s.worked_minutes)
          );

          //.toFixed(decimal_places)

          total_worked_hours += parseInt(worked_minutes / 60);
          minutes = String("0" + parseInt(worked_minutes % 60)).slice(-2);

          const results = {
            details: outputArray,
            total_worked_hours: total_worked_hours + "." + minutes,
            noEmployees: result.length,
            total_cost: total_cost
          };

          //utilities.logger().log("result: ", results);
          resolve(results);
        })
        .catch(error => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
