const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      // const utilities = new algaehUtilities();

      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // date(?-?'-01') and date(?-?'-31')

      let strData = "";
      // if (input.year > 0) {
      //   strData +=
      //     " date('" +
      //     input.year +
      //     "-" +
      //     input.month +
      //     "-01') and date('" +
      //     input.year +
      //     "-" +
      //     input.month +
      //     "-31')";
      // }

      if (input.hospital_id > 0) {
        strData += " and PR.hospital_id=" + input.hospital_id;
      }
      if (input.project_id > 0) {
        strData += " and PR.project_id=" + input.project_id;
      }
      if (input.employee_type) {
        strData += ` and PR.employee_type= '${input.employee_type}'`;
      }
      // if (input.department_id > 0) {
      //   strData += " and SD.department_id=" + input.department_id;
      // }

      // if (input.sub_department_id > 0) {
      //   strData += " and E.sub_department_id=" + input.sub_department_id;
      // }
      // if (input.employee_group_id > 0) {
      //   strData += " and E.employee_group_id=" + input.employee_group_id;
      // }

      // if (input.designation_id > 0) {
      //   strData += " and E.employee_designation_id=" + input.designation_id;
      // }

      options.mysql
        .executeQuery({
          query: `select hims_d_employee_id,employee_code,full_name, 
          designation,project_code,project_desc,attendance_date,hospital_code,hospital_name 
          from view_project_roster as PR
          where date(PR.attendance_date) between  date(?) and date(?) ${strData} ;`,
          values: [input.from_date, input.to_date],
          printQuery: true,
        })
        .then((results) => {
          const result = _.chain(results)
            .groupBy((g) => g.hims_d_employee_id)
            .map(function (dtl) {
              const {
                employee_code,
                full_name,
                designation,
                attendance_date,
              } = dtl[0];
              return {
                employee_code,
                full_name,
                designation,
                attendance_date,
                emp_count: dtl.length,
                detailList: dtl,
              };
            })
            .value();
          resolve({ detail: result });
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
