import httpStatus from "../utils/httpStatus";
import logUtils from "../utils/logging";

import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");
const { debugLog } = logUtils;

const getFormula = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  const _inputParam = req.query;
  debugLog("Input Parameters", _inputParam);
  if (req.db == null) next(httpStatus.dataBaseNotInitilizedError());

  _mysql
    .executeQuery({
      query:
        "select `formula` from `algaeh_d_formulas` where algaeh_d_formulas_id=?",
      values: [_inputParam.algaeh_d_formulas_id]
    })
    .then(result => {
      _mysql.releaseConnection();
      req.records = result;
      next();
    })
    .catch(error => {
      _mysql.releaseConnection();
      next(error);
    });
};
export default { getFormula };
