const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;

      const utilities = new algaehUtilities();

      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      let strData = "";

      if (input.project_id > 0) {
        strData += " and PWP.project_id=" + input.project_id;
      }
      if (input.department_id > 0) {
        strData += " and SD.department_id=" + input.department_id;
      }

      if (input.sub_department_id > 0) {
        strData += " and E.sub_department_id=" + input.sub_department_id;
      }
      if (input.employee_group_id > 0) {
        strData += " and E.employee_group_id=" + input.employee_group_id;
      }

      options.mysql
        .executeQuery({
          query: `select hims_f_project_wise_payroll_id,
          employee_id,E.employee_code,E.full_name,d.designation,project_id,
          concat( COALESCE(worked_hours,0)  ,'.',right( concat( '0', (worked_minutes%60)),2))  as complete_hours,
          P.project_code,P.project_desc,month,year,(worked_hours) as worked_hours,(worked_minutes) as worked_minutes,
          (cost) as project_cost,PWP.hospital_id,SD.hims_d_sub_department_id,SD.sub_department_name,DP.hims_d_department_id,
          DP.department_name ,EG.group_description from hims_f_project_wise_payroll PWP inner join hims_d_employee  E on
          PWP.employee_id=E.hims_d_employee_id and PWP.year=? and PWP.month=?
          left join hims_d_project  P on PWP.project_id=P.hims_d_project_id
          left join hims_d_designation d on E.employee_designation_id = d.hims_d_designation_id 
          left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id
          left join hims_d_department DP on SD.department_id=DP.hims_d_department_id
          left join hims_d_employee_group EG on E.employee_group_id=EG.hims_d_employee_group_id
          where PWP.hospital_id=?    ${strData} ;`,
          values: [input.year, input.month, input.hospital_id],
          printQuery: false
        })
        .then(result => {
          const outputArray = [];
          if (result.length > 0) {
            const projectWise = _.chain(result)
              .groupBy(g => g.project_id)
              .map(m => m)
              .value();
            projectWise.forEach(project => {
              let total_proj_cost = _.sumBy(project, s =>
                parseFloat(s.project_cost)
              ).toFixed(decimal_places);

              let project_hours = _.sumBy(project, s =>
                parseFloat(s.worked_hours)
              );
              project_hours += parseInt(
                parseInt(_.sumBy(project, s => parseFloat(s.worked_minutes))) /
                  parseInt(60)
              );

              let project_mins =
                parseInt(_.sumBy(project, s => parseFloat(s.worked_minutes))) %
                parseInt(60);

              const dept_Array = [];
              const departmentWise = _.chain(project)
                .groupBy(g => g.hims_d_department_id)
                .map(m => m)
                .value();

              departmentWise.forEach(department => {
                const sub_dept = _.chain(department)
                  .groupBy(g => g.hims_d_sub_department_id)
                  .map(sub => {
                    return {
                      sub_department_name: sub[0].sub_department_name,
                      sub_no_employee: sub.length,
                      employees: sub
                    };
                  })
                  .value();

                dept_Array.push({
                  department_name: department[0]["department_name"],
                  dep_no_employee: department.length,
                  sub_dept: sub_dept
                });
              });
              outputArray.push({
                project_cost: total_proj_cost,
                no_hours: project_hours + "." + project_mins,
                no_employees: project.length,
                project_name: project[0]["project_desc"],
                dept_Array: dept_Array
              });
            });

            utilities.logger().log("outputArray: ", outputArray);
            resolve({
              result: outputArray
            });
          } else {
            resolve({
              result: result
            });
          }
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
