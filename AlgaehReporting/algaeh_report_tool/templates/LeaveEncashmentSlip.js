const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      const writtenForm = options.writtenForm;

      let input = options.args.reportParams.find(
        (f) => f.name === "hims_f_leave_encash_header_id"
      );

      const month = moment(input.month, "M").format("MMMM");
      options.mysql
        .executeQuery({
          query: `select H.hospital_name, hims_f_leave_encash_header_id,encashment_number, employee_id, encashment_date, year, total_amount,emp.employee_code,
emp.full_name, emp.hospital_id, authorized, D.designation, L.leave_description, EH.leave_days from hims_f_leave_encash_header EH
inner join hims_d_employee emp on EH.employee_id = emp.hims_d_employee_id  and EH.hospital_id= emp.hospital_id 
inner join hims_d_hospital H on H.hims_d_hospital_id = emp.hospital_id
inner join hims_d_designation D on D.hims_d_designation_id = emp.employee_designation_id
inner join hims_d_leave L on L.hims_d_leave_id = EH.leave_id
                            where hims_f_leave_encash_header_id=?;`,
          values: [input.value],
          printQuery: true,
        })

        .then((result) => {
          resolve({
            result: result,
          });
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
