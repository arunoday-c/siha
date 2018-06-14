import httpStatus from "../utils/httpStatus";
import { whereCondition, releaseDBConnection } from "../utils";
import extend from "extend";
import { logger, debugLog, debugFunction } from "../utils/logging";

let inputServiceType = {
  hims_d_service_type_id: null,
  service_type_code: null,
  service_type: null,
  service_type_desc: null,
  arabic_service_type: null,
  effective_start_date: null,
  effective_end_date: null,
  created_by: null,
  created_date: null,
  updated_by: null,
  updated_date: null,
  record_status: null
};

let serviceTypeWhere = {
  hims_d_service_type_id: "ALL",
  service_type_code: "ALL",
  service_type: "ALL"
};
let getServiceType = (req, res, next) => {
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
module.exports = {
  getServiceType
};
