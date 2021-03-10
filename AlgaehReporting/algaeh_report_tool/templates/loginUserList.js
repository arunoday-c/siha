const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      const writtenForm = options.writtenForm;

      // // let str = "";
      // let input = {};
      // let params = options.args.reportParams;

      // params.forEach((para) => {
      //   input[para["name"]] = para["value"];
      // });

      // if (input.hospital_id > 0) {
      //   str += ` and AM.hospital_id= ${input.hospital_id}`;
      // }
      // let is_local = "";

      // if (input.is_local === "Y") {
      //   is_local = " and H.default_nationality=E.nationality ";
      // } else if (input.is_local === "N") {
      //   is_local = " and H.default_nationality<>E.nationality ";
      // }

      // ${str}

      options.mysql
        .executeQuery({
          query: `select  username,login_attempt_date,
          case when USR.user_type = 'AD' then 'ADMIN' when USR.user_type = 'D' then 'DOCTOR' when USR.user_type = 'N' then 'NURSE' when USR.user_type = 'C' then 'CASHIER' when USR.user_type = 'L' then 'LAB TECHNICIAN' when USR.user_type = 'HR' then 'HR' when USR.user_type = 'PM' then 'Payroll Manager' when USR.user_type = 'O' then 'OTHERS' else '' end as user_type,
          EM.full_name,EM.employee_code,ID.identity_document_name,EM.identity_no,G.app_group_name,R.role_name,case when USR.user_status='A' then 'Active' else 'Inactive' end as user_status
           from algaeh_d_app_user USR 
          inner join hims_d_employee EM on EM.hims_d_employee_id=USR.employee_id
          inner join hims_d_identity_document ID on ID.hims_d_identity_document_id = EM.identity_type_id
          inner join algaeh_m_role_user_mappings UR on UR.user_id = USR.algaeh_d_app_user_id
          inner join algaeh_d_app_roles R on R.app_d_app_roles_id = UR.role_id
          inner join algaeh_d_app_group G on G.algaeh_d_app_group_id = R.app_group_id
          where user_type <> 'SU';`,
          // values: [],
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
