import httpStatus from "../utils/httpStatus";
import { whereCondition, releaseDBConnection, selectStatement } from "../utils";
import extend from "extend";
// import { logger, debugLog, debugFunction } from "../utils/logging";
// import { validate } from "node-model-validation";
let inputServiceType = {
  hims_d_service_type_id: null,
  service_type_code: null,
  service_type: null,
  service_type_desc: null,
  arabic_service_type: null,
  effective_start_date: null,
  effective_end_date: null
  // created_by: req.userIdentity.algaeh_d_app_user_id,

  // updated_by: req.userIdentity.algaeh_d_app_user_id
};

let serviceTypeWhere = {
  hims_d_service_type_id: "ALL",
  service_type_code: "ALL",
  service_type: "ALL"
};
let getServiceType = (req, res, next) => {
  let serviceTypeWhere = {
    hims_d_service_type_id: "ALL",
    service_type_code: "ALL",
    service_type: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let where = whereCondition(extend(serviceTypeWhere, req.query));
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "SELECT `hims_d_service_type_id`, `service_type_code`, `service_type`, `service_type_desc` \
          ,`arabic_service_type` FROM `hims_d_service_type` WHERE `record_status`='A' AND " +
          where.condition,
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

let getServices = (req, res, next) => {
  let serviceWhere = {
    hims_d_services_id: "ALL",
    service_code: "ALL",
    cpt_code: "ALL",
    service_name: "ALL",
    service_desc: "ALL",
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
    let parameters = extend(
      req.Wherecondition == null ? {} : req.Wherecondition,
      serviceWhere
    );
    let condition = whereCondition(extend(req.query, parameters));
    selectStatement(
      {
        db: req.db,
        query:
          "select hims_d_services_id, service_code, cpt_code, service_name \
          , service_desc, sub_department_id, hospital_id, service_type_id, standard_fee \
          , discount, effective_start_date, effectice_end_date from hims_d_services WHERE record_status ='A' AND " +
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
  getServiceType,
  getServices
};
