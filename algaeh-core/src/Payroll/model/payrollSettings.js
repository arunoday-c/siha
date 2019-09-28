"use strict";
import extend from "extend";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import logUtils from "../../utils/logging";

const { debugLog } = logUtils;
const {
  selectStatement,
  whereCondition,
  deleteRecord,
  runningNumberGen,
  releaseDBConnection,
  jsonArrayToObject,
  getMaxAuth
} = utils;

let getMiscEarningDeductions = (req, res, next) => {
  let selectWhere = {
    component_category: "ALL",
    miscellaneous_component: "ALL",
    component_type: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_earning_deduction_id,earning_deduction_code,earning_deduction_description,\
          short_desc,component_category,calculation_method,component_frequency,calculation_type,\
          component_type,shortage_deduction_applicable,overtime_applicable,limit_applicable,limit_amount,\
          process_limit_required,process_limit_days,general_ledger,allow_round_off,round_off_type,\
          round_off_amount from hims_d_earning_deduction\
          where record_status='A' and " +
          where.condition +
          "order by hims_d_earning_deduction_id desc",
        where.values,

        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
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

//created by irfan:
let assignAuthLevels = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    debugLog("input:", input);
    db.getConnection((error, connection) => {
      new Promise((resolve, reject) => {
        try {
          if (input.no_employees == "ALL") {
            connection.query(
              "select hims_d_employee_id as employee_id from hims_d_employee  where record_status='A'\
              and sub_department_id=? and employee_status='A' ",
              input.sub_dept_id,
              (error, employeeResult) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                resolve(employeeResult);
              }
            );
          } else {
            resolve([{ employee_id: input.employee_id }]);
          }
        } catch (e) {
          reject(e);
        }
      }).then(empEesult => {
        debugLog("empEesult:", empEesult);

        if (input.auth_type == "LE") {
          //leave
          let list = [];
          let values = [];
          let duplicate = [];

          switch (input.no_auths) {
            case 1:
              list = ["leave_level_1"];
              values = [input.level_1];
              duplicate = ["leave_level_1=" + input.level_1];
              break;
            case 2:
              list = ["leave_level_1", "leave_level_2"];
              values = [input.level_1, input.level_2];
              duplicate = [
                "leave_level_1=" + input.level_1,
                "leave_level_2=" + input.level_2
              ];
              break;
            case 3:
              list = ["leave_level_1", "leave_level_2", "leave_level_3"];
              values = [input.level_1, input.level_2, input.level_3];
              duplicate = [
                "leave_level_1=" + input.level_1,
                "leave_level_2=" + input.level_2,
                "leave_level_3=" + input.level_3
              ];
              break;
            case 4:
              list = [
                "leave_level_1",
                "leave_level_2",
                "leave_level_3",
                "leave_level_4"
              ];
              values = [
                input.level_1,
                input.level_2,
                input.level_3,
                input.level_4
              ];
              duplicate = [
                "leave_level_1=" + input.level_1,
                "leave_level_2=" + input.level_2,
                "leave_level_3=" + input.level_3,
                "leave_level_4=" + input.level_4
              ];
              break;
            case 5:
              list = [
                "leave_level_1",
                "leave_level_2",
                "leave_level_3",
                "leave_level_4",
                "leave_level_5"
              ];
              values = [
                input.level_1,
                input.level_2,
                input.level_3,
                input.level_4,
                input.level_5
              ];
              duplicate = [
                "leave_level_1=" + input.level_1,
                "leave_level_2=" + input.level_2,
                "leave_level_3=" + input.level_3,
                "leave_level_4=" + input.level_4,
                "leave_level_5=" + input.level_5
              ];
              break;
            default:
          }
          debugLog("list:", list);
          debugLog("values:", values);
          debugLog("duplicate:", duplicate);
          const insurtColumns = ["employee_id"];

          connection.query(
            "INSERT INTO hims_f_authorization_setup (" +
              insurtColumns.join(",") +
              "," +
              list +
              ")  VALUES ?   ON DUPLICATE KEY UPDATE " +
              duplicate,
            [
              jsonArrayToObject({
                sampleInputObject: insurtColumns,
                arrayObj: empEesult,
                newFieldToInsert: values,
                req: req
              })
            ],
            (error, leaveResult) => {
              releaseDBConnection(db, connection);
              if (error) {
                next(error);
              }

              req.records = leaveResult;
              next();
            }
          );
        } else if (input.auth_type == "LO") {
          //loan

          let list = [];
          let values = [];
          let duplicate = [];

          switch (input.no_auths) {
            case 1:
              list = ["loan_level_1"];
              values = [input.level_1];
              duplicate = ["loan_level_1=" + input.level_1];
              break;
            case 2:
              list = ["loan_level_1", "loan_level_2"];
              values = [input.level_1, input.level_2];
              duplicate = [
                "loan_level_1=" + input.level_1,
                "loan_level_2=" + input.level_2
              ];
              break;
            case 3:
              list = ["loan_level_1", "loan_level_2", "loan_level_3"];
              values = [input.level_1, input.level_2, input.level_3];
              duplicate = [
                "loan_level_1=" + input.level_1,
                "loan_level_2=" + input.level_2,
                "loan_level_3=" + input.level_3
              ];
              break;
            case 4:
              list = [
                "loan_level_1",
                "loan_level_2",
                "loan_level_3",
                "loan_level_4"
              ];
              values = [
                input.level_1,
                input.level_2,
                input.level_3,
                input.level_4
              ];
              duplicate = [
                "loan_level_1=" + input.level_1,
                "loan_level_2=" + input.level_2,
                "loan_level_3=" + input.level_3,
                "loan_level_4=" + input.level_4
              ];
              break;
            case 5:
              list = [
                "loan_level_1",
                "loan_level_2",
                "loan_level_3",
                "loan_level_4",
                "loan_level_5"
              ];
              values = [
                input.level_1,
                input.level_2,
                input.level_3,
                input.level_4,
                input.level_5
              ];
              duplicate = [
                "loan_level_1=" + input.level_1,
                "loan_level_2=" + input.level_2,
                "loan_level_3=" + input.level_3,
                "loan_level_4=" + input.level_4,
                "loan_level_5=" + input.level_5
              ];
              break;
            default:
          }
          debugLog("list:", list);
          debugLog("values:", values);
          debugLog("duplicate:", duplicate);
          const insurtColumns = ["employee_id"];

          connection.query(
            "INSERT INTO hims_f_authorization_setup (" +
              insurtColumns.join(",") +
              "," +
              list +
              ")  VALUES ?   ON DUPLICATE KEY UPDATE " +
              duplicate,
            [
              jsonArrayToObject({
                sampleInputObject: insurtColumns,
                arrayObj: empEesult,
                newFieldToInsert: values,
                req: req
              })
            ],
            (error, loanResult) => {
              releaseDBConnection(db, connection);
              if (error) {
                next(error);
              }

              req.records = loanResult;
              next();
            }
          );
        } else if (input.auth_type == "S") {
          //salary

          let list = [];
          let values = [];
          let duplicate = [];

          switch (input.no_auths) {
            case 1:
              list = ["salary_level_1"];
              values = [input.level_1];
              duplicate = ["salary_level_1=" + input.level_1];
              break;
            case 2:
              list = ["salary_level_1", "salary_level_2"];
              values = [input.level_1, input.level_2];
              duplicate = [
                "salary_level_1=" + input.level_1,
                "salary_level_2=" + input.level_2
              ];
              break;
            case 3:
              list = ["salary_level_1", "salary_level_2", "salary_level_3"];
              values = [input.level_1, input.level_2, input.level_3];
              duplicate = [
                "salary_level_1=" + input.level_1,
                "salary_level_2=" + input.level_2,
                "salary_level_3=" + input.level_3
              ];
              break;
            case 4:
              list = [
                "salary_level_1",
                "salary_level_2",
                "salary_level_3",
                "salary_level_4"
              ];
              values = [
                input.level_1,
                input.level_2,
                input.level_3,
                input.level_4
              ];
              duplicate = [
                "salary_level_1=" + input.level_1,
                "salary_level_2=" + input.level_2,
                "salary_level_3=" + input.level_3,
                "salary_level_4=" + input.level_4
              ];
              break;
            case 5:
              list = [
                "salary_level_1",
                "salary_level_2",
                "salary_level_3",
                "salary_level_4",
                "salary_level_5"
              ];
              values = [
                input.level_1,
                input.level_2,
                input.level_3,
                input.level_4,
                input.level_5
              ];
              duplicate = [
                "salary_level_1=" + input.level_1,
                "salary_level_2=" + input.level_2,
                "salary_level_3=" + input.level_3,
                "salary_level_4=" + input.level_4,
                "salary_level_5=" + input.level_5
              ];
              break;
            default:
          }
          debugLog("list:", list);
          debugLog("values:", values);
          debugLog("duplicate:", duplicate);
          const insurtColumns = ["employee_id"];

          connection.query(
            "INSERT INTO hims_f_authorization_setup (" +
              insurtColumns.join(",") +
              "," +
              list +
              ")  VALUES ?   ON DUPLICATE KEY UPDATE " +
              duplicate,
            [
              jsonArrayToObject({
                sampleInputObject: insurtColumns,
                arrayObj: empEesult,
                newFieldToInsert: values,
                req: req
              })
            ],
            (error, salaryResult) => {
              releaseDBConnection(db, connection);
              if (error) {
                next(error);
              }

              req.records = salaryResult;
              next();
            }
          );
        } else if (input.auth_type == "P") {
          //performance

          let list = [];
          let values = [];
          let duplicate = [];

          switch (input.no_auths) {
            case 1:
              list = ["performance_level_1"];
              values = [input.level_1];
              duplicate = ["performance_level_1=" + input.level_1];
              break;
            case 2:
              list = ["performance_level_1", "performance_level_2"];
              values = [input.level_1, input.level_2];
              duplicate = [
                "performance_level_1=" + input.level_1,
                "performance_level_2=" + input.level_2
              ];
              break;
            case 3:
              list = [
                "performance_level_1",
                "performance_level_2",
                "performance_level_3"
              ];
              values = [input.level_1, input.level_2, input.level_3];
              duplicate = [
                "performance_level_1=" + input.level_1,
                "performance_level_2=" + input.level_2,
                "performance_level_3=" + input.level_3
              ];
              break;
            case 4:
              list = [
                "performance_level_1",
                "performance_level_2",
                "performance_level_3",
                "performance_level_4"
              ];
              values = [
                input.level_1,
                input.level_2,
                input.level_3,
                input.level_4
              ];
              duplicate = [
                "performance_level_1=" + input.level_1,
                "performance_level_2=" + input.level_2,
                "performance_level_3=" + input.level_3,
                "performance_level_4=" + input.level_4
              ];
              break;
            case 5:
              list = [
                "performance_level_1",
                "performance_level_2",
                "performance_level_3",
                "performance_level_4",
                "performance_level_5"
              ];
              values = [
                input.level_1,
                input.level_2,
                input.level_3,
                input.level_4,
                input.level_5
              ];
              duplicate = [
                "performance_level_1=" + input.level_1,
                "performance_level_2=" + input.level_2,
                "performance_level_3=" + input.level_3,
                "performance_level_4=" + input.level_4,
                "performance_level_5=" + input.level_5
              ];
              break;
            default:
          }
          debugLog("list:", list);
          debugLog("values:", values);
          debugLog("duplicate:", duplicate);
          const insurtColumns = ["employee_id"];

          connection.query(
            "INSERT INTO hims_f_authorization_setup (" +
              insurtColumns.join(",") +
              "," +
              list +
              ")  VALUES ?   ON DUPLICATE KEY UPDATE " +
              duplicate,
            [
              jsonArrayToObject({
                sampleInputObject: insurtColumns,
                arrayObj: empEesult,
                newFieldToInsert: values,
                req: req
              })
            ],
            (error, performaceResult) => {
              releaseDBConnection(db, connection);
              if (error) {
                next(error);
              }

              req.records = performaceResult;
              next();
            }
          );
        } else {
          req.records = {
            invalid_input: true,
            message: "please send valid input"
          };
          next();
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let dummy = (req, res, next) => {
  debugLog("hiii");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let ary = [
      "mir aisha",
      "kiriraj pathan",
      "lilly dae",
      "mock man",
      "elli jhon",
      "josh frank",
      "jerry prank",
      "john morgan",
      "haris jaison",
      "herry sejal",
      "edison roy",
      "marry thomas",
      "johnson",
      "ericsson",
      "nawaz ahmed",
      "john",
      "shirin",
      "zeenat",
      "noor",
      "noor",
      "savad",
      "nowshaba",
      "heeba",
      "arish",
      "babalo",
      "khalid",
      "basha",
      "fareed",
      "sofiya kuriyan",
      "sofiya kuriyan",
      "david",
      "zakeer hussain",
      "abhishek srivastav",
      "ziya ulla",
      "hidayath",
      "ghafoor",
      "sameer",
      "anil",
      "bahadur",
      "rayan",
      "abu bakar",
      "raman sharma",
      "yahya",
      "asfaq ulla khan",
      "gopal pandey",
      "jagmohan",
      "rincy",
      "anwar",
      "narendra sody",
      "amar shah",
      "khaleel",
      "uday",
      "ahad",
      "habeeb",
      "krishna murthy",
      "shadab khan",
      "khan",
      "khursheed",
      "khadar",
      "mohammed saleem",
      "salma fathima",
      "awdhesh choubey",
      "wakar zaka",
      "yakub ansari",
      "thiruva perera",
      "farhaan khan",
      "damodar prasad",
      "joginder sharma",
      "mashoor gulati",
      "lalaram jogi"
    ];

    // new Promise((resolve, reject) => {
    //   try {
    //     getMaxAuth({
    //       req: req,
    //       onFailure: error => {
    //         reject(error);
    //       },
    //       onSuccess: result => {
    //         resolve(result);
    //       }
    //     });
    //   } catch (e) {
    //     reject(e);
    //   }
    // }).then(result => {
    //   debugLog("result:", result.MaxLeave);
    // });
  } catch (e) {
    next(e);
  }
};

export default {
  getMiscEarningDeductions,
  assignAuthLevels,
  dummy
};
