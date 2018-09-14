import {
  whereCondition,
  releaseDBConnection,
  selectStatement,
  deleteRecord
} from "../utils";
import extend from "extend";
import httpStatus from "../utils/httpStatus";
import { logger, debugFunction, debugLog } from "../utils/logging";

//Section
let getGenerics = (req, res, next) => {
  let labSection = {
    hims_d_item_generic_id: "ALL"
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
          "SELECT * FROM `hims_d_item_generic` WHERE `record_status`='A' AND " +
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
  getGenerics
};
