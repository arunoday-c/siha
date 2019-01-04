"use strict";

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _index = require("../utils/index");

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getFormula = function getFormula(req, res, next) {
  (0, _logging.debugFunction)("getFormula");
  var _inputParam = req.query;
  (0, _logging.debugLog)("Input Parameters", _inputParam);
  if (req.db == null) next(_httpStatus2.default.dataBaseNotInitilizedError());
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      (0, _index.releaseDBConnection)(db, connection);
      next(error);
    }
    connection.query("select `formula` from `algaeh_d_formulas` where algaeh_d_formulas_id=?", [_inputParam.algaeh_d_formulas_id], function (error, result) {
      (0, _index.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};
module.exports = { getFormula: getFormula };
//# sourceMappingURL=algaeh_formulas.js.map