//import algaehUtilities from 'algaeh-utilities/utilities';
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    //	const utilities = new algaehUtilities();
    try {
      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      if (input.sub_department_id > 0) {
        str += ` and A.sub_department_id= ${input.sub_department_id}`;
      }

      if (input.provider_id > 0) {
        str += ` and A.provider_id= ${input.provider_id}`;
      }

      if (input.status_id > 0) {
        str += ` and A.appointment_status_id= ${input.status_id}`;
      }
      options.mysql
        .executeQuery({
          query: `select hims_f_patient_appointment_id,appointment_date,appointment_from_time,appointment_to_time, S.description as app_status,S.default_status, patient_name,patient_code,A.age,A.gender,contact_number,cancelled,appointment_remarks, E.full_name as doctor_name,E.employee_code as doctor_code ,cancel_reason,concat(D.full_name,'-' ,D.employee_code)as updated_by, SB.sub_department_name
          from hims_f_patient_appointment A 
          inner join hims_d_employee E on A.provider_id=E.hims_d_employee_id 
          inner join hims_d_sub_department SB on A.sub_department_id=SB.hims_d_sub_department_id 
          inner join hims_d_appointment_status S on A.appointment_status_id=S.hims_d_appointment_status_id 
          left join algaeh_d_app_user U on A.updated_by=U.algaeh_d_app_user_id 
          left join  hims_d_employee D on  U.employee_id=D.hims_d_employee_id 
          where A.appointment_date between date(?) and date(?) and A.hospital_id=? ${str} \
order by appointment_date;`,
          values: [
            input.from_date,
            input.to_date,
            options.args.hospital_id,
            input.sub_department_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          const data = _.chain(result)
            .groupBy((g) => g.doctor_code)
            .map(function (detail, key) {
              let cancel = detail.filter((item) => {
                return item.default_status == "CAN";
              }).length;
              let checked_in = detail.filter((item) => {
                return item.default_status == "C";
              }).length;
              let no_show = detail.filter((item) => {
                return item.default_status == "NS";
              }).length;

              return {
                doctor_code: key,
                doctor_name: detail[0]["doctor_name"],
                checked_in: checked_in,
                no_show: no_show,
                cancel: cancel,
                details: detail,
              };
            })
            .value();

          //utilities.logger().log('datazz: ', data);
          resolve({ groupdetails: data });
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
