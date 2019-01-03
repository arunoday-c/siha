"use strict";

var _AlgaehUtilities = require("../../../AlgaehUtilities");

var _AlgaehUtilities2 = _interopRequireDefault(_AlgaehUtilities);

var _algaehMysql = require("algaeh-mysql");

var _algaehMysql2 = _interopRequireDefault(_algaehMysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import keys from "../../../keys/keys";
module.exports = {
  generalLedgerGet: function generalLedgerGet(req, res, next) {
    var _mysql = new _algaehMysql2.default();
    /* Select statemwnt  */
    _mysql.executeQueryWithTransaction({
      values: [1],
      query: "select * from algaeh_d_formulas where algaeh_d_formulas_id=?",
      printQuery: true
    }).then(function (result) {
      _mysql.commitTransaction(function () {
        _mysql.releaseConnection();
      });
      req.records = result;
      next();
    }).catch(function (e) {
      next(e);
    });

    /*    Bulk update ,replace keys and exclude values and extravalues */
    // _mysql
    //   .executeQuery({
    //     values: [
    //       {
    //         algaeh_d_formulas_id: 4,
    //         formula_for: "Testing1",
    //         status: "I"
    //       }
    //     ],
    //     //values: ["Testing", 4],
    //     extraValues: {
    //       formula: "A+B"
    //     },
    //     excludeValues: ["formula_for"],
    //     replcaeKeys: { status: "record_status" },
    //     where: ["algaeh_d_formulas_id"],
    //     query: "update  algaeh_d_formulas set ? where algaeh_d_formulas_id=?",
    //     printQuery: true,
    //     bulkInsertOrUpdate: true
    //   })
    //   .then(result => {
    //     _mysql.releaseConnection();
    //     req.records = result;
    //     next();
    //   })
    //   .catch(e => {
    //     next(e);
    //   });

    /*
        Bulk insert ,replace keys and exclude values and extravalues
    */

    // _mysql
    //   .executeQuery({
    //     values: [
    //       { algaeh_d_formulas_id: 3, formula_for: "Testing", status: "A" },
    //       { algaeh_d_formulas_id: 4, formula_for: "Testing1", status: "I" }
    //     ],
    //     extraValues: {
    //       formula: "A+B"
    //     },
    //     excludeValues: ["formula_for"],
    //     replcaeKeys: { status: "record_status" },
    //     query: "insert into  algaeh_d_formulas (??) values ?",
    //     printQuery: true,
    //     bulkInsertOrUpdate: true
    //   })
    //   .then(result => {
    //     _mysql.releaseConnection();
    //     req.records = result;
    //     next();
    //   })
    //   .catch(e => {
    //     next(e);
    //   });
  }
};
//# sourceMappingURL=general_ledger.js.map