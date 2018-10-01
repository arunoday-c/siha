import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  releaseDBConnection
} from "../utils";
import httpStatus from "../utils/httpStatus";

// api to add employee
let addEmployee = (req, res, next) => {
  let employeeModel = {
    hims_d_employee_id: 0,
    employee_code: null,
    first_name: null,
    middle_name: null,
    last_name: null,
    arabic_name: null,
    sex: "MALE",
    date_of_birth: null,
    date_of_joining: null,
    date_of_leaving: null,
    address: null,
    primary_contact_no: null,
    secondary_contact_no: null,
    email: null,
    emergancy_contact_person: null,
    emergancy_contact_no: null,
    blood_group: null,
    employee_status: "A",
    effective_start_date: null,
    effective_end_date: null,
    created_date: new Date(),
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_date: new Date(),
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let employeeDetails = extend(employeeModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT hims_d_employee(employee_code,first_name,middle_name,last_name,arabic_name, \
            sex,date_of_birth,date_of_joining,date_of_leaving,address,primary_contact_no,\
            secondary_contact_no,email,emergancy_contact_person,emergancy_contact_no,\
            blood_group,effective_start_date,effective_end_date,created_date,created_by) \
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          employeeDetails.employee_code,
          employeeDetails.first_name,
          employeeDetails.middle_name,
          employeeDetails.last_name,
          employeeDetails.arabic_name,
          employeeDetails.sex,
          employeeDetails.date_of_birth,
          employeeDetails.date_of_joining,
          employeeDetails.date_of_leaving,
          employeeDetails.address,
          employeeDetails.primary_contact_no,
          employeeDetails.secondary_contact_no,
          employeeDetails.email,
          employeeDetails.emergancy_contact_person,
          employeeDetails.emergancy_contact_no,
          employeeDetails.blood_group,
          employeeDetails.effective_start_date,
          employeeDetails.effective_end_date,
          employeeDetails.created_date,
          employeeDetails.created_by
        ],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          connection.query(
            "SELECT * FROM hims_d_employee WHERE hims_d_employee_id=?",
            [result["insertId"]],
            (error, resultBack) => {
              releaseDBConnection(db, connection);
              if (error) {
                next(error);
              }
              req.records = resultBack;
              next();
            }
          );
        }
      );
    });
  } catch (e) {
    next(e);
  }
};
// api to fetch employee
let getEmployee = (req, res, next) => {
  let employeeWhereCondition = {
    employee_code: "ALL",
    first_name: "ALL",
    middle_name: "ALL",
    last_name: "ALL",
    sex: "ALL",
    blood_group: "ALL",
    employee_status: "ALL",
    date_of_joining: "ALL",
    date_of_leaving: "ALL",
    primary_contact_no: "ALL",
    email: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let pagePaging = "";
    if (req.paging != null) {
      let Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }
    let parameters = extend(
      employeeWhereCondition,
      req.Wherecondition == null ? {} : req.Wherecondition
    );
    let condition = whereCondition(extend(parameters, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT * FROM hims_d_employee WHERE record_status ='A' AND " +
          condition.condition +
          " " +
          pagePaging,
        values: condition.values
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

let updateEmployee = (req, res, next) => {
  let employeeModel = {
    hims_d_employee_id: 0,
    employee_code: null,
    first_name: null,
    middle_name: null,
    last_name: null,
    arabic_name: null,
    sex: "MALE",
    date_of_birth: null,
    date_of_joining: null,
    date_of_leaving: null,
    address: null,
    primary_contact_no: null,
    secondary_contact_no: null,
    email: null,
    emergancy_contact_person: null,
    emergancy_contact_no: null,
    blood_group: null,
    employee_status: "A",
    effective_start_date: null,
    effective_end_date: null,
    created_date: new Date(),
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_date: new Date(),
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let employeeDetails = extend(employeeModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "UPDATE hims_d_employee SET first_name=?,middle_name=?\
                     ,last_name=?,arabic_name=?,sex=?,date_of_birth=?,date_of_joining=?\
                     ,date_of_leaving=?,address=?,primary_contact_no=?,secondary_contact_no=?\
                     ,email=?,emergancy_contact_person=?,emergancy_contact_no=?\
                     ,blood_group=?,employee_status=?,effective_start_date=?,effective_end_date=?\
                     ,updated_date=now(),updated_by=? WHERE  hims_d_employee_id=?",
        [
          employeeDetails.first_name,
          employeeDetails.middle_name,
          employeeDetails.last_name,
          employeeDetails.arabic_name,
          employeeDetails.sex,
          employeeDetails.date_of_birth,
          employeeDetails.date_of_joining,
          employeeDetails.date_of_leaving,
          employeeDetails.address,
          employeeDetails.primary_contact_no,
          employeeDetails.secondary_contact_no,
          employeeDetails.email,
          employeeDetails.emergancy_contact_person,
          employeeDetails.emergancy_contact_no,
          employeeDetails.blood_group,
          employeeDetails.employee_status,
          employeeDetails.effective_start_date,
          employeeDetails.effective_end_date,
          employeeDetails.updated_by,
          employeeDetails.hims_d_employee_id
        ],
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

//created by irfan: to get eployee details
let getEmployeeDetails = (req, res, next) => {
  let employeeWhereCondition = {
    employee_code: "ALL",
    first_name: "ALL",
    middle_name: "ALL",
    last_name: "ALL",
    sex: "ALL",
    blood_group: "ALL",
    employee_status: "ALL",
    date_of_joining: "ALL",
    date_of_leaving: "ALL",
    primary_contact_no: "ALL",
    email: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(employeeWhereCondition, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT E.hims_d_employee_id,E.employee_code,E.services_id,E.title_id,E.first_name,E.middle_name,E.last_name,E.full_name,E.arabic_name,E.employee_designation_id,\
        E.license_number,E.sex,E.date_of_birth,E.date_of_joining,E.date_of_leaving,E.address,E.address2,E.pincode,E.city_id,E.state_id,E.country_id,E.primary_contact_no,\
        E.secondary_contact_no,E.email,E.emergancy_contact_person,E.emergancy_contact_no,E.blood_group,\
        E.isdoctor,E.employee_status,E.effective_start_date,E.effective_end_date,E.category_id,\
        ED.hims_d_employee_department_id,ED.employee_id,ED.sub_department_id,ED.category_speciality_id,ED.user_id,CS.hims_m_category_speciality_mappings_id,CS.category_id,CS.speciality_id,\
        CS.category_speciality_status,CS.effective_start_date,CS.effective_end_date\
        from hims_d_employee E,hims_m_employee_department_mappings ED,hims_m_category_speciality_mappings CS\
         Where E.record_status='A' and ED.record_status='A' and CS.record_status='A' and E.hims_d_employee_id=ED.employee_id and ED.category_speciality_id=CS.hims_m_category_speciality_mappings_id AND " +
          where.condition,
        where.values,
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
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
  addEmployee,
  getEmployee,
  updateEmployee,
  getEmployeeDetails
};
