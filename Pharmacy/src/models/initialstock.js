import algaehMysql from "algaeh-mysql";
module.exports = {
  addPharmacyInitialStock: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  }
};
