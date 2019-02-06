import extend from "extend";
import httpStatus from "../utils/httpStatus";
import { debugLog } from "../utils/logging";

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
  try {
    let db;
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    } else {
      db = req.db;
    }
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
          "User name can not blank"
        )
      );
    }
    if (inputData.password == null || inputData.password == "") {
      next(
        httpStatus.generateError(
          httpStatus.badRequest,
          "Password can not blank"
        )
      );
    }
    req.body = inputData;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "SELECT  hims_d_hospital_id,hospital_code,hospital_name,arabic_hospital_name, \
        username FROM algaeh_d_api_auth,hims_d_hospital WHERE password=md5(?)\
            AND algaeh_d_api_auth.record_status='A' AND username =? and hims_d_hospital.algaeh_api_auth_id =\
            algaeh_d_api_auth. algaeh_d_api_auth_id",
        [inputData.password, inputData.username],
        (error, result) => {
          connection.release();
          if (error) {
            next(error);
          }
          if (result.length > 0) {
            req.result = {
              success: true,
              results: result[0]["username"],
              hospitalList: result
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
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//api user authentication
let authUserOLD = (req, res, next) => {
  let authModel = {
    username: "",
    password: ""
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputData = extend(authModel, req.body);

    db.getConnection((error, connection) => {
      let query =
        "select algaeh_d_app_user.algaeh_d_app_user_id,algaeh_d_app_user.username, \
        user_display_name,user_type,locked,login_attempts,password_expiry_rule, \
      change_password,password_expiry_date,hims_m_employee_department_mappings.employee_id,\
      hims_m_employee_department_mappings.sub_department_id ,app_group_id,algaeh_m_group_user_mappings.role_id,group_type \
      from algaeh_d_app_user,algaeh_d_app_password,hims_m_employee_department_mappings,algaeh_m_group_user_mappings, algaeh_d_app_group \
      WHERE algaeh_d_app_user.record_status='A' AND algaeh_d_app_password.record_status='A' and algaeh_d_app_group.algaeh_d_app_group_id= \
      algaeh_m_group_user_mappings.app_group_id \
      AND algaeh_d_app_password.password=md5(?) AND algaeh_d_app_user.username=? \
      AND hims_m_employee_department_mappings.user_id=algaeh_d_app_user.algaeh_d_app_user_id \
      AND algaeh_m_group_user_mappings.user_id=algaeh_d_app_user.algaeh_d_app_user_id";

      connection.query(
        query,
        [inputData.password, inputData.username],
        (error, result) => {
          if (error) {
            connection.release();
            next(error);
          }
          // if (result != null && result.length != 0) {
          //   connection.query(
          //     "select module_name,module_desc from algaeh_d_app_privilege,algaeh_d_app_screens where role_id =? and  \
          //   algaeh_d_app_privilege.screen_id = algaeh_d_app_screens.algaeh_app_screens_id",
          //     [result[0].role_id],
          //     (error, rec) => {
          //       connection.release();
          //       if (error) {
          //         connection.release();
          //         next(error);
          //       }
          //       req.records = result;
          //       req.secureModels = rec;
          //       next();
          //     }
          //   );
          // } else {
          //   req.records = result;
          //   req.activeModels = [];
          //   next();
          // }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//api user authentication
let authUser = (req, res, next) => {
  let authModel = {
    username: "",
    password: ""
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputData = extend(authModel, req.body);

    // SELECT algaeh_d_app_user_id, username, user_display_name,  locked, user_type,login_attempts,\
    // password_expiry_rule, algaeh_m_role_user_mappings_id,app_d_app_roles_id,app_group_id,\
    // role_code, role_name, role_discreption, role_type,loan_authorize_privilege,leave_authorize_privilege,\
    // algaeh_d_app_group_id, app_group_code, app_group_name, app_group_desc, group_type, \
    // hims_d_employee_department_id, employee_id, services_id, sub_department_id \
    // FROM  algaeh_d_app_user U inner join algaeh_m_role_user_mappings RU on RU.user_id=U.algaeh_d_app_user_id\
    // inner join algaeh_d_app_roles R on RU.role_id=R.app_d_app_roles_id\
    // inner join algaeh_d_app_group G on R.app_group_id=G.algaeh_d_app_group_id\
    // inner join hims_m_employee_department_mappings EDM on  RU.user_id=EDM.user_id\
    // inner join  algaeh_d_app_password P on U.algaeh_d_app_user_id=P.userid\
    // WHERE P.password=md5(?) AND U.username=? AND U.record_status='A' \
    // AND P.record_status='A' AND G.record_status='A' AND R.record_status='A'

    db.getConnection((error, connection) => {
      let query =
        "SELECT algaeh_d_app_user_id, username, user_display_name,  locked, user_type,login_attempts,\
        password_expiry_rule, algaeh_m_role_user_mappings_id,app_d_app_roles_id,app_group_id,\
        role_code, role_name, role_discreption, role_type,loan_authorize_privilege,leave_authorize_privilege,\
        algaeh_d_app_group_id, app_group_code, app_group_name, app_group_desc, group_type, \
         employee_id,  sub_department_id \
        FROM  algaeh_d_app_user U inner join algaeh_m_role_user_mappings RU on RU.user_id=U.algaeh_d_app_user_id\
        inner join algaeh_d_app_roles R on RU.role_id=R.app_d_app_roles_id\
        inner join algaeh_d_app_group G on R.app_group_id=G.algaeh_d_app_group_id\
        inner join hims_m_user_employee UEM on  RU.user_id=UEM.user_id\
        inner join  algaeh_d_app_password P on U.algaeh_d_app_user_id=P.userid\
        WHERE P.password=md5(?) AND U.username=? AND U.record_status='A' \
        AND P.record_status='A' AND G.record_status='A' AND R.record_status='A' ";
      connection.query(
        query,
        [inputData.password, inputData.username],
        (error, result) => {
          if (error) {
            connection.release();
            next(error);
          }

          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  apiAuth,
  authUser
};
