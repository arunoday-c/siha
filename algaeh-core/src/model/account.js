import extend from "extend";
import httpStatus from "../utils/httpStatus";
const keyPath = require("algaeh-keys/keys");
import algaehMysql from "algaeh-mysql";

let getUserNamePassWord = base64String => {
  try {
    const temp = base64String.split(" ");
    const buffer = new Buffer.from(temp[1], "base64");
    const UserNamePassword = buffer.toString().split(":");
    return {
      username: UserNamePassword[0],
      password: UserNamePassword[1]
    };
  } catch (e) {
    console.error(e);
  }
};

//api authentication
let apiAuth = (req, res, next) => {
  let authModel = {
    username: "",
    password: ""
  };

  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let authHeader = req.headers["authorization"];
    if (!authHeader || authHeader == "") {
      next(
        httpStatus.generateError(
          httpStatus.unAuthorized,
          "Missing authorization token"
        )
      );
    }

    let inputData = extend(authModel, getUserNamePassWord(authHeader));

    if (inputData.username == null || inputData.username == "") {
      next(
        httpStatus.generateError(
          httpStatus.badRequest,
          "User name cannot blank"
        )
      );
    }
    if (inputData.password == null || inputData.password == "") {
      next(
        httpStatus.generateError(httpStatus.badRequest, "Password cannot blank")
      );
    }
    req.body = inputData;
    _mysql
      .executeQuery({
        query:
          "SELECT  hims_d_hospital_id,hospital_code,hospital_name,arabic_hospital_name, \
          username,algaeh_api_auth_id FROM algaeh_d_api_auth,hims_d_hospital WHERE password=md5(?)\
          AND algaeh_d_api_auth.record_status='A' AND username =? and hims_d_hospital.algaeh_api_auth_id =\
          algaeh_d_api_auth.algaeh_d_api_auth_id and hims_d_hospital.record_status='A';select * from algaeh_d_app_module;",
        values: [inputData.password, inputData.username]
      })
      .then(result => {
        _mysql.releaseConnection();
        if (result.length > 0) {
          req.result = {
            success: true,
            results: result[0]["username"],
            hospitalList: result[0],
            activemoduleList: result[1]
          };
          next();
        } else {
          next(
            httpStatus.generateError(
              httpStatus.unAuthorized,
              "Authentication service error please contact to your service provider"
            )
          );
        }
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//api user authentication
let authUser = (req, res, next) => {
  let authModel = {
    username: "",
    password: ""
  };

  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let inputData = extend(authModel, req.body);

    _mysql
      .executeQuery({
        query:
          "SELECT algaeh_d_app_user_id, username, user_display_name,  locked, user_type,login_attempts,\
     password_expiry_rule, algaeh_m_role_user_mappings_id,app_d_app_roles_id,app_group_id,\
     role_code, role_name, role_discreption, role_type,loan_authorize_privilege,leave_authorize_privilege,finance_authorize_privilege,edit_monthly_attendance,\
     algaeh_d_app_group_id, app_group_code, app_group_name, app_group_desc, group_type, \
      U.employee_id, E.sub_department_id,UEM.hospital_id,S.page_to_redirect\
     FROM  algaeh_d_app_user U inner join algaeh_m_role_user_mappings RU on RU.user_id=U.algaeh_d_app_user_id\
     inner join algaeh_d_app_roles R on RU.role_id=R.app_d_app_roles_id\
     inner join algaeh_d_app_group G on R.app_group_id=G.algaeh_d_app_group_id\
     inner join hims_m_user_employee UEM on  RU.user_id=UEM.user_id\
     inner join hims_d_employee E on U.employee_id=E.hims_d_employee_id\
     inner join  algaeh_d_app_password P on U.algaeh_d_app_user_id=P.userid\
     left join algaeh_d_app_screens S on  RU.land_screen_id=S.algaeh_app_screens_id \
     WHERE P.password=md5(?) AND U.username=? AND U.record_status='A'   AND U.user_status='A' \
     AND P.record_status='A' AND G.record_status='A' AND R.record_status='A' and UEM.record_status='A' and E.employee_status <>'I'and UEM.hospital_id=?;\
     SELECT hims_d_hospital_id, hospital_code, local_vat_applicable, default_nationality, default_country, \
   default_currency, default_slot, default_patient_type, standard_from_time, standard_to_time, hospital_name, \
   arabic_hospital_name, hospital_address, city_id, organization_id, effective_start_date, effective_end_date, \
   hosital_status, lab_location_code ,hims_d_currency_id, currency_code, currency_description, currency_symbol,\
   decimal_places, symbol_position, thousand_separator, decimal_separator, negative_separator,unique_id_for_appointmt, requied_emp_id FROM \
   hims_d_hospital, hims_d_currency CUR WHERE hims_d_hospital.record_status='A' AND \
   CUR.hims_d_currency_id=default_currency AND hims_d_hospital_id=?;",
        values: [
          inputData.password,
          inputData.username,
          inputData.item_id,
          inputData.item_id
        ],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

let apiAuthentication = (req, res, next) => {
  let authModel = {
    username: ""
  };
  console.log("Inside api authentication");
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let inputData = extend(authModel, req.query);

    _mysql
      .executeQuery({
        query:
          "SELECT algaeh_d_app_user_id, username, user_display_name,P.password as gatepass,  locked, user_type,login_attempts,\
         password_expiry_rule, algaeh_m_role_user_mappings_id,app_d_app_roles_id,app_group_id,\
         role_code, role_name, role_discreption, role_type,loan_authorize_privilege,leave_authorize_privilege,edit_monthly_attendance,\
         algaeh_d_app_group_id, app_group_code, app_group_name, app_group_desc, group_type, \
          U.employee_id, E.sub_department_id,UEM.hospital_id,S.page_to_redirect\
         FROM  algaeh_d_app_user U inner join algaeh_m_role_user_mappings RU on RU.user_id=U.algaeh_d_app_user_id\
         inner join algaeh_d_app_roles R on RU.role_id=R.app_d_app_roles_id\
         inner join algaeh_d_app_group G on R.app_group_id=G.algaeh_d_app_group_id\
         inner join hims_m_user_employee UEM on  RU.user_id=UEM.user_id\
         inner join hims_d_employee E on U.employee_id=E.hims_d_employee_id\
         inner join  algaeh_d_app_password P on U.algaeh_d_app_user_id=P.userid\
         left join algaeh_d_app_screens S on  RU.land_screen_id=S.algaeh_app_screens_id \
         WHERE  U.username=? AND U.record_status='A'   AND U.user_status='A' \
         AND P.record_status='A' AND G.record_status='A' AND R.record_status='A' and UEM.record_status='A' and E.employee_status <>'I'and UEM.hospital_id=?;\
         SELECT hims_d_hospital_id, hospital_code, local_vat_applicable, default_nationality, default_country, \
       default_currency, default_slot, default_patient_type, standard_from_time, standard_to_time, hospital_name, \
       arabic_hospital_name, hospital_address, city_id, organization_id, effective_start_date, effective_end_date, \
       hosital_status, lab_location_code ,hims_d_currency_id, currency_code, currency_description, currency_symbol,\
       decimal_places, symbol_position, thousand_separator, decimal_separator, negative_separator,unique_id_for_appointmt, requied_emp_id FROM \
       hims_d_hospital, hims_d_currency CUR WHERE hims_d_hospital.record_status='A' AND \
       CUR.hims_d_currency_id=default_currency AND hims_d_hospital_id=?;",
        values: [inputData.username, inputData.item_id, inputData.item_id],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export default {
  apiAuth,
  authUser,
  apiAuthentication
};
