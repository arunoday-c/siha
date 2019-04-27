import algaehMysql from "algaeh-mysql";
module.exports = {
  addDepartment: (req, res, next) => {
    return new Promise((resolve, reject) => {
      let input = req.body;
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
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id
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

            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      reject(error);
      next(e);
    });
  },

  updateDepartment: (req, res, next) => {
    return new Promise((resolve, reject) => {
      let input = req.body;
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query:
              "UPDATE `hims_d_department`\
        SET   `department_name`=?, `department_desc`=?, `department_type`=?\
        , `effective_start_date`=?, `effective_end_date`=? \
        ,`arabic_department_name`=?, `updated_date`=?, `updated_by`=?\
        WHERE record_status='A' AND `hims_d_department_id`=?;",
            values: [
              input.department_name,
              input.department_desc,
              input.department_type,
              input.effective_start_date,
              input.effective_end_date,
              input.arabic_department_name,
              new Date(),
              input.updated_by,
              input.hims_d_department_id
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

            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      reject(error);
      next(e);
    });
  },

  selectDepartment: (req, res, next) => {
    return new Promise((resolve, reject) => {
      let input = req.query;
      const _mysql = new algaehMysql();

      try {
        let query = "";
        let values = [];

        if (input.hims_d_department_id != null) {
          query =
            "select hims_d_department_id, department_code, department_name, arabic_department_name,\
      department_desc, department_type, effective_start_date, effective_end_date, department_status\
      from hims_d_department where record_status='A' AND hims_d_department_id=? order by hims_d_department_id desc";

          values = values.push(input.hims_d_department_id);
        } else {
          query =
            "select hims_d_department_id, department_code, department_name, arabic_department_name,\
       department_desc, department_type, effective_start_date, effective_end_date, department_status\
       from hims_d_department where record_status='A' order by hims_d_department_id desc";
        }

        _mysql
          .executeQuery({
            query: query,
            values: values,
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

            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      reject(error);
      next(e);
    });
  },

  selectSubDepartment: (req, res, next) => {
    return new Promise((resolve, reject) => {
      let input = req.query;
      const _mysql = new algaehMysql();

      try {
        let query = "";
        let values = [];

        if (input.department_id > 0) {
          query =
            "select hims_d_sub_department_id, sub_department_code, sub_department_name, arabic_sub_department_name,\
          sub_department_desc, department_id, effective_start_date, effective_end_date, sub_department_status\
          from  hims_d_sub_department where record_status='A' and department_id=? order by hims_d_sub_department_id desc";

          values.push(input.department_id);
        } else {
          query =
            "select hims_d_sub_department_id, sub_department_code, sub_department_name, arabic_sub_department_name,\
          sub_department_desc, department_id, effective_start_date, effective_end_date, sub_department_status\
          from  hims_d_sub_department where record_status='A' order by hims_d_sub_department_id desc";
        }

        _mysql
          .executeQuery({
            query: query,
            values: values,
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

            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      reject(error);
      next(e);
    });
  },
  addSubDepartment: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_d_sub_department` (sub_department_code,sub_department_name,\
            arabic_sub_department_name,sub_department_desc,department_id,effective_start_date,\
            effective_end_date,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.sub_department_code,
          input.sub_department_name,
          input.arabic_sub_department_name,
          input.sub_department_desc,
          input.department_id,
          input.effective_start_date,
          input.effective_end_date,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id
        ],
        printQuery: true
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
  },
  updateSubDepartment: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_d_sub_department`\
        SET `sub_department_name`=?, `sub_department_desc`=?,arabic_sub_department_name=?\
        , `effective_start_date`=?, `effective_end_date`=? \
        ,`updated_date`=?, `updated_by`=?\
        WHERE `record_status`='A' AND `hims_d_sub_department_id`=? ;",
        values: [
          input.sub_department_name,
          input.sub_department_desc,
          input.arabic_sub_department_name,
          input.effective_start_date,
          input.effective_end_date,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.hims_d_sub_department_id
        ],
        printQuery: true
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
  }
};
