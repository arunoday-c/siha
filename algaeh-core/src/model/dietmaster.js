import utils from "../utils";
import extend from "extend";
import httpStatus from "../utils/httpStatus";

const { whereCondition, selectStatement } = utils;

let selectDiet = (req, res, next) => {
  let Diet = {
    hims_d_diet_master_id: "ALL"
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
          "SELECT * FROM `hims_d_diet_master` WHERE `record_status`='A' AND " +
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

export default {
  selectDiet
};
