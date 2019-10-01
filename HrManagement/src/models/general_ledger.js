import utlities from "algaeh-utilities";
import algaehMysql from "algaeh-mysql";
// import keys from "../../../keys/keys";
export default {
  generalLedgerGet: (req, res, next) => {
    const _mysql = new algaehMysql();
    /* Select statemwnt  */
    _mysql
      .executeQueryWithTransaction({
        values: [1],
        query: "select * from algaeh_d_formulas where algaeh_d_formulas_id=?",
        printQuery: true
      })
      .then(result => {
        _mysql.commitTransaction(() => {
          _mysql.releaseConnection();
        });
        req.records = result;
        next();
      })
      .catch(e => {
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
