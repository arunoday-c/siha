import { whereCondition, selectStatement } from "../utils";
import extend from "extend";
import httpStatus from "../utils/httpStatus";
import { debugLog } from "../utils/logging";

let getOrganization = (req, res, next) => {
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

module.exports = {
  getOrganization
};
