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
      if (input.religion_id > 0) {
        strQuery += ` and E.religion_id=${input.religion_id}`;
      }

      options.mysql
        .executeQuery({
          query: ` 
          select  hospital_name FROM hims_d_hospital where hims_d_hospital_id=?;
          select hims_d_employee_id,employee_code,full_name,sex,date_of_joining,
          case employee_status when 'A' then 'ACTIVE' when 'I' then 'INACTIVE'
          when 'R' then 'RESIGNED' when 'T' then 'TERMINATED' when 'E' then 'RETIRED'
          end asemployee_status,DG.designation,N.nationality,R.religion_name,
          E.sub_department_id, SD.sub_department_name,D.hims_d_department_id,D.department_name,
          case employee_type when  'PE' then  'PERMANENT' when  'CO' then  'CONTRACT'
          when  'PB' then  'PROBATION' when  'LC' then  'LOCUM'
          when  'VC' then  'VISITING CONSULTANT'end as employee_type,hims_d_religion_id
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
            const nationgWiseEmp = _.chain(result)
              .groupBy(g => g.hims_d_religion_id)
              .map(m => {
                return {
                  religion: m[0]["religion_name"],
                  no_employee: m.length,
                  employees: m
                };
              })
              .value();

            resolve({
              hospital_name: hospital_name,
              no_employees: result.length,
              result: nationgWiseEmp
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
