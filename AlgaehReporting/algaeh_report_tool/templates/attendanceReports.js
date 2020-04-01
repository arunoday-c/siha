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

      if (input.hospital_id > 0) {
        str += ` and AM.hospital_id= ${input.hospital_id}`;
      }

      if (input.sub_department_id > 0) {
        str += ` and AM.sub_department_id= ${input.sub_department_id}`;
      }

      if (input.hims_d_employee_id > 0) {
        str += ` and AM.employee_id= ${input.hims_d_employee_id}`;
      }

      if (input.employee_group_id > 0) {
        str += ` and E.employee_group_id= ${input.employee_group_id}`;
      }

      if (input.department_id > 0) {
        str += ` and SD.department_id=${input.department_id}`;
      }
      let is_local = "";

      if (input.is_local === "Y") {
        is_local = " and H.default_nationality=E.nationality ";
      } else if (input.is_local === "N") {
        is_local = " and H.default_nationality<>E.nationality ";
      }

      // 	const month_number =
      // 	req.query.yearAndMonth === undefined ? req.query.month : moment(req.query.yearAndMonth).format('M');
      // const year =
      // 	req.query.yearAndMonth === undefined
      // 		? req.query.year
      // 		: moment(new Date(req.query.yearAndMonth)).format('YYYY');

      options.mysql
        .executeQuery({
          query: `select hims_f_attendance_monthly_id,employee_id,E.employee_code,E.full_name as employee_name,\
					year,month,AM.hospital_id,AM.sub_department_id,\
					total_days,present_days,display_present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,\
					total_leave,paid_leave,unpaid_leave,total_paid_days ,pending_unpaid_leave,total_hours,total_working_hours,\
					shortage_hours,ot_work_hours,ot_weekoff_hours,ot_holiday_hours,(COALESCE(ot_weekoff_hours,0)+COALESCE(ot_holiday_hours,0)) as total_ot_hr from hims_f_attendance_monthly AM \
					inner join hims_d_employee E on AM.employee_id=E.hims_d_employee_id \
          left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id \
          	left join hims_d_hospital H  on E.hospital_id=H.hims_d_hospital_id \
					where AM.record_status='A' and AM.year= ? and AM.month=? ${is_local} ${str} `,
          values: [input.year, input.month],
          printQuery: true
        })
        .then(result => {
          resolve({ result: result });
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
