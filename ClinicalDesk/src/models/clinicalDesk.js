import algaehMysql from "algaeh-mysql";
module.exports = {
  getChiefComplaints: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        _mysql
          .executeQuery({
            query:
              "select hims_d_hpi_header_id,hpi_description,created_date from hims_d_hpi_header where sub_department_id=? and record_status='A';",
            values: [req.userIdentity.sub_department_id],
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
