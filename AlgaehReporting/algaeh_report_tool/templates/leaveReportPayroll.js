const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let str = "";

      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      //utilities.logger().log("input: ", input);

      if (input.hospital_id > 0) {
        str += ` and E.hospital_id=${input.hospital_id}`;
      }

      if (input.hims_d_leave_id > 0) {
        str += ` and leave_id=${input.hims_d_leave_id}`;
      }
      if (input.employee_group_id > 0) {
        str += ` and E.employee_group_id= ${input.employee_group_id}`;
      }

      if (input.sub_department_id > 0) {
        str += ` and E.sub_department_id= ${input.sub_department_id}`;
      }

      if (input.department_id > 0) {
        str += ` and SD.department_id=${input.department_id}`;
      }

      if (
        input.status !== "" &&
        input.status !== null &&
        input.status !== undefined
      ) {
        str += ` and status='${input.status}'`;
      }

      let is_local = "";

      if (input.is_local === "Y") {
        is_local = " and H.default_nationality=E.nationality ";
      } else if (input.is_local === "N") {
        is_local = " and H.default_nationality<>E.nationality ";
      }

      options.mysql
        .executeQuery({
          query: `select hims_f_leave_application_id, leave_application_code, LA.employee_id, leave_id, \
from_date, to_date, total_applied_days, case EAL.from_normal_salary  when 'N' then \
'Leave Salary' else 'Normal Salary' end as from_normal_salary, \
case status  when  'PEN' then 'PENDING' when 'APR' then 'APPROVED' when 'REJ' then 'REJECTED' \
when 'CAN' then 'CANCELLED' end as status ,L.leave_code,L.leave_description,L.leave_type, \ 
E.employee_code,E.full_name as employee_name,E.sex,E.employee_status, \
SD.sub_department_code, SD.sub_department_name, D.department_name, \
EG.group_description,L1.user_display_name as autho1_by ,L2.user_display_name as autho2_by,L3.user_display_name as autho3_by \
FROM hims_f_leave_application LA inner join  hims_d_leave L on LA.leave_id=L.hims_d_leave_id \
inner join hims_d_employee E on LA.employee_id=E.hims_d_employee_id \
left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id \
left join hims_d_department D on SD.department_id=D.hims_d_department_id \
left join hims_f_employee_annual_leave EAL on EAL.leave_application_id=LA.hims_f_leave_application_id \
left join hims_d_employee_group EG on E.employee_group_id=EG.hims_d_employee_group_id \
left join hims_d_hospital H  on E.hospital_id=H.hims_d_hospital_id \        
left join algaeh_d_app_user L1 on LA.authorized1_by=L1.algaeh_d_app_user_id \
left join algaeh_d_app_user L2 on LA.authorized2_by=L2.algaeh_d_app_user_id \
left join algaeh_d_app_user L3 on LA.authorized3_by=L3.algaeh_d_app_user_id \
where(  (  date(?)>=date(from_date) and date(?)<=date(to_date)) or \
( date(?)>=date(from_date) and   date(?)<=date(to_date)) \
or (date(from_date)>= date(?) and date(from_date)<=date(?) ) )  ${is_local}	${str};`,
          values: [
            input.from_date,
            input.to_date,
            input.from_date,
            input.to_date,
            input.from_date,
            input.to_date,
          ],
          printQuery: true,
        })
        .then((results) => {
          const result = _.chain(results)
            .groupBy((g) => g.status)
            .map(function (dtl, key) {
              return {
                status: key,
                detailList: dtl,
              };
            })
            .value();
          resolve({ detail: result });
        })
        .catch((error) => {
          options.mysql.releaseConnection();
        });

      //const result = { detailList: options.result };
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
