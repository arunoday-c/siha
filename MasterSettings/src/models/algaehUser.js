import algaehMysql from "algaeh-mysql";
export default {
  getLoginUserMasterGrid: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      if (req.userIdentity.role_type != "GN") {
        let adminUSer = "";
        if (req.userIdentity.role_type != "SU") {
          adminUSer = " and   group_type <> 'SU' and role_type <>'SU' ";
        }

        _mysql
          .executeQuery({
            query: `select  algaeh_d_app_user_id,H.hospital_name,username,user_display_name,user_type,user_status,hims_d_employee_id,
                employee_code,R.app_group_id,RU.role_id,full_name,E.email,E.work_email, role_name,app_group_name,algaeh_m_role_user_mappings_id , app_d_app_roles_id, 
              UM.hospital_id, hims_m_user_employee_id from  hims_m_user_employee UM
              inner join hims_d_hospital H on UM.hospital_id=H.hims_d_hospital_id
               inner join algaeh_m_role_user_mappings RU  on  UM.user_id=RU.user_id 
                inner join algaeh_d_app_roles R on  RU.role_id=R.app_d_app_roles_id
                inner join algaeh_d_app_group G on R.app_group_id=G.algaeh_d_app_group_id 
              inner join algaeh_d_app_user U on UM.user_id=U.algaeh_d_app_user_id
              inner join hims_d_employee E on U.employee_id=E.hims_d_employee_id
                  where E.record_status='A' and UM.login_user='Y' 
                  ${adminUSer}
                  order by  algaeh_d_app_user_id desc`,
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          validUser: false,
          message: "you dont have admin privilege",
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
};
