import extend from "extend";
import httpStatus from "../utils/httpStatus";
const keyPath = require("algaeh-keys/keys");
import algaehMysql from "algaeh-mysql";
import algaehMail from "algaeh-utilities/mail-send";
import newAxios from "algaeh-utilities/axios";
import { pinSet, pinDelete, pinGet } from "algaeh-utilities/checksecurity";
import moment from "moment";
let getUserNamePassWord = (base64String) => {
  try {
    const temp = base64String.split(" ");
    const buffer = new Buffer.from(temp[1], "base64");
    const UserNamePassword = buffer.toString().split(":");
    return {
      username: UserNamePassword[0],
      password: UserNamePassword[1],
    };
  } catch (e) {
    console.error(e);
  }
};

//api authentication
let apiAuth = (req, res, next) => {
  let authModel = {
    username: "",
    password: "",
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
          algaeh_d_api_auth.algaeh_d_api_auth_id and hims_d_hospital.record_status='A'",
        //select * from algaeh_d_app_module;",
        values: [inputData.password, inputData.username],
        // printQuery: true
      })
      .then((result) => {
        _mysql.releaseConnection();
        if (result.length > 0) {
          req.result = {
            success: true,
            results: inputData.username, //result[0]["username"],
            hospitalList: result,
            // activemoduleList: result[1]
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
      .catch((error) => {
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
    password: "",
  };
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let inputData = extend(authModel, req.body);
    //,ORG.secure_modules
    _mysql
      .executeQuery({
        query:
          "SELECT  algaeh_d_app_user_id, username, user_display_name,  employee_code, locked, user_type,login_attempts,\
     password_expiry_rule, algaeh_m_role_user_mappings_id,app_d_app_roles_id,app_group_id,\
     role_code, role_name, role_discreption, role_type,loan_authorize_privilege,leave_authorize_privilege,finance_authorize_privilege,edit_monthly_attendance,\
     algaeh_d_app_group_id, app_group_code, app_group_name, app_group_desc, group_type, \
      U.employee_id, E.sub_department_id,UEM.hospital_id,S.page_to_redirect,E.full_name,E.arabic_name, E.service_dis_percentage \
     FROM  algaeh_d_app_user U inner join algaeh_m_role_user_mappings RU on RU.user_id=U.algaeh_d_app_user_id\
     inner join algaeh_d_app_roles R on RU.role_id=R.app_d_app_roles_id\
     inner join algaeh_d_app_group G on R.app_group_id=G.algaeh_d_app_group_id\
     inner join hims_m_user_employee UEM on  RU.user_id=UEM.user_id\
     inner join hims_d_employee E on U.employee_id=E.hims_d_employee_id\
     inner join  algaeh_d_app_password P on U.algaeh_d_app_user_id=P.userid\
     left join algaeh_d_app_screens S on  R.default_land_screen_id=S.algaeh_app_screens_id \
     WHERE P.password=md5(?) AND U.username=? AND U.record_status='A'   AND U.user_status='A' \
     AND P.record_status='A' AND G.record_status='A' AND R.record_status='A' and UEM.record_status='A' and E.employee_status <>'I'and UEM.hospital_id=?;\
     SELECT ORG.product_type, ORG.business_registration_number,ORG.tax_number,ORG.other_lang,ORG.other_lang_short,hims_d_hospital_id, hospital_code, local_vat_applicable, default_nationality, default_country, \
   H.default_currency, H.default_slot, H.default_patient_type, H.standard_from_time, H.standard_to_time, H.hospital_name,portal_exists, \
   H.arabic_hospital_name, H.hospital_address, H.city_id, organization_id, H.effective_start_date, H.effective_end_date, \
   hosital_status, lab_location_code ,hims_d_currency_id, currency_code, currency_description, currency_symbol,ORG.organization_name,ORG.organization_code,ORG.country_id as org_country_id,\
   decimal_places, symbol_position, thousand_separator, decimal_separator, negative_separator,unique_id_for_appointmt, requied_emp_id, mrn_num_sep_cop_client, \
   default_pay_type, vat_applicable, vat_percent FROM hims_d_hospital H, hims_d_currency CUR,hims_d_organization ORG WHERE H.record_status='A' AND \
   CUR.hims_d_currency_id=default_currency AND ORG.hims_d_organization_id = H.organization_id AND H.hims_d_hospital_id=?;",
        values: [
          inputData.password,
          inputData.username,
          inputData.item_id,
          inputData.item_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        req.hospital_id = inputData.item_id;
        next();
      })
      .catch((error) => {
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
    username: "",
  };
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let inputData = extend(authModel, req.query);

    _mysql
      .executeQuery({
        query:
          "SELECT algaeh_d_app_user_id, username, user_display_name,employee_code,P.password as gatepass,  locked, user_type,login_attempts,\
         password_expiry_rule, algaeh_m_role_user_mappings_id,app_d_app_roles_id,app_group_id,\
         role_code, role_name, role_discreption, role_type,loan_authorize_privilege,leave_authorize_privilege,edit_monthly_attendance,\
         algaeh_d_app_group_id, app_group_code, app_group_name, app_group_desc, group_type, \
          U.employee_id, E.sub_department_id,UEM.hospital_id,S.page_to_redirect, E.service_dis_percentage\
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
       decimal_places, symbol_position, thousand_separator, decimal_separator, negative_separator,\
       unique_id_for_appointmt, requied_emp_id, mrn_num_sep_cop_client FROM \
       hims_d_hospital, hims_d_currency CUR WHERE hims_d_hospital.record_status='A' AND \
       CUR.hims_d_currency_id=default_currency AND hims_d_hospital_id=?;",
        values: [inputData.username, inputData.item_id, inputData.item_id],
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

let userCheck = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    const { userId } = req.body;
    _mysql
      .executeQuery({
        query: `select ume.hospital_id,e.full_name,e.arabic_name,
          e.date_of_birth,e.employee_code from algaeh_d_app_user as u inner join 
          hims_m_user_employee as ume  on ume.user_id = u.algaeh_d_app_user_id
          inner join hims_d_employee as e on e.hims_d_employee_id = u.employee_id
          where UCASE(u.username)=UCASE(?) and u.record_status='A' and date(u.effective_start_date) <= date(now()) 
          and date(u.effective_end_date) >= date(now()) and e.employee_status in ('A','R') and u.locked='N' and ume.login_user='Y'; `,
        values: [userId],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        if (result.length > 0) {
          const {
            date_of_birth,
            hospital_id,
            full_name,
            arabic_name,
            employee_code,
          } = result[0];
          let happyBirthDay = "";
          const dobMonthDay = parseInt(moment(date_of_birth).format("MMDD"));
          const currentMonthDay = parseInt(moment().format("MMDD"));
          if (dobMonthDay === currentMonthDay) {
            happyBirthDay = `Happy Birthday`;
          }
          // happyBirthDay = `Happy Birthday`;
          req.records = {
            hospital_id,
            full_name,
            arabic_name,
            happyBirthDay,
            employee_code,
          };

          next();
        } else {
          next(new Error("User Does Not Exist OR User is Inactive"));
        }
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
const resetPassword = (req, res, next) => {
  const { username } = req.body;
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query: `select e.work_email,e.full_name from algaeh_d_app_user as u inner join hims_d_employee as e
      on u.employee_id = e.hims_d_employee_id where lcase(u.username)=lcase(?)
      and u.locked ='N' and u.record_status='A' and e.employee_status='A' and e.record_status='A'; `,
        values: [username],
      })
      .then((result) => {
        _mysql.releaseConnection();
        if (result.length > 0) {
          const { work_email, full_name } = result[0];
          if (work_email === null || work_email === "") {
            next(new Error("No email id provided to send new password."));
            return;
          }
          const pin = Math.floor(Math.random() * 90000) + 10000;
          try {
            newAxios(req, {
              url: "http://localhost:3006/api/v1//Document/getEmailConfig",
            }).then((res) => {
              const options = res.data;

              new algaehMail(options.data[0])
                .to(work_email)
                .subject("Password reset PIN")
                .templateHbs("userPasswodReset.hbs", {
                  pin,
                  full_name,
                })
                .send()
                .then((result) => {
                  const user = username.toLowerCase();
                  pinSet(user, pin);
                  console.log("Email sent : ", result);
                  next();
                })
                .catch((error) => {
                  console.error("Email error", error);
                  next(new Error(error));
                });
            });
          } catch (e) {
            _mysql.releaseConnection();
            next(e);
          }
          new algaehMail();
        } else {
          next(new Error("No record found for this userid"));
        }
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
const verifyPin = (req, res, next) => {
  const { pinNo, username } = req.body;
  pinGet(username)
    .then((result) => {
      if (result === pinNo) {
        next();
      } else {
        next(new Error("PIN not valid."));
      }
    })
    .catch((error) => {
      next(error);
    });
};
const changePasswordRequest = (req, res, next) => {
  const { newPassword, username } = req.body;
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query: `select algaeh_d_app_user_id from algaeh_d_app_user where lcase(username) =lcase(?)
     and locked='N' and record_status='A' and user_status='A';`,
        values: [username],
      })
      .then((result) => {
        if (result.length > 0) {
          const { algaeh_d_app_user_id } = result[0];
          _mysql
            .executeQuery({
              query: `update algaeh_d_app_password set password=md5(?) where userid=?;`,
              values: [newPassword, algaeh_d_app_user_id],
            })
            .then(() => {
              _mysql.releaseConnection();
              next();
            })
            .catch((error) => {
              _mysql.releaseConnection();
              next(error);
            });
        } else {
          _mysql.releaseConnection();
          next(new Error("There is no user to change password"));
        }
      })
      .catch((error) => {
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
  verifyPin,
  authUser,
  apiAuthentication,
  userCheck,
  resetPassword,
  changePasswordRequest,
};
