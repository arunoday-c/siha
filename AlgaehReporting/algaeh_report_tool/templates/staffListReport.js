const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;

      const utilities = new algaehUtilities();
      let input = {};

      const params = options.args.reportParams;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      utilities.logger().log("input: ", input);

      let strQuery = "";

      if (input.department_id > 0) {
        strQuery += ` and SD.department_id=${input.department_id}`;
      }
      if (input.sub_department_id > 0) {
        strQuery += ` and E.sub_department_id=${input.sub_department_id}`;
      }

      switch (input.employee_status) {
        case "A":
        case "I":
        case "R":
        case "T":
        case "E":
          strQuery += ` and E.employee_status='${input.employee_status}'`;
          break;
      }

      switch (input.employee_type) {
        case "PB":
        case "PE":
        case "CO":
          strQuery += ` and E.employee_type='${input.employee_type}'`;
          break;
      }

      options.mysql
        .executeQuery({
          query: ` 
          select  hospital_name FROM hims_d_hospital where hims_d_hospital_id=?;
          select hims_d_employee_id,employee_code,full_name,sex,date_of_joining,
          case employee_status when 'A' then 'ACTIVE' when 'I' then 'INACTIVE'
          when 'R' then 'RESIGNED' when 'T' then 'TERMINATED' when 'E' then 'RETIRED'
          end as employee_status,DG.designation,N.nationality,R.religion_name,
          E.sub_department_id, SD.sub_department_name,D.hims_d_department_id,D.department_name,
          case employee_type when  'PE' then  'PERMANENT' when  'CO' then  'CONTRACT'
          when  'PB' then  'PROBATION' when  'LC' then  'LOCUM'
          when  'VC' then  'VISITING CONSULTANT'end as employee_type
          from hims_d_employee E left join hims_d_designation DG on
          E.employee_designation_id=DG.hims_d_designation_id
          left join hims_d_religion R on E.religion_id=R.hims_d_religion_id
          left join hims_d_nationality N on E.nationality=N.hims_d_nationality_id
          left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id
          left join hims_d_department D on SD.department_id=D.hims_d_department_id
          where E.hospital_id=? and E.record_status='A'  ${strQuery}; `,
          values: [input.hospital_id, input.hospital_id],
          printQuery: true
        })
        .then(res => {
          options.mysql.releaseConnection();
          const hospital_name = res[0][0]["hospital_name"];
          const result = res[1];

          if (result.length > 0) {
            const departmentWise = _.chain(result)
              .groupBy(g => g.hims_d_department_id)
              .map(m => m)
              .value();
            //utilities.logger().log("departmentWise:", departmentWise);
            const outputArray = [];

            for (let i = 0; i < departmentWise.length; i++) {
              let dep_no_employee = 0;
              const sub_dept = _.chain(departmentWise[i])
                .groupBy(g => g.sub_department_id)
                .map(sub => {
                  dep_no_employee += sub.length;
                  return {
                    sub_department_name: sub[0].sub_department_name,
                    sub_no_employee: sub.length,
                    employees: sub
                  };
                })
                .value();

              outputArray.push({
                department_name: departmentWise[i][0]["department_name"],
                dep_no_employee: dep_no_employee,
                sub_dept: sub_dept
              });
            }

            resolve({
              hospital_name: hospital_name,
              no_employees: result.length,
              result: outputArray
            });
          } else {
            resolve({
              hospital_name: hospital_name,
              no_employees: result.length,
              result: result
            });
          }
        })
        .catch(e => {
          console.log("e:", e);
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
