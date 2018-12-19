import utlities from "../../../AlgaehUtilities";
import algaeh_mysql from "algaeh-mysql";
import keys from "../../../keys/keys";
module.exports = {
  generalLedgerGet: (req, res, next) => {
    return new Promise((resolve, reject) => {
      algaeh_mysql
        .AlgaehQuery({
          config: keys.mysqlDb
        })
        .executeQuery({
          values: [1],
          query: "select * from algaeh_d_formulas where algaeh_d_formulas_id=?",
          onSuccess: data => {
            resolve(data);
          },
          onFailure: error => {
            reject(error);
          }
        })
        .releaseConnection();
    })
      .then(output => {
        console.log("Records", output);
        req.records = output;
        next();
      })
      .catch(e => {
        next(e);
      });
  }
};
