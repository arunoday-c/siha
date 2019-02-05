import algaehMysql from "algaeh-mysql";
module.exports = {
  addDepartment: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query:
              "INSERT INTO `hims_d_department` (department_code,department_name,arabic_department_name,\
              department_desc,department_type,effective_start_date,effective_end_date,created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              input.department_code,
              input.department_name,
              input.arabic_department_name,
              input.department_desc,
              input.department_type,
              input.effective_start_date,
              input.effective_end_date,
              new Date(),
              input.created_by,
              new Date(),
              input.updated_by
            ],
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
