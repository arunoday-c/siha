import { whereCondition, selectStatement } from "../utils";
import extend from "extend";
import httpStatus from "../utils/httpStatus";
import { debugLog } from "../utils/logging";

let getOrganizationOLD = (req, res, next) => {
  let labSection = {
    hims_d_hospital_id: "ALL"
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

    let condition = whereCondition(extend(labSection, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT * FROM hims_d_hospital, hims_d_currency CUR WHERE hims_d_hospital.record_status='A' AND \
          CUR.hims_d_currency_id=default_currency AND " +
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
//created by irfan: to get hospitals
let getOrganization = (req, res, next) => {
  let selectWhere = {
    hims_d_hospital_id: "ALL"
   
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        " select hims_d_hospital_id, hospital_code, local_vat_applicable, default_nationality, default_country,\
        default_currency, default_slot, standard_from_time, standard_to_time, hospital_name, arabic_hospital_name, \
        hospital_address, city_id, organization_id, effective_start_date, effective_end_date, hosital_status, \
        lab_location_code from hims_d_hospital where record_status='A' and " +
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
  getOrganization
};
