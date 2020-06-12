import utils from "../utils";
import extend from "extend";
import httpStatus from "../utils/httpStatus";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");
// const { whereCondition, selectStatement } = utils;

let selectDiet = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let str = "";
    if (req.query.hims_d_diet_master_id > 0) {
      str = " and hims_d_diet_master_id=" + req.query.hims_d_diet_master_id;
    }
    _mysql
      .executeQuery({
        query: `SELECT * FROM hims_d_diet_master WHERE record_status='A' ${str};`,
        printQuery: false,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export default {
  selectDiet,
};
