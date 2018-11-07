import httpStatus from "../utils/httpStatus";
import { releaseDBConnection } from "../utils/index";
import { debugLog, debugFunction } from "../utils/logging";
const getFormula = (req, res, next) => {
  debugFunction("getFormula");
  const _inputParam = req.query;
  debugLog("Input Parameters", _inputParam);
  if (req.db == null) next(httpStatus.dataBaseNotInitilizedError());
  const db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      releaseDBConnection(db, connection);
      next(error);
    }
    connection.query(
      "select `formula` from `algaeh_d_formulas` where algaeh_d_formulas_id=?",
      [_inputParam.algaeh_d_formulas_id],
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
};
module.exports = { getFormula };
