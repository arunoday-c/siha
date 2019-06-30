const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;

      let str = "";

      let input = {};
      let params = options.args.reportParams;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      //utilities.logger().log("input: ", input);

      if (input.hims_d_leave_id > 0) {
        str += ` and leave_id=${input.hims_d_leave_id}`;
      }
      if (
        input.status !== "" &&
        input.status !== null &&
        input.status !== undefined
      ) {
        str += ` and status='${input.status}'`;
      }

      options.mysql
        .executeQuery({
          query: `select hims_f_leave_application_id, leave_application_code,employee_id, leave_id ,
			  from_date,to_date,total_applied_days,status ,L.leave_code,L.leave_description,L.leave_type,
			  E.employee_code,full_name as employee_name,E.sex,E.employee_status,
			  SD.sub_department_code,SD.sub_department_name
			  FROM hims_f_leave_application LA inner join  hims_d_leave L on LA.leave_id=L.hims_d_leave_id
			  inner join hims_d_employee E  on LA.employee_id=E.hims_d_employee_id
			  inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id
			  where((from_date>= ? and from_date <= ?) or (to_date >= ? and to_date <= ?) or (from_date <= ? and to_date >= ?))	${str};`,
          values: [
            input.from_date,
            input.to_date,
            input.from_date,
            input.to_date,
            input.from_date,
            input.to_date
          ],
          printQuery: true
        })
        .then(results => {
          const result = _.chain(results)
            .groupBy(g => g.status)
            .map(function(dtl, key) {
              return {
                status: key,
                detailList: dtl
              };
            })
            .value();
          resolve({ detail: result });
        })
        .catch(error => {
          options.mysql.releaseConnection();
          console.log("error", error);
        });

      //const result = { detailList: options.result };
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
