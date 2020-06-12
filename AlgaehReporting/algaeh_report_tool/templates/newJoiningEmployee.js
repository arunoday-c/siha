// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      // const utilities = new algaehUtilities();
      let input = {};

      const params = options.args.reportParams;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      // utilities.logger().log("input: ", input);

      let strQuery = "";

      let return_input = "";
      if (input.department_id > 0) {
        strQuery += ` and SD.department_id=${input.department_id}`;
      }
      if (input.sub_department_id > 0) {
        strQuery += ` and E.sub_department_id=${input.sub_department_id}`;
      }
      if (input.employee_group_id > 0) {
        strQuery += ` and E.employee_group_id=${input.employee_group_id}`;
      }

      let start_date = moment()
        .startOf("month")
        .format("YYYY-MM-DD");
      let end_date = moment()
        .endOf("month")
        .format("YYYY-MM-DD");

      if (input.year > 0 && input.month > 0) {
        start_date = moment(input.year + "-" + input.month, "YYYY-M")
          .startOf("month")
          .format("YYYY-MM-DD");
        end_date = moment(input.year + "-" + input.month, "YYYY-M")
          .endOf("month")
          .format("YYYY-MM-DD");
      } else if (input.year > 0 && !input.month > 0) {
        start_date = moment(input.year, "YYYY")
          .startOf("year")
          .format("YYYY-MM-DD");
        end_date = moment(input.year, "YYYY")
          .endOf("year")
          .format("YYYY-MM-DD");
      } else if (!input.year > 0 && input.month > 0) {
        start_date = moment(input.month, "M")
          .startOf("month")
          .format("YYYY-MM-DD");

        end_date = moment(input.month, "M")
          .endOf("month")
          .format("YYYY-MM-DD");
      }

      switch (input.date_of_join) {
        case "A":
          strQuery += ` and E.date_of_joining > date('${end_date}')`;
          return_input = `  After ${end_date}`;
          break;
        case "B":
          strQuery += ` and E.date_of_joining < date('${start_date}')`;
          return_input = `  Before ${start_date}`;
          break;

        default:
          strQuery += ` and E.date_of_joining  between date('${start_date}') and date('${end_date}')`;

          return_input = `  Between ${start_date} and  ${end_date}`;
          break;
      }

      options.mysql
        .executeQuery({
          query: `
          select  hospital_name FROM hims_d_hospital where hims_d_hospital_id=?;
          select hims_d_employee_id,employee_code,full_name,sex,date_of_joining,G.group_description,
          case employee_status when 'A' then 'ACTIVE' when 'I' then 'INACTIVE'
          when 'R' then 'RESIGNED' when 'T' then 'TERMINATED' when 'E' then 'RETIRED'
          end asemployee_status,DG.designation,N.nationality,R.religion_name,
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
           left join hims_d_employee_group G on E.employee_group_id=G.hims_d_employee_group_id
          where E.hospital_id=? and E.record_status='A'  ${strQuery} order by date_of_joining desc; `,
          values: [input.hospital_id, input.hospital_id],
          printQuery: true
        })
        .then(res => {
          options.mysql.releaseConnection();
          const hospital_name = res[0][0]["hospital_name"];
          const result = res[1];

          resolve({
            hospital_name: hospital_name,
            return_input: return_input,
            no_employees: result.length,
            result: result
          });
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
