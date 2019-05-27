import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

module.exports = {
  init: (req, res, next) => {
    const _mysql = new algaehMysql({ path: keyPath });
    const input = req.query;
    try {
      input.orderBy = input.orderBy || "desc";
      _mysql
        .executeQuery({
          query:
            "select " +
            input.fields +
            " from " +
            input.tableName +
            " " +
            input.whereCondition +
            " order by " +
            input.keyFieldName +
            " " +
            input.orderBy +
            " limit 1"
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
    } catch (e) {
      next(e);
    }
  }
};
