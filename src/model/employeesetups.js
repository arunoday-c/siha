import {
  whereCondition,
 
  selectStatement
  
} from "../utils";
import extend from "extend";
import httpStatus from "../utils/httpStatus";


let getDesignations = (req, res, next) => {
  let Diet = {
    hims_d_designation_id: "ALL"
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

    let condition = whereCondition(extend(Diet, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT * FROM `hims_d_designation` WHERE `record_status`='A' AND " +
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

let getEmpSpeciality = (req, res, next) => {
  let Diet = {
    hims_d_employee_speciality_id: "ALL",
    sub_department_id: "ALL"
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

    let condition = whereCondition(extend(Diet, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT * FROM `hims_d_employee_speciality` WHERE `record_status`='A' AND " +
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

let getEmpCategory = (req, res, next) => {
  let Diet = {
    hims_employee_category_id: "ALL"
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

    let condition = whereCondition(extend(Diet, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT * FROM `hims_d_employee_category` WHERE `record_status`='A' AND " +
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
module.exports = {
  getDesignations,
  getEmpSpeciality,
  getEmpCategory
};
