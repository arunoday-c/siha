const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      // const _ = options.loadash;
      // const moment = options.moment;
      // const writtenForm = options.writtenForm;

      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      //       select H.hospital_name, hims_f_leave_encash_header_id,encashment_number, employee_id, encashment_date, year, total_amount,emp.employee_code,
      // emp.full_name, emp.hospital_id, authorized, D.designation, L.leave_description, EH.leave_days from hims_f_leave_encash_header EH
      // inner join hims_d_employee emp on EH.employee_id = emp.hims_d_employee_id  and EH.hospital_id= emp.hospital_id
      // inner join hims_d_hospital H on H.hims_d_hospital_id = emp.hospital_id
      // inner join hims_d_designation D on D.hims_d_designation_id = emp.employee_designation_id
      // inner join hims_d_leave L on L.hims_d_leave_id = EH.leave_id
      //                             where hims_f_leave_encash_header_id=?;
      options.mysql
        .executeQuery({
          query: ` SELECT leave_encash_level FROM hims_d_hrms_options limit 1;`,
          printQuery: false,
        })

        .then((hr_option) => {
          let selectQry = "";
          let joinQry = "";

          if (hr_option[0]["leave_encash_level"] == "2") {
            selectQry =
              "  , case EH.authorized2 when 'PEN' then  'PENDING' \
              when 'APR' then  'APPROVED' when 'REJ' then 'REJECTED' end as authorized2 ,\
              coalesce(concat(A2E.full_name,' / ',A2E.employee_code),'-') as authorized2_by, \
              coalesce(EH.authorized2_date ,'-') as authorized2_date ";

            joinQry =
              " left join algaeh_d_app_user A2 on EH.posted_by=A2.algaeh_d_app_user_id\
              left join hims_d_employee A2E on A1.employee_id=A2E.hims_d_employee_id";
          }

          options.mysql
            .executeQuery({
              query: ` select  hims_f_leave_encash_header_id,H.hospital_name, EH.encashment_number, EH.employee_id,
              EH.encashment_date, EH.year, EH.total_amount,E.employee_code,E.full_name, 
              case  authorized when 'PEN' then  'PENDING' when 'APR' then  'APPROVED' when 'REJ' then 
              'REJECTED' when 'PRO' then 'PROCESSED' when 'SET' then  'SETTLED'when 'CAN' then 'CANCELLED' 
              else 'None' end as auth_status,D.designation, L.leave_description, EH.leave_days ,
              SH.balance_leave_days,SH.balance_leave_salary_amount,case EH.posted when 'N' then 'No' when'Y'
               then 'Yes' end as posted_status,coalesce(concat(POE.full_name,' / ',POE.employee_code),'-') 
               as posted_by,coalesce(EH.posted_date ,'-') as posted_date,EH.payment_date,case EH.authorized1 
               when 'PEN' then  'PENDING' when 'APR' then  'APPROVED' when 'REJ' then 'REJECTED' end as authorized1 ,
              coalesce(concat(A1E.full_name,' / ',A1E.employee_code),'-') as authorized1_by, 
              coalesce(EH.authorized1_date ,'-') as authorized1_date ${selectQry} from hims_f_leave_encash_header EH 
              inner join hims_d_employee E on EH.employee_id = E.hims_d_employee_id
              inner join hims_d_hospital H on E.hospital_id=H.hims_d_hospital_id 
              inner join hims_d_leave L on  EH.leave_id=L.hims_d_leave_id 
              inner join hims_f_employee_leave_salary_header SH on EH.employee_id=SH.employee_id and EH.year=SH.year
              left join hims_d_designation D on  E.employee_designation_id=D.hims_d_designation_id 
              left join algaeh_d_app_user PO on EH.posted_by=PO.algaeh_d_app_user_id left join hims_d_employee POE 
              on PO.employee_id=POE.hims_d_employee_id   left join algaeh_d_app_user A1 on EH.posted_by=A1.algaeh_d_app_user_id
              left join hims_d_employee A1E on A1.employee_id=A1E.hims_d_employee_id ${joinQry}
              where hims_f_leave_encash_header_id=?;`,
              values: [input.hims_f_leave_encash_header_id],

              printQuery: false,
            })

            .then((result) => {
              options.mysql.releaseConnection();
              if (result.length) {
                const detail = [];
                if (hr_option[0]["leave_encash_level"] == "1") {
                  detail.push({
                    desc1: "authorized",
                    desc2: "authorized by",
                    desc3: "authorized date",
                    value1: result[0]["authorized1"],
                    value2: result[0]["authorized1_by"],
                    value3: result[0]["authorized1_date"],
                  });
                } else if (hr_option[0]["leave_encash_level"] == "2") {
                  detail.push({
                    desc1: "authorized_1",
                    desc2: "authorized_1 by",
                    desc3: "authorized_1 date",
                    value1: result[0]["authorized1"],
                    value2: result[0]["authorized1_by"],
                    value3: result[0]["authorized1_date"],
                  });
                  detail.push({
                    desc1: "authorized_2",
                    desc2: "authorized_2 by",
                    desc3: "authorized_2 date",
                    value1: result[0]["authorized2"],
                    value2: result[0]["authorized2_by"],
                    value3: result[0]["authorized2_date"],
                  });
                }

                let output = {
                  hospital_name: result[0]["hospital_name"],
                  encashment_number: result[0]["encashment_number"],
                  employee_id: result[0]["employee_id"],
                  encashment_date: result[0]["encashment_date"],
                  year: result[0]["year"],
                  total_amount: result[0]["total_amount"],
                  employee_code: result[0]["employee_code"],
                  full_name: result[0]["full_name"],
                  auth_status: result[0]["auth_status"],
                  designation: result[0]["designation"],
                  leave_description: result[0]["leave_description"],
                  leave_days: result[0]["leave_days"],
                  balance_leave_days: result[0]["balance_leave_days"],
                  balance_leave_salary_amount:
                    result[0]["balance_leave_salary_amount"],
                  posted_status: result[0]["posted_status"],
                  posted_by: result[0]["posted_by"],
                  posted_date: result[0]["posted_date"],
                  payment_date: result[0]["payment_date"],
                  detail: detail,
                };

                console.log("output:", output);
                resolve(output);
              } else {
                resolve({});
              }
            })
            .catch((e) => {
              console.log("e:", e);
              options.mysql.releaseConnection();
            });
        })
        .catch((error) => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      console.log("e:", e);
      reject(e);
    }
  });
};
module.exports = { executePDF };
